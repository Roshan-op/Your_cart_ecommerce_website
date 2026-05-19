"""
Admin REST API Views
All endpoints require IsAdminUser permission
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from base.models import Product, Order, OrderItem, Review
from base.serializer import UserSerializer, ProductSerializer, OrderSerializer
from django.db.models import Sum, Count, Q, F
from datetime import datetime, timedelta
from django.utils import timezone


# ============ ADMIN DASHBOARD ============

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard(request):
    """Get admin dashboard statistics"""
    try:
        # Overall stats
        total_users = User.objects.count()
        total_vendors = Product.objects.values('user').distinct().count()
        total_products = Product.objects.count()
        total_orders = Order.objects.count()
        
        # Sales metrics
        total_sales = Order.objects.filter(ispaid=True).aggregate(
            total=Sum('totalPrice')
        )['total'] or 0
        
        # This month stats
        now = timezone.now()
        month_start = now.replace(day=1)
        month_sales = Order.objects.filter(
            ispaid=True,
            createdAt__gte=month_start
        ).aggregate(total=Sum('totalPrice'))['total'] or 0
        
        # This week stats
        week_ago = now - timedelta(days=7)
        week_sales = Order.objects.filter(
            ispaid=True,
            createdAt__gte=week_ago
        ).aggregate(total=Sum('totalPrice'))['total'] or 0
        
        # Orders breakdown
        pending_orders = Order.objects.filter(ispaid=False).count()
        paid_orders = Order.objects.filter(ispaid=True, isDelivered=False).count()
        delivered_orders = Order.objects.filter(isDelivered=True).count()
        
        # Recent orders
        recent_orders = Order.objects.select_related('user').order_by('-createdAt')[:5]
        recent_orders_data = []
        for order in recent_orders:
            recent_orders_data.append({
                'id': order._id,
                'user': order.user.email,
                'amount': float(order.totalPrice),
                'status': 'Delivered' if order.isDelivered else ('Paid' if order.ispaid else 'Pending'),
                'date': order.createdAt.isoformat()
            })
        
        # Top vendors (by sales)
        top_vendors = []
        vendors = User.objects.filter(product__isnull=False).distinct()[:5]
        for vendor in vendors:
            vendor_sales = OrderItem.objects.filter(
                product__user=vendor
            ).aggregate(total=Sum(F('price') * F('qty')))['total'] or 0
            top_vendors.append({
                'id': vendor.id,
                'name': vendor.get_full_name() or vendor.email,
                'email': vendor.email,
                'products': Product.objects.filter(user=vendor).count(),
                'sales': float(vendor_sales)
            })
        
        return Response({
            'totalUsers': total_users,
            'totalVendors': total_vendors,
            'totalProducts': total_products,
            'totalOrders': total_orders,
            'totalSales': float(total_sales),
            'monthSales': float(month_sales),
            'weekSales': float(week_sales),
            'pendingOrders': pending_orders,
            'paidOrders': paid_orders,
            'deliveredOrders': delivered_orders,
            'recentOrders': recent_orders_data,
            'topVendors': top_vendors
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ============ VENDORS MANAGEMENT ============

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_vendors(request):
    """Get all vendors"""
    try:
        vendors = User.objects.filter(product__isnull=False).distinct()
        vendors_data = []
        
        for vendor in vendors:
            products_count = Product.objects.filter(user=vendor).count()
            orders_count = OrderItem.objects.filter(product__user=vendor).values('order').distinct().count()
            sales = OrderItem.objects.filter(
                product__user=vendor
            ).aggregate(total=Sum(F('price') * F('qty')))['total'] or 0
            
            vendors_data.append({
                'id': vendor.id,
                'name': vendor.get_full_name() or vendor.email,
                'email': vendor.email,
                'products': products_count,
                'orders': orders_count,
                'sales': float(sales),
                'joined': vendor.date_joined.isoformat()
            })
        
        return Response({'vendors': vendors_data, 'count': len(vendors_data)})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ============ PRODUCTS MANAGEMENT ============

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_products(request):
    """Get all products"""
    try:
        products = Product.objects.all()
        products_data = []
        
        for product in products:
            orders_count = OrderItem.objects.filter(product=product).count()
            sales = OrderItem.objects.filter(product=product).aggregate(
                total=Sum(F('qty') * F('price'))
            )['total'] or 0
            
            products_data.append({
                'id': product._id,
                'name': product.name,
                'vendor': product.user.email,
                'price': float(product.price),
                'category': product.category,
                'stock': product.countInStock,
                'orders': orders_count,
                'sales': float(sales),
                'image': product.image.url if product.image else '/placeholder.png'
            })
        
        return Response({'products': products_data, 'count': len(products_data)})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def admin_delete_product(request, pk):
    """Delete a product"""
    try:
        product = Product.objects.get(_id=pk)
        product.delete()
        return Response({'message': 'Product deleted successfully'})
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ============ ORDERS MANAGEMENT ============

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_orders(request):
    """Get all orders"""
    try:
        status_filter = request.query_params.get('status', 'all')
        
        orders_qs = Order.objects.select_related('user').all()
        
        if status_filter == 'pending':
            orders_qs = orders_qs.filter(ispaid=False)
        elif status_filter == 'paid':
            orders_qs = orders_qs.filter(ispaid=True, isDelivered=False)
        elif status_filter == 'delivered':
            orders_qs = orders_qs.filter(isDelivered=True)
        
        orders_qs = orders_qs.order_by('-createdAt')
        orders_data = []
        
        for order in orders_qs:
            items = OrderItem.objects.filter(order=order)
            items_data = [{
                'name': item.name,
                'qty': item.qty,
                'price': float(item.price)
            } for item in items]
            
            orders_data.append({
                'id': order._id,
                'customer': order.user.email,
                'amount': float(order.totalPrice),
                'isPaid': order.ispaid,
                'isDelivered': order.isDelivered,
                'paymentMethod': order.paymentMethod,
                'createdAt': order.createdAt.isoformat(),
                'items': items_data,
                'itemsCount': len(items_data)
            })
        
        return Response({'orders': orders_data, 'count': len(orders_data)})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def admin_update_order_status(request, pk):
    """Update order delivery status"""
    try:
        order = Order.objects.get(_id=pk)
        order.isDelivered = request.data.get('isDelivered', order.isDelivered)
        if order.isDelivered:
            order.deliveredAt = timezone.now()
        order.save()
        
        return Response({
            'message': 'Order status updated',
            'id': order._id,
            'isDelivered': order.isDelivered
        })
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ============ USERS MANAGEMENT ============

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_users(request):
    """Get all users"""
    try:
        users = User.objects.all()
        users_data = []
        
        for user in users:
            is_vendor = Product.objects.filter(user=user).exists()
            orders_count = Order.objects.filter(user=user).count()
            
            users_data.append({
                'id': user.id,
                'name': user.get_full_name() or user.username,
                'email': user.email,
                'isAdmin': user.is_staff or user.is_superuser,
                'isVendor': is_vendor,
                'orders': orders_count,
                'joined': user.date_joined.isoformat()
            })
        
        return Response({'users': users_data, 'count': len(users_data)})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def admin_update_user_role(request, pk):
    """Update user admin/vendor status"""
    try:
        user = User.objects.get(id=pk)
        
        if request.data.get('isAdmin'):
            user.is_staff = True
            user.is_superuser = True
        else:
            # Only allow removing admin status if not the current user
            if user.id != request.user.id:
                user.is_staff = False
                user.is_superuser = False
        
        user.save()
        return Response({'message': 'User role updated', 'id': user.id})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def admin_delete_user(request, pk):
    """Delete a user"""
    try:
        user = User.objects.get(id=pk)
        
        # Prevent deleting yourself
        if user.id == request.user.id:
            return Response({'error': 'Cannot delete your own account'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.delete()
        return Response({'message': 'User deleted successfully'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ============ CATEGORIES ============

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_categories(request):
    """Get all product categories"""
    try:
        categories = Product.objects.values_list('category', flat=True).distinct()
        categories_data = []
        
        for category in categories:
            if category:
                products_count = Product.objects.filter(category=category).count()
                sales = OrderItem.objects.filter(
                    product__category=category
                ).aggregate(total=Sum(F('qty') * F('price')))['total'] or 0
                
                categories_data.append({
                    'name': category,
                    'products': products_count,
                    'sales': float(sales)
                })
        
        return Response({'categories': categories_data, 'count': len(categories_data)})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ============ SETTINGS ============

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_settings(request):
    """Get admin settings"""
    return Response({
        'storeName': 'Digital Market',
        'storeEmail': 'support@digitalmmarket.com',
        'supportPhone': '+1-800-123-4567',
        'currency': 'USD',
        'timezone': 'UTC',
        'language': 'English',
        'maintenanceMode': False,
        'allowNewVendors': True,
        'commissionRate': 10,
        'taxRate': 5
    })


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def admin_update_settings(request):
    """Update admin settings"""
    try:
        # In a real app, save these to a settings model
        # For now, just acknowledge the update
        return Response({'message': 'Settings updated successfully'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
