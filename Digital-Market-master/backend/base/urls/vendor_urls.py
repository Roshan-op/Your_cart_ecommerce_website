"""
Vendor API URLs for React Frontend
"""
from django.urls import path
from base.views import vendor_views as views

urlpatterns = [
    # Dashboard
    path('dashboard/', views.vendor_dashboard, name='vendor-dashboard'),
    
    # Products
    path('products/', views.vendor_products, name='vendor-products'),
    path('products/<int:pk>/', views.vendor_product_detail, name='vendor-product-detail'),
    path('products/<int:pk>/stock/', views.vendor_update_stock, name='vendor-update-stock'),
    
    # Orders
    path('orders/', views.vendor_orders, name='vendor-orders'),
    path('orders/<int:pk>/status/', views.vendor_update_order_status, name='vendor-update-order-status'),
    
    # Earnings
    path('earnings/', views.vendor_earnings, name='vendor-earnings'),
    
    # Inventory
    path('inventory/', views.vendor_inventory, name='vendor-inventory'),
    
    # Profile
    path('profile/', views.vendor_profile, name='vendor-profile'),
    
    # Notifications
    path('notifications/', views.vendor_notifications, name='vendor-notifications'),
]
