import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productAPI, apiUtils } from '../api/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const { getTotalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const history = useHistory();

  const debounceRef = useRef(null);
  const blurTimerRef = useRef(null);

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  // Debounced real-time fetch
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = searchQuery.trim();
    if (!q) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearchLoading(false);
      return;
    }

    setIsSearchLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await productAPI.getProducts(q, 1);
        const results = (data.products || []).slice(0, 6);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        setActiveIndex(-1);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  // Close dropdown when input loses focus — 150ms delay lets onClick fire first
  const handleInputBlur = () => {
    blurTimerRef.current = setTimeout(() => {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }, 150);
  };

  // Cancel the close timer if user clicks inside the dropdown
  const handleDropdownMouseDown = () => {
    clearTimeout(blurTimerRef.current);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    window.location.href = '/';
  };

  const goToSearch = () => {
    const q = searchQuery.trim();
    if (q) {
      history.push(`/shop?keyword=${encodeURIComponent(q)}`);
      setSearchQuery('');
      setShowSuggestions(false);
      setIsOpen(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    goToSearch();
  };

  const handleSuggestionClick = (product) => {
    history.push(`/product/${product._id}`);
    setSearchQuery('');
    setShowSuggestions(false);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions && !isSearchLoading) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  // Inline suggestion list JSX — used in both desktop and mobile
  const suggestionList = (
    <div
      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[200]"
      onMouseDown={handleDropdownMouseDown}
    >
      {isSearchLoading ? (
        <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400">
          <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin flex-shrink-0" />
          Searching&hellip;
        </div>
      ) : (
        <>
          {suggestions.map((product, idx) => (
            <div
              key={product._id}
              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                idx === activeIndex ? 'bg-beige' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSuggestionClick(product)}
              onMouseEnter={() => setActiveIndex(idx)}
            >
              <img
                src={apiUtils.getImageUrl(product.image)}
                alt={product.name}
                className="w-10 h-10 object-cover rounded-lg flex-shrink-0 bg-beige"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-primary truncate leading-tight">
                  {product.name}
                </p>
                <p className="text-xs text-gray-400 capitalize mt-0.5">{product.category}</p>
              </div>
              <span className="text-sm font-bold text-accent flex-shrink-0 ml-2">
                Rs.&nbsp;{Number(product.price).toLocaleString()}
              </span>
            </div>
          ))}
          <div
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-sm font-semibold text-accent cursor-pointer hover:bg-beige transition-colors"
            onClick={goToSearch}
          >
            <Search size={14} />
            See all results for &ldquo;{searchQuery}&rdquo;
          </div>
        </>
      )}
    </div>
  );

  return (
    <nav className="bg-light shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary hover:text-accent transition-colors">
              Your-cart
            </h1>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 flex-shrink-0">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-4 py-2 text-primary hover:text-accent transition-colors font-medium whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop search */}
          <div className="hidden md:block flex-1 max-w-xs lg:max-w-sm relative">
            <form onSubmit={handleSearch} className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={handleInputBlur}
                className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-taupe bg-white focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {isSearchLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-accent border-t-transparent rounded-full animate-spin pointer-events-none" />
              )}
            </form>
            {(showSuggestions || isSearchLoading) && searchQuery.trim() && suggestionList}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {/* Cart */}
            <Link to="/cart" className="relative group">
              <ShoppingCart size={24} className="text-primary hover:text-accent transition-colors" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center group-hover:bg-secondary group-hover:text-light transition-colors">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* User menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User size={24} className="text-primary" />
                  <span className="hidden sm:inline text-sm text-primary font-medium">
                    {user.name || user.email}
                  </span>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-10">
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-primary hover:bg-gray-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-primary hover:bg-gray-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    {user?.isVendor && (
                      <Link
                        to="/vendor"
                        className="block px-4 py-2 text-blue-600 hover:bg-gray-50 transition-colors font-semibold"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Vendor Panel
                      </Link>
                    )}
                    {user?.isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-purple-600 hover:bg-gray-50 transition-colors font-semibold"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <User size={24} className="text-primary" />
              </Link>
            )}

            {/* Hamburger */}
            <button
              onClick={() => {
                setIsOpen((prev) => {
                  if (prev) setShowSuggestions(false);
                  return !prev;
                });
              }}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isOpen ? <X size={24} className="text-primary" /> : <Menu size={24} className="text-primary" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 animate-slideDown">
            {/* Mobile search */}
            <div className="px-4 mb-3 relative">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search products…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleInputBlur}
                    className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-taupe bg-white focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-light text-sm font-semibold rounded-lg hover:bg-secondary transition-colors"
                >
                  Go
                </button>
              </form>
              {(showSuggestions || isSearchLoading) && searchQuery.trim() && suggestionList}
            </div>

            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block px-4 py-2 text-primary hover:text-accent hover:bg-gray-50 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
              >
                <LogOut size={16} /> Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
