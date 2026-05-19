# Quick Start & Testing Guide

## 🚀 Current Status

✅ **Frontend**: Running on http://localhost:3000  
✅ **Backend**: Running on http://localhost:8000  
✅ **Connection**: Full API integration complete

---

## Testing Checklist

### 1. Check Frontend is Running
- Open browser: http://localhost:3000
- Should see beautiful home page with featured products
- No errors in browser console

### 2. Check Backend is Running
- Open browser: http://localhost:8000
- Should see Django success page
- API available at: http://localhost:8000/api/

### 3. Test Product Fetching
- Go to http://localhost:3000/shop
- Should see products loaded from backend
- If no products yet, create them in Django admin

### 4. Test Authentication
1. Click user icon → Sign up
2. Create test account:
   - Name: Test User
   - Email: test@example.com
   - Password: TestPass123
3. Click "Create Account"
4. Should be logged in automatically
5. See your name in navbar

### 5. Test Shopping
1. Go to Shop page
2. Add items to cart
3. Check cart icon shows count
4. Go to Cart page
5. Click Proceed to Checkout
6. Fill shipping details
7. Choose payment method
8. Click Place Order
9. Should see success message

### 6. Test Login/Logout
1. Click user dropdown in navbar
2. Click Logout
3. User info disappears from navbar
4. Try accessing /checkout
5. Should redirect to /login

---

## Creating Test Products

### Method 1: Django Admin Panel
1. Visit: http://localhost:8000/admin/
2. Login with Django credentials
3. Click "Products"
4. Click "Add Product"
5. Fill in:
   - Name
   - Price
   - Category
   - Description
   - Stock count
   - Image
6. Save

### Method 2: Using the API (Advanced)
```bash
curl -X POST http://localhost:8000/api/products/create/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 99.99,
    "category": "Women",
    "description": "Test desc",
    "countInStock": 10
  }'
```

---

## Sample Test Scenarios

### Scenario 1: Complete Purchase Flow
1. Register new account
2. Browse products (Shop page)
3. Add 2-3 items to cart
4. Update quantities
5. Go to checkout
6. Enter shipping address
7. Select payment method
8. Place order
9. See order confirmation

### Scenario 2: Cart Persistence
1. Add items to cart
2. Refresh browser (F5)
3. Cart items should still be there
4. Quantities preserved
5. Close browser
6. Reopen localhost:3000
7. Cart items still there

### Scenario 3: User Authentication
1. Register account A
2. Add items, logout
3. Register account B
4. Add different items
5. Login as account A
6. Cart should show account A's items
7. Profile should show account A's info

---

## Monitoring

### Frontend Console
- Press F12 to open DevTools
- Check Console tab for errors
- Network tab shows API requests
- Should see requests to http://localhost:8000/api/

### Backend Terminal
- Monitor Django output
- Should see "GET /api/products/" logs
- Success indicated by 200 status codes
- Errors show with stack traces

---

## Common Issues & Quick Fixes

| Issue | Solution |
|-------|----------|
| Products not loading | Check backend running, visit /api/products/ |
| Can't login | Verify user exists, check password, look at backend logs |
| Cart empty after refresh | Check localStorage in DevTools → Application |
| Checkout redirect to login | Refresh page, login again, try checkout |
| CORS errors | Ensure backend running before frontend |
| API timeout | Check server connection, restart if needed |

---

## API Testing with Curl

### Test Product List
```bash
curl http://localhost:8000/api/products/
```

### Test Login
```bash
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "test@example.com", "password": "TestPass123"}'
```

### Test Get Profile (requires token)
```bash
curl http://localhost:8000/api/users/profile/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Performance Tips

1. **Clear Cache**: Ctrl+Shift+Delete in browser
2. **Reload**: Ctrl+Shift+R (hard refresh)
3. **Clear localStorage**: 
   - Open DevTools
   - Application → localStorage
   - Clear all
4. **Restart servers**: Stop and restart both
5. **Check logs**: Monitor terminal output

---

## Next Phase: Production Ready

When ready for production:

✅ Implement actual payment gateway (Khalti/eSewa)  
✅ Add email notifications  
✅ Add order tracking  
✅ Implement reviews/ratings  
✅ Add wishlist feature  
✅ Optimize images  
✅ Set up SSL/HTTPS  
✅ Configure production database  
✅ Add analytics  
✅ Implement admin dashboard  

---

## Success Indicators

✅ **Frontend loads without errors**  
✅ **Navigation works (Home → Shop → Cart → Checkout)**  
✅ **Can register and login**  
✅ **Products display from backend**  
✅ **Cart operations work (add, remove, update qty)**  
✅ **Checkout creates orders in backend**  
✅ **User info persists across pages**  
✅ **Logout clears user data**  

---

## Contact & Support

If you encounter any issues:
1. Check the backend logs (Django terminal)
2. Check the frontend logs (Browser DevTools)
3. Verify both servers are running
4. Verify network connection to localhost:8000
5. Clear browser cache and try again

---

**Ready to test? Open http://localhost:3000 in your browser! 🎉**
