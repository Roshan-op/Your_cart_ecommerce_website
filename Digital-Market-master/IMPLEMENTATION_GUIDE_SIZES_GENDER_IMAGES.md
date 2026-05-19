# Product Sizes, Gender & Multiple Images Implementation

## 🎯 What Was Implemented

I've added a complete system for:
1. **Clothing Sizes** - XS, S, M, L, XL, XXL options
2. **Footwear Sizes** - Sizes 3-50 (Nepal shoe sizes)
3. **Gender Selection** - Male, Female, Unisex/Both distinctions
4. **Multiple Product Images** - Gallery support for 4+ images per product

---

## 📋 Backend Changes

### 1. **Updated Product Model** (`/backend/base/models.py`)
```python
# New fields added:
gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='both')
available_sizes = models.TextField()  # Comma-separated sizes
additional_images = models.TextField()  # JSON array of image URLs
```

### 2. **Updated OrderItem Model** (`/backend/base/models.py`)
```python
# Track user's selections:
selected_size = models.CharField(max_length=10)
selected_gender = models.CharField(max_length=10)
```

### 3. **Created Migration** (`0003_product_sizes_gender_images.py`)
- Adds all new fields to database
- Backward compatible with existing data

### 4. **Management Command** (`populate_sizes.py`)
- Auto-categorizes products with appropriate sizes
- Assigns gender based on product name keywords
- Run: `python manage.py populate_sizes`

---

## 🎨 Frontend Changes

### 1. **Updated ProductScreen.js**
Features added:
- ✅ Multiple image gallery with thumbnail selector
- ✅ Size selection buttons (category-based)
- ✅ Gender display badge
- ✅ Brand information display
- ✅ Image swapping on thumbnail click

```jsx
// Size selection UI
{getAvailableSizes().length > 0 && (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
    {getAvailableSizes().map((size) => (
      <Button 
        onClick={() => setSelectedSize(size)}
        variant={selectedSize === size ? 'warning' : 'outline-secondary'}
      >
        {size}
      </Button>
    ))}
  </div>
)}

// Multiple images gallery
{getAdditionalImages().map((img, idx) => (
  <Image 
    src={img} 
    onClick={() => setMainImage(img)}
    style={{ cursor: 'pointer', border: mainImage === img ? '2px solid #f8e825' : '1px solid #ccc' }}
  />
))}
```

### 2. **Updated CartScreen.js**
- ✅ Displays selected size for each item
- ✅ Displays selected gender for each item
- ✅ Preserves size/gender when updating quantity
- ✅ Proper URL parsing for all parameters

### 3. **Updated cartActions.js**
```javascript
export const addToCart = (id, qty, size = "", gender = "") => async (dispatch, getState) => {
  // Now supports size and gender parameters
}
```

---

## 🚀 How to Use

### Step 1: Apply Database Migration
```bash
cd d:\your\ cart\Digital-Market-master\backend
python manage.py migrate
```

### Step 2: Populate Product Data (Automatic)
```bash
python manage.py populate_sizes
```

This will:
- Add sizes to **Footwear**: 3, 4, 5, ..., 13
- Add sizes to **Clothing**: XS, S, M, L, XL, XXL
- Detect gender from product names (Men's, Women's, etc.)
- Set gender to "both" for unisex items

---

## 📊 Size Configuration

### **Footwear Sizes** (Nepal Standard - NP)
Product category: **Footwear**
Available sizes: 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13

### **Clothing Sizes**
Product category: **Clothing**
Available sizes: XS, S, M, L, XL, XXL

### **Other Categories** (No sizes)
- Accessories
- Bags
- Electronics
- Home & Decor

---

## 🖼️ Multiple Images Setup

### How to Add Multiple Images
The `additional_images` field stores JSON array of image URLs:

```json
[
  "https://example.com/image2.jpg",
  "https://example.com/image3.jpg",
  "https://example.com/image4.jpg"
]
```

**Option 1: Via Django Admin**
1. Go to Django admin: `http://localhost:8000/admin/`
2. Edit a product
3. Paste JSON array in `additional_images` field

**Option 2: Via Management Command**
Create a custom command to upload images from a folder.

**Option 3: Via API**
Send POST request with product data including `additional_images`.

---

## 👥 Gender Options

| Value | Display | Products |
|-------|---------|----------|
| `male` | 👨 Male | Men's Shoes, Men's Jackets, etc. |
| `female` | 👩 Female | Women's Footwear, Women's Watches, etc. |
| `both` | 👥 Unisex/Both | Universal products, unisex items |

**Auto-detection Keywords:**
- **Male**: 'men', "men's", 'male', 'boy', 'gents'
- **Female**: 'women', "women's", 'female', 'girl', 'ladies'
- **Both**: 'unisex', 'both', 'universal'

---

## ✨ Frontend Features

### Product Detail Page
```
┌─────────────────────────────────────────────────┐
│                                                 │
│  [Main Image]        │  Product Info           │
│                      │  ⭐⭐⭐⭐ (X reviews)    │
│  [Thumb][Thumb]      │  👨 Male                │
│  [Thumb][Thumb]      │  Brand: Nike            │
│                      │  Price: Rs. 1,999       │
│                      │                         │
│                      │  📏 Size Selection:     │
│                      │  [S] [M] [L] [XL]       │
│                      │                         │
│                      │  Qty: [5▼]              │
│                      │  [Add to Cart]          │
│                      │                         │
└─────────────────────────────────────────────────┘
```

### Shopping Cart Page
```
Product Name
Price: Rs. 999
Size: L
Gender: Male
Qty: +[2]- 🗑️
```

---

## 🔧 Database Fields Reference

### Product Model
| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `gender` | Char | `male`, `female`, `both` | Gender type |
| `available_sizes` | Text | `XS,S,M,L,XL` or `3,4,5,6` | Comma-separated |
| `additional_images` | Text | JSON array | Store multiple image URLs |

### OrderItem Model
| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `selected_size` | Char | `L` or `10` | User's chosen size |
| `selected_gender` | Char | `male` | For record keeping |

---

## 🐛 Troubleshooting

### Migration Fails
```bash
# Rollback and retry
python manage.py migrate base 0002
python manage.py migrate
```

### Size Not Showing
- Check product `category` matches: Footwear, Clothing
- Verify `available_sizes` field is populated
- Refresh browser cache

### Images Not Displaying
- Verify URLs are absolute (start with `http://` or `https://`)
- Check CORS settings if using external CDN
- Use Django's built-in image field for local storage

### Size Not Saved in Order
- Size is stored in `OrderItem.selected_size`
- Check order details page to verify

---

## 📝 Next Steps

1. **Add actual product images** to database
2. **Create size chart** frontend component
3. **Add size filtering** on shop page
4. **Implement size recommendations** based on measurements
5. **Create size stock tracking** per size variant

---

## 💡 Example: Adding Sizes to a Product

### Via Python Shell
```python
from base.models import Product

# Get a product
product = Product.objects.get(_id=5)

# Add clothing sizes
product.available_sizes = "XS,S,M,L,XL,XXL"
product.gender = "female"
product.save()
```

### Via Management Command
```bash
python manage.py populate_sizes
```

---

**Implementation Date:** May 18, 2026  
**Status:** ✅ Ready for Database Migration & Testing
