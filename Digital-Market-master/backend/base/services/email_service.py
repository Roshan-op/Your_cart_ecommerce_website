"""
Email Service for AWS SES Integration
Handles sending various transactional emails for the e-commerce platform
"""
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags
import logging

logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending emails via AWS SES"""
    
    @staticmethod
    def send_email(subject, template_name, context, recipient_email, from_email=None):
        """
        Send email using Django template
        
        Args:
            subject (str): Email subject
            template_name (str): Template path (e.g., 'emails/order_confirmation.html')
            context (dict): Context for template rendering
            recipient_email (str): Recipient email address
            from_email (str): Sender email address (optional, uses default if not provided)
        
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            if not from_email:
                from_email = settings.DEFAULT_FROM_EMAIL
            
            # Render HTML template
            html_message = render_to_string(template_name, context)
            plain_message = strip_tags(html_message)
            
            # Create email
            email = EmailMultiAlternatives(
                subject=subject,
                body=plain_message,
                from_email=from_email,
                to=[recipient_email]
            )
            email.attach_alternative(html_message, "text/html")
            
            # Send email
            email.send(fail_silently=False)
            logger.info(f"Email sent successfully to {recipient_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {recipient_email}: {str(e)}")
            return False
    
    @staticmethod
    def send_welcome_email(user_name, user_email):
        """Send welcome email to new user"""
        context = {
            'user_name': user_name,
            'shop_name': 'MUSE',
        }
        return EmailService.send_email(
            subject='Welcome to MUSE - Your Premium Shopping Destination',
            template_name='emails/welcome.html',
            context=context,
            recipient_email=user_email
        )
    
    @staticmethod
    def send_order_confirmation(order_id, user_name, user_email, order_details):
        """Send order confirmation email"""
        context = {
            'order_id': order_id,
            'user_name': user_name,
            'order_details': order_details,
            'shop_name': 'MUSE',
        }
        return EmailService.send_email(
            subject=f'Order Confirmation - Order #{order_id}',
            template_name='emails/order_confirmation.html',
            context=context,
            recipient_email=user_email
        )
    
    @staticmethod
    def send_order_shipped(order_id, user_name, user_email, tracking_number=None):
        """Send order shipped notification"""
        context = {
            'order_id': order_id,
            'user_name': user_name,
            'tracking_number': tracking_number,
            'shop_name': 'MUSE',
        }
        return EmailService.send_email(
            subject=f'Your Order #{order_id} Has Shipped',
            template_name='emails/order_shipped.html',
            context=context,
            recipient_email=user_email
        )
    
    @staticmethod
    def send_password_reset(user_name, user_email, reset_link):
        """Send password reset email"""
        context = {
            'user_name': user_name,
            'reset_link': reset_link,
            'shop_name': 'MUSE',
        }
        return EmailService.send_email(
            subject='Reset Your MUSE Account Password',
            template_name='emails/password_reset.html',
            context=context,
            recipient_email=user_email
        )
    
    @staticmethod
    def send_email_verification(user_name, user_email, verification_link):
        """Send email verification link"""
        context = {
            'user_name': user_name,
            'verification_link': verification_link,
            'shop_name': 'MUSE',
        }
        return EmailService.send_email(
            subject='Verify Your Email Address - MUSE',
            template_name='emails/email_verification.html',
            context=context,
            recipient_email=user_email
        )
    
    @staticmethod
    def send_contact_form_email(name, email, subject, message, reply_to_email=None):
        """Send contact form submission to admin"""
        context = {
            'name': name,
            'email': email,
            'subject': subject,
            'message': message,
        }
        
        admin_email = getattr(settings, 'ADMIN_EMAIL', settings.DEFAULT_FROM_EMAIL)
        
        return EmailService.send_email(
            subject=f'New Contact Form Submission: {subject}',
            template_name='emails/contact_form.html',
            context=context,
            recipient_email=admin_email,
            from_email=reply_to_email or settings.DEFAULT_FROM_EMAIL
        )
