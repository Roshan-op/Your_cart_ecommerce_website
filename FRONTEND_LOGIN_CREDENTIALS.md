# 🔐 LOCALHOST:3000 Frontend Login Credentials

## ✅ Quick Login Guide

### **Login URL**
```
http://localhost:3000/login
```

---

## 🔑 **METHOD 1: Use Existing Admin/Vendor Accounts**

### **ADMIN Account** (Full System Access)
```
Login Page: http://localhost:3000/login
Email/Username: admin
Password: admin123
```

### **VENDOR Account** (Vendor Dashboard Access)
```
Login Page: http://localhost:3000/login
Email/Username: vendor
Password: vendor123
```

---

## 👥 **METHOD 2: Create Test Accounts via Django**

Run this command to create test users:

```bash
cd d:\your cart\Digital-Market-master\backend
python manage.py create_accounts --superuser testadmin --superemail testadmin@example.com --vendor testvendor --vendoremail testvendor@example.com
```

This will output the credentials. Then use them to login on localhost:3000.

---

## 📝 **METHOD 3: Create New Account (Sign Up)**

1. Go to: http://localhost:3000/login
2. Click **"Sign up"** tab
3. Fill in:
   - **Full Name**: Your name
   - **Email**: your-email@example.com
   - **Password**: your-password
   - **Confirm Password**: repeat password
4. Click **Create Account**
5. You'll be logged in automatically

---

## 🎯 **How Frontend Login Works**

The frontend login system (http://localhost:3000/login):

1. Takes **Email/Username** and **Password**
2. Sends POST request to: `http://localhost:8000/api/users/login/`
3. Backend returns JWT token + user info
4. Stores token in localStorage as `authToken`
5. Redirects to home page

### **Login Endpoint:**
```
POST /api/users/login/
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

---

## 💡 **Login Field Accepts:**
- ✅ Username (admin, vendor, etc.)
- ✅ Email (admin@cashmarket.com, etc.)

**Frontend converts the email field to username when sending to backend**

---

## 🚀 **Complete Setup Steps**

### **Step 1: Start Django Backend (if not running)**
```bash
cd d:\your cart\Digital-Market-master\backend
python manage.py runserver
```
✅ Backend running on: http://localhost:8000

### **Step 2: Start React Frontend (if not running)**
```bash
cd d:\your cart\Digital-Market-master\backend\frontend
npm start
```
✅ Frontend running on: http://localhost:3000

### **Step 3: Go to Login Page**
```
http://localhost:3000/login
```

### **Step 4: Enter Credentials**
```
Email/Username: admin
Password: admin123
```

### **Step 5: Click "Sign In"**
✅ You're logged in!

---

## 🔍 **Troubleshooting**

### **Error: "Invalid credentials"**
- Check that backend is running on port 8000
- Verify username/email spelling
- Try creating a new account via signup

### **Error: "Cannot reach backend"**
- Backend must be running: `python manage.py runserver`
- Check it's on: http://localhost:8000/api/users/login/

### **CORS/Connection Issues**
- Ensure backend has CORS enabled
- Check browser console for error details
- Try incognito mode to clear cache

### **Want to create more test accounts?**

**Option A: Using Django Admin**
```bash
python manage.py createsuperuser
```

**Option B: Frontend Signup**
1. Go to http://localhost:3000/login
2. Click "Sign up"
3. Fill form and create account
4. You can now login with that email

---

## 📊 **Account Types & Permissions**

| Feature | Admin | Vendor | Customer |
|---------|-------|--------|----------|
| **Login Page** | ✅ | ✅ | ✅ |
| **Browse Products** | ✅ | ✅ | ✅ |
| **Shopping Cart** | ✅ | ✅ | ✅ |
| **Checkout** | ✅ | ✅ | ✅ |
| **View Orders** | ✅ (all) | ✅ (own) | ✅ (own) |
| **Admin Dashboard** | ✅ | ❌ | ❌ |
| **Vendor Dashboard** | ✅ | ✅ | ❌ |
| **Manage Products** | ✅ | ✅ (own) | ❌ |

---

## 🎪 **Demo Flow**

### **Try As Customer:**
1. Go to http://localhost:3000/login
2. Click "Sign up" (don't have account)
3. Create new account
4. Browse products at http://localhost:3000/shop
5. Add to cart and checkout

### **Try As Admin:**
1. Go to http://localhost:3000/login
2. Enter: `admin` / `admin123`
3. Access admin dashboard
4. View all products, orders, users

### **Try As Vendor:**
1. Go to http://localhost:3000/login
2. Enter: `vendor` / `vendor123`
3. Access vendor dashboard
4. Manage own products

---

## 📞 **Quick Reference Card**

```
┌─────────────────────────────────────────────┐
│     LOCALHOST:3000 LOGIN QUICK REFERENCE     │
├─────────────────────────────────────────────┤
│                                              │
│ ADMIN:                                       │
│   Username: admin                            │
│   Password: admin123                         │
│                                              │
│ VENDOR:                                      │
│   Username: vendor                           │
│   Password: vendor123                        │
│                                              │
│ CUSTOMER:                                    │
│   Sign up at: http://localhost:3000/login    │
│                                              │
│ Backend Required:                            │
│   http://localhost:8000/api/users/login/    │
│                                              │
└─────────────────────────────────────────────┘
```

---

**Happy Testing! 🚀**
