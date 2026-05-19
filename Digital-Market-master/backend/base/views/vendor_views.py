"""
Vendor API Views for React Frontend
Handles all vendor dashboard operations
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from base.models import Product, Order, OrderItem
from base.serializer import ProductSerializer, OrderSerializer
from django.db.models import Sum, Count, Q
from datetime import datetime, timedelta
import json


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def vendor_dashboard(request):
    """Get vendor dashboard statistics"""
    user = request.user
    
    # Get vendor's products
    vendor_products = Product.objects.filter(user=user)
    
    # Get vendor's orders (orders that contain vendor's products)
    vendor_orders = Order.objects.filter(
        orderitem__product__user=user
    ).distinct()
    
    # Calculate stats
    total_products = vendor_products.count()
    total_orders = vendor_orders.count()
    total_sales = vendor_orders.filter(ispaid=True).aggregate(
        Sum('totalPrice')
    )['totalPrice__sum'] or 0
    pending_orders = vendor_orders.filter(ispaid=False).count()
    delivered_orders = vendor_orders.filter(isDelivered=True).count()
    
    # This month sales
    today = datetime.now()
    month_start = today.replace(day=1)
    month_sales = vendor_orders.filter(
        ispaid=True,
        createdAt__gte=month_start
    ).aggregate(Sum('totalPrice'))['totalPrice__sum'] or 0
    
    # Out of stock products
    out_of_stock = vendor_products.filter(countInStock=0).count()
    low_stock = vendor_products.filter(countInStock__gt=0, countInStock__lte=5).count()
    
    # Recent orders
    recent_orders = vendor_orders.order_by('-createdAt')[:5]
    recent_orders_data = []
    for order in recent_orders:
        recent_orders_data.append({
            '_id': order._id,
            'user': order.user.username,
            'totalPrice': float(order.totalPrice),
            'ispaid': order.ispaid,
            'isDelivered': order.isDelivered,
            'createdAt': order.createdAt.isoformat(),
            'items': list(order.orderitem_set.filter(
                product__user=user
            ).values('name', 'qty', 'price'))
        })
    
    return Response({
        'totalProducts': total_products,
        'totalOrders': total_orders,
        'totalSales': float(total_sales),
        'monthSales': float(month_sales),
        'pendingOrders': pending_orders,
        'deliveredOrders': delivered_orders,
        'outOfStock': out_of_stock,
        'lowStock': low_stock,
        'recentOrders': recent_orders_data
    })


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def vendor_products(request):
    """Get vendor's products or create new product"""
    user = request.user
    
    if request.method == 'GET':
        products = Product.objects.filter(user=user).order_by('-createdAt')
        serializer = ProductSerializer(products, many=True)
        return Response({
            'count': products.count(),
            'products': serializer.data
        })
    
    elif request.method == 'POST':
        data = request.data
        try:
            product = Product.objects.create(
                user=user,
                name=data.get('name', 'Untitled Product'),
                price=data.get('price', 0),
                category=data.get('category', 'Uncategorized'),
                brand=data.get('brand', ''),
                description=data.get('description', ''),
                countInStock=data.get('countInStock', 0),
                gender=data.get('gender', 'both'),
                available_sizes=data.get('available_sizes', ''),
            )
            if 'image' in request.FILES:
                product.image = request.FILES['image']
                product.save()
            
            serializer = ProductSerializer(product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def vendor_product_detail(request, pk):
    """Get, update, or delete vendor's product"""
    user = request.user
    
    try:
        product = Product.objects.get(_id=pk, user=user)
    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found or not owned by you'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        data = request.data
        product.name = data.get('name', product.name)
        product.price = data.get('price', product.price)
        product.category = data.get('category', product.category)
        product.brand = data.get('brand', product.brand)
        product.description = data.get('description', product.description)
        product.countInStock = data.get('countInStock', product.countInStock)
        product.gender = data.get('gender', product.gender)
        product.available_sizes = data.get('available_sizes', product.available_sizes)
        
        if 'image' in request.FILES:
            product.image = request.FILES['image']
        
        product.save()
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    
    elif request.method == 'DELETE':
        product.delete()
        return Response({'message': 'Product deleted successfully'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def vendor_orders(request):
    """Get vendor's orders"""
    user = request.user
    status_filter = request.query_params.get('status', 'all')
    
    # Get orders containing vendor's products
    vendor_orders = Order.objects.filter(
        orderitem__product__user=user
    ).distinct().select_related('user').order_by('-createdAt')
    
    # Filter by status
    if status_filter == 'pending':
        vendor_orders = vendor_orders.filter(ispaid=False)
    elif status_filter == 'paid':
        vendor_orders = vendor_orders.filter(ispaid=True, isDelivered=False)
    elif status_filter == 'delivered':
        vendor_orders = vendor_orders.filter(isDelivered=True)
    
    orders_data = []
    for order in vendor_orders:
        # Get only items from this vendor
        vendor_items = order.orderitem_set.filter(product__user=user)
        vendor_subtotal = sum(float(item.price) * item.qty for item in vendor_items)
        
        orders_data.append({
            '_id': order._id,
            'user': order.user.username,
            'userEmail': order.user.email,
            'totalPrice': float(order.totalPrice),
            'vendorSubtotal': vendor_subtotal,
            'ispaid': order.ispaid,
            'isDelivered': order.isDelivered,
            'paymentMethod': order.paymentMethod,
            'createdAt': order.createdAt.isoformat(),
            'paidAt': order.paidAt.isoformat() if order.paidAt else None,
            'deliveredAt': order.deliveredAt.isoformat() if order.deliveredAt else None,
            'items': list(vendor_items.values(
                'name', 'qty', 'price', 'selected_size', 'selected_gender'
            )),
            'shippingAddress': {
                'address': order.shippingaddress.address if hasattr(order, 'shippingaddress') else '',
                'city': order.shippingaddress.city if hasattr(order, 'shippingaddress') else '',
                'PhoneNumber': order.shippingaddress.PhoneNumber if hasattr(order, 'shippingaddress') else '',
            }
        })
    
    return Response({
        'count': len(orders_data),
        'orders': orders_data
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def vendor_update_order_status(request, pk):
    """Update order status (mark as delivered)"""
    user = request.user
    data = request.data
    
    try:
        order = Order.objects.get(_id=pk)
        
        # Verify vendor owns products in this order
        vendor_items = order.orderitem_set.filter(product__user=user)
        if not vendor_items.exists():
            return Response(
                {'error': 'You cannot update this order'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if data.get('isDelivered'):
            order.isDelivered = True
            order.deliveredAt = datetime.now()
            order.save()
        
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response(
            {'error': 'Order not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def vendor_earnings(request):
    """Get vendor's earnings and sales history"""
    user = request.user
    
    # Get all vendor's paid orders
    vendor_orders = Order.objects.filter(
        orderitem__product__user=user,
        ispaid=True
    ).distinct()
    
    # Calculate earnings
    total_earnings = vendor_orders.aggregate(
        Sum('totalPrice')
    )['totalPrice__sum'] or 0
    
    # This month
    today = datetime.now()
    month_start = today.replace(day=1)
    month_earnings = vendor_orders.filter(
        createdAt__gte=month_start
    ).aggregate(Sum('totalPrice'))['totalPrice__sum'] or 0
    
    # This week
    week_start = today - timedelta(days=today.weekday())
    week_earnings = vendor_orders.filter(
        createdAt__gte=week_start
    ).aggregate(Sum('totalPrice'))['totalPrice__sum'] or 0
    
    # Daily earnings (last 30 days)
    daily_earnings = []
    for i in range(30):
        date = today - timedelta(days=i)
        date_start = date.replace(hour=0, minute=0, second=0, microsecond=0)
        date_end = date.replace(hour=23, minute=59, second=59, microsecond=999999)
        
        day_total = vendor_orders.filter(
            createdAt__gte=date_start,
            createdAt__lte=date_end
        ).aggregate(Sum('totalPrice'))['totalPrice__sum'] or 0
        
        daily_earnings.append({
            'date': date.strftime('%Y-%m-%d'),
            'earnings': float(day_total)
        })
    
    daily_earnings.reverse()
    
    # Recent transactions
    recent_transactions = []
    for order in vendor_orders.order_by('-createdAt')[:10]:
        vendor_items = order.orderitem_set.filter(product__user=user)
        vendor_subtotal = sum(float(item.price) * item.qty for item in vendor_items)
        
        recent_transactions.append({
            '_id': order._id,
            'user': order.user.username,
            'amount': vendor_subtotal,
            'date': order.paidAt.isoformat() if order.paidAt else order.createdAt.isoformat(),
            'items': vendor_items.count()
        })
    
    return Response({
        'totalEarnings': float(total_earnings),
        'monthEarnings': float(month_earnings),
        'weekEarnings': float(week_earnings),
        'dailyEarnings': daily_earnings,
        'recentTransactions': recent_transactions
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def vendor_inventory(request):
    """Get vendor's inventory and stock status"""
    user = request.user
    
    products = Product.objects.filter(user=user).order_by('-createdAt')
    
    inventory_data = []
    total_stock = 0
    out_of_stock_count = 0
    low_stock_count = 0
    
    for product in products:
        stock_status = 'in_stock'
        if product.countInStock == 0:
            stock_status = 'out_of_stock'
            out_of_stock_count += 1
        elif product.countInStock <= 5:
            stock_status = 'low_stock'
            low_stock_count += 1
        
        total_stock += product.countInStock
        
        inventory_data.append({
            '_id': product._id,
            'name': product.name,
            'category': product.category,
            'price': float(product.price),
            'stock': product.countInStock,
            'status': stock_status,
            'image': product.image.url if product.image else None
        })
    
    return Response({
        'totalProducts': products.count(),
        'totalStock': total_stock,
        'outOfStock': out_of_stock_count,
        'lowStock': low_stock_count,
        'inventory': inventory_data
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def vendor_update_stock(request, pk):
    """Update product stock"""
    user = request.user
    data = request.data
    
    try:
        product = Product.objects.get(_id=pk, user=user)
        product.countInStock = data.get('countInStock', product.countInStock)
        product.save()
        
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def vendor_profile(request):
    """Get or update vendor profile"""
    user = request.user
    
    if request.method == 'GET':
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'isStaff': user.is_staff,
            'isSuperuser': user.is_superuser
        })
    
    elif request.method == 'PUT':
        data = request.data
        user.first_name = data.get('firstName', user.first_name)
        user.last_name = data.get('lastName', user.last_name)
        user.email = data.get('email', user.email)
        
        if data.get('newPassword'):
            user.set_password(data.get('newPassword'))
        
        user.save()
        return Response({
            'message': 'Profile updated successfully',
            'user': {
                'username': user.username,
                'email': user.email,
                'firstName': user.first_name,
                'lastName': user.last_name
            }
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def vendor_notifications(request):
    """Get vendor notifications"""
    user = request.user
    
    notifications = []
    
    # New orders notification
    recent_orders = Order.objects.filter(
        orderitem__product__user=user
    ).distinct().order_by('-createdAt')[:5]
    
    for order in recent_orders:
        if not order.ispaid:
            notifications.append({
                'id': f'order-{order._id}',
                'type': 'new_order',
                'title': f'New Order #{order._id}',
                'message': f'You received a new order from {order.user.username}',
                'timestamp': order.createdAt.isoformat(),
                'read': False
            })
    
    # Low stock notification
    low_stock_products = Product.objects.filter(
        user=user,
        countInStock__lte=5,
        countInStock__gt=0
    )
    
    for product in low_stock_products[:5]:
        notifications.append({
            'id': f'stock-{product._id}',
            'type': 'low_stock',
            'title': f'Low Stock: {product.name}',
            'message': f'Only {product.countInStock} items left in stock',
            'timestamp': datetime.now().isoformat(),
            'read': False
        })
    
    # Out of stock notification
    out_of_stock_products = Product.objects.filter(
        user=user,
        countInStock=0
    )
    
    for product in out_of_stock_products[:3]:
        notifications.append({
            'id': f'outofstock-{product._id}',
            'type': 'out_of_stock',
            'title': f'Out of Stock: {product.name}',
            'message': f'{product.name} is now out of stock',
            'timestamp': datetime.now().isoformat(),
            'read': False
        })
    
    return Response({
        'count': len(notifications),
        'notifications': notifications
    })
