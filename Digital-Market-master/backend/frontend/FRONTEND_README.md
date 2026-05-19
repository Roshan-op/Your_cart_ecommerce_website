# MUSE - Modern E-Commerce Frontend

A beautiful, modern, responsive e-commerce frontend built with React, Tailwind CSS, and a clean component architecture.

## 🎨 Design Highlights

- **Modern Minimal Aesthetic** - Clean, spacious design with soft pastel colors
- **Fully Responsive** - Mobile-first approach, optimized for all screen sizes
- **Production-Ready Components** - Reusable, scalable component system
- **Smooth Animations** - Subtle hover effects and transitions
- **Tailwind CSS** - Utility-first styling for rapid development

## 🛠️ Tech Stack

- **React 18.2** - UI library
- **Tailwind CSS 3.3** - Styling
- **React Router DOM 5.3** - Navigation
- **Lucide React** - Icons
- **Context API** - State management (Cart)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js
│   ├── Footer.js
│   ├── ProductCard.js
│   ├── CategoryCard.js
│   ├── Button.js
│   ├── Badge.js
│   ├── TestimonialCard.js
│   ├── Loading.js
│   └── index.js        # Exports all components
│
├── pages/              # Page components
│   ├── HomePage.js
│   ├── ShopPage.js
│   ├── ProductDetailPage.js
│   ├── CartPage.js
│   ├── CheckoutPage.js
│   ├── LoginPage.js
│   ├── AboutPage.js
│   ├── ContactPage.js
│   └── index.js
│
├── context/            # React Context
│   └── CartContext.js  # Cart state management
│
├── utils/              # Utility functions (for future use)
│
├── App.js             # Main app with routing
├── index.js           # React root
├── index.css          # Tailwind imports & global styles
├── tailwind.config.js # Tailwind configuration
└── postcss.config.js  # PostCSS configuration
```

## 🎯 Pages Included

1. **Home Page** - Hero, featured categories, products, testimonials, services
2. **Shop Page** - Product grid with filters (category, price) and sorting
3. **Product Detail** - Product images, details, specs, reviews, related products
4. **Cart** - Item management, subtotal, checkout
5. **Checkout** - Multi-step (shipping, payment), order summary
6. **Login/Signup** - Clean auth UI with form toggle
7. **About** - Company story, values, team
8. **Contact** - Contact form, business hours, location

## 📦 Components

### Navigation & Layout
- **Navbar** - Responsive header with mobile menu, cart badge
- **Footer** - Multi-column footer with newsletter signup

### Product Display
- **ProductCard** - Product image, price, rating, add-to-cart, wishlist
- **CategoryCard** - Category showcase
- **Badge** - Sale/discount badges

### UI Elements
- **Button** - 4 variants (primary, secondary, outline, ghost), 4 sizes
- **TestimonialCard** - Customer testimonials with ratings
- **Loading** - Spinner component

## 🎨 Design System

### Color Palette
```
Primary: #333333 (Dark Charcoal)
Secondary: #8B7355 (Warm Brown)
Accent: #D4A373 (Gold/Tan)
Light: #F9F7F4 (Off-white)

Pastels:
- Cream: #FFF9F5
- Beige: #F5EDE3
- Taupe: #D4C5B9
- Sage: #B8C5A0
- Dusty: #A89BA3
- Blush: #F0D4D4
- Mint: #D4E8E0
- Lavender: #E8D9E8
```

### Typography
- **Serif Font**: Playfair Display (headings)
- **Sans Font**: Inter (body text)
- **Font Scale**: 5 heading levels + body sizes

## 🚀 Getting Started

### Prerequisites
- Node.js 14+
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```
   
   The app will open at `http://localhost:3000`

3. **Build for production**
   ```bash
   npm run build
   ```

## 💡 Key Features

### Cart Management
- Add/remove items
- Update quantities
- Persistent localStorage
- Real-time total calculation

### Responsive Design
- Mobile-first approach
- Desktop, tablet, mobile breakpoints
- Sticky navigation
- Touch-friendly buttons

### Navigation
- Client-side routing with React Router
- Smooth page transitions
- Breadcrumb navigation
- Active route highlighting

### Product Filtering
- Filter by category
- Filter by price range
- Sort by: newest, price (low-high, high-low), rating
- Real-time results update

## 🔨 Customization

### Adding New Color
Edit `tailwind.config.js`:
```js
colors: {
  myColor: '#HEXCODE'
}
```

### Creating New Component
1. Create file in `src/components/`
2. Export from `src/components/index.js`
3. Import and use in pages

### Adding New Page
1. Create file in `src/pages/`
2. Export from `src/pages/index.js`
3. Add route to `App.js`

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🎯 Performance Optimizations

- Code splitting (page-based)
- Image lazy loading
- CSS class optimization with Tailwind
- Minified production build

## 📝 API Integration

The frontend expects the following API structure (from your Django backend):

### Product Endpoints
- `GET /api/products/` - List products
- `GET /api/products/{id}/` - Product details
- `GET /api/products/top/` - Top rated products

### User Endpoints
- `POST /api/users/login/` - User login
- `POST /api/users/register/` - User registration

### Order Endpoints
- `POST /api/orders/` - Create order
- `GET /api/orders/{id}/` - Order details

Update the API base URL in components as needed.

## 🐛 Troubleshooting

### Tailwind not compiling
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Port 3000 already in use
```bash
PORT=3001 npm start
```

## 📄 License

Licensed under MIT License.

## 👥 Author

Built with ❤️ by the MUSE team.

---

**Ready to customize?** Start editing components in `src/components/` and pages in `src/pages/`!
