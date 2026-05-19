import React, { useState } from 'react';
import { Navbar } from '../components';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const LoginPage = ({ history }) => {
  const { login, register, loading, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [localError, setLocalError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setLocalError(null);
  };

  const validateName = (name) => {
    // Check if name is empty
    if (!name || name.trim().length === 0) {
      return 'Name cannot be empty';
    }

    // Check if name starts with a number
    if (/^[0-9]/.test(name.trim())) {
      return 'Name cannot start with a number';
    }

    // Check if name contains only letters, spaces, and hyphens
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
      return 'Name can only contain letters, spaces, and hyphens';
    }

    // Check minimum length
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters long';
    }

    // Check maximum length
    if (name.trim().length > 50) {
      return 'Name cannot exceed 50 characters';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    try {
      if (isLogin) {
        // Login
        if (!formData.email || !formData.password) {
          setLocalError('Please fill in all fields');
          return;
        }
        await login(formData.email, formData.password);
      } else {
        // Register
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
          setLocalError('Please fill in all fields');
          return;
        }
        
        // Validate name
        const nameValidationError = validateName(formData.name);
        if (nameValidationError) {
          setLocalError(nameValidationError);
          return;
        }
        
        if (formData.password !== formData.confirmPassword) {
          setLocalError('Passwords do not match');
          return;
        }
        await register(formData.name, formData.email, formData.password);
      }
      
      // Redirect to home on success
      if (history) {
        history.push('/');
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      setLocalError(err.message || `${isLogin ? 'Login' : 'Registration'} failed`);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="card-base p-8">
            <h1 className="font-serif text-3xl font-bold text-center text-primary mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-center text-gray-600 mb-8">
              {isLogin ? 'Sign in to your account' : 'Join our community'}
            </p>

            {displayError && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-sm">
                {displayError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-taupe rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-gray-100"
                />
              )}

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-taupe rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-gray-100"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-taupe rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-gray-100"
              />

              {!isLogin && (
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!isLogin}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-taupe rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-gray-100"
                />
              )}

              {isLogin && (
                <div className="flex justify-end">
                  <a href="#" className="text-accent hover:text-secondary text-sm">
                    Forgot password?
                  </a>
                </div>
              )}

              <Button 
                variant="primary" 
                size="lg" 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData({ email: '', password: '', confirmPassword: '', name: '' });
                    setLocalError(null);
                  }}
                  className="ml-2 text-accent hover:text-secondary font-semibold"
                  disabled={loading}
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-xs text-gray-600">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
