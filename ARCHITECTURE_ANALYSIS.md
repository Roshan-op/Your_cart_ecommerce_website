# Digital Market E-Commerce Platform - Complete Architecture Analysis

**Last Analyzed:** March 30, 2026  
**Projects:** Digital-Market-master, Git-push (backup), Bubal_host (deployment)  

---

## 📋 TABLE OF CONTENTS

1. [Workspace Overview](#workspace-overview)
2. [System Architecture](#system-architecture)
3. [Database Design](#database-design)
4. [API Architecture](#api-architecture)
5. [Frontend Architecture](#frontend-architecture)
6. [Authentication Flow](#authentication-flow)
7. [Deployment Architecture](#deployment-architecture)
8. [API Endpoints Reference](#api-endpoints-reference)
9. [Component Hierarchy](#component-hierarchy)
10. [Data Flow Diagrams](#data-flow-diagrams)

---

## Workspace Overview

```
d:\your cart\
├── Digital-Market-master/          ← PRIMARY PROJECT
│   ├── backend/                     ← Django REST API
│   │   ├── base/                    ← App models, views, serializers
│   │   ├── backend/                 ← Django configuration
│   │   ├── static/                  ← Static files, images
│   │   ├── manage.py
│   │   ├── db.sqlite3
│   │   └── requirements.txt
│   │
│   └── frontend/                    ← React SPA
│       ├── src/                     ← React source
│       ├── public/                  ← Static HTML
│       ├── build/                   ← Built production files
│       └── package.json
│
├── Git-push/                        ← Backup copy
├── Bubal_host/                      ← Hosting config
├── scripts/                         ← Utility scripts
│
├── README.md
├── COMPLETE_GUIDE.md                ← Setup & credentials guide
├── HOSTING_DEPLOYMENT.md            ← Production deployment
├── BUBAL_HOST_CPANEL_DEPLOYMENT.md  ← cPanel hosting specific
└── start_server.bat                 ← Windows batch starter
```

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     COMPLETE SYSTEM DIAGRAM                     │
└─────────────────────────────────────────────────────────────────┘

                         FRONTEND (React)
                    Port 3000 (Development)
         ┌──────────────────────────────────────────┐
         │  React SPA with Redux State Management   │
         ├──────────────────────────────────────────┤
         │ • Pages: 15+ screens (Home, Cart, etc)   │
         │ • Components: 13 reusable components     │
         │ • State: Redux + localStorage            │
         │ • HTTP Client: Axios                     │
         └────────────────────╥─────────────────────┘
                              ║ JSON over HTTPS
                              ║ Authorization: JWT Bearer Token
                              ║
         ┌────────────────────╨─────────────────────┐
         │                                          │
         │    DJANGO REST API BACKEND               │
         │    Port 8000 (Development)               │
         │                                          │
         ├──────────────────────────────────────────┤
         │                                          │
         │  URL Routers:                           │
         │  ├─ /api/products/     (Product CRUD)   │
         │  ├─ /api/orders/       (Order Management)
         │  ├─ /api/users/        (Auth & Users)   │
         │  ├─ /auth/             (Login/Signup)   │
         │  ├─ /dashboard/        (Admin/Vendor)   │
         │  └─ /admin/            (Django Admin)   │
         │                                          │
         │  API Views:                             │
         │  ├─ product_views.py   (17+ endpoints)  │
         │  ├─ order_views.py     (6+ endpoints)   │
         │  ├─ user_views.py      (9+ endpoints)   │
         │  ├─ auth_views.py      (4+ endpoints)   │
         │  └─ dashboard_views.py (7+ endpoints)   │
         │                                          │
         │  Serializers (Data Transformation):     │
         │  ├─ UserSerializer                      │
         │  ├─ ProductSerializer                   │
         │  ├─ OrderSerializer                     │
         │  ├─ OrderItemSerializer                 │
         │  └─ ShippingAddressSerializer           │
         │                                          │
         │  Authentication:                        │
         │  ├─ JWT (rest_framework_simplejwt)      │
         │  ├─ 30-day access tokens                │
         │  ├─ Django User model integration       │
         │  └─ Role-based permissions              │
         │                                          │
         └────────────────────╥─────────────────────┘
                              ║
                              ║ Django ORM
                              ║ SQL Queries
                              ║
         ┌────────────────────╨─────────────────────┐
         │          DATABASE LAYER (SQLite)         │
         ├──────────────────────────────────────────┤
         │                                          │
         │  Models (5 core models):                │
         │  ├─ Product                             │
         │  │  ├─ _id (PK)                         │
         │  │  ├─ user (FK→User, vendor)           │
         │  │  ├─ name, brand, category            │
         │  │  ├─ description, image               │
         │  │  ├─ price, countInStock              │
         │  │  ├─ rating, numReviews               │
         │  │  └─ createdAt                        │
         │  │                                       │
         │  ├─ Review                              │
         │  │  ├─ _id (PK)                         │
         │  │  ├─ product (FK)                     │
         │  │  ├─ user (FK)                        │
         │  │  ├─ name, rating, comment            │
         │  │  └─ createdAt                        │
         │  │                                       │
         │  ├─ Order                               │
         │  │  ├─ _id (PK)                         │
         │  │  ├─ user (FK)                        │
         │  │  ├─ paymentMethod, totalPrice        │
         │  │  ├─ taxPrice, shippingPrice          │
         │  │  ├─ ispaid, paidAt                   │
         │  │  ├─ isDelivered, deliveredAt         │
         │  │  └─ createdAt                        │
         │  │                                       │
         │  ├─ OrderItem                           │
         │  │  ├─ _id (PK)                         │
         │  │  ├─ order (FK)                       │
         │  │  ├─ product (FK)                     │
         │  │  ├─ name, qty, price, image          │
         │  │                                       │
         │  └─ ShippingAddress                     │
         │     ├─ _id (PK)                         │
         │     ├─ order (OneToOne)                 │
         │     ├─ address, city                    │
         │     ├─ PhoneNumber                      │
         │     └─ shippingPrice                    │
         │                                          │
         │  File: db.sqlite3                       │
         │  Can migrate to PostgreSQL/MySQL        │
         │                                          │
         └────────────────────────────────────────┘

```

---

## Database Design

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE SCHEMA                        │
└─────────────────────────────────────────────────────────────┘

    ┌──────────────────┐
    │  auth_user       │ (Django's User Model)
    ├──────────────────┤
    │ id (PK)          │
    │ username         │
    │ email            │
    │ password         │
    │ first_name       │
    │ last_name        │
    │ is_staff         │ ← determines if Vendor
    │ is_superuser     │ ← determines if Admin
    │ is_active        │
    │ date_joined      │
    │ last_login       │
    └──────────┬───────┘
               │
        ┌──────┴──────────────────────────────┐
        │                                     │
        │ 1:N                                 │ 1:N
        │                                     │
    ┌───▼──────────────┐         ┌───────────▼──┐
    │ base_product     │         │ base_review  │
    ├──────────────────┤         ├──────────────┤
    │ _id (PK)         │◄────┐   │ _id (PK)     │
    │ user_id (FK)     │     │   │ user_id (FK) │
    │ name             │     └───┤ product_id   │
    │ brand            │         │ (FK)         │
    │ category         │         │ name         │
    │ description      │         │ rating       │
    │ price            │         │ comment      │
    │ countInStock     │         │ createdAt    │
    │ rating           │         └──────────────┘
    │ numReviews       │
    │ image            │
    │ createdAt        │
    └────┬─────────────┘
         │
         │ 1:N
         │
    ┌────▼──────────────┐
    │ base_orderitem    │
    ├───────────────────┤
    │ _id (PK)          │
    │ product_id (FK)  ├──┐
    │ order_id (FK)    │  │
    │ name              │  │
    │ qty               │  │
    │ price             │  │
    │ image             │  │
    └───────────────────┘  │
         ▲                 │
         │ 1:N             │
         │                 │
    ┌────┴────────────────┴──┐
    │ base_order             │
    ├────────────────────────┤
    │ _id (PK)               │
    │ user_id (FK)           │
    │ paymentMethod          │
    │ taxPrice               │
    │ shippingPrice          │
    │ totalPrice             │
    │ ispaid (Boolean)       │
    │ paidAt (Timestamp)     │
    │ isDelivered (Boolean)  │
    │ deliveredAt (Timestamp)│
    │ createdAt              │
    └────┬────────────────────┘
         │
         │ 1:1 (OneToOne)
         │
    ┌────▼─────────────────┐
    │ base_shippingaddress │
    ├──────────────────────┤
    │ _id (PK)             │
    │ order_id (FK)        │
    │ address              │
    │ city                 │
    │ PhoneNumber          │
    │ shippingPrice        │
    └──────────────────────┘

Key Relationships:
─────────────────
Product  ──1:N──→ Review      (user→product)
Product  ──1:N──→ OrderItem   (product_id)
Order    ──1:1──→ ShippingAddress
Order    ──1:N──→ OrderItem   (order_id)
User     ──1:N──→ Product     (vendor)
User     ──1:N──→ Review      (reviewer)
User     ──1:N──→ Order       (customer)
```

---

## API Architecture

### RESTful API Endpoints Map

```
┌─────────────────────────────────────────────────────────────┐
│          API ENDPOINT ARCHITECTURE & HIERARCHY              │
└─────────────────────────────────────────────────────────────┘

BASE_URL: http://localhost:8000

┌─────────────────────────────────────────────────────────────┐
│  PRODUCT API (/api/products/)                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Public Endpoints:                                          │
│  ├─ GET  /                          List all products       │
│  │   └─ Query params: ?keyword=x&page=1&all=true           │
│  │       Response: {products[], page, pages}               │
│  │                                                          │
│  ├─ GET  /top/                      Top-rated products      │
│  │   └─ Filter: rating >= 4, order by -rating, limit 5     │
│  │       Response: [Product]                                │
│  │                                                          │
│  ├─ GET  /<id>/                     Product details        │
│  │   └─ Response: Product object                           │
│  │                                                          │
│  ├─ GET  /<id>/recommend/           AI recommendations     │
│  │   └─ Uses similarity matrix (sklearn)                   │
│  │       Response: [Product] (4 similar products)          │
│  │                                                          │
│  ├─ POST /<id>/reviews/             Create review          │
│  │   └─ Auth: IsAuthenticated                              │
│  │       Payload: {rating, comment}                        │
│  │       Updates: product.numReviews, product.rating       │
│  │                                                          │
│  Vendor/Admin Endpoints:                                    │
│  ├─ POST /create/                   Create product         │
│  │   └─ Auth: IsAuthenticated, IsAdminUser                 │
│  │       Creates sample product with default values        │
│  │                                                          │
│  ├─ PUT  /update/<id>/              Update product         │
│  │   └─ Auth: IsAuthenticated                              │
│  │       Vendor auth: loginId == productUserId             │
│  │       Payload: {name, price, brand, etc}               │
│  │                                                          │
│  ├─ DELETE /delete/<id>/            Delete product         │
│  │   └─ Auth: IsAuthenticated                              │
│  │       Vendor auth: loginId == productUserId             │
│  │                                                          │
│  ├─ POST /upload/                   Upload product image   │
│  │   └─ Payload: {product_id, image (file)}               │
│  │       Saves to: static/images/                         │
│  │                                                          │
│  └─ GET  /resetdb/                  Reset from CSV         │
│      └─ Payload: Reads from data.csv, recreates all       │
│          products                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ORDER API (/api/orders/)                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Customer Endpoints:                                        │
│  ├─ POST /add/                      Create new order       │
│  │   └─ Auth: IsAuthenticated                              │
│  │       Payload: {orderItems[], shippingAddress, ...}     │
│  │       Creates: Order + OrderItems + ShippingAddress     │
│  │       Updates: Product.countInStock -= qty              │
│  │       Response: Order object (serialized)               │
│  │                                                          │
│  ├─ GET  /myorders/                 User's own orders      │
│  │   └─ Auth: IsAuthenticated                              │
│  │       Response: [Order] filtered by user                │
│  │                                                          │
│  ├─ GET  /<id>/                     Get order details      │
│  │   └─ Auth: IsAuthenticated                              │
│  │       Permission: order.user == request.user            │
│  │       Response: Order object with items & shipping      │
│  │                                                          │
│  ├─ PUT  /<id>/pay/                 Mark as paid           │
│  │   └─ Auth: IsAuthenticated                              │
│  │       Updates: ispaid=True, paidAt=now()                │
│  │       Response: 'Order was paid'                        │
│  │                                                          │
│  Admin Endpoints:                                           │
│  ├─ GET  /                          All orders             │
│  │   └─ Auth: IsAdminUser                                  │
│  │       Response: [Order]                                 │
│  │                                                          │
│  └─ PUT  /<id>/deliver/             Mark as delivered     │
│      └─ Auth: IsAdminUser                                  │
│          Updates: isDelivered=True, deliveredAt=now()      │
│          Response: 'Order was delivered'                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  USER API (/api/users/)                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Auth Endpoints:                                            │
│  ├─ POST /login/                    JWT token login        │
│  │   └─ Payload: {username(email), password}               │
│  │       Response: {token, user object, isAdmin, isVendor}│
│  │       Token type: JWT Bearer (30-day access)            │
│  │                                                          │
│  ├─ POST /register/                 Register new user      │
│  │   └─ Payload: {name, email, password}                   │
│  │       Creates User (is_staff=False, is_superuser=False) │
│  │       Returns: {token, user object}                     │
│  │                                                          │
│  Customer Endpoints:                                        │
│  ├─ GET  /profile/                  Authenticated user     │
│  │   └─ Auth: IsAuthenticated                              │
│  │       Response: Serialized User object                  │
│  │                                                          │
│  ├─ PUT  /profile/update/           Update profile         │
│  │   └─ Auth: IsAuthenticated                              │
│  │       Payload: {name, email, password}                  │
│  │       Updates: first_name, username, email, password    │
│  │       Response: New user serializer data                │
│  │                                                          │
│  Admin Endpoints:                                           │
│  ├─ GET  /                          All users              │
│  │   └─ Auth: IsAdminUser                                  │
│  │       Response: [User]                                  │
│  │                                                          │
│  ├─ GET  /<id>/                     User by ID             │
│  │   └─ Auth: IsAdminUser                                  │
│  │       Response: User object                             │
│  │                                                          │
│  ├─ PUT  /update/<id>/              Update user            │
│  │   └─ Auth: IsAdminUser                                  │
│  │       Payload: {name, email, isAdmin, isVendor}         │
│  │       Updates: is_staff, is_superuser                   │
│  │       Response: Updated user                            │
│  │                                                          │
│  └─ DELETE /delete/<id>/            Delete user            │
│      └─ Auth: IsAdminUser                                  │
│          Response: 'User was deleted'                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  AUTHENTICATION VIEWS (/auth/)                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ├─ GET/POST /admin/login/          Admin login form      │
│  │   └─ Checks: is_staff & is_superuser both True          │
│  │       Redirects to: dashboard:admin_dashboard           │
│  │                                                          │
│  ├─ GET/POST /vendor/login/         Vendor login form     │
│  │   └─ Checks: is_staff OR has products                   │
│  │       Redirects to: dashboard:vendor_dashboard          │
│  │                                                          │
│  ├─ GET/POST /customer/signup/      Customer signup form  │
│  │   └─ Validates: unique username/email, password match   │
│  │       Creates: User(is_staff=False, is_superuser=False) │
│  │       Redirects to: admin_login                         │
│  │                                                          │
│  └─ GET     /logout/                Logout redirect        │
│      └─ Clears session, redirects to: /                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  DASHBOARD VIEWS (/dashboard/)                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Admin: /admin/                     Admin dashboard        │
│  Admin: /admin/orders/              All orders             │
│  Admin: /admin/products/            All products           │
│  Admin: /admin/users/               User management        │
│  Admin: /admin/reports/             System reports         │
│                                                             │
│  Vendor: /vendor/                   Vendor dashboard       │
│  Vendor: /vendor/products/          Own products           │
│  Vendor: /vendor/products/add/      Create product         │
│  Vendor: /vendor/products/edit/<id>/Edit product           │
│  Vendor: /vendor/products/delete/<id>/Delete product       │
│  Vendor: /vendor/orders/            Own orders             │
│  Vendor: /vendor/analytics/         Sales analytics        │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  DJANGO ADMIN (/admin/)                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Custom DigitalMarketAdminSite with:                       │
│  • Enhanced dashboard (index.html template)                │
│  • Real-time statistics (products, orders, users, revenue) │
│  • Chart.js integration (line charts)                      │
│  • Color-coded stat cards (pink/blue/teal/navy/orange)     │
│  • Purple gradient theme (#667eea → #764ba2)               │
│  • Recent orders table                                      │
│  • Admin credentials: admin / AdminPass123!                │
│                                                             │
│  Registered Models:                                         │
│  ├─ auth.User (CustomUserAdmin)                            │
│  ├─ base.Product (ProductAdmin)                            │
│  ├─ base.Order (OrderAdmin)                                │
│  ├─ base.Review (ReviewAdmin)                              │
│  ├─ base.OrderItem (OrderItemAdmin)                        │
│  └─ base.ShippingAddress (ShippingAddressAdmin)            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

```

### Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│              AUTHENTICATION & AUTHORIZATION FLOW            │
└─────────────────────────────────────────────────────────────┘

LOGIN FLOW:
───────────

User (Frontend)                          Backend
      │                                    │
      ├─POST /api/users/login/────────────>
      │  {email, password}                 │
      │                                    │
      │  MyTokenObtainPairView             │
      │  └─> Validate credentials          │
      │       └─> Generate JWT Token       │
      │                                    │
      │<────────────{token, user, etc}─────┤
      │                                    │
      └─> localStorage.setItem('userInfo')


AUTHENTICATED REQUEST:
──────────────────────

Frontend                                Backend
   │                                       │
   ├─GET /api/products/1/──────────────   │
   │  Header:                              │
   │  Authorization: Bearer <token>        │
   │                                       │
   │  JWTAuthentication middleware         │
   │  ├─ Extract token from header         │
   │  ├─ Decode & verify token             │
   │  ├─ Load User from token claim        │
   │  └─> request.user = User object       │
   │                                       │
   │  View decorator checks:               │
   │  ├─ @permission_classes([             │
   │  │   IsAuthenticated,                 │
   │  │   IsAdminUser,                     │
   │  │   IsAuthenticatedOrReadOnly, ...   │
   │  └─])                                 │
   │                                       │
   │<──────────{product_data}──────────────┤
   │


USER ROLE HIERARCHY:
────────────────────

┌──────────────────────────────────────────────────┐
│              SUPER ADMIN (is_superuser=True)     │
│           (is_staff=True)                        │
│  • Full system access                           │
│  • Can perform any operation                    │
│  • Login at: /auth/admin/login/                 │
└──────────────────────────────────────────────────┘
         ▲
         │ Hierarchy
         │
┌────────┴───────────────────────────────────────┐
│           VENDOR (is_staff=True,                │
│          is_superuser=False)                    │
│  • Manage own products                         │
│  • View own orders                             │
│  • Vendor dashboard access                     │
│  • Login at: /auth/vendor/login/               │
└────────────────────────────────────────────────┘
         ▲
         │ Hierarchy
         │
┌────────┴───────────────────────────────────────┐
│        CUSTOMER (is_staff=False,                │
│         is_superuser=False)                     │
│  • Browse products (public API)                │
│  • Place orders                                │
│  • View own profile & orders                   │
│  • Sign up at: /auth/customer/signup/          │
└────────────────────────────────────────────────┘


TOKEN CONFIGURATION:
────────────────────
Algorithm: HS256 (HMAC SHA-256)
Signing Key: SECRET_KEY (from settings)
Access Token Lifetime: 30 days
Refresh Token Lifetime: 1 day
Auth Header Type: Bearer
Claim Field: HTTP_AUTHORIZATION
```

---

## Frontend Architecture

### React Component Hierarchy & Routing

```
┌─────────────────────────────────────────────────────────────┐
│            REACT FRONTEND COMPONENT ARCHITECTURE            │
└─────────────────────────────────────────────────────────────┘

App.js (Root Component)
│
├─ <Router>  (React Router for SPA navigation)
│  │
│  ├─ <Header/>
│  │  ├─ Navigation menu
│  │  ├─ <SearchBox/> (product search)
│  │  └─ User menu (login/profile/logout)
│  │
│  ├─ <main className="py-3">
│  │  │
│  │  ├─ Route: / ────────────> <HomeScreen/>
│  │  │   └─ Lists all products with pagination
│  │  │       └─ Uses <Product/> component cards
│  │  │       └─ Uses <Paginate/> for pagination
│  │  │       └─ Uses <TopFilter/> for filters
│  │  │       └─ Uses <ProductCarousel/> for featured
│  │  │
│  │  ├─ Route: /product/:id ──> <ProductScreen/>
│  │  │   └─ Product details, reviews, recommendations
│  │  │       └─ Uses <Rating/> for star display
│  │  │       └─ Calls recommend API for similar
│  │  │
│  │  ├─ Route: /cart/:id? ────> <CartScreen/>
│  │  │   └─ Shopping cart management
│  │  │       └─ Edit quantities, remove items
│  │  │       └─ Proceed to checkout
│  │  │
│  │  ├─ Route: /login ────────> <LoginScreen/>
│  │  │   └─ JWT token authentication
│  │  │       └─ Stores token in localStorage
│  │  │
│  │  ├─ Route: /register ─────> <RegisterScreen/>
│  │  │   └─ New user registration
│  │  │       └─ Creates account, auto-login
│  │  │
│  │  ├─ Route: /profile ──────> <ProfileScreen/>
│  │  │   └─ Authenticated user profile
│  │  │       └─ Edit email, password
│  │  │
│  │  ├─ Route: /shipping ─────> <ShippingScreen/>
│  │  │   └─ Shipping address entry
│  │  │       └─ Uses <CheckoutSteps/>
│  │  │
│  │  ├─ Route: /payment ──────> <PaymentScreen/>
│  │  │   └─ Payment method selection
│  │  │       └─ Uses <CheckoutSteps/>
│  │  │
│  │  ├─ Route: /placeorder ───> <PlaceOrderScreen/>
│  │  │   └─ Order summary before placement
│  │  │       └─ Uses <CheckoutSteps/>
│  │  │
│  │  ├─ Route: /order/:id ────> <OrderScreen/>
│  │  │   └─ Order tracking & details
│  │  │       └─ Displays order items, status
│  │  │
│  │  ├─ ADMIN ROUTES:
│  │  │  │
│  │  │  ├─ /admin/userlist ───> <UserListScreen/>
│  │  │  │   └─ Admin: List all users
│  │  │  │       └─ Delete, edit user links
│  │  │  │
│  │  │  ├─ /admin/user/:id/edit> <UserEditScreen/>
│  │  │  │   └─ Admin: Edit user details
│  │  │  │       └─ Toggle isAdmin, isVendor
│  │  │  │
│  │  │  ├─ /admin/productlist ─> <ProductListScreen/>
│  │  │  │   └─ Admin: Paginated product list
│  │  │  │       └─ Create, edit, delete links
│  │  │  │
│  │  │  ├─ /admin/product/:id/edit> <ProductEditScreen/>
│  │  │  │   └─ Admin: Edit product details
│  │  │  │       └─ Name, price, stock, image
│  │  │  │
│  │  │  └─ /admin/orderlist ──> <OrderListScreen/>
│  │  │      └─ Admin: All orders listing
│  │  │          └─ Toggle delivery status
│  │  │
│  │  └─ <FormContainer/> (wrapper for forms)
│  │
│  └─ <Footer/>
│     └─ Footer information
│


REUSABLE COMPONENTS:
────────────────────

13 Reusable Components across pages:

1. <Header/>
   └─ Navigation, user menu, search integration

2. <Footer/>
   └─ Footer section

3. <Product/>
   └─ Product card display with image, price, rating
   └─ Props: product, review count

4. <ProductCarousel/>
   └─ Featured products carousel
   └─ Uses Chart.js for animations (optional)

5. <Rating/>
   └─ Star rating display (0-5 stars)
   └─ Props: value (number), text (description)

6. <Paginate/>
   └─ Pagination controls
   └─ Props: pages, page, keyword (optional)

7. <Message/>
   └─ Alert/notification display
   └─ Props: variant (success/danger/warning)

8. <Loader/>
   └─ Loading spinner/indicator
   └─ Shows while API data loads

9. <FormContainer/>
   └─ Wrapper for form pages
   └─ Standardized form layout

10. <CheckoutSteps/>
    └─ Progress indicator for checkout
    └─ Shows: Shipping → Payment → PlaceOrder

11. <SearchBox/>
    └─ Product search functionality
    └─ Query string integration

12. <TopFilter/>
    └─ Category & brand filters
    └─ Filter panel

13. <HeroBanner/>
    └─ Main promotional banner
    └─ Landing page hero section

```

### Redux State Management Architecture

```
┌─────────────────────────────────────────────────────────────┐
│        REDUX STATE MANAGEMENT & STATE PERSISTENCE          │
└─────────────────────────────────────────────────────────────┘

STORE STRUCTURE:
────────────────

store.js:
  ├─ combineReducers() combines all reducers
  ├─ Middleware: Redux Thunk for async actions
  ├─ Preloaded state from localStorage
  └─ Initial state:
     ├─ cart: { cartItems: [], shippingAddress: {} }
     └─ userLogin: { userInfo: null or {...} }


STATE TREE:
───────────

Redux Store Root
│
├─ productList
│  ├─ loading: Boolean
│  ├─ products: [{_id, name, price, ...}]
│  ├─ page: Number
│  ├─ pages: Number
│  └─ error: String or null
│
├─ productDetails
│  ├─ loading: Boolean
│  ├─ product: {_id, name, reviews: [...], ...}
│  └─ error: String or null
│
├─ productCreate
│  ├─ loading: Boolean
│  ├─ success: Boolean
│  ├─ product: {...}
│  └─ error: String or null
│
├─ productUpdate
│  ├─ loading: Boolean
│  ├─ success: Boolean
│  └─ product: {...}
│
├─ productDelete
│  ├─ loading: Boolean
│  ├─ success: Boolean
│  └─ error: String or null
│
├─ productReviewCreate
│  ├─ loading: Boolean
│  ├─ success: Boolean
│  └─ error: String or null
│
├─ productTopRated
│  ├─ loading: Boolean
│  └─ products: [{_id, name, rating, ...}]
│
├─ productRecommend
│  ├─ loading: Boolean
│  ├─ products: [{_id, name, ...}]
│  └─ error: String or null
│
├─ cart
│  ├─ cartItems: [
│  │   {product, qty, price, image, brand}
│  │ ]
│  ├─ shippingAddress: {
│  │   address, city, phoneNumber
│  │ }
│  ├─ paymentMethod: String
│  └─ itemsPrice, taxPrice, shippingPrice, totalPrice
│
├─ userLogin
│  ├─ loading: Boolean
│  ├─ userInfo: {
│  │   id, _id, username, email, name,
│  │   isAdmin, token, isVendor
│  │ } (or null if logged out)
│  └─ error: String or null
│
├─ userRegister
│  ├─ loading: Boolean
│  ├─ userInfo: {...}
│  └─ error: String or null
│
├─ userDetails
│  ├─ loading: Boolean
│  ├─ user: {...}
│  └─ error: String or null
│
├─ userList
│  ├─ loading: Boolean
│  ├─ users: [{id, name, email, isAdmin, isVendor}]
│  └─ error: String or null
│
├─ userDelete
│  ├─ loading: Boolean
│  └─ success: Boolean
│
├─ userUpdate
│  ├─ loading: Boolean
│  ├─ success: Boolean
│  └─ user: {...}
│
├─ orderCreate
│  ├─ loading: Boolean
│  ├─ success: Boolean
│  ├─ order: {_id, user, orderItems, ...}
│  └─ error: String or null
│
├─ orderDetails
│  ├─ loading: Boolean
│  ├─ order: {_id, user, orderItems, shippingAddress, ...}
│  └─ error: String or null
│
├─ orderPay
│  ├─ loading: Boolean
│  ├─ success: Boolean
│  └─ error: String or null
│
├─ orderListMy
│  ├─ loading: Boolean
│  ├─ orders: [{_id, user, createdAt, totalPrice, ...}]
│  └─ error: String or null
│
├─ orderList
│  ├─ loading: Boolean
│  ├─ orders: [{_id, user, createdAt, totalPrice, ...}]
│  └─ error: String or null
│
└─ orderDeliver
   ├─ loading: Boolean
   ├─ success: Boolean
   └─ error: String or null


LOCAL STORAGE PERSISTENCE:
──────────────────────────

Browser localStorage keys:
  ├─ cartItems
  │  └─ Persists: [{product: id, qty, price, ...}]
  │  └─ Loads on app init
  │
  ├─ userInfo
  │  └─ Persists: {token, user details}
  │  └─ Loads on app init
  │  └─ Cleared on logout
  │
  └─ shippingAddress
     └─ Persists: {address, city, phone}
     └─ Loads on app init


THUNK ACTIONS (Async Operations):
──────────────────────────────────

productActions.js:
  ├─ listProducts(keyword)
  │  └─ Dispatches: REQUEST → SUCCESS/FAIL
  │
  ├─ listProductsDetails(id)
  │  └─ Fetches single product
  │
  ├─ deleteProduct(id)
  │  └─ DELETE with auth token
  │
  ├─ createProduct()
  │  └─ POST with auth token
  │
  ├─ updateProduct(product)
  │  └─ PUT with auth token
  │
  └─ createProductReview(id, review)

userActions.js:
  ├─ login(email, password)
  │  └─ POST /api/users/login/
  │  └─ Saves token to localStorage
  │
  ├─ register(name, email, password)
  │  └─ POST /api/users/register/
  │
  ├─ logout()
  │  └─ Clears ALL state per role
  │
  ├─ getUserDetails(id)
  │  └─ GET /api/users/<id>/
  │
  ├─ updateUserProfile(user)
  │  └─ PUT /api/users/profile/update/
  │
  └─ listUsers(), deleteUser(id), updateUser(id, user)

orderActions.js:
  ├─ createOrder(order)
  │  └─ POST /api/orders/add/
  │
  ├─ getOrderDetails(id)
  │  └─ GET /api/orders/<id>/
  │
  ├─ payOrder(id)
  │  └─ PUT /api/orders/<id>/pay/
  │
  ├─ listMyOrders()
  │  └─ GET /api/orders/myorders/
  │
  ├─ listOrders()
  │  └─ GET /api/orders/ (admin)
  │
  └─ deliverOrder(id)
     └─ PUT /api/orders/<id>/deliver/

cartActions.js:
  ├─ addToCart(id, qty)
  │  └─ Adds/updates item in cart
  │  └─ Persists cartItems to localStorage
  │
  ├─ removeFromCart(id)
  │  └─ Removes item from cart
  │
  ├─ saveShippingAddress(address)
  │  └─ Persists to localStorage
  │
  └─ savePaymentMethod(method)

```

---

## Authentication Flow

### Complete Authentication & Authorization Diagram

```
┌─────────────────────────────────────────────────────────────┐
│     COMPLETE USER AUTHENTICATION & AUTHORIZATION FLOW       │
└─────────────────────────────────────────────────────────────┘

USER REGISTRATION:
──────────────────

Customer (Frontend)
      │
      └─ clicks Register button
         │
         ├─ <RegisterScreen/>
         │  └─ Form with: name, email, password
         │
         └─> POST /api/users/register/
            {
              "name": "John Doe",
              "email": "john@example.com",
              "password": "secure123"
            }
            │
            ├─ Backend validation:
            │  ├─ Check email uniqueness
            │  ├─ Check username available
            │  └─ Hash password
            │
            ├─ Creates User:
            │  {
            │    username: "john@example.com",
            │    email: "john@example.com",
            │    first_name: "John",
            │    password: hashed,
            │    is_staff: False,
            │    is_superuser: False
            │  }
            │
            └─ Returns: UserSerializerWithToken
               {
                 "_id": 5,
                 "id": 5,
                 "username": "john@example.com",
                 "email": "john@example.com",
                 "name": "John Doe",
                 "isAdmin": false,
                 "isVendor": false,
                 "token": "eyJ0eXAiOiJKV1QiLCJhb..."
               }
               │
               ├─ Frontend action (userActions.js):
               │  dispatch(USER_REGISTER_SUCCESS, payload)
               │  dispatch(USER_LOGIN_SUCCESS, payload)
               │
               └─ LocalStorage:
                  localStorage.setItem('userInfo', JSON.stringify(data))


USER LOGIN:
───────────

Customer (Frontend)
      │
      └─ clicks Login button
         │
         ├─ <LoginScreen/>
         │  └─ Form with: email, password
         │
         └─> POST /api/users/login/
            {
              "username": "john@example.com",
              "password": "secure123"
            }
            │
            ├─ Backend (MyTokenObtainPairView):
            │  ├─ Authenticate user
            │  │  └─ Check email+password
            │  │
            │  ├─ Generate JWT Token:
            │  │  ├─ Header: {typ: "JWT", alg: "HS256"}
            │  │  ├─ Payload:
            │  │  │  {
            │  │  │    user_id: 5,
            │  │  │    token_type: "access",
            │  │  │    exp: <30 days from now>,
            │  │  │    iat: <now>
            │  │  │  }
            │  │  └─ Signature: HMAC(SECRET_KEY)
            │  │
            │  └─ Return serialized user + token
            │
            └─ Returns: UserSerializerWithToken
               {
                 "_id": 5,
                 "id": 5,
                 "username": "john@example.com",
                 "email": "john@example.com",
                 "name": "John Doe",
                 "isAdmin": false,
                 "isVendor": false,
                 "token": "eyJ0eXAiOiJKV1QiLCJhb..."
               }
               │
               ├─ Frontend actions:
               │  dispatch(USER_LOGIN_SUCCESS, payload)
               │
               └─ LocalStorage:
                  localStorage.setItem('userInfo', JSON.stringify(data))


AUTHENTICATED API REQUESTS:
───────────────────────────

Frontend (with stored token)
      │
      └─> Axios GET /api/products/1
         Headers: {
           "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhb...",
           "Content-Type": "application/json"
         }
         │
         ├─ Django Middleware (JWTAuthentication):
         │  ├─ Extract "Bearer eyJ..." from header
         │  ├─ Decode token
         │  │  ├─ Verify signature
         │  │  ├─ Check expiration
         │  │  ├─ Check blacklist (if enabled)
         │  │  └─ Extract user_id from payload
         │  │
         │  └─ request.user = User(id=5)
         │
         ├─ View checks permissions:
         │  ├─ @permission_classes([IsAuthenticated])
         │  │  └─ ✓ request.user is authenticated
         │  │     └─ Proceed to view
         │  │
         │  └─ Optional authorization checks:
         │    └─ if request.user.is_staff:
         │       └─ ✓ Vendor/Admin check
         │
         └─> View executes and returns response


ROLE-BASED ACCESS CONTROL:
──────────────────────────

User Type       is_staff    is_superuser    Permissions
────────────────────────────────────────────────────────
Admin           True        True            • All endpoints
                                           • ALL CRUD operations
                                           • Admin dashboard
                                           • View all users/orders/products
                                           • Generate reports

Vendor          True        False           • Can create/edit own products
                                           • Can view own orders
                                           • Vendor dashboard
                                           • Cannot: view other vendors' data
                                           • Cannot: delete users

Customer        False       False           • Browse public products
                                           • Create/manage orders
                                           • Create reviews
                                           • View own profile & orders
                                           • Cannot: create/edit products
                                           • Cannot: access admin areas


LOGOUT:
───────

Customer (Frontend)
      │
      └─ clicks Logout
         │
         ├─ userActions.logout() thunk:
         │  ├─ localStorage.removeItem('userInfo')
         │  ├─ Dispatch: USER_LOGOUT
         │  ├─ Dispatch: USER_DETAILS_RESET
         │  ├─ Dispatch: ORDER_LIST_MY_RESET
         │  └─ Dispatch: USER_LIST_RESET
         │
         ├─ Redux state cleared:
         │  ├─ userLogin.userInfo = null
         │  ├─ userDetails = {}
         │  ├─ orderListMy = {}
         │  └─ userList = {}
         │
         └─> GET /auth/logout/
            │
            ├─ Backend: logout(request)
            │  ├─ logout(request)  [Django function]
            │  └─ Redirect to "/"
            │
            └─ Frontend: Redirect to Home
               └─ User is now anonymous


TOKEN EXPIRATION HANDLING:
──────────────────────────

Frontend tries: GET /api/users/profile/
   │
   ├─ Header: Authorization: Bearer <expired_token>
   │
   └─> Backend JWT validation FAILS
       │
       ├─ 401 Unauthorized response
       │
       └─> Frontend Axios interceptor catches error:
           ├─ Check if error.response.status === 401
           ├─ Dispatch: USER_LOGOUT
           ├─ Clear localStorage
           └─ Redirect to /login
              └─ Show: "Session expired, please login again"

```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              DEPLOYMENT ARCHITECTURE OPTIONS               │
└─────────────────────────────────────────────────────────────┘

CURRENT DEVELOPMENT SETUP:
──────────────────────────

Local Machine (Windows)
├─ Django Backend
│  ├─ Port: 8000
│  ├─ Command: python manage.py runserver
│  ├─ Process: console window or start_server.bat
│  └─ Database: SQLite (local file)
│
├─ React Frontend
│  ├─ Port: 3000
│  ├─ Command: npm start
│  ├─ Dev Server: Webpack dev server with hot reload
│  └─ Build: npm run build → frontend/build/
│
└─ Start Script: start_server.bat (Windows)
   └─ Activates venv & runs Django


PRODUCTION DEPLOYMENT OPTIONS:
──────────────────────────────

Option 1: HEROKU (Easiest, Recommended)
────────────────────────────────────────
Cost: $7-25/mo
Setup:
  ├─ Push code to Git
  ├─ Create Procfile (web: gunicorn backend.wsgi)
  ├─ Set environment variables
  ├─ Link PostgreSQL add-on
  └─ Deploy with: git push heroku main

Architecture:
  ├─ Dyno: Runs Django + React
  ├─ PostgreSQL: Managed database
  ├─ Static files: S3 or Heroku CDN
  ├─ Media files: S3 or Heroku
  └─ SSL: Automatic


Option 2: CPANEL HOSTING (Bubal Host)
──────────────────────────────────────
Cost: ~$3-10/mo
Setup:
  ├─ Upload via FTP/SFTP
  ├─ Python 3.8+ must be installed
  ├─ Create virtual environment
  ├─ Install dependencies
  ├─ Configure database (MySQL/PostgreSQL)
  ├─ Setup supervisor/cron for restart
  └─ Configure SSL certificate

File Structure:
  ~/public_html/     ← React frontend
  ~/django_app/      ← Django backend
  ~/databases/       ← MySQL/PostgreSQL

Web Server: Apache with mod_wsgi or Nginx
Application Server: Gunicorn or uWSGI
Process Manager: Supervisor


Option 3: DIGITALOCEAN (Full Control)
──────────────────────────────────────
Cost: $4-24/mo per droplet
Setup:
  ├─ SSH into droplet
  ├─ Install: Python, PostgreSQL, Nginx, Gunicorn
  ├─ Clone repo & setup virtual env
  ├─ Configure Gunicorn service
  ├─ Setup Nginx as reverse proxy
  ├─ Install SSL with Let's Encrypt
  └─ Configure firewall & backups

Process:
  ├─ Nginx (reverse proxy)
  │  └─ Port 80/443
  │     │
  │     └─> Gunicorn
  │        ├─ Port 8000
  │        ├─ Django app
  │        └─ Static/media served
  │
  └─ PostgreSQL (database)
     └─ Port 5432


Option 4: AWS DEPLOYMENT
────────────────────────
Cost: $1-100+/mo
Services:
  ├─ EC2: Application server
  ├─ RDS: PostgreSQL database
  ├─ S3: Static & media files
  ├─ CloudFront: CDN
  ├─ Route53: DNS
  └─ ACM: SSL certificates

Architecture: Terraform/CloudFormation Infrastructure as Code


ENVIRONMENT CONFIGURATION:
──────────────────────────

Development (.env not needed for SQLite):
  DEBUG = True
  ALLOWED_HOSTS = localhost, 127.0.0.1
  DATABASE = SQLite
  STATIC_URL = /static/
  CORS_ALLOW_ALL_ORIGINS = True

Production (.env file):
  DEBUG = False
  SECRET_KEY = <strong-secret>
  ALLOWED_HOSTS = yourdomain.com, www.yourdomain.com
  DATABASE_URL = postgres://user:pass@host/db
  STATIC_ROOT = /home/app/static/
  MEDIA_ROOT = /home/app/media/
  AWS_STORAGE_BUCKET_NAME = your-bucket
  EMAIL_HOST_PASSWORD = <smtp-password>
  CORS_ALLOWED_ORIGINS = https://yourdomain.com


DEPLOYMENT DATA FLOW:
─────────────────────

User (Browser)
      │
      ├─ User visits: https://yourdomain.com
      │
      ├─> DNS Lookup → yourdomain.com → 203.0.113.5
      │
      ├─> HTTP Request to: 203.0.113.5:443 (HTTPS)
      │
      ├─> SSL/TLS Handshake
      │
      ├─> Nginx (Reverse Proxy)
      │  ├─ Port 443 (HTTPS)
      │  ├─ Port 80 → 443 redirect
      │  ├─ Serves static files directly
      │  └─ Proxies /api/* to Gunicorn
      │
      ├─> Gunicorn (App Server)
      │  ├─ Port 8000 (internal only)
      │  ├─ Multiple workers (e.g., 4)
      │  ├─ Handles Django requests
      │  ├─ Queries PostgreSQL
      │  └─ Returns JSON or HTML
      │
      ├─> PostgreSQL (Database)
      │  ├─ Stores: Users, Products, Orders, etc.
      │  ├─ Backups: Automated daily
      │  └─ SSL connection
      │
      ├─> S3 (Media & Backups)
      │  ├─ Product images
      │  ├─ Database backups
      │  └─ CDN delivery (CloudFront)
      │
      └─> Response back to browser
         ├─ HTML (index.html for SPA)
         ├─ JavaScript bundles
         ├─ CSS
         ├─ Media files (from CDN)
         └─ JSON API responses


REQUIREMENTS FOR PRODUCTION:
────────────────────────────

Python Packages (requirements.txt):
  ├─ Django==4.0.4
  ├─ djangorestframework
  ├─ django-cors-headers
  ├─ djangorestframework-simplejwt
  ├─ gunicorn (production server)
  ├─ psycopg2-binary (PostgreSQL adapter)
  ├─ python-decouple (environment variables)
  ├─ pillow (image processing)
  ├─ pandas (data processing)
  └─ scikit-learn (ML recommendations)

Node.js (frontend/package.json):
  ├─ react
  ├─ react-router-dom
  ├─ redux
  ├─ react-redux
  ├─ redux-thunk
  ├─ axios
  ├─ react-bootstrap
  └─ bootstrap

System Packages:
  ├─ PostgreSQL (recommended over SQLite)
  ├─ Python 3.8+
  ├─ Node.js 14+
  ├─ Nginx (reverse proxy)
  ├─ Supervisor (process management)
  └─ Certbot (SSL certificates)

```

---

## API Endpoints Reference

### Complete API Endpoint Summary

```
┌─────────────────────────────────────────────────────────────┐
│          COMPLETE REST API ENDPOINTS REFERENCE              │
└─────────────────────────────────────────────────────────────┘

PRODUCT ENDPOINTS:
══════════════════

[GET]  /api/products/
       Query: ?keyword=text&page=1&all=true
       Response: {products: [], page: int, pages: int}
       Auth: Public
       Rate: Unlimited

[GET]  /api/products/top/
       Response: [Product × 5]
       Auth: Public
       Filter: rating >= 4, top 5

[GET]  /api/products/{id}/
       Response: Product object
       Auth: Public

[POST] /api/products/create/
       Auth: IsAuthenticated + IsAdminUser
       Body: {} (auto-generate sample)
       Response: Product object

[PUT]  /api/products/update/{id}/
       Auth: IsAuthenticated (vendor auth check)
       Body: {name, brand, price, category, description, countInStock}
       Response: Updated Product

[DELETE] /api/products/delete/{id}/
        Auth: IsAuthenticated (vendor auth check)
        Response: "Product Deleted"

[POST] /api/products/upload/
       Auth: Any
       Body: {product_id, image: file}
       Response: "Image was uploaded"

[POST] /api/products/{id}/reviews/
       Auth: IsAuthenticated
       Body: {rating, comment}
       Response: "Review Added"
       Updates: product.numReviews, product.rating

[GET]  /api/products/{id}/recommend/
       Response: [Product × 4] (similar products)
       Uses: Similarity matrix from sklearn
       Auth: Public

[GET]  /api/products/resetdb/
       Response: "Bus Stop are Added"
       Loads data from: data.csv
       Auth: Any (should be admin only!)


ORDER ENDPOINTS:
════════════════

[GET]  /api/orders/
       Auth: IsAdminUser
       Response: [Order]

[POST] /api/orders/add/
       Auth: IsAuthenticated
       Body: {
         orderItems: [{product: id, qty: int, price: dec}],
         shippingAddress: {address, city, phoneNumber},
         paymentMethod: string,
         taxPrice: decimal,
         shippingPrice: decimal,
         totalPrice: decimal
       }
       Creates: Order + OrderItems + ShippingAddress
       Updates: Product.countInStock -= qty
       Response: Order object (serialized)

[GET]  /api/orders/myorders/
       Auth: IsAuthenticated
       Response: [Order] filtered by user

[GET]  /api/orders/{id}/
       Auth: IsAuthenticated
       Permission: order.user == request.user OR is_staff
       Response: Order with nested items & shipping

[PUT]  /api/orders/{id}/pay/
       Auth: IsAuthenticated
       Body: {} (optional update data)
       Updates: ispaid=True, paidAt=now()
       Response: "Order was paid"

[PUT]  /api/orders/{id}/deliver/
       Auth: IsAdminUser
       Updates: isDelivered=True, deliveredAt=now()
       Response: "Order was delivered"


USER ENDPOINTS:
═══════════════

[POST] /api/users/login/
       Body: {username: email, password: password}
       Response: {token, user object, isAdmin, isVendor}
       Generates: JWT access token (30 days)

[POST] /api/users/register/
       Body: {name, email, password}
       Creates: User (is_staff=False, is_superuser=False)
       Response: {token, user object}
       Auto-login after registration

[GET]  /api/users/profile/
       Auth: IsAuthenticated
       Response: Serialized User object

[PUT]  /api/users/profile/update/
       Auth: IsAuthenticated
       Body: {name, email, password: "" (if no change)}
       Updates: first_name, username, email, password
       Response: UserSerializerWithToken

[GET]  /api/users/
       Auth: IsAdminUser
       Response: [User]

[GET]  /api/users/{id}/
       Auth: IsAdminUser
       Response: User object

[PUT]  /api/users/update/{id}/
       Auth: IsAdminUser
       Body: {name, email, isAdmin, isVendor}
       Updates: first_name, username, email, is_staff, is_superuser
       Response: Updated User

[DELETE] /api/users/delete/{id}/
        Auth: IsAdminUser
        Response: "User was deleted"


AUTH VIEWS:
═══════════

[GET/POST] /auth/admin/login/
           Check: is_staff & is_superuser
           Redirect: /dashboard/admin/

[GET/POST] /auth/vendor/login/
           Check: is_staff OR has products
           Redirect: /dashboard/vendor/

[GET/POST] /auth/customer/signup/
           Validate: username/email unique, password match
           Redirect: /auth/admin/login/

[GET]      /auth/logout/
           Clears session
           Redirect: /


DASHBOARD VIEWS:
════════════════

[GET]  /dashboard/admin/
       Auth: is_staff & is_superuser
       Template: admin dashboard template

[GET]  /dashboard/admin/orders/
[GET]  /dashboard/admin/products/
[GET]  /dashboard/admin/users/
[GET]  /dashboard/admin/reports/

[GET]  /dashboard/vendor/
       Auth: is_staff
       Template: vendor dashboard template

[GET]  /dashboard/vendor/products/
[GET]  /dashboard/vendor/products/add/
[GET]  /dashboard/vendor/products/edit/<id>/
[GET]  /dashboard/vendor/products/delete/<id>/
[GET]  /dashboard/vendor/orders/
[GET]  /dashboard/vendor/analytics/


DJANGO ADMIN:
══════════════

[GET]  /admin/
       Custom DigitalMarketAdminSite
       Enhanced dashboard with metrics
       Auth: Django admin user (is_staff & is_superuser)
       Credentials: admin / AdminPass123!
       Features:
       └─ Real-time statistics
       └─ Product/Order/User CRUD
       └─ Chart.js dashboard
       └─ Purple/orange theme


RESPONSE FORMAT STANDARDS:
═══════════════════════════

Success (2xx):
  ├─ List endpoint:
  │  {
  │    "products": [...],
  │    "page": 1,
  │    "pages": 5
  │  }
  │
  ├─ Detail endpoint:
  │  {
  │    "_id": 1,
  │    "name": "Product Name",
  │    "price": "99.99",
  │    ...
  │  }
  │
  └─ Created/Updated:
     {
       "_id": 1,
       "name": "Updated Name",
       ...
     }

Error (4xx, 5xx):
  └─ {
       "detail": "Error message"
     }


AUTHENTICATION HEADER:
══════════════════════

For authenticated endpoints, include:
  Authorization: Bearer <access_token>

Example:
  GET /api/users/profile/
  Headers:
    Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
    Content-Type: application/json

```

---

## Component Hierarchy & Data Flow

### Complete Component Tree with Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│         REACT COMPONENT HIERARCHY WITH DATA FLOW           │
└─────────────────────────────────────────────────────────────┘

App.js (Root)
│
├─ <BrowserRouter>
│  │
│  ├─ <Header/> ◄─────────────────────────────────────┐
│  │  │                                               │
│  │  ├─ Logo/Brand                                   │
│  │  ├─ <SearchBox/>                                 │
│  │  │   └─ State: Redux userLogin                   │
│  │  │       └─ userName display                     │
│  │  │       └─ Redirect to /product/?keyword=x     │
│  │  │                                               │
│  │  └─ User Menu                                    │
│  │       ├─ IF authenticated:                       │
│  │       │  ├─ Link to Profile                      │
│  │       │  └─ Link to Logout                       │
│  │       ├─ IF admin:                               │
│  │       │  └─ Link to Admin Area                   │
│  │       └─ IF not authenticated:                   │
│  │          ├─ Link to Login                        │
│  │          └─ Link to Register                     │
│  │                                                   │
│  ├─ <main className="py-3">                         │
│  │  │                                               │
│  │  └─ <Container>                                  │
│  │     │                                            │
│  │     ├─ ROUTE: / ───────> <HomeScreen/>          │
│  │     │                    ├─ Redux: productList   │
│  │     │                    ├─ Dispatch:            │
│  │     │                    │  └─ listProducts()    │
│  │     │                    │                       │
│  │     │                    ├─ Pagination:          │
│  │     │                    │  ├─ keyword param     │
│  │     │                    │  ├─ page param        │
│  │     │                    │  └─ <Paginate/>      │
│  │     │                    │                       │
│  │     │                    ├─ Mapping:             │
│  │     │                    │  ├─ products.map()    │
│  │     │                    │  └─ <Product/> card  │
│  │     │                    │                       │
│  │     │                    ├─ Featured:            │
│  │     │                    │  └─ <ProductCarousel/> │
│  │     │                    │                       │
│  │     │                    ├─ Filters:             │
│  │     │                    │  └─ <TopFilter/>      │
│  │     │                    │                       │
│  │     │                    └─ Messages:            │
│  │     │                       └─ <Message/>        │
│  │     │                                            │
│  │     ├─ ROUTE: /product/:id ─> <ProductScreen/>  │
│  │     │                        ├─ Redux:           │
│  │     │                        │  ├─ productDetails│
│  │     │                        │  └─ cart          │
│  │     │                        │                   │
│  │     │                        ├─ Dispatch:        │
│  │     │                        │  ├─ listProducts  │
│  │     │                        │    Details(id)    │
│  │     │                        │                   │
│  │     │                        ├─ Display:         │
│  │     │                        │  ├─ Image         │
│  │     │                        │  ├─ Price         │
│  │     │                        │  ├─ <Rating/>     │
│  │     │                        │  ├─ In Stock      │
│  │     │                        │  ├─ Add to Cart   │
│  │     │                        │  └─ Reviews list  │
│  │     │                        │                   │
│  │     │                        ├─ Actions:         │
│  │     │                        │  ├─ Select qty    │
│  │     │                        │  ├─ "Add to Cart" │
│  │     │                        │  │  └─ Dispatches │
│  │     │                        │  │     addToCart()│
│  │     │                        │  └─ Write review  │
│  │     │                        │     └─ Dispatches│
│  │     │                        │        createReview│
│  │     │                        │                   │
│  │     │                        └─ Similar:         │
│  │     │                           ├─ API call:     │
│  │     │                           │  /recommend/{id}│
│  │     │                           └─ Product cards │
│  │     │                                            │
│  │     ├─ ROUTE: /cart/:id? ──> <CartScreen/>      │
│  │     │                       ├─ Redux: cart      │
│  │     │                       │  └─ cartItems[]   │
│  │     │                       │                   │
│  │     │                       ├─ Calculations:     │
│  │     │                       │  ├─ itemsPrice    │
│  │     │                       │  ├─ taxPrice      │
│  │     │                       │  └─ totalPrice    │
│  │     │                       │                   │
│  │     │                       ├─ Actions:         │
│  │     │                       │  ├─ ± Qty buttons │
│  │     │                       │  ├─ Remove item   │
│  │     │                       │  └─ Checkout btn  │
│  │     │                       │     └─ Redirect:  │
│  │     │                       │        login      │
│  │     │                       │        └─ or      │
│  │     │                       │           shipping│
│  │     │                       │                   │
│  │     │                       └─ LocalStorage     │
│  │     │                          └─ Save on change│
│  │     │                                            │
│  │     ├─ ROUTE: /login ─────> <LoginScreen/>      │
│  │     │                      ├─ Redux: userLogin  │
│  │     │                      │  └─ loading, error │
│  │     │                      │                    │
│  │     │                      ├─ Form:             │
│  │     │                      │  ├─ Email input    │
│  │     │                      │  ├─ Password input │
│  │     │                      │  └─ Login button   │
│  │     │                      │                    │
│  │     │                      ├─ Dispatch:         │
│  │     │                      │  └─ login(email,   │
│  │     │                      │     password)      │
│  │     │                      │                    │
│  │     │                      ├─ On Success:       │
│  │     │                      │  ├─ localstorage   │
│  │     │                      │  │  .setItem()     │
│  │     │                      │  └─ redirect to    │
│  │     │                      │     ?redirect=...  │
│  │     │                      │                    │
│  │     │                      └─ Messages display  │
│  │     │                                            │
│  │     ├─ ROUTE: /register ──> <RegisterScreen/>   │
│  │     │                       ├─ Redux:            │
│  │     │                       │  └─ userRegister   │
│  │     │                       │                    │
│  │     │                       ├─ Form:             │
│  │     │                       │  ├─ Name          │
│  │     │                       │  ├─ Email         │
│  │     │                       │  ├─ Password      │
│  │     │                       │  ├─ Confirm Pass  │
│  │     │                       │  └─ Register btn  │
│  │     │                       │                    │
│  │     │                       ├─ Dispatch:         │
│  │     │                       │  └─ register()    │
│  │     │                       │                    │
│  │     │                       ├─ On Success:       │
│  │     │                       │  ├─ Auto-login     │
│  │     │                       │  ├─ localstorage   │
│  │     │                       │  │  .setItem()     │
│  │     │                       │  └─ redirect to /  │
│  │     │                       │                    │
│  │     │                       └─ <FormContainer/> │
│  │     │                                            │
│  │     ├─ ROUTE: /profile ───> <ProfileScreen/>    │
│  │     │                      ├─ Auth check        │
│  │     │                      ├─ Redux:            │
│  │     │                      │  ├─ userDetails    │
│  │     │                      │  └─ userUpdateProf.│
│  │     │                      │                    │
│  │     │                      ├─ Dispatch:         │
│  │     │                      │  └─ getUserDetails │
│  │     │                      │     (userInfo._id) │
│  │     │                      │                    │
│  │     │                      ├─ Form:             │
│  │     │                      │  ├─ Name (prepped) │
│  │     │                      │  ├─ Email (prepped)│
│  │     │                      │  ├─ New password   │
│  │     │                      │  └─ Update btn     │
│  │     │                      │                    │
│  │     │                      ├─ On Submit:        │
│  │     │                      │  └─ Dispatch:      │
│  │     │                      │     updateProfile()│
│  │     │                      │                    │
│  │     │                      ├─ MY ORDERS sect:   │
│  │     │                      │  └─ Dispatch:      │
│  │     │                      │     listMyOrders() │
│  │     │                      │                    │
│  │     │                      └─ Orders table      │
│  │     │                         └─ Link to order  │
│  │     │                                            │
│  │     ├─ CHECKOUT FLOW:
│  │     │  │
│  │     │  ├─ ROUTE: /shipping ──> <ShippingScreen/>
│  │     │  │                      ├─ Redux: cart    │
│  │     │  │                      ├─ Form:          │
│  │     │  │                      │  ├─ Address     │
│  │     │  │                      │  ├─ City        │
│  │     │  │                      │  ├─ Postal Code │
│  │     │  │                      │  └─ Country     │
│  │     │  │                      │                 │
│  │     │  │                      ├─ On Submit:     │
│  │     │  │                      │  ├─ saveShipping │
│  │     │  │                      │  │  Address()   │
│  │     │  │                      │  ├─ localstorage│
│  │     │  │                      │  │  .setItem()  │
│  │     │  │                      │  └─ redirect to │
│  │     │  │                      │     /payment    │
│  │     │  │                      │                 │
│  │     │  │                      └─ <CheckoutSteps│
│  │     │  │                         step=1 />      │
│  │     │  │                                        │
│  │     │  ├─ ROUTE: /payment ───> <PaymentScreen/ │
│  │     │  │                      ├─ Redux: cart   │
│  │     │  │                      ├─ Form:         │
│  │     │  │                      │  ├─ PayPal     │
│  │     │  │                      │  ├─ Stripe     │
│  │     │  │                      │  └─ Debit Card │
│  │     │  │                      │                 │
│  │     │  │                      ├─ On Select:    │
│  │     │  │                      │  ├─ savePayment │
│  │     │  │                      │  │  Method()   │
│  │     │  │                      │  └─ redirect to│
│  │     │  │                      │     /placeorder│
│  │     │  │                      │                 │
│  │     │  │                      └─ <CheckoutSteps│
│  │     │  │                         step=2 />      │
│  │     │  │                                        │
│  │     │  └─ ROUTE: /placeorder > <PlaceOrderScreen
│  │     │                          ├─ Redux:       │
│  │     │                          │  ├─ cart      │
│  │     │                          │  └─ orderCreate
│  │     │                          │                │
│  │     │                          ├─ Summary:      │
│  │     │                          │  ├─ Items list │
│  │     │                          │  ├─ Address    │
│  │     │                          │  ├─ Payment m. │
│  │     │                          │  ├─ Prices     │
│  │     │                          │  └─ Place Ord. │
│  │     │                          │                │
│  │     │                          ├─ On Submit:    │
│  │     │                          │  ├─ Dispatch:  │
│  │     │                          │  │  createOrder│
│  │     │                          │  │  (cart data)│
│  │     │                          │  │             │
│  │     │                          │  │  POST       │
│  │     │                          │  │  /api/      │
│  │     │                          │  │  orders/add/│
│  │     │                          │  │             │
│  │     │                          │  └─ On Success:│
│  │     │                          │     redirect to│
│  │     │                          │     /order/{id}│
│  │     │                          │                │
│  │     │                          └─ <CheckoutSteps
│  │     │                             step=3 />    │
│  │     │                                          │
│  │     ├─ ROUTE: /order/:id ──> <OrderScreen/>    │
│  │     │                       ├─ Redux:          │
│  │     │                       │  └─ orderDetails │
│  │     │                       │                  │
│  │     │                       ├─ Dispatch:       │
│  │     │                       │  └─ getOrderDetls│
│  │     │                       │     (id)        │
│  │     │                       │                  │
│  │     │                       ├─ Display:        │
│  │     │                       │  ├─ Order ID     │
│  │     │                       │  ├─ Items table  │
│  │     │                       │  ├─ Shipping     │
│  │     │                       │  ├─ Payment m.   │
│  │     │                       │  ├─ Prices       │
│  │     │                       │  ├─ Payment btn  │
│  │     │                       │  │  └─ Call      │
│  │     │                       │  │     payOrder()│
│  │     │                       │  └─ Delivery     │
│  │     │                       │     status       │
│  │     │                       │                  │
│  │     │                       └─ <Message/>      │
│  │     │                                          │
│  │     ├─ ADMIN ROUTES:
│  │     │  │
│  │     │  ├─ /admin/userlist ──> <UserListScreen/>
│  │     │  │                     ├─ Redux: userList│
│  │     │  │                     ├─ Dispatch:      │
│  │     │  │                     │  └─ listUsers() │
│  │     │  │                     │                 │
│  │     │  │                     ├─ Table:         │
│  │     │  │                     │  ├─ users.id    │
│  │     │  │                     │  ├─ users.name  │
│  │     │  │                     │  ├─ users.email │
│  │     │  │                     │  ├─ users.admin │
│  │     │  │                     │  ├─ users.vendor│
│  │     │  │                     │  ├─ Edit link   │
│  │     │  │                     │  └─ Delete btn  │
│  │     │  │                     │                 │
│  │     │  │                     ├─ On Delete:     │
│  │     │  │                     │  └─ deleteUser()│
│  │     │  │                     │                 │
│  │     │  │                     └─ Create User ln │
│  │     │  │                                       │
│  │     │  ├─ /admin/user/:id/edit └─ <UserEditScrn
│  │     │  │                        ├─ Redux:      │
│  │     │  │                        │  └─ userDetls│
│  │     │  │                        │             │
│  │     │  │                        ├─ Dispatch:   │
│  │     │  │                        │  └─ getUserDtl│
│  │     │  │                        │     (id)     │
│  │     │  │                        │             │
│  │     │  │                        ├─ Form:       │
│  │     │  │                        │  ├─ Name    │
│  │     │  │                        │  ├─ Email   │
│  │     │  │                        │  ├─ isAdmin │
│  │     │  │                        │  ├─ isVendor│
│  │     │  │                        │  └─ Save btn│
│  │     │  │                        │             │
│  │     │  │                        └─ On Submit: │
│  │     │  │                           updateUser()
│  │     │  │                                       │
│  │     │  ├─ /admin/productlist ─└─ <ProductLstScrn
│  │     │  │                        ├─ Redux:     │
│  │     │  │                        │  └─ productLst
│  │     │  │                        │            │
│  │     │  │                        ├─ Dispatch:  │
│  │     │  │                        │  └─ listProd │
│  │     │  │                        │     ucts()  │
│  │     │  │                        │            │
│  │     │  │                        ├─ Table:      │
│  │     │  │                        │  ├─ product  │
│  │     │  │                        │  │  .name    │
│  │     │  │                        │  ├─ brand    │
│  │     │  │                        │  ├─ category │
│  │     │  │                        │  ├─ price    │
│  │     │  │                        │  ├─ stock    │
│  │     │  │                        │  ├─ Edit ln  │
│  │     │  │                        │  └─ Del btn  │
│  │     │  │                        │            │
│  │     │  │                        ├─ Pagination  │
│  │     │  │                        ├─ Create new  │
│  │     │  │                        └─ On Delete:  │
│  │     │  │                           deleteProduct
│  │     │  │                                     │
│  │     │  ├─ /admin/product/:id/edit └─ <ProdEdt
│  │     │  │   (similar to product edit)       │
│  │     │  │                                    │
│  │     │  └─ /admin/orderlist ──> <OrderLstScrn
│  │     │                         ├─ Redux:    │
│  │     │                         │  └─ orderLst│
│  │     │                         │            │
│  │     │                         ├─ Dispatch: │
│  │     │                         │  └─ listOrd│
│  │     │                         │     ers()  │
│  │     │                         │            │
│  │     │                         ├─ Table:     │
│  │     │                         │  ├─ id      │
│  │     │                         │  ├─ customer│
│  │     │                         │  ├─ date    │
│  │     │                         │  ├─ total   │
│  │     │                         │  ├─ paid    │
│  │     │                         │  ├─ delivered
│  │     │                         │  └─ Link   │
│  │     │                         │      /order/{id}
│  │     │                         │            │
│  │     │                         └─ Pagination
│  │     │
│  │     └─ Error Handling:
│  │        ├─ <Message variant="danger" />
│  │        └─ Redux error state
│  │
│  └─ <Footer/>
│     └─ Footer links, copyright


REDUX FLOW EXAMPLE (Listing Products):
═══════════════════════════════════════

1. Component mounts: <HomeScreen/>
2. useEffect hook:
   ├─ dispatch(listProducts())  [with spinner]
   │
   └─> Redux Action (productActions.js):
       ├─ Dispatch: PRODUCT_LIST_REQUEST
       │  └─ Reducer updates: loading = true
       │
       ├─ axios.get('/api/products?keyword=')
       │  └─ Backend returns: {products: [], page: 1, pages: 5}
       │
       └─ Dispatch: PRODUCT_LIST_SUCCESS, payload: data
          └─ Reducer updates:
             ├─ loading = false
             ├─ products = data.products
             ├─ page = data.page
             └─ pages = data.pages

3. Component re-renders:
   ├─ products.map((product) => <Product key={product._id}/>)
   │  └─ Each <Product/> displays: image, name, price, rating, reviews
   │
   └─ <Paginate/> displays: page 1 of 5, clickable page numbers

```

---

## Data Flow Diagrams

```
┌─────────────────────────────────────────────────────────────┐
│     REQUEST & RESPONSE FLOW - COMPLETE EXAMPLE             │
└─────────────────────────────────────────────────────────────┘

EXAMPLE: User adds product to cart and places order

USER ACTION:
───────────

User views: ProductScreen (/product/1)
           │
           ├─ See "Add to Cart" button with qty selector
           │
           └─> Click "Add to Cart"


REACT FRONTEND:
───────────────

addToCartHandler(dispatch, product, qty)
┌─────────────────────────────────────────┐
│ 1. Dispatch Action: addToCart()          │
│    Payload: {product: 1, qty: 2}         │
│                                          │
│ 2. Redux Reducer (cartReducers.js):      │
│    ├─ Check if product already in cart   │
│    ├─ If yes: update qty                 │
│    ├─ If no: add new item                │
│    └─ Update state: cart.cartItems[]     │
│                                          │
│ 3. Persist to localStorage:              │
│    localStorage.setItem(                 │
│      'cartItems',                        │
│      JSON.stringify(cartItems)           │
│    )                                     │
│                                          │
│ 4. Component re-renders                  │
│    └─ Show success message               │
│    └─ Update cart count badge            │
└─────────────────────────────────────────┘
           │
           └─> User navigates to /cart


CART PROCESSING:
─────────────────

<CartScreen/> displays:
├─ Item list with qty/remove buttons
├─ Price calculations:
│  ├─ itemsPrice = sum of (qty × price)
│  ├─ taxPrice = itemsPrice × 0.10
│  └─ totalPrice = itemsPrice + taxPrice + shippingPrice
│
├─ Next steps: Login → Shipping → Payment → PlaceOrder
│
└─> User clicks "PROCEED TO CHECKOUT"
   ├─ Check if authenticated
   ├─ If yes: redirect to /shipping
   └─ If no: redirect to /login?redirect=/shipping


USER COMPLETES CHECKOUT:
────────────────────────

User fills: Shipping Address
            Payment Method
            Confirms Order Summary

Then clicks: "PLACE ORDER"
           │
           └─> Frontend (placeOrderActions.js):
               │
               ├─ Prepare payload:
               │  {
               │    orderItems: [
               │      {product: 1, qty: 2, price: 29.99}
               │    ],
               │    shippingAddress: {
               │      address: "123 Main St",
               │      city: "New York",
               │      phoneNumber: "555-1234"
               │    },
               │    paymentMethod: "PayPal",
               │    taxPrice: 6.00,
               │    shippingPrice: 10.00,
               │    totalPrice: 75.98
               │  }
               │
               ├─ Dispatch: ORDER_CREATE_REQUEST
               │
               └─> POST /api/orders/add/
                  Headers: {
                    Authorization: Bearer <token>,
                    Content-Type: application/json
                  }


DJANGO BACKEND PROCESSING:
───────────────────────────

View: addOrderItems(request)
├─ Validate request.user is authenticated
├─ Validate orderItems not empty
│
├─ Step 1: CREATE ORDER
│  ├─ Order.objects.create(
│  │   user=request.user,
│  │   paymentMethod=data['paymentMethod'],
│  │   taxPrice=data['taxPrice'],
│  │   shippingPrice=data['shippingPrice'],
│  │   totalPrice=data['totalPrice']
│  │ )
│  └─ Database INSERT into base_order
│
├─ Step 2: CREATE SHIPPING ADDRESS
│  ├─ ShippingAddress.objects.create(
│  │   order=order,
│  │   address=data['shippingAddress']['address'],
│  │   city=data['shippingAddress']['city'],
│  │   PhoneNumber=data['shippingAddress']['phoneNumber']
│  │ )
│  └─ Database INSERT into base_shippingaddress
│
├─ Step 3: CREATE ORDER ITEMS
│  ├─ for item in orderItems:
│  │  ├─ product = Product.objects.get(_id=item['product'])
│  │  │
│  │  ├─ OrderItem.objects.create(
│  │  │   product=product,
│  │  │   order=order,
│  │  │   name=product.name,
│  │  │   qty=item['qty'],
│  │  │   price=item['price'],
│  │  │   image=product.image.url
│  │  │ )
│  │  ├─ Database INSERT into base_orderitem
│  │  │
│  │  └─ Step 4: UPDATE PRODUCT STOCK
│  │     ├─ product.countInStock -= item['qty']
│  │     └─ product.save()  [Database UPDATE]
│  │
│  └─ Repeat for each item
│
├─ Serialize Order (OrderSerializer)
│  └─ Transforms to JSON:
│     {
│       "_id": 12,
│       "user": {
│         "id": 5,
│         "_id": 5,
│         "username": "john@example.com",
│         "email": "john@example.com",
│         "name": "John Doe",
│         "isAdmin": false,
│         "isVendor": false
│       },
│       "orderItems": [
│         {
│           "_id": 45,
│           "product": 1,
│           "order": 12,
│           "name": "Product Name",
│           "qty": 2,
│           "price": "29.99",
│           "image": "/images/product.jpg"
│         }
│       ],
│       "shippingAddress": {
│         "_id": 23,
│         "order": 12,
│         "address": "123 Main St",
│         "city": "New York",
│         "PhoneNumber": "555-1234",
│         "shippingPrice": "10.00"
│       },
│       "paymentMethod": "PayPal",
│       "taxPrice": "6.00",
│       "shippingPrice": "10.00",
│       "totalPrice": "75.98",
│       "ispaid": false,
│       "paidAt": null,
│       "isDelivered": false,
│       "deliveredAt": null,
│       "createdAt": "2026-03-30T14:25:30Z"
│     }
│
└─> HTTP 200 OK Response + JSON data


FRONTEND RECEIVES RESPONSE:
───────────────────────────

Redux Action handles response:
├─ Dispatch: ORDER_CREATE_SUCCESS, payload: order
│
└─> Reducer updates state:
   ├─ orderCreate.success = true
   ├─ orderCreate.order = order_data
   └─ orderCreate.loading = false

Component (<PlaceOrderScreen/>) re-renders:
├─ Success detected
├─ Clear cart:
│  └─ localStorage.removeItem('cartItems')
│
├─ Redirect to:
│  └─ /order/{order._id}
│
└─> <OrderScreen/> displays order details


ORDER TRACKING (ORDER SCREEN):
──────────────────────────────

<OrderScreen/:id/> loads:
├─ Dispatch: getOrderDetails(orderId)
│
└─> GET /api/orders/12
   Headers: {Authorization: Bearer <token>}
   │
   ├─ Backend validates: order.user == request.user OR is_staff
   │
   └─ Returns: Full Order object (with items & shipping)

Component displays:
├─ Order ID: 12
├─ Status: Awaiting Payment
├─ Items table
├─ Shipping address
├─ Payment button: "Pay with PayPal"
├─ Current payment status
└─ Delivery status


PAYMENT PROCESSING:
────────────────────

User clicks: "Pay Now"
           │
           └─> Integrate with PayPal/Stripe
              ├─ PayPal Modal appears
              └─ User completes payment

Payment Success:
└─> PUT /api/orders/12/pay/
   Headers: {Authorization: Bearer <token>}
   │
   ├─ Backend updates:
   │  ├─ order.ispaid = True
   │  ├─ order.paidAt = datetime.now()
   │  └─ order.save()  [Database UPDATE]
   │
   └─ Response: "Order was paid"

Frontend re-renders:
├─ Status changes to: "Paid"
└─ Shows green checkmark


ADMIN ORDER DELIVERY:
──────────────────────

Admin views: /admin/orderlist
           │
           ├─ Sees all orders
           └─> Finds order 12, clicks "Mark Delivered"

PUT /api/orders/12/deliver/
Headers: {
  Authorization: Bearer <admin_token>,
  Content-Type: application/json
}

Backend validates:
├─ @permission_classes([IsAdminUser])
└─ Updates:
   ├─ order.isDelivered = True
   ├─ order.deliveredAt = datetime.now()
   └─ order.save()

Customer sees (next login):
├─ Order status: "Delivered"
└─ Delivery date displayed

```

---

## Summary of Key Technologies

```
Backend Stack:
  Django 4.0.4
  Django REST Framework
  SimpleJWT (JWT tokens)
  SQLite / PostgreSQL (production)
  Gunicorn (production server)
  
Frontend Stack:
  React 17+
  Redux + Redux Thunk
  React Router
  React Bootstrap
  Axios (HTTP client)
  
Additional:
  Pandas (data processing)
  Scikit-learn (recommendations)
  Pillow (image handling)
  Chart.js (admin charts)
  
DevOps/Hosting:
  Docker (containerization)
  Heroku / DigitalOcean / PythonAnywhere (hosting)
  Nginx (reverse proxy)
  Let's Encrypt (SSL)
  
Database:
  SQLite (development)
  PostgreSQL (recommended production)
  Migrations: Django ORM
```

---

## Related Documentation Files

Key files in workspace:
- `COMPLETE_GUIDE.md` - Setup instructions & credentials
- `HOSTING_DEPLOYMENT.md` - Production deployment options
- `BUBAL_HOST_CPANEL_DEPLOYMENT.md` - cPanel-specific deployment
- `requirements.txt` - Python dependencies
- `package.json` - Node.js dependencies
- `start_server.bat` - Windows startup script

---

**End of Architecture Analysis**  
**Generated:** March 30, 2026  
**All findings based on complete codebase exploration**
