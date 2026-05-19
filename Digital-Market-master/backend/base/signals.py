from django.db.models.signals import pre_save, post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
import logging

logger = logging.getLogger(__name__)


def updateUser(sender, instance, **kwargs):
    user = instance
    if user.email != '':
        user.username = user.email


pre_save.connect(updateUser, sender=User)


@receiver(post_save, sender=User)
def send_welcome_email(sender, instance, created, **kwargs):
    """Send welcome email when new user is created"""
    if created:
        try:
            from base.services.email_service import EmailService
            EmailService.send_welcome_email(
                user_name=instance.first_name or instance.username,
                user_email=instance.email
            )
        except Exception as e:
            logger.error(f"Failed to send welcome email to {instance.email}: {str(e)}")