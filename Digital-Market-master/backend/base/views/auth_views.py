"""
Custom Authentication Views for Admin and Vendor
"""
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from base.models import Product
from django.views.decorators.http import require_http_methods


def get_user_type(user):
    """Determine if user is admin or vendor"""
    if user.is_staff and user.is_superuser:
        return 'admin'
    elif user.is_staff or Product.objects.filter(user=user).exists():
        return 'vendor'
    return None


@require_http_methods(["GET", "POST"])
def admin_login(request):
    """Admin Login Page"""
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            # Check if user is admin or superuser
            if user.is_staff and user.is_superuser:
                login(request, user)
                # Redirect to next page or admin dashboard
                next_page = request.GET.get('next', 'dashboard:admin_dashboard')
                return redirect(next_page)
            else:
                messages.error(request, 'Invalid credentials. Admin account required.')
        else:
            messages.error(request, 'Invalid username or password.')
    
    return render(request, 'auth/admin_login.html')


@require_http_methods(["GET", "POST"])
def vendor_login(request):
    """Vendor Login Page"""
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            # Check if user is vendor (staff but not superuser, or has products)
            is_vendor = (user.is_staff and not user.is_superuser) or Product.objects.filter(user=user).exists()
            
            if is_vendor:
                login(request, user)
                # Redirect to next page or vendor dashboard
                next_page = request.GET.get('next', 'dashboard:vendor_dashboard')
                return redirect(next_page)
            else:
                messages.error(request, 'Invalid credentials. Vendor account required.')
        else:
            messages.error(request, 'Invalid username or password.')
    
    return render(request, 'auth/vendor_login.html')


@require_http_methods(["GET", "POST"])
def customer_signup(request):
    """Customer Signup Page"""
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        password_confirm = request.POST.get('password_confirm')
        first_name = request.POST.get('first_name', '')
        last_name = request.POST.get('last_name', '')
        
        # Validation
        if not username or not email or not password:
            messages.error(request, 'All fields are required.')
            return render(request, 'auth/customer_signup.html')
        
        if password != password_confirm:
            messages.error(request, 'Passwords do not match.')
            return render(request, 'auth/customer_signup.html')
        
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists.')
            return render(request, 'auth/customer_signup.html')
        
        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already exists.')
            return render(request, 'auth/customer_signup.html')
        
        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            is_staff=False,
            is_superuser=False
        )
        
        messages.success(request, 'Account created successfully! You can now login.')
        return redirect('admin_login')
    
    return render(request, 'auth/customer_signup.html')


def logout_view(request):
    """Logout user and redirect to homepage"""
    logout(request)
    messages.success(request, 'You have been logged out.')
    return redirect('/')
