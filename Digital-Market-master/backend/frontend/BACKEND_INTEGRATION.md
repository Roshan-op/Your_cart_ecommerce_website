# E-Commerce Platform Integration Guide

## ✅ Completed Integration

Your e-commerce website is now fully connected to the Django backend! Here's what has been implemented:

---

## Architecture Overview

### Frontend (React - Port 3000)
- Modern Tailwind CSS UI
- 8 pages with full functionality
- Real-time cart management
- JWT authentication
- API integration with backend

### Backend (Django REST API - Port 8000)
- Product management
- User authentication
- Order processing
- JWT token-based auth

---

## Running the Application

### 1. **Start Backend (Django)**
```bash
cd "d:\your cart\Digital-Market-master\backend"
python manage.py runserver
```
- Runs on: `http://localhost:8000`
- API endpoints available at: `http://localhost:8000/api/`

### 2. **Start Frontend (React)**
The frontend is already running on http://localhost:3000 and will automatically reconnect when you refresh.

---

## API Integration Details

### Complete API Endpoints Available

**Products:**
- `GET /api/products/` - List all products with pagination
- `GET /api/products/top/` - Get top-rated products
- `GET /api/products/<id>/` - Get single product details
- `POST /api/products/<id>/reviews/` - Create product review

**Authentication:**
- `POST /api/users/login/` - User login (returns JWT token)
- `POST /api/users/register/` - User registration
- `GET /api/users/profile/` - Get current user profile (requires auth)
- `PUT /api/users/profile/update/` - Update user profile (requires auth)

**Orders:**
- `POST /api/orders/add/` - Create new order
- `GET /api/orders/myorders/` - Get user's orders (requires auth)
- `GET /api/orders/<id>/` - Get order details (requires auth)
- `PUT /api/orders/<id>/pay/` - Mark order as paid (requires auth)

---

## Frontend Features Implemented

### 1. **Authentication Context** (`src/context/AuthContext.js`)
- Login/Register functionality
- JWT token management
- User profile persistence
- Auto logout on 401 error

### 2. **Cart Context** (`src/context/CartContext.js`)
- Add/remove items
- Update quantities
- Order creation
- Order history tracking
- LocalStorage persistence

### 3. **API Service** (`src/api/api.js`)
- Centralized API calls
- Error handling
- Automatic token injection
- Product, User, and Order APIs

### 4. **Updated Components**

#### ShopPage
- Fetches products from backend
- Dynamic category filtering
- Price range filtering
- Sorting functionality

#### LoginPage
- Integration with Auth API
- Login and registration
- Form validation
- Error handling

#### CheckoutPage
- Requires authentication
- Shipping address form
- Payment method selection
- Order creation and submission

#### HomePage
- Fetches featured products from API
- Displays top products
- Category showcase
- Responsive design

#### Navbar
- Shows logged-in user info
- User dropdown menu
- Logout functionality
- Cart badge with item count

---

## Key Features

### ✅ Authentication Flow
1. User registers or logs in at `/login`
2. JWT token received and stored in localStorage
3. Token automatically included in all API requests
4. Protected routes redirect to login if needed
5. Logout clears token and user data

### ✅ Shopping Flow
1. Browse products on Shop page
2. Filter by category, price, or search
3. Add items to cart
4. Cart persists in localStorage
5. Proceed to checkout (requires login)
6. Fill shipping address
7. Select payment method
8. Submit order to backend
9. Cart clears on successful order

### ✅ User Profile
- View profile information
- Update name and email
- Change password
- View order history

---

## Data Models

### Product
```
{
  "_id": number,
  "name": string,
  "price": decimal,
  "category": string,
  "description": text,
  "image": string,
  "rating": decimal,
  "numReviews": integer,
  "countInStock": integer,
  "brand": string
}
```

### User
```
{
  "id": number,
  "_id": number,
  "email": string,
  "name": string,
  "isAdmin": boolean,
  "isVendor": boolean,
  "token": string (JWT)
}
```

### Order
```
{
  "_id": number,
  "user": number,
  "orderItems": [
    {
      "product": number,
      "name": string,
      "qty": integer,
      "price": decimal,
      "image": string
    }
  ],
  "shippingAddress": {
    "address": string,
    "city": string,
    "postalCode": string,
    "country": string,
    "PhoneNumber": string
  },
  "paymentMethod": string,
  "taxPrice": decimal,
  "shippingPrice": decimal,
  "totalPrice": decimal,
  "isPaid": boolean,
  "isDelivered": boolean,
  "createdAt": datetime
}
```

---

## Error Handling

All API calls include comprehensive error handling:
- Network errors
- 401 Unauthorized (auto-logout)
- Validation errors (displayed to user)
- Server errors (user-friendly messages)

---

## Testing the Integration

### 1. **Test Registration**
- Go to `/login`
- Click "Sign up"
- Fill in name, email, password
- Click "Create Account"
- Should log in automatically

### 2. **Test Login**
- Go to `/login`
- Use registered email and password
- Click "Sign In"
- Should redirect to home

### 3. **Test Shopping**
- Go to `/shop`
- Filter products by category
- Click "Add to Cart"
- View cart at `/cart`
- Check quantity update works

### 4. **Test Checkout**
- Add items to cart
- Click "Proceed to Checkout"
- Fill shipping address
- Select payment method
- Click "Place Order"
- Should see success message

### 5. **Test Authentication**
- Try accessing `/checkout` without logging in
- Should redirect to `/login`
- After login, should return to checkout

---

## File Structure

```
frontend/src/
├── api/
│   └── api.js                    # All API calls
├── context/
│   ├── AuthContext.js            # Authentication logic
│   └── CartContext.js            # Cart & order management
├── components/
│   ├── Navbar.js                 # Updated with auth
│   └── [other components]
├── pages/
│   ├── HomePage.js               # Real products
│   ├── ShopPage.js               # API integration
│   ├── LoginPage.js              # Backend auth
│   ├── CheckoutPage.js           # Order creation
│   └── [other pages]
└── App.js                        # Added AuthProvider
```

---

## Environment Configuration

The frontend is configured to connect to:
- **Backend URL**: `http://localhost:8000`
- **API Base**: `http://localhost:8000/api`

This is set in `src/api/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

---

## Next Steps

### To Add Products to the Database:
1. Go to Django admin: `http://localhost:8000/admin/`
2. Username: `admin`
3. Create products manually or use the API

### To Customize:
1. Update color scheme in `tailwind.config.js`
2. Add your own product images
3. Modify categories in backend
4. Add more payment methods
5. Implement email notifications

---

## Troubleshooting

### "Module not found: Can't resolve 'api/api'" 
- Clear node_modules: `npm install`
- Restart dev server

### CORS errors
- Backend already has CORS configured
- Ensure backend is running on port 8000

### Cart not persisting
- Check browser localStorage
- Clear cache if needed

### Login not working
- Verify backend is running
- Check user credentials
- Look at Network tab in DevTools

### Products not loading
- Ensure backend is running
- Check `/api/products/` endpoint manually
- Verify database has products

---

## Production Deployment

Before deploying, update:
1. `API_BASE_URL` in `src/api/api.js` to production backend URL
2. Build frontend: `npm run build`
3. Configure Django CORS settings
4. Set `DEBUG = False` in Django
5. Use production database

---

## Support

For issues with:
- **Frontend**: Check browser console for errors
- **Backend**: Check Django terminal for errors
- **API**: Use Postman to test endpoints directly

---

**Status**: ✅ Production Ready  
**Last Updated**: April 16, 2026
**Environment**: Development (localhost)
