# Gmail SMTP Email Configuration Guide

## Overview
This guide provides step-by-step instructions to configure Gmail SMTP for sending transactional emails in your Django e-commerce application. Gmail SMTP is free, easy to set up, and perfect for small to medium projects.

## Table of Contents
1. [Gmail Account Setup](#gmail-account-setup)
2. [Enable 2-Step Verification](#enable-2-step-verification)
3. [Generate App Password](#generate-app-password)
4. [Environment Configuration](#environment-configuration)
5. [Usage](#usage)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## Gmail Account Setup

### Requirements
- Active Gmail account
- 2-Step Verification enabled (required for App Passwords)
- Access to account recovery options

### Step 1: Go to Google Account Settings
1. Visit [Google Account Security](https://myaccount.google.com/security)
2. Sign in with your Gmail account if prompted
3. You'll see your security overview

---

## Enable 2-Step Verification

### Why It's Required
App Passwords can only be created if you have 2-Step Verification enabled on your account.

### Steps to Enable
1. In Google Account → **Security** (left sidebar)
2. Scroll down to **How you sign in to Google**
3. Click **2-Step Verification**
4. Click **Get Started**
5. Follow the prompts:
   - Verify your password
   - Enter a phone number (where you can receive verification codes)
   - Choose verification method (text message or voice call)
   - Verify the code sent to your phone
   - Accept the terms
6. 2-Step Verification is now enabled ✓

---

## Generate App Password

### What is an App Password?
- A 16-character password specifically for your app
- More secure than your regular Gmail password
- Can be revoked at any time
- Works only for third-party apps like Django

### Steps to Generate App Password
1. Return to [Google Account Security](https://myaccount.google.com/security)
2. Scroll down to **How you sign in to Google**
3. Click **App passwords** (appears after enabling 2-Step Verification)
   - If you don't see this, 2-Step Verification may not be fully enabled
4. Select **App type**: Mail
5. Select **Device type**: Windows Computer (or your device)
6. Click **Generate**
7. Google displays your 16-character app password (e.g., `xxxx xxxx xxxx xxxx`)
8. **Copy this password immediately** - it only shows once!

### Copy & Store Password
The app password looks like: `abcd efgh ijkl mnop`
- Remove spaces when using in `.env` file: `abcdefghijklmnop`
- Store securely - never commit to git
- Keep the spaces as shown for readability (Gmail accepts both formats)

---

## Environment Configuration

### 1. Create `.env` File
If `.env` doesn't exist:
```bash
cp .env.example .env
```

### 2. Configure Environment Variables
Edit `.env` and add your Gmail credentials:
```env
# Your Gmail address
EMAIL_HOST_USER=your-email@gmail.com

# Gmail App Password (16 characters from previous step)
EMAIL_HOST_PASSWORD=xxxx xxxx xxxx xxxx

# Email sender address (usually your Gmail)
DEFAULT_FROM_EMAIL=your-email@gmail.com

# Admin email for notifications
ADMIN_EMAIL=your-email@gmail.com
```

### 3. Verify Settings
The Django settings should automatically load these variables:
- `EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'`
- `EMAIL_HOST = 'smtp.gmail.com'`
- `EMAIL_PORT = 587`
- `EMAIL_USE_TLS = True`

---

## Usage

### Email Service Integration
The `EmailService` class handles all email operations:

```python
from base.services.email_service import EmailService

# Send welcome email
EmailService.send_welcome_email(
    user_name="John Doe",
    user_email="john@example.com"
)

# Send order confirmation
EmailService.send_order_confirmation(
    order_id=12345,
    user_name="John Doe",
    user_email="john@example.com",
    order_details={
        'items': [
            {'name': 'Nike Shoes', 'qty': 1, 'price': '99.99', 'total': '99.99'}
        ],
        'subtotal': '99.99',
        'shipping': '10.00',
        'total': '109.99',
        'date': '2026-05-14',
        'estimated_delivery': '2026-05-21'
    }
)

# Send order shipped notification
EmailService.send_order_shipped(
    order_id=12345,
    user_name="John Doe",
    user_email="john@example.com",
    tracking_number="1Z123ABC123456"
)

# Send password reset
EmailService.send_password_reset(
    user_name="John Doe",
    user_email="john@example.com",
    reset_link="https://yourdomain.com/reset?token=abc123"
)

# Send email verification
EmailService.send_email_verification(
    user_name="John Doe",
    user_email="john@example.com",
    verification_link="https://yourdomain.com/verify?token=xyz789"
)
```

### Automatic Welcome Emails
Welcome emails are automatically sent when a new user registers (via Django signals):
- Triggered by User creation in the database
- Uses user's first_name or username
- Sent to user's email address

### Integration with Views
Add email sending to your API endpoints:

```python
from base.services.email_service import EmailService

@api_view(['POST'])
def register_user(request):
    # ... registration logic ...
    
    # Send welcome email
    EmailService.send_welcome_email(user.first_name, user.email)
    
    return Response({'message': 'User created successfully'})
```

---

## Testing

### Test 1: Using Django Shell
```bash
# Start Django shell
python manage.py shell

# Send test email
from base.services.email_service import EmailService
result = EmailService.send_welcome_email("Test User", "your-email@example.com")
print(result)  # Should print True if successful
```

### Test 2: Trigger on User Registration
```bash
# Using curl or Postman
curl -X POST http://127.0.0.1:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123"
  }'

# Check your email for welcome message
```

### Test 3: Send Test Email via Django
```bash
python manage.py shell
from django.core.mail import send_mail
send_mail(
    'Test Email',
    'This is a test message from Django',
    'from@gmail.com',  # Should match EMAIL_HOST_USER
    ['to@example.com'],
    fail_silently=False,
)
```

---

## Gmail Sending Limits

### Free Tier Limits
- **Send Rate**: 100 emails per day (rolling window)
- **Recipients per email**: Up to 100
- **Message size**: Up to 25 MB
- **Attachments**: Supported
- **Throttling**: 100 emails/day for regular accounts

### Important Notes
- Limits reset daily at midnight Pacific Time
- Bounced emails count against your limit
- Replies/forwards don't count against limit
- If you exceed limit, you'll get error: "421 Service Unavailable"

### Increase Limits
- Google Workspace accounts have higher limits (10,000+ emails/day)
- Consider upgrading if you reach free tier limits
- Alternative: Use SendGrid, AWS SES, or other services for higher volume

---

## Production Considerations

### For Small Projects (< 50 emails/day)
- Gmail SMTP is sufficient
- Implement rate limiting to stay under 100/day limit
- Monitor sending volume

### For Medium Projects (50-500 emails/day)
- Consider Google Workspace ($6/month, higher limits)
- Or use SendGrid free tier (100/day) with better reliability
- Or use AWS SES ($0.10 per 1,000 emails)

### For Large Projects (500+ emails/day)
- Use dedicated email service:
  - SendGrid (recommended for startups)
  - AWS SES (AWS ecosystem users)
  - Mailgun (API-first approach)
  - Twilio SendGrid (highest volume)

### Best Practices
1. **Implement Email Queuing**: Use Celery for async email sending
2. **Monitor Bounce Rates**: Track and remove bouncing emails
3. **Set Up Reply-To**: Help customers reply to emails
4. **Test Before Production**: Thoroughly test email flow
5. **Monitor Sending**: Keep logs of all sent emails
6. **Handle Failures**: Retry logic for failed sends

---

## Troubleshooting

### Error: "SMTPAuthenticationError"
**Cause**: Incorrect Gmail credentials or app password
**Solutions**:
1. Verify EMAIL_HOST_USER is your full Gmail address (including @gmail.com)
2. Verify EMAIL_HOST_PASSWORD is correct 16-character app password (remove spaces when testing)
3. Check .env file is loaded correctly
4. Ensure 2-Step Verification is enabled
5. Try generating a new app password

### Error: "SMTPException: SMTP AUTH extension not supported"
**Cause**: Port or TLS settings incorrect
**Solutions**:
1. Verify EMAIL_PORT = 587 (not 25, 465, or other ports)
2. Verify EMAIL_USE_TLS = True
3. Verify EMAIL_USE_SSL = False

### Error: "421 Service Unavailable"
**Cause**: Gmail sending limit exceeded (100 emails/day)
**Solutions**:
1. Wait until next day (limit resets at midnight Pacific)
2. Reduce email sending volume
3. Consider upgrading to Google Workspace
4. Switch to a different email service for production

### Emails Not Sending
**Check**:
1. Gmail credentials in .env are correct
2. 2-Step Verification is enabled on your Gmail account
3. App password is enabled and properly generated
4. Django check passes: `python manage.py check`
5. No errors in Django console/logs
6. Check spam/promotions folder in Gmail

### "Less secure app access" blocked
**Note**: App passwords bypass this security feature entirely
- This error should NOT appear if you're using App Password
- If you see this, you're using regular Gmail password (which won't work)
- Use the 16-character App Password instead

### Test Email Loop (emails not delivering)
**Cause**: Sending to an email that's filtering or blocking
**Solutions**:
1. Test with external email address first (not your Gmail)
2. Check email spam/promotions filters
3. Add sender email to contacts to improve delivery
4. Check email provider's bounce logs

---

## AWS SES Limits & Pricing

### Free Tier
- 62,000 emails/month for first 12 months
- Must receive emails (not send-only)

### Production Pricing
- $0.10 per 1,000 emails sent
- No charge for bounces/complaints
- Additional charges for attachments

### Rate Limits
- Default: 1 email/second
- Increases available upon request
- Consider queue system for high volume

---

## Next Steps

1. ✅ Create Gmail account or use existing one
2. ✅ Enable 2-Step Verification
3. ✅ Generate App Password
4. ✅ Create `.env` file
5. ✅ Add Gmail credentials to `.env`
6. ✅ Test email sending via Django shell
7. ✅ Test with user registration
8. ✅ Monitor sending limits
9. ✅ Setup email queuing for production (optional)
10. ✅ Monitor email deliverability

---

## Support & Resources

- [Google Account Help](https://support.google.com/accounts/)
- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)
- [Django Email Documentation](https://docs.djangoproject.com/en/4.1/topics/email/)
- [Google Account Security](https://myaccount.google.com/security)

---

## Quick Reference

| Setting | Value |
|---------|-------|
| Email Backend | `django.core.mail.backends.smtp.EmailBackend` |
| SMTP Host | `smtp.gmail.com` |
| SMTP Port | `587` |
| Use TLS | `True` |
| Use SSL | `False` |
| Username | Your Gmail address |
| Password | 16-character App Password |
| Daily Limit (Free) | 100 emails |
| Cost | Free |

---

**Last Updated**: May 14, 2026
**Django Version**: 4.1.6
**Python Version**: 3.8+
**Status**: ✅ Production Ready
