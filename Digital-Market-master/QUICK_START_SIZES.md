# 🚀 Quick Start: Activate Sizes, Gender & Images

## ⚡ 5-Minute Setup

### 1. Apply Database Migration
```bash
cd d:\your\ cart\Digital-Market-master\backend

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Run migration
python manage.py migrate
```

✅ This adds 5 new fields to your Product and OrderItem models

---

### 2. Populate Product Data (Auto-categorize sizes & gender)
```bash
python manage.py populate_sizes
```

This will:
- ✅ Add **Footwear sizes**: 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
- ✅ Add **Clothing sizes**: XS, S, M, L, XL, XXL
- ✅ Auto-detect **gender** from product names
- ✅ Show detailed progress for each product

Expected output:
```
Updated: Men's Shoes - Gender: male, Category: Footwear
Updated: Men's Jacket - Gender: male, Category: Clothing
Updated: Women's Watch - Gender: female, Category: Accessories
...
✅ Successfully updated 49 products with sizes and gender data
```

---

### 3. Start Your Servers

**Terminal 1: Backend**
```bash
cd d:\your\ cart\Digital-Market-master\backend
python manage.py runserver
# Running on http://localhost:8000/
```

**Terminal 2: Frontend**
```bash
cd d:\your\ cart\Digital-Market-master\backend\frontend
npm start
# Running on http://localhost:3000/
```

---

## 🎯 Test the New Features

### 1. Visit a Product Page
- Go to: `http://localhost:3000/product/18` (Nike Air Force)
- You should see:
  - ✅ **Multiple images** gallery with thumbnails
  - ✅ **Size selection buttons** (for footwear: 3-13)
  - ✅ **Gender badge** (👨 Male, 👩 Female, or 👥 Unisex)
  - ✅ **Brand name** displayed

### 2. Select a Size and Add to Cart
- Click a size button (should highlight in yellow)
- Click **"Add to Cart"** button
- Size should be selected before adding!

### 3. View Cart
- Go to: `http://localhost:3000/cart`
- You should see:
  - ✅ Selected **Size: L** (or whatever you chose)
  - ✅ Selected **Gender: Male**
  - ✅ Can update quantity while keeping size/gender

---

## 📊 What Changed

### Database Changes
| Field | Model | Description |
|-------|-------|---|
| `gender` | Product | Male / Female / Both |
| `available_sizes` | Product | Comma-separated sizes |
| `additional_images` | Product | JSON array of image URLs |
| `selected_size` | OrderItem | Tracks user's choice |
| `selected_gender` | OrderItem | For order records |

### UI Changes
| Page | Changes |
|------|---------|
| **ProductScreen.js** | Size buttons, gender display, multiple image gallery |
| **CartScreen.js** | Shows selected size & gender per item |
| **cartActions.js** | Accepts size & gender parameters |

---

## 🖼️ Adding Multiple Images (Optional)

### Method 1: Django Admin
1. Go to `http://localhost:8000/admin/`
2. Login with admin credentials
3. Click **Products**
4. Edit a product
5. In `additional_images` field, paste:
```json
["/static/images/image2.avif", "/static/images/image3.avif"]
```
6. Save

### Method 2: Using Command
```bash
python manage.py add_product_images
# This adds sample images to Nike, MacBook, and iPhone
```

### Method 3: Via Your Own Images
1. Place images in `/backend/static/images/`
2. Update product via admin with JSON URLs

---

## ✨ Product Categories Auto-Assigned Sizes

### Footwear (14 products)
- Sizes: **3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13**
- Examples: All Nike Shoes, Adidas Shoes, Caliber Shoes

### Clothing (7 products)
- Sizes: **XS, S, M, L, XL, XXL**
- Examples: Hoodies, Jackets, T-shirts by Huba, DEMIN

### Accessories (13 products)
- No sizes (watches, bracelets)

### Bags (3 products)
- No sizes (one-size-fits-all)

### Electronics (10 products)
- No sizes (standard electronics)

### Home & Decor (5 products)
- No sizes

---

## 🎨 User Experience Flow

```
Customer on Product Page
        ↓
   Sees Images Gallery
   (Click thumbnails to swap main image)
        ↓
   See Size Selection
   (Highlight shows chosen size)
        ↓
   See Gender Info
   (👨 Male / 👩 Female / 👥 Both)
        ↓
   Add to Cart
   (Size + Gender saved)
        ↓
   Cart Shows Details
   (Size: M, Gender: Female, Qty: 2)
        ↓
   Checkout with Khalti
   (Size/Gender in order record)
```

---

## 🐛 Common Issues & Fixes

### "Size button not showing"
- ✅ Make sure category is "Footwear" or "Clothing"
- ✅ Run: `python manage.py populate_sizes`
- ✅ Refresh browser (Ctrl+F5)

### "Images not appearing"
- ✅ Check JSON format in `additional_images` field
- ✅ Image URLs must be absolute or `/media/` paths
- ✅ Ensure images exist

### "Size not saved in cart"
- ✅ Frontend parses from URL correctly
- ✅ Check browser console for errors
- ✅ Verify `cartActions.js` has size parameter

### "Gender shows as 'both' for everything"
- ✅ Run: `python manage.py populate_sizes` again
- ✅ Check product names contain keywords: men's, women's

---

## 📱 Frontend Size Selection UI

The size buttons are styled with Bootstrap:
- **Unselected**: Gray outline
- **Selected**: Yellow/Warning color (matches rating color)
- **Responsive**: Wraps on mobile

---

## ✅ Verification Checklist

After completing setup, check all these:

- [ ] Migration applied successfully
- [ ] `populate_sizes` command completed without errors
- [ ] Both servers running (Django + React)
- [ ] Can see product page with sizes visible
- [ ] Can select a size (button highlights)
- [ ] Can add to cart with size selected
- [ ] Size shows in cart page
- [ ] Gender displays as expected
- [ ] Images gallery works (if added)
- [ ] Checkout includes size/gender data

---

## 🎓 Learning Path

1. **Understand the model changes**: Read `/backend/base/models.py` (lines 6-70)
2. **See the migrations**: Check `/backend/base/migrations/0003_product_sizes_gender_images.py`
3. **Frontend implementation**: Review `/ProductScreen.js` (lines 24-70 for state)
4. **Cart integration**: Check `/CartScreen.js` (URL parsing)
5. **API flow**: `/cartActions.js` (parameter passing)

---

## 🚀 What's Next?

After this is working, you can:

1. **Add product filters** by size/gender on shop page
2. **Create size chart** component
3. **Add size recommendations** based on measurements
4. **Implement size-specific stock** tracking
5. **Create outfit bundles** (e.g., "Complete Look")
6. **Add size reviews** ("This runs small/large")

---

**Setup Time**: ~5 minutes  
**Ready**: ✅ All code is in place!  
**Next Step**: Run the migration command above
