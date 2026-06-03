"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.http import FileResponse, Http404


def serve_image(request, filename):
    """
    Serve images from MEDIA_ROOT with underscore→space fallback.
    Tries the exact filename first, then replaces underscores with spaces.
    """
    base = settings.MEDIA_ROOT

    for candidate in (filename, filename.replace('_', ' ')):
        path_on_disk = os.path.join(base, candidate)
        if os.path.isfile(path_on_disk):
            return FileResponse(open(path_on_disk, 'rb'))

    raise Http404(f'Image not found: {filename}')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='index.html')),
    path('api/products/', include('base.urls.product_urls')),
    path('api/users/', include('base.urls.user_urls')),
    path('api/orders/', include('base.urls.order_urls')),
    path('api/vendor/', include('base.urls.vendor_urls')),
    path('api/admin/', include('base.urls.admin_urls')),
    path('api/', include('base.urls.contact_urls')),
    # Custom image serving — must come before the static() fallback
    re_path(r'^images/(?P<filename>.+)$', serve_image, name='serve-image'),
]
