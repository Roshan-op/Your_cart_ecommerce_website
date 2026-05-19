# 🎨 UI/UX Visual Guide

## Product Detail Page - Before & After

### BEFORE (Current)
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  [Single Image]          │  Product Info              │
│                          │  ⭐⭐⭐⭐ (1 review)        │
│                          │                            │
│                          │  Price: Rs. 50             │
│                          │                            │
│                          │  Description: Premium...   │
│                          │                            │
│                          │  Qty: [10▼]               │
│                          │                            │
│                          │  [Add to Cart Button]     │
│                          │                            │
└─────────────────────────────────────────────────────────┘
```

### AFTER (With Sizes, Gender & Images)
```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  [Main Product Image]    │  NIKE AIR FORCE 1           │
│  (High Resolution)       │  ⭐⭐⭐⭐ (1 review)        │
│                          │  Brand: Nike               │
│  [Thumb1][Thumb2]        │  👨 Male                   │
│  [Thumb3][Thumb4]        │                            │
│  (Click to swap)         │  Price: Rs. 50             │
│                          │                            │
│                          │  Description:              │
│                          │  Premium Nike shoe...      │
│                          │                            │
│                          │  📏 Size Selection:        │
│                          │  [3] [4] [5] [6] [7] [8]  │
│                          │  [9] [10] [11] [12] [13]  │
│                          │                            │
│                          │  Qty: [10▼]               │
│                          │                            │
│                          │  [Add to Cart Button]     │
│                          │  (Disabled if no size)    │
│                          │                            │
└──────────────────────────────────────────────────────────┘

Legend:
[3] = Unselected size button (outline)
[7] = Selected size button (yellow/gold highlight)
```

---

## Shopping Cart - Before & After

### BEFORE (Current)
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│ [Product Image]  Nike Air Force 1                      │
│                  Rs. 50                       +  [2]  - │
│                                                        X │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### AFTER (With Size & Gender Info)
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│ [Product Image]  Nike Air Force 1                      │
│                  Rs. 50                                │
│                  Size: 10                              │
│                  Gender: 👨 Male              +  [2]  - │
│                                                        X │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Product Listing - Filter By Gender (Future)

```
SHOP PAGE
┌─────────────────────────────────────────────────────┐
│  Filters:                                           │
│  ☐ Male (👨)                                       │
│  ☐ Female (👩)                                     │
│  ☐ Unisex/Both (👥)                               │
│                                                    │
│  [X] Nike Air Force    [X] Red iPhone 7            │
│  Size: 7-13            Price: 45 Rs                │
│  Gender: Male                                      │
│  Price: Rs. 50         [Add to Cart]              │
│  [Add to Cart]                                     │
│                                                    │
│  [X] Hoodie            [X] MacBook Pro             │
│  Size: XS-XXL          Price: 15 Rs                │
│  Gender: Both                                      │
│  Price: Rs. 10         [Add to Cart]              │
│  [Add to Cart]                                     │
└─────────────────────────────────────────────────────┘
```

---

## Size Selection UI - Interactive

### Clothing Sizes (XS to XXL)
```
┌──────────────────────────────────────────────────┐
│  Select Size:                                   │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐               │
│  │XS│ │S │ │M │ │L │ │XL│ │XXL│              │
│  └──┘ └──┘ └──┘ └──┘ └──┘ └──┘               │
│  (Unselected: Gray outline)                    │
│                                                 │
│  ┌──┐ ┌──┐ ┌──┐ ┌──────┐ ┌──┐ ┌──┐          │
│  │XS│ │S │ │M │ │ L  │ │XL│ │XXL│          │
│  └──┘ └──┘ └──┘ └──────┘ └──┘ └──┘          │
│  (Selected: Yellow/Gold highlight)             │
└──────────────────────────────────────────────────┘
```

### Footwear Sizes (3 to 13 NP)
```
┌──────────────────────────────────────────────────┐
│  Select Shoe Size (NP):                          │
│  ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ │
│  │3│ │4│ │5│ │6│ │7│ │8│ │9│ │10│ │11│ │12│ │13││
│  └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ │
│                                                  │
│  ┌─┐ ┌─┐ ┌─┐ ┌────┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ │
│  │3│ │4│ │5│ │ 6  │ │7│ │8│ │9│ │10│ │11│ │12│ │13││
│  └─┘ └─┘ └─┘ └────┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ │
└──────────────────────────────────────────────────┘
```

---

## Image Gallery - Multiple Views

### Desktop (Multi-image)
```
┌────────────────────────────────────────┐
│                                        │
│    [    Main Image     ]               │
│    [                   ]     Gender: 👨│
│    [ (Swappable)       ]               │
│    [                   ]     Price: Rs │
│                                        │
├────────────────────────────────────────┤
│ [Thumb1] [Thumb2] [Thumb3] [Thumb4]   │
│  (Select to swap main image)           │
│  - Click border turns yellow           │
│  - Main image updates                  │
└────────────────────────────────────────┘
```

### Mobile (Responsive)
```
┌─────────────────┐
│ [   Product   ] │
│ [     Image    ]│
│ [             ]│
├─────────────────┤
│ [T1] [T2] [T3] │
├─────────────────┤
│ Gender: 👨      │
│ Price: Rs. 50   │
│                 │
│ Size Selection: │
│ [5] [6] [7]     │
│ [8] [9] [10]    │
│                 │
│ Qty: [10▼]      │
│                 │
│ [Add to Cart]   │
└─────────────────┘
```

---

## Color Scheme

### Button States
```
Default/Unselected:
┌─────────┐
│  Size   │  Gray border, white background
└─────────┘

Selected:
┌─────────┐
│  Size   │  Yellow/Gold background (#f8e825)
└─────────┘  Bold text

Disabled:
┌─────────┐
│  Size   │  Faded gray, crossed out
└─────────┘
```

### Gender Badges
```
👨 Male       - Blue tint, male emoji
👩 Female     - Pink tint, female emoji  
👥 Both/Unisex - Purple tint, people emoji
```

---

## Responsive Design

### Mobile (< 768px)
```
Full width layout
- Image gallery stacked vertically
- Size buttons wrap in smaller grid
- Gender info inline with price
```

### Tablet (768px - 1024px)
```
2-column layout
- Image on left (40%)
- Details on right (60%)
- Size buttons in 2 rows
```

### Desktop (> 1024px)
```
3-column layout
- Image gallery on left (50%)
- Product info in middle (25%)
- Add to cart panel on right (25%)
- Size buttons single row with horizontal scroll if needed
```

---

## Interaction States

### Product Page Size Selection
```
1. Page loads
   └─ First available size pre-selected (visual highlight)

2. User hovers over size button
   └─ Color darkens slightly
   └─ Cursor changes to pointer

3. User clicks size
   └─ Button highlights in yellow
   └─ Button text becomes bold
   └─ "Add to Cart" button becomes enabled

4. User changes size
   └─ Previous selection returns to normal
   └─ New selection highlights in yellow

5. User adds to cart without selecting size
   └─ Warning: "Please select a size first"
   └─ "Add to Cart" button remains disabled
```

### Image Gallery
```
1. Page loads
   └─ Main product image displays
   └─ Thumbnails appear below (if additional images exist)

2. User hovers over thumbnail
   └─ Thumbnail border highlights yellow
   └─ Cursor changes to pointer
   └─ Slight zoom/scale effect

3. User clicks thumbnail
   └─ Main image updates (fade transition)
   └─ Thumbnail border remains highlighted
   └─ All other thumbnails return to normal border
```

---

## Accessibility Features

### Keyboard Navigation
```
Tab → Cycles through size buttons
Space/Enter → Select size
Tab → Focus "Add to Cart" button
Enter → Add to cart (if size selected)

For images:
Tab → Focus thumbnail
Space/Enter → Swap to main image
```

### Screen Reader Text
```
<button aria-label="Select size 10">10</button>
<button aria-label="Increase quantity for Nike Air Force">+</button>
<button aria-label="Remove from cart">X</button>
```

### Color Contrast
```
Selected size (Yellow #f8e825) on white: ✅ AAA compliant
Unselected size (Gray #999) on white: ✅ AA compliant
```

---

## Animation & Transitions

### Image Swap
```
Duration: 200ms
Effect: Fade transition
- Main image opacity: 1 → 0.5 → 1
- New image loads during fade
```

### Size Button Selection
```
Duration: 150ms
Effect: Color transition + scale
- Background color change: gray → yellow
- Text weight: normal → bold
- Scale: 1 → 1.05 (slight grow)
```

### Add to Cart
```
Duration: 300ms
Effect: Button feedback
- Background color pulse
- Text feedback: "Adding..." → "Added! ✓"
- Redirect to cart after 500ms
```

---

## Data Display Examples

### Product with All Features
```
Name: Nike Air Force 1 (OFF White)
Brand: Nike
Category: Footwear
Gender: 👨 Male
Price: Rs. 50
Available Sizes: 3,4,5,6,7,8,9,10,11,12,13
Additional Images: [url1, url2, url3]
Stock: 10 units
Rating: ⭐⭐⭐⭐ (1 review)
```

### Cart Item Display
```
Product: Nike Air Force 1 (OFF White)
Price per unit: Rs. 50
Selected Size: 10 NP
Selected Gender: Male
Quantity: 2 units
Subtotal: Rs. 100
```

---

## Testing Checklist

- [ ] Size buttons appear for Footwear category
- [ ] Size buttons appear for Clothing category
- [ ] Gender badge displays correctly
- [ ] Multiple images display as thumbnails
- [ ] Clicking thumbnail swaps main image
- [ ] Selected size highlights in yellow
- [ ] Adding to cart without size shows warning
- [ ] Size persists in cart view
- [ ] Gender displays in cart
- [ ] Mobile layout is responsive
- [ ] Keyboard navigation works
- [ ] Screen readers read labels correctly

---

**UI/UX Version**: 1.0  
**Last Updated**: May 18, 2026  
**Status**: ✅ Ready for Implementation
