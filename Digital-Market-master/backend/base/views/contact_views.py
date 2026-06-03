from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from base.services.email_service import send_contact_email, send_newsletter_welcome


@api_view(['POST'])
@permission_classes([AllowAny])
def contact_form(request):
    data    = request.data
    name    = str(data.get('name', '')).strip()
    email   = str(data.get('email', '')).strip()
    subject = str(data.get('subject', '')).strip()
    message = str(data.get('message', '')).strip()

    if not all([name, email, subject, message]):
        return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

    send_contact_email(name, email, subject, message)
    return Response({'message': 'Message sent successfully.'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def newsletter_subscribe(request):
    email = str(request.data.get('email', '')).strip()
    if not email:
        return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

    send_newsletter_welcome(email)
    return Response({'message': 'Subscribed successfully.'}, status=status.HTTP_200_OK)
