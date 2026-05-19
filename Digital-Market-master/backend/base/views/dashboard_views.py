"""
Dashboard Views for Admin and Vendor
"""
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.db.models import Sum, Count, Q
from django.contrib.auth.models import User
from base.models import Product, Order, OrderItem, Review
from datetime import datetime, timedelta
import json
from decimal import Decimal


class DecimalEncoder(json.JSONEncoder):
    """JSON encoder that handles Decimal objects"""
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)


def add_display_id(objects):
    """Add display-friendly ID attribute to objects with _id field"""
    for obj in objects:
        if hasattr(obj, '_id'):
            obj.display_id = str(obj._id)
    return objects


def get_user_type(user):
    """Determine if user is admin or vendor"""
    if user.is_staff and user.is_superuser:
        return 'admin'
    elif user.is_staff or Product.objects.filter(user=user).exists():
        return 'vendor'
    return None


@login_required(login_url='/auth/admin/login/')
def admin_dashboard(request):
    """Admin Dashboard - Overview Statistics"""
    if get_user_type(request.user) != 'admin':
        return redirect('dashboard:vendor_dashboard')
    
    # Calculate statistics
    total_sales = Order.objects.filter(ispaid=True).aggregate(Sum('totalPrice'))['totalPrice__sum'] or 0
    total_revenue = total_sales
    total_orders = Order.objects.count()
    total_products = Product.objects.count()
    total_users = User.objects.count()
    total_visitors = total_orders * 5  # Approximate
    
    # This week stats
    week_ago = datetime.now() - timedelta(days=7)
    week_sales = Order.objects.filter(createdAt__gte=week_ago, ispaid=True).aggregate(Sum('totalPrice'))['totalPrice__sum'] or 0
    week_orders = Order.objects.filter(createdAt__gte=week_ago).count()
    
    # Recent orders
    recent_orders = Order.objects.select_related('user').order_by('-createdAt')[:6]
    recent_orders = add_display_id(list(recent_orders))
    
    # Sales by category
    category_sales = {}
    for product in Product.objects.all():
        items = OrderItem.objects.filter(product=product)
        total = sum(item.qty * item.price for item in items)
        if product.category:
            category_sales[product.category] = category_sales.get(product.category, 0) + total
    
    context = {
        'user_type': 'admin',
        'total_sales': f"${total_sales:,.0f}",
        'total_revenue': f"${total_revenue:,.0f}",
        'total_orders': total_orders,
        'total_products': total_products,
        'total_users': total_users,
        'total_visitors': total_visitors,
        'week_sales': f"${week_sales:,.0f}",
        'week_orders': week_orders,
        'sales_growth': '+45%',
        'revenue_growth': '+60%',
        'visitor_growth': '+20%',
        'recent_orders': recent_orders,
        'category_sales': json.dumps(category_sales, cls=DecimalEncoder),
    }
    
    return render(request, 'dashboard/admin/dashboard.html', context)


@login_required(login_url='/auth/admin/login/')
def admin_orders(request):
    """Admin Orders Management"""
    if get_user_type(request.user) != 'admin':
        return redirect('dashboard:vendor_dashboard')
    
    orders = Order.objects.select_related('user').order_by('-createdAt')
    
    # Filters
    status_filter = request.GET.get('status', 'all')
    if status_filter == 'delivered':
        orders = orders.filter(isDelivered=True)
    elif status_filter == 'pending':
        orders = orders.filter(isDelivered=False)
    elif status_filter == 'paid':
        orders = orders.filter(ispaid=True)
    
    orders = add_display_id(list(orders[:50]))
    
    context = {
        'user_type': 'admin',
        'orders': orders,
        'total_orders': Order.objects.count(),
        'status_filter': status_filter,
    }
    
    return render(request, 'dashboard/admin/orders.html', context)


@login_required(login_url='/auth/admin/login/')
def admin_products(request):
    """Admin Products Management"""
    if get_user_type(request.user) != 'admin':
        return redirect('dashboard:vendor_dashboard')
    
    products = Product.objects.select_related('user').order_by('-createdAt')[:50]
    products = add_display_id(list(products))
    
    context = {
        'user_type': 'admin',
        'products': products,
        'total_products': Product.objects.count(),
    }
    
    return render(request, 'dashboard/admin/products.html', context)


@login_required(login_url='/auth/admin/login/')
def admin_users(request):
    """Admin Users Management"""
    if get_user_type(request.user) != 'admin':
        return redirect('dashboard:vendor_dashboard')
    
    users = User.objects.all().order_by('-date_joined')
    
    context = {
        'user_type': 'admin',
        'users': users[:50],
        'total_users': User.objects.count(),
    }
    
    return render(request, 'dashboard/admin/users.html', context)


@login_required(login_url='/auth/admin/login/')
def admin_reports(request):
    """Admin Reports & Analytics"""
    if get_user_type(request.user) != 'admin':
        return redirect('dashboard:vendor_dashboard')
    
    # Revenue over time
    orders_by_date = {}
    for order in Order.objects.filter(ispaid=True):
        date = order.createdAt.strftime('%Y-%m-%d')
        orders_by_date[date] = orders_by_date.get(date, 0) + float(order.totalPrice)
    
    context = {
        'user_type': 'admin',
        'revenue_data': json.dumps(orders_by_date, cls=DecimalEncoder),
    }
    
    return render(request, 'dashboard/admin/reports.html', context)


@login_required(login_url='/auth/vendor/login/')
def vendor_dashboard(request):
    """Vendor Dashboard - Their Sales Overview"""
    user_type = get_user_type(request.user)
    if user_type == 'admin':
        return redirect('dashboard:admin_dashboard')
    
    # Get vendor's products
    vendor_products = Product.objects.filter(user=request.user)
    
    # Calculate vendor statistics
    vendor_orders = Order.objects.filter(orderitem__product__user=request.user).distinct()
    vendor_sales = vendor_orders.filter(ispaid=True).aggregate(Sum('totalPrice'))['totalPrice__sum'] or 0
    
    # This week stats
    week_ago = datetime.now() - timedelta(days=7)
    week_sales = vendor_orders.filter(createdAt__gte=week_ago, ispaid=True).aggregate(Sum('totalPrice'))['totalPrice__sum'] or 0
    
    # Recent orders for this vendor
    recent_orders = vendor_orders.select_related('user').order_by('-createdAt')[:6]
    recent_orders = add_display_id(list(recent_orders))
    
    context = {
        'user_type': 'vendor',
        'vendor_name': request.user.get_full_name() or request.user.username,
        'total_sales': f"${vendor_sales:,.0f}",
        'total_products': vendor_products.count(),
        'total_orders': vendor_orders.count(),
        'week_sales': f"${week_sales:,.0f}",
        'sales_growth': '+32%',
        'recent_orders': recent_orders,
    }
    
    return render(request, 'dashboard/vendor/dashboard.html', context)


@login_required(login_url='/auth/vendor/login/')
def vendor_products(request):
    """Vendor Products Management"""
    user_type = get_user_type(request.user)
    if user_type == 'admin':
        return redirect('dashboard:admin_dashboard')
    
    products = Product.objects.filter(user=request.user).order_by('-createdAt')
    products = add_display_id(list(products))
    
    context = {
        'user_type': 'vendor',
        'vendor_name': request.user.get_full_name() or request.user.username,
        'products': products,
        'total_products': len(products),
    }
    
    return render(request, 'dashboard/vendor/products.html', context)


@login_required(login_url='/auth/vendor/login/')
def vendor_orders(request):
    """Vendor Orders - Their Sales"""
    user_type = get_user_type(request.user)
    if user_type == 'admin':
        return redirect('dashboard:admin_dashboard')
    
    vendor_orders_list = Order.objects.filter(orderitem__product__user=request.user).distinct().select_related('user')
    vendor_orders_list = add_display_id(list(vendor_orders_list.order_by('-createdAt')[:50]))
    
    context = {
        'user_type': 'vendor',
        'vendor_name': request.user.get_full_name() or request.user.username,
        'orders': vendor_orders_list,
        'total_orders': Order.objects.filter(orderitem__product__user=request.user).distinct().count(),
    }
    
    return render(request, 'dashboard/vendor/orders.html', context)


@login_required(login_url='/auth/vendor/login/')
def vendor_analytics(request):
    """Vendor Analytics & Reports"""
    user_type = get_user_type(request.user)
    if user_type == 'admin':
        return redirect('dashboard:admin_dashboard')
    
    vendor_products = Product.objects.filter(user=request.user)
    vendor_orders = Order.objects.filter(orderitem__product__user=request.user).distinct()
    
    context = {
        'user_type': 'vendor',
        'vendor_name': request.user.get_full_name() or request.user.username,
        'products_count': vendor_products.count(),
        'orders_count': vendor_orders.count(),
        'revenue': vendor_orders.filter(ispaid=True).aggregate(Sum('totalPrice'))['totalPrice__sum'] or 0,
    }
    
    return render(request, 'dashboard/vendor/analytics.html', context)


def logout_view(request):
    """Logout user"""
    logout(request)
    return redirect('/')


# Vendor Product Management Views

@login_required(login_url='/auth/vendor/login/')
def vendor_product_add(request):
    """Add new product as vendor"""
    user_type = get_user_type(request.user)
    if user_type == 'admin':
        return redirect('dashboard:admin_dashboard')
    
    if request.method == 'POST':
        name = request.POST.get('name')
        description = request.POST.get('description')
        price = request.POST.get('price')
        category = request.POST.get('category')
        brand = request.POST.get('brand')
        countInStock = request.POST.get('countInStock', 0)
        
        try:
            product = Product.objects.create(
                name=name,
                description=description,
                price=float(price),
                category=category,
                brand=brand,
                countInStock=int(countInStock),
                user=request.user,
                rating=0
            )
            messages.success(request, 'Product added successfully!')
            return redirect('dashboard:vendor_products')
        except Exception as e:
            messages.error(request, f'Error adding product: {str(e)}')
    
    context = {
        'user_type': 'vendor',
        'vendor_name': request.user.get_full_name() or request.user.username,
    }
    return render(request, 'dashboard/vendor/product_form.html', context)


@login_required(login_url='/auth/vendor/login/')
def vendor_product_edit(request, product_id):
    """Edit product as vendor"""
    user_type = get_user_type(request.user)
    if user_type == 'admin':
        return redirect('dashboard:admin_dashboard')
    
    try:
        product = Product.objects.get(display_id=product_id, user=request.user)
    except Product.DoesNotExist:
        messages.error(request, 'Product not found or you do not have access to it.')
        return redirect('dashboard:vendor_products')
    
    if request.method == 'POST':
        product.name = request.POST.get('name', product.name)
        product.description = request.POST.get('description', product.description)
        product.price = float(request.POST.get('price', product.price))
        product.category = request.POST.get('category', product.category)
        product.brand = request.POST.get('brand', product.brand)
        product.countInStock = int(request.POST.get('countInStock', product.countInStock))
        
        try:
            product.save()
            messages.success(request, 'Product updated successfully!')
            return redirect('dashboard:vendor_products')
        except Exception as e:
            messages.error(request, f'Error updating product: {str(e)}')
    
    context = {
        'user_type': 'vendor',
        'vendor_name': request.user.get_full_name() or request.user.username,
        'product': product,
        'is_edit': True,
    }
    return render(request, 'dashboard/vendor/product_form.html', context)


@login_required(login_url='/auth/vendor/login/')
def vendor_product_delete(request, product_id):
    """Delete product as vendor"""
    user_type = get_user_type(request.user)
    if user_type == 'admin':
        return redirect('dashboard:admin_dashboard')
    
    try:
        product = Product.objects.get(display_id=product_id, user=request.user)
        product.delete()
        messages.success(request, 'Product deleted successfully!')
    except Product.DoesNotExist:
        messages.error(request, 'Product not found or you do not have access to it.')
    
    return redirect('dashboard:vendor_products')
