from django.urls import path
from base.views import contact_views as views

urlpatterns = [
    path('contact/', views.contact_form, name='contact-form'),
    path('newsletter/', views.newsletter_subscribe, name='newsletter-subscribe'),
]
