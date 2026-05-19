# Gmail SMTP Email Integration - Quick Start Guide

## Installation Steps

### 1. Install Required Packages (Already Done!)
The required packages are already in your `requirements.txt`:
- `python-dotenv` - for loading .env file
- Django built-in SMTP backend (no extra packages needed!)

```bash
# If you need to reinstall:
cd Digital-Market-master/backend
pip install -r requirements.txt
```

### 2. Create Environment File
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your Gmail credentials
# Open .env in your text editor and fill in:
# - EMAIL_HOST_USER (your Gmail address)
# - EMAIL_HOST_PASSWORD (16-char app password)
# - DEFAULT_FROM_EMAIL
```

### 3. Get Gmail App Password (90 Seconds!)
1. Visit [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification (if not already enabled)
3. Go to **App passwords** section
4. Select **Mail** and **Windows Computer**
5. Copy the 16-character password shown
6. Paste into `.env` file as `EMAIL_HOST_PASSWORD`

### 4. Django Settings Already Updated
The settings have already been updated in `backend/settings.py` with:
- `EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'`
- Gmail SMTP configuration
- Environment variables loaded from .env

---

## Available Email Features

### ✉️ Emails Automatically Sent
- **Welcome Email**: Sent when new user registers
- Uses Django signals (base/signals.py)

### 📧 Emails Available to Call Manually
```python
from base.services.email_service import EmailService

# Welcome email
EmailService.send_welcome_email(user_name, user_email)

# Order confirmation
EmailService.send_order_confirmation(order_id, user_name, user_email, order_details)

# Order shipped notification
EmailService.send_order_shipped(order_id, user_name, user_email, tracking_number)

# Password reset
EmailService.send_password_reset(user_name, user_email, reset_link)

# Email verification
EmailService.send_email_verification(user_name, user_email, verification_link)

# Contact form notification
EmailService.send_contact_form_email(name, email, subject, message)
```

---

## Testing Email Sending

### Test 1: Using Django Shell
```bash
# Start Django shell
python manage.py shell

# Send test email
from base.services.email_service import EmailService
result = EmailService.send_welcome_email("Test User", "your-email@example.com")
print(result)  # Should print True
```

### Test 2: Trigger on User Registration
```bash
# Using Python
curl -X POST http://127.0.0.1:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123"
  }'

# Check your email for welcome message
```

### Test 3: Send Direct Email
```bash
python manage.py shell
from django.core.mail import send_mail
send_mail(
    'Test Subject',
    'Test message body',
    'your-email@gmail.com',  # Must match EMAIL_HOST_USER
    ['recipient@example.com'],
    fail_silently=False,
)
```

---

## Integration Examples

### Add Order Confirmation Email to Order API
```python
# In views/order_views.py
from base.services.email_service import EmailService

@api_view(['POST'])
def createOrder(request):
    # ... create order logic ...
    
    # Send confirmation email
    order_details = {
        'items': [...],
        'subtotal': order.itemsPrice,
        'shipping': order.shippingPrice,
        'total': order.totalPrice,
        'date': order.createdAt.strftime('%Y-%m-%d'),
        'estimated_delivery': '...'
    }
    
    EmailService.send_order_confirmation(
        order_id=order.id,
        user_name=request.user.first_name,
        user_email=request.user.email,
        order_details=order_details
    )
    
    return Response(order)
```

### Add Shipped Notification
```python
# In views/order_views.py
@api_view(['PUT'])
def updateOrderToShipped(request, pk):
    order = Order.objects.get(_id=pk)
    order.isShipped = True
    order.shippedAt = datetime.datetime.now()
    order.save()
    
    # Send shipped email
    EmailService.send_order_shipped(
        order_id=order.id,
        user_name=order.user.first_name,
        user_email=order.user.email,
        tracking_number=request.data.get('tracking_number')
    )
    
    return Response({'message': 'Order shipped'})
```

---

## Email Templates

All email templates are in: `base/templates/emails/`

- `welcome.html` - Welcome email
- `order_confirmation.html` - Order confirmation
- `order_shipped.html` - Shipping notification
- `password_reset.html` - Password reset
- `email_verification.html` - Email verification
- `contact_form.html` - Contact form notification

Edit these templates to customize email appearance!

---

## Gmail Limits & Pricing

### Free Tier
- **100 emails/day** (limit resets daily)
- **No credit card required**
- **Perfect for development and small projects**

### Google Workspace (Paid)
- **$6/month per user**
- **10,000+ emails/day**
- **Better deliverability**

---

## Production Checklist

- [ ] Gmail account created and accessible
- [ ] 2-Step Verification enabled in Google Account
- [ ] App password generated
- [ ] App password copied to `.env`
- [ ] EMAIL_HOST_USER is your full Gmail address
- [ ] EMAIL_HOST_PASSWORD is 16-char app password
- [ ] `python manage.py check` passes with no issues
- [ ] Welcome email tested successfully
- [ ] Test emails received in inbox
- [ ] Order confirmation emails integrated
- [ ] Shipped notification emails integrated
- [ ] Daily email sending volume monitored
- [ ] Plan upgrade for > 100 emails/day

---

## Troubleshooting

### Email Not Sending?
**Check**:
1. `.env` file exists and is readable
2. EMAIL_HOST_USER is your full Gmail address (with @gmail.com)
3. EMAIL_HOST_PASSWORD is 16-character app password (NOT your Gmail password)
4. 2-Step Verification is enabled in Google Account
5. `python manage.py check` shows no errors

### "SMTPAuthenticationError"
**Cause**: Wrong credentials
**Solution**:
1. Verify EMAIL_HOST_USER in .env
2. Verify EMAIL_HOST_PASSWORD is app password (not regular password)
3. Generate new app password from Google Account if needed

### "SMTPException: SMTP AUTH extension not supported"
**Cause**: Port or TLS settings incorrect
**Solution**:
1. Verify EMAIL_PORT = 587
2. Verify EMAIL_USE_TLS = True
3. Verify EMAIL_USE_SSL = False

### "421 Service Unavailable"
**Cause**: Exceeded 100 emails/day limit
**Solution**:
1. Wait until next day (limit resets at midnight Pacific)
2. Upgrade to Google Workspace for higher limit
3. Use different email service for production

### Emails Going to Spam?
**Solution**:
1. Check spam/promotions folder
2. Add your email to recipient's contacts
3. For production, use a real domain name

### Django Check Shows Errors
```bash
# Run check with full output
python manage.py check

# Common issue: INSTALLED_APPS missing 'base'
# Fix: Add 'base' to INSTALLED_APPS in settings.py
```

### Import Errors
```bash
# Verify EmailService exists
python manage.py shell
from base.services.email_service import EmailService
print(EmailService)  # Should show the class
```

---

## Next Steps

1. **Setup Gmail Account**: Enable 2-Step Verification
2. **Generate App Password**: Get 16-character credentials
3. **Create `.env` file**: Copy `.env.example` to `.env`
4. **Add Gmail credentials**: Fill in EMAIL_HOST_USER and EMAIL_HOST_PASSWORD
4. **Test sending**: Use Django shell to test
5. **Integrate with API**: Add email calls to your endpoints
7. **Monitor**: Track daily email volume vs 100/day limit
8. **Scale**: Upgrade to Google Workspace if needed

---

## Support

- Full setup guide: [AWS_SES_SETUP.md](AWS_SES_SETUP.md) (now Gmail SMTP guide)
- Email service code: [base/services/email_service.py](base/services/email_service.py)
- Django signals: [base/signals.py](base/signals.py)
- Gmail SMTP Settings: https://support.google.com/mail/answer/7126229
- Google Account Security: https://myaccount.google.com/security
