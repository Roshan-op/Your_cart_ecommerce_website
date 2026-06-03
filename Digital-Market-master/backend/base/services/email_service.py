from django.core.mail import EmailMultiAlternatives
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

ADMIN_EMAIL = 'raghavbharati12@gmail.com'
BRAND      = 'Your-cart'
GREEN      = '#2E7D32'
GOLD       = '#D4AF37'


# ─── Shared helpers ────────────────────────────────────────────────────────────

def _wrap(title, body_html):
    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;color:#333;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0"
  style="max-width:600px;width:100%;background:#ffffff;border-radius:10px;overflow:hidden;
         box-shadow:0 2px 12px rgba(0,0,0,0.08);">
  <!-- Header -->
  <tr>
    <td style="background:{GREEN};padding:28px 32px;text-align:center;">
      <h1 style="margin:0;color:{GOLD};font-size:26px;letter-spacing:3px;font-family:Georgia,serif;">{BRAND}</h1>
      <p style="margin:5px 0 0;color:rgba(255,255,255,0.75);font-size:12px;">Sustainably Stylish, Naturally You</p>
    </td>
  </tr>
  <!-- Body -->
  <tr><td style="padding:32px 32px 24px;">{body_html}</td></tr>
  <!-- Footer -->
  <tr>
    <td style="background:#f9f9f9;padding:18px 32px;text-align:center;border-top:1px solid #eee;">
      <p style="margin:0;color:#bbb;font-size:11px;">© 2026 {BRAND}. Balkumari, Lalitpur, Nepal.</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body></html>"""


def _send(subject, html, to, reply_to=None):
    try:
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', ADMIN_EMAIL)
        msg = EmailMultiAlternatives(
            subject=subject,
            body='Please view this email in an HTML-capable client.',
            from_email=from_email,
            to=[to],
        )
        msg.attach_alternative(html, 'text/html')
        if reply_to:
            msg.reply_to = [reply_to]
        msg.send(fail_silently=False)
        logger.info(f'Email sent → {to}')
        return True
    except Exception as e:
        logger.error(f'Email failed → {to}: {e}')
        return False


# ─── Order Confirmation ────────────────────────────────────────────────────────

def send_order_confirmation(order, items, user_name, user_email):
    """
    order  – dict with keys: _id, totalPrice, shippingPrice, paymentMethod
    items  – list of dicts: name, qty, price
    """
    rows = ''.join(
        f"""<tr>
          <td style="padding:8px 4px;border-bottom:1px solid #f0f0f0;">{i['name']}</td>
          <td style="padding:8px 4px;border-bottom:1px solid #f0f0f0;text-align:center;">{i['qty']}</td>
          <td style="padding:8px 4px;border-bottom:1px solid #f0f0f0;text-align:right;">
            Rs.&nbsp;{float(i['price']) * int(i['qty']):.2f}
          </td>
        </tr>"""
        for i in items
    )

    shipping = float(order.get('shippingPrice') or 0)
    total    = float(order.get('totalPrice') or 0)

    # Customer email
    customer_body = f"""
      <h2 style="color:{GREEN};margin-top:0;">Order Confirmed ✓</h2>
      <p>Hi <strong>{user_name}</strong>, thank you for shopping with <strong>{BRAND}</strong>.
         Your order has been received and is being processed.</p>

      <div style="background:#f0faf0;border-radius:8px;padding:14px 18px;margin:20px 0;display:inline-block;">
        <p style="margin:0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Order ID</p>
        <p style="margin:4px 0 0;font-size:24px;font-weight:bold;color:{GREEN};">#{order['_id']}</p>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
        <tr>
          <th style="text-align:left;padding:8px 4px;border-bottom:2px solid {GREEN};color:{GREEN};font-size:13px;">Product</th>
          <th style="text-align:center;padding:8px 4px;border-bottom:2px solid {GREEN};color:{GREEN};font-size:13px;">Qty</th>
          <th style="text-align:right;padding:8px 4px;border-bottom:2px solid {GREEN};color:{GREEN};font-size:13px;">Subtotal</th>
        </tr>
        {rows}
        <tr>
          <td colspan="2" style="padding:10px 4px 4px;color:#555;">Shipping</td>
          <td style="padding:10px 4px 4px;text-align:right;color:#555;">Rs.&nbsp;{shipping:.2f}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding:4px;font-weight:bold;font-size:16px;color:{GREEN};">Total</td>
          <td style="padding:4px;text-align:right;font-weight:bold;font-size:16px;color:{GREEN};">Rs.&nbsp;{total:.2f}</td>
        </tr>
      </table>

      <p style="margin-top:28px;font-size:13px;color:#555;">
        We will notify you once your order is dispatched.<br>
        Questions? Contact us at
        <a href="mailto:support@your-cart.com" style="color:{GREEN};">support@your-cart.com</a>
        or call <strong>+977-98-1238-3254</strong>.
      </p>"""

    _send(
        f'{BRAND} – Order #{order["_id"]} Confirmed',
        _wrap('Order Confirmed', customer_body),
        user_email,
    )

    # Admin notification
    admin_body = f"""
      <h2 style="color:{GREEN};margin-top:0;">New Order #{order['_id']}</h2>
      <p><strong>Customer:</strong> {user_name} (<a href="mailto:{user_email}" style="color:{GREEN};">{user_email}</a>)</p>
      <p><strong>Payment Method:</strong> {order.get('paymentMethod', '—')}</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
        <tr>
          <th style="text-align:left;padding:8px 4px;border-bottom:2px solid {GREEN};color:{GREEN};font-size:13px;">Product</th>
          <th style="text-align:center;padding:8px 4px;border-bottom:2px solid {GREEN};color:{GREEN};font-size:13px;">Qty</th>
          <th style="text-align:right;padding:8px 4px;border-bottom:2px solid {GREEN};color:{GREEN};font-size:13px;">Subtotal</th>
        </tr>
        {rows}
        <tr>
          <td colspan="2" style="padding:10px 4px 4px;font-weight:bold;font-size:16px;color:{GREEN};">Total</td>
          <td style="padding:10px 4px 4px;text-align:right;font-weight:bold;font-size:16px;color:{GREEN};">Rs.&nbsp;{total:.2f}</td>
        </tr>
      </table>"""

    _send(
        f'[{BRAND}] New Order #{order["_id"]} – {user_name}',
        _wrap('New Order', admin_body),
        ADMIN_EMAIL,
    )


# ─── Contact Form ──────────────────────────────────────────────────────────────

def send_contact_email(name, email, subject, message):
    # Admin notification (reply-to set so admin can reply directly to sender)
    admin_body = f"""
      <h2 style="color:{GREEN};margin-top:0;">New Contact Form Submission</h2>
      <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
        <tr>
          <td style="padding:6px 16px 6px 0;color:#888;white-space:nowrap;">From</td>
          <td style="padding:6px 0;"><strong>{name}</strong></td>
        </tr>
        <tr>
          <td style="padding:6px 16px 6px 0;color:#888;">Email</td>
          <td style="padding:6px 0;">
            <a href="mailto:{email}" style="color:{GREEN};">{email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:6px 16px 6px 0;color:#888;">Subject</td>
          <td style="padding:6px 0;">{subject}</td>
        </tr>
      </table>
      <div style="background:#f9f9f9;border-left:4px solid {GREEN};padding:16px;border-radius:0 6px 6px 0;">
        <p style="margin:0;line-height:1.7;white-space:pre-line;">{message}</p>
      </div>"""

    _send(
        f'[{BRAND} Contact] {subject}',
        _wrap('Contact Form', admin_body),
        ADMIN_EMAIL,
        reply_to=email,
    )

    # User confirmation
    user_body = f"""
      <h2 style="color:{GREEN};margin-top:0;">We've received your message!</h2>
      <p>Hi <strong>{name}</strong>, thank you for contacting <strong>{BRAND}</strong>.</p>
      <p>We've received your message about <em>"{subject}"</em> and will get back to you
         within <strong>2 business days</strong>.</p>
      <div style="background:#f9f9f9;border-left:4px solid {GREEN};padding:16px;border-radius:0 6px 6px 0;margin:20px 0;">
        <p style="margin:0;font-size:13px;color:#666;line-height:1.7;white-space:pre-line;">{message}</p>
      </div>
      <p style="font-size:13px;color:#555;">
        Need a faster response? Call us at <strong>+977-98-1238-3254</strong> (Mon–Fri, 9 AM–6 PM).
      </p>"""

    _send(
        f'{BRAND} – We received your message',
        _wrap('Message Received', user_body),
        email,
    )


# ─── Newsletter ────────────────────────────────────────────────────────────────

def send_newsletter_welcome(subscriber_email):
    user_body = f"""
      <h2 style="color:{GREEN};margin-top:0;">You're subscribed! 🎉</h2>
      <p>Thank you for joining the <strong>{BRAND}</strong> newsletter.</p>
      <p>Here's what you can look forward to:</p>
      <ul style="color:#555;line-height:2;padding-left:20px;">
        <li>Exclusive deals and early-access sales</li>
        <li>New arrivals and seasonal collections</li>
        <li>Sustainability updates and behind-the-scenes stories</li>
      </ul>
      <p style="margin-top:28px;">
        <a href="http://localhost:3000/shop"
           style="background:{GREEN};color:#ffffff;padding:12px 28px;border-radius:6px;
                  text-decoration:none;font-weight:bold;font-size:14px;">
          Shop Now
        </a>
      </p>
      <p style="margin-top:28px;font-size:11px;color:#bbb;">
        Don't want emails? Reply "unsubscribe" and we'll remove you right away.
      </p>"""

    _send(
        f'Welcome to {BRAND} Newsletter!',
        _wrap('Subscribed!', user_body),
        subscriber_email,
    )

    admin_body = f"""
      <h2 style="color:{GREEN};margin-top:0;">New Newsletter Subscriber</h2>
      <p><a href="mailto:{subscriber_email}" style="color:{GREEN};">{subscriber_email}</a>
         just subscribed to the {BRAND} newsletter.</p>"""

    _send(
        f'[{BRAND}] New Subscriber – {subscriber_email}',
        _wrap('New Subscriber', admin_body),
        ADMIN_EMAIL,
    )
