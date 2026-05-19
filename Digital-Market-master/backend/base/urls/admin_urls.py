"""
Admin REST API Routes
"""
from django.urls import path
from base.views.admin_views import (
    admin_dashboard,
    admin_vendors,
    admin_products,
    admin_delete_product,
    admin_orders,
    admin_update_order_status,
    admin_users,
    admin_update_user_role,
    admin_delete_user,
    admin_categories,
    admin_settings,
    admin_update_settings,
)

urlpatterns = [
    # Dashboard
    path('dashboard/', admin_dashboard, name='admin_dashboard'),
    
    # Vendors
    path('vendors/', admin_vendors, name='admin_vendors'),
    
    # Products
    path('products/', admin_products, name='admin_products'),
    path('products/<int:pk>/', admin_delete_product, name='admin_delete_product'),
    
    # Orders
    path('orders/', admin_orders, name='admin_orders'),
    path('orders/<int:pk>/status/', admin_update_order_status, name='admin_update_order_status'),
    
    # Users
    path('users/', admin_users, name='admin_users'),
    path('users/<int:pk>/role/', admin_update_user_role, name='admin_update_user_role'),
    path('users/<int:pk>/', admin_delete_user, name='admin_delete_user'),
    
    # Categories
    path('categories/', admin_categories, name='admin_categories'),
    
    # Settings
    path('settings/', admin_settings, name='admin_settings'),
    path('settings/update/', admin_update_settings, name='admin_update_settings'),
]
