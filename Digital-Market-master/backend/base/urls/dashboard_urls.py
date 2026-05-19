"""
Admin and Vendor Dashboard URLs Configuration
"""
from django.urls import path
from base.views.dashboard_views import (
    admin_dashboard,
    admin_orders,
    admin_products,
    admin_users,
    admin_reports,
    vendor_dashboard,
    vendor_products,
    vendor_orders,
    vendor_analytics,
    vendor_product_add,
    vendor_product_edit,
    vendor_product_delete,
    logout_view
)

app_name = 'dashboard'

urlpatterns = [
    # Admin Dashboard
    path('admin/', admin_dashboard, name='admin_dashboard'),
    path('admin/orders/', admin_orders, name='admin_orders'),
    path('admin/products/', admin_products, name='admin_products'),
    path('admin/users/', admin_users, name='admin_users'),
    path('admin/reports/', admin_reports, name='admin_reports'),
    
    # Vendor Dashboard
    path('vendor/', vendor_dashboard, name='vendor_dashboard'),
    path('vendor/products/', vendor_products, name='vendor_products'),
    path('vendor/products/add/', vendor_product_add, name='vendor_product_add'),
    path('vendor/products/edit/<int:product_id>/', vendor_product_edit, name='vendor_product_edit'),
    path('vendor/products/delete/<int:product_id>/', vendor_product_delete, name='vendor_product_delete'),
    path('vendor/orders/', vendor_orders, name='vendor_orders'),
    path('vendor/analytics/', vendor_analytics, name='vendor_analytics'),
    
    # Shared
    path('logout/', logout_view, name='logout'),
]
