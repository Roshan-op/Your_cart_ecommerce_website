#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
sys.path.insert(0, 'd:\\your cart\\Digital-Market-master\\backend')
django.setup()

from base.models import Product, Order, User, OrderItem
from django.db import connection

print('═' * 60)
print('SYSTEM STATUS REPORT')
print('═' * 60)
print()

# Database Status
print('📊 DATABASE STATUS')
print('─' * 60)
print(f'  Total Products:    {Product.objects.count()}')
print(f'  Total Orders:      {Order.objects.count()}')
print(f'  Total Users:       {User.objects.count()}')
print(f'  Total Order Items: {OrderItem.objects.count()}')
print()

# Product Categories
print('📦 PRODUCT DISTRIBUTION')
print('─' * 60)
categories = Product.objects.values('category').distinct().order_by('category')
for cat in categories:
    count = Product.objects.filter(category=cat['category']).count()
    print(f'  {cat["category"]}: {count} products')
print()

# Order Statistics
print('📋 ORDER STATISTICS')
print('─' * 60)
total_orders = Order.objects.count()
paid_orders = Order.objects.filter(ispaid=True).count()
delivered_orders = Order.objects.filter(isDelivered=True).count()
print(f'  Total Orders:        {total_orders}')
print(f'  Paid Orders:         {paid_orders} ({(paid_orders/total_orders*100):.1f}%)')
print(f'  Delivered Orders:    {delivered_orders} ({(delivered_orders/total_orders*100):.1f}%)')
print(f'  Pending Orders:      {total_orders - paid_orders}')
print()

# Recent Orders
print('🆕 LAST 5 ORDERS')
print('─' * 60)
recent_orders = Order.objects.all().order_by('-createdAt')[:5]
for order in recent_orders:
    status = '✓ Paid' if order.ispaid else '⏳ Pending'
    print(f'  Order #{order.pk}: {status} | Rs.{order.totalPrice:.2f} | {order.createdAt.strftime("%Y-%m-%d %H:%M")}')
print()

# Database Tables
print('💾 DATABASE TABLES')
print('─' * 60)
with connection.cursor() as cursor:
    cursor.execute("SELECT COUNT(*) FROM sqlite_master WHERE type='table';")
    table_count = cursor.fetchone()[0]
    print(f'  Total Tables: {table_count}')
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")
    tables = cursor.fetchall()
    for table in tables:
        print(f'    ✓ {table[0]}')
print()

print('═' * 60)
print('✅ SYSTEM CHECK COMPLETE')
print('═' * 60)
