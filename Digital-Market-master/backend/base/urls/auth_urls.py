"""
Authentication URLs
"""
from django.urls import path
from base.views.auth_views import admin_login, vendor_login, customer_signup, logout_view

urlpatterns = [
    path('admin/login/', admin_login, name='admin_login'),
    path('vendor/login/', vendor_login, name='vendor_login'),
    path('customer/signup/', customer_signup, name='customer_signup'),
    path('logout/', logout_view, name='logout'),
]
