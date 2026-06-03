import { BrowserRouter as Router, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

// Context Providers
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";

// Modern UI/UX Pages
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import LoginPage from "./pages/LoginPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import ReturnsPage from "./pages/ReturnsPage";
import PrivacyPage from "./pages/PrivacyPage";
import EcoPage from "./pages/EcoPage";
import FairTradePage from "./pages/FairTradePage";
import AdminPanelEnhanced from "./pages/AdminPanelEnhanced";
import CustomerPanel from "./pages/CustomerPanel";
import VendorPanel from "./pages/VendorPanelEnhanced";
import SizeChartPage from "./pages/SizeChartPage";

// Fallback to old screens for order tracking
import OrderScreen from "./screens/OrderScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <ScrollToTop />
            {/* Modern UI/UX Routing */}
            <Route path="/" component={HomePage} exact />
            <Route path="/shop" component={ShopPage} />
            <Route path="/product/:id" component={ProductDetailPage} />
            <Route path="/cart" component={CartPage} />
            <Route path="/checkout" component={CheckoutPage} />
            <Route path="/payment-success/:id" component={PaymentSuccessPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/contact" component={ContactPage} />
            <Route path="/faq" component={FAQPage} />
            <Route path="/returns" component={ReturnsPage} />
            <Route path="/privacy" component={PrivacyPage} />
            <Route path="/eco" component={EcoPage} />
            <Route path="/fair-trade" component={FairTradePage} />
            <Route path="/account" component={CustomerPanel} />
            <Route path="/admin" component={AdminPanelEnhanced} />
            <Route path="/vendor" component={VendorPanel} />
            <Route path="/size-chart" component={SizeChartPage} />

            {/* Order Tracking */}
            <Route path="/order/:id" component={OrderScreen} />
            
            {/* Admin Routes */}
            <Route path="/admin/userlist" component={UserListScreen} />
            <Route path="/admin/user/:id/edit" component={UserEditScreen} />
            <Route path="/admin/productlist" component={ProductListScreen} />
            <Route path="/admin/orderlist" component={OrderListScreen} />
            <Route path="/admin/product/:id/edit" component={ProductEditScreen} />
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
