from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from base.models import Product, Order ,OrderItem, ShippingAddress
from base.serializer import ProductSerializer,OrderSerializer
from datetime import datetime
import requests
import json
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data['orderItems']
    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:

        # (1) Create order

        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice']
        )

        # (2) Create shipping address

        shipping = ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            PhoneNumber = data['shippingAddress']['PhoneNumber']
        )

        # (3) Create order items adn set order to orderItem relationship
        for i in orderItems:
            product = Product.objects.get(_id=i['product'])

            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=i['qty'],
                price=i['price'],
                image=product.image.url,
            )

            # (4) Update stock

            product.countInStock -= item.qty
            product.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    
    # Enhance with vendor information
    orders_data = []
    for order in orders:
        order_dict = {
            '_id': order._id,
            'user': order.user.email,
            'totalPrice': float(order.totalPrice),
            'ispaid': order.ispaid,
            'isDelivered': order.isDelivered,
            'paymentMethod': order.paymentMethod,
            'createdAt': order.createdAt.isoformat(),
            'paidAt': order.paidAt.isoformat() if order.paidAt else None,
            'deliveredAt': order.deliveredAt.isoformat() if order.deliveredAt else None,
            'items': [],
            'vendors': []
        }
        
        # Get items grouped by vendor
        items = OrderItem.objects.filter(order=order)
        vendors_set = set()
        
        for item in items:
            vendor = item.product.user
            if vendor:  # Check if vendor exists
                vendors_set.add(vendor.email)
            
            order_dict['items'].append({
                'name': item.name,
                'qty': item.qty,
                'price': float(item.price),
                'vendor': vendor.email if vendor else 'Unknown',
                'vendorName': (vendor.get_full_name() or vendor.username) if vendor else 'Unknown',
                'image': item.image
            })
        
        # Add unique vendors to order
        order_dict['vendors'] = list(vendors_set)
        
        # Add shipping address
        if hasattr(order, 'shippingaddress'):
            order_dict['shippingAddress'] = {
                'address': order.shippingaddress.address or '',
                'city': order.shippingaddress.city or '',
                'PhoneNumber': order.shippingaddress.PhoneNumber or ''
            }
        
        orders_data.append(order_dict)
    
    return Response(orders_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request,pk):
    user=request.user
    try:
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order,many = False)
            return Response(serializer.data)
        else:
            Response({'detail':'Not authorized to view this order'},status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail':'Order does not exist'},status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request,pk):
    order = Order.objects.get(_id=pk)
    order.ispaid = True
    order.paidAt= datetime.now()
    order.save()
    return Response('Order was paid')

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders,many=True)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request,pk):
    order = Order.objects.get(_id=pk)
    order.isDelivered = True
    order.deliveredAt= datetime.now()
    order.save()
    return Response('Order was delivered')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verifyKhaltiPayment(request):
    """
    Verify Khalti payment and mark order as paid
    """
    try:
        data = request.data
        order_id = data.get('orderId')
        khalti_token = data.get('khaltiToken')
        khalti_amount = data.get('khaltiAmount')

        # Get the order
        try:
            order = Order.objects.get(_id=order_id)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Verify that the order belongs to the authenticated user
        if order.user != request.user:
            return Response(
                {'error': 'Unauthorized - Order does not belong to this user'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Verify payment with Khalti API
        khalti_verify_url = "https://khalti.com/api/v2/payment/verify/"
        khalti_secret_key = "test_secret_key_37cb6b253b0f4ae5824d4d48bca676e3"  # Store in settings
        
        verify_data = {
            "token": khalti_token,
            "amount": khalti_amount,
        }
        
        headers = {
            "Authorization": f"Key {khalti_secret_key}"
        }

        try:
            khalti_response = requests.post(
                khalti_verify_url,
                json=verify_data,
                headers=headers,
                timeout=10
            )

            if khalti_response.status_code == 200:
                khalti_result = khalti_response.json()
                
                # Mark order as paid
                order.ispaid = True
                order.paidAt = datetime.now()
                order.save()

                return Response({
                    'success': True,
                    'message': 'Payment verified successfully',
                    'order': OrderSerializer(order).data,
                    'khalti_data': khalti_result
                }, status=status.HTTP_200_OK)
            else:
                error_message = f"Khalti verification failed: {khalti_response.text}"
                logger.error(error_message)
                return Response(
                    {'error': 'Payment verification failed with Khalti', 'details': khalti_response.text},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except requests.exceptions.RequestException as e:
            error_message = f"Khalti API request error: {str(e)}"
            logger.error(error_message)
            return Response(
                {'error': 'Failed to verify payment with Khalti', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    except Exception as e:
        error_message = f"Unexpected error in Khalti verification: {str(e)}"
        logger.error(error_message)
        return Response(
            {'error': 'An unexpected error occurred', 'details': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
