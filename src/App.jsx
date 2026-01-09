import { useState, useEffect } from 'react';
const API_URL = 'https://ecommerce-backend-6i5c.onrender.com';


function App() {
  // State Management
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [reviews, setReviews] = useState({});
  const [likedProducts, setLikedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // UI State
  const [currentView, setCurrentView] = useState('products');
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal States
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Form States
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  
  // User State
  const [user, setUser] = useState(null);
  
  // Toast Notification
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Styles
  const styles = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  `;

  useEffect(() => {
    loadProducts();
    const token = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    if (token && savedUsername) {
      setUser({ username: savedUsername, token: token });
      loadUserData(token);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = '#1a1a1a';
      document.body.style.color = '#ffffff';
    } else {
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
    }
  }, [darkMode]);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (message, type = 'success') => {
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    setToast({ show: true, message: `${icons[type]} ${message}`, type });
  };

  const loadProducts = async () => {
    try {
      const response = await fetch('https://ecommerce-backend-6i5c.onrender.com/api/products/');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load products");
      setLoading(false);
    }
  };

  const loadUserData = async (token) => {
    await loadCartFromBackend(token);
    await loadOrdersFromBackend(token);
    await loadWishlistFromBackend(token);
    await loadNotifications(token);
    await loadRecentlyViewed(token);
    await loadCoupons(token);
    await loadLikedProducts(token);
  };

  const loadCartFromBackend = async (token) => {
    try {
      const response = await fetch('https://ecommerce-backend-6i5c.onrender.com/api/cart/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  };

  const loadOrdersFromBackend = async (token) => {
    try {
      const response = await fetch('https://ecommerce-backend-6i5c.onrender.com/api/orders/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    }
  };

  const loadWishlistFromBackend = async (token) => {
    try {
      const response = await fetch('https://ecommerce-backend-6i5c.onrender.com/api/wishlist/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setWishlist(data.map(item => item.product));
      }
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    }
  };

  const loadNotifications = async (token) => {
    try {
      const response = await fetch('https://ecommerce-backend-6i5c.onrender.com/api/notifications/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  const loadRecentlyViewed = async (token) => {
    try {
      const response = await fetch('https://ecommerce-backend-6i5c.onrender.com/api/recently-viewed/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRecentlyViewed(data.map(item => item.product));
      }
    } catch (err) {
      console.error("Failed to load recently viewed:", err);
    }
  };

  const loadCoupons = async (token) => {
    try {
      const response = await fetch('https://ecommerce-backend-6i5c.onrender.com/api/coupons/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCoupons(data);
      }
    } catch (err) {
      console.error("Failed to load coupons:", err);
    }
  };

  const loadLikedProducts = async (token) => {
    try {
      const response = await fetch('https://ecommerce-backend-6i5c.onrender.com/api/likes/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLikedProducts(data.map(item => item.product.id));
      }
    } catch (err) {
      console.error("Failed to load likes:", err);
    }
  };

  const loadReviewsForProduct = async (productId) => {
    try {
      const response = await fetch(`https://ecommerce-backend-6i5c.onrender.com/api/reviews/?product_id=${productId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(prev => ({ ...prev, [productId]: data }));
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      const response = await fetch('https://ecommerce-backend-6i5c.onrender.com/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access);
        localStorage.setItem('username', username);
        setUser({ username, token: data.access });
        setShowAuthForm(false);
        setUsername("");
        setPassword("");
        loadUserData(data.access);
        showToast(`Welcome back!`, 'success');
      } else {
        setAuthError("Invalid username or password");
      }
    } catch (err) {
      setAuthError("Login failed. Please try again.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      const response = await fetch('https://ecommerce-backend-6i5c.onrender.com/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      if (response.ok) {
        showToast('Account created!', 'success');
        handleLogin(e);
      } else {
        const data = await response.json();
        setAuthError(data.username?.[0] || "Registration failed");
      }
    } catch (err) {
      setAuthError("Registration failed");
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
    setCart([]);
    setOrders([]);
    setWishlist([]);
    showToast('Logged out', 'info');
    setCurrentView('products');
  };

  const addToCart = async (product, variant = null) => {
    if (!user) {
      showToast("Please login!", 'error');
      setShowAuthForm(true);
      return;
    }
    
    try {
      const body = { product_id: product.id, quantity: 1 };
      if (variant) body.variant_id = variant.id;
      
      const response = await fetch('https://ecommerce-backend-6i5c.onrender.com/api/cart/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(body)
      });
      
      if (response.ok) {
        await loadCartFromBackend(user.token);
        showToast('Added to cart!', 'success');
      }
    } catch (err) {
      showToast('Failed to add', 'error');
    }
  };

  const updateQuantityOnBackend = async (cartItemId, newQuantity) => {
    if (!user) return;
    try {
      if (newQuantity > 0) {
        await fetch(`https://ecommerce-backend-6i5c.onrender.com/api/cart/${cartItemId}/update_quantity/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({ quantity: newQuantity })
        });
      } else {
        await fetch(`https://ecommerce-backend-6i5c.onrender.com/api/cart/${cartItemId}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
      }
      await loadCartFromBackend(user.token);
    } catch (err) {
      console.error("Failed to update cart");
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!user) return;
    try {
      await fetch(`https://ecommerce-backend-6i5c.onrender.com/api/cart/${cartItemId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      await loadCartFromBackend(user.token);
      showToast('Removed', 'info');
    } catch (err) {
      console.error("Failed to remove");
    }
  };

  const calculateTotal = () => cart.reduce((total, item) => total + item.total_price, 0);
  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

  const applyCoupon = async () => {
    if (!couponCode) {
      showToast('Enter coupon code', 'error');
      return;
    }
    
    try {
      const response = await fetch('https://ecommerce-backend-6i5c.onrender.com/api/coupons/validate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ code: couponCode, amount: calculateTotal() })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAppliedCoupon(data);
        showToast(`Saved ₹${data.discount}!`, 'success');
        setShowCouponModal(false);
      } else {
        const error = await response.json();
        showToast(error.error || 'Invalid coupon', 'error');
      }
    } catch (err) {
      showToast('Failed', 'error');
    }
  };

  const handleCheckout = () => {
    if (!user) {
      showToast("Please login!", 'error');
      setShowAuthForm(true);
      return;
    }
    
    if (cart.length === 0) {
      showToast('Cart is empty!', 'error');
      return;
    }
    
    if (!shippingAddress.trim()) {
      showToast('Enter address', 'warning');
      return;
    }
    
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    try {
      const body = {
        payment_method: paymentMethod,
        shipping_address: shippingAddress
      };
      
      if (appliedCoupon) body.coupon_id = appliedCoupon.coupon_id;
      
      const response = await fetch('https://ecommerce-backend-6i5c.onrender.com/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(body)
      });
      
      if (response.ok) {
        const order = await response.json();
        showToast(`Order #${order.id} placed!`, 'success');
        setCart([]);
        setAppliedCoupon(null);
        setCouponCode('');
        setShippingAddress('');
        setShowPaymentModal(false);
        await loadOrdersFromBackend(user.token);
        await loadNotifications(user.token);
        setCurrentView('orders');
      }
    } catch (err) {
      showToast('Failed', 'error');
    }
  };

  const isInWishlist = (productId) => wishlist.some(item => item.id === productId);

  const toggleWishlist = async (product) => {
    if (!user) {
      showToast("Please login!", 'error');
      setShowAuthForm(true);
      return;
    }

    try {
      if (isInWishlist(product.id)) {
        await fetch('https://ecommerce-backend-6i5c.onrender.com/api/wishlist/remove_by_product/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({ product_id: product.id })
        });
        setWishlist(wishlist.filter(item => item.id !== product.id));
        showToast('Removed', 'info');
      } else {
        await fetch('https://ecommerce-backend-6i5c.onrender.com/api/wishlist/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({ product_id: product.id })
        });
        setWishlist([...wishlist, product]);
        showToast('Added to wishlist!', 'success');
      }
    } catch (err) {
      console.error("Failed");
    }
  };

  const toggleLike = async (product) => {
    if (!user) {
      showToast("Please login!", 'error');
      setShowAuthForm(true);
      return;
    }

    try {
      const response = await fetch('https://ecommerce-backend-6i5c.onrender.com/api/likes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ product_id: product.id })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.liked) {
          setLikedProducts([...likedProducts, product.id]);
        } else {
          setLikedProducts(likedProducts.filter(id => id !== product.id));
        }
        await loadProducts();
      }
    } catch (err) {
      console.error("Failed");
    }
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
    setSelectedVariant(null);
    setShowProductModal(true);
    loadReviewsForProduct(product.id);
  };

  const openReviewModal = (product) => {
    if (!user) {
      showToast("Please login!", 'error');
      setShowAuthForm(true);
      return;
    }
    setSelectedProduct(product);
    setReviewRating(5);
    setReviewComment("");
    setShowReviewModal(true);
    loadReviewsForProduct(product.id);
  };

  const submitReview = async () => {
    if (!user || !selectedProduct) return;
    
    try {
      const response = await fetch('https://ecommerce-backend-6i5c.onrender.com/api/reviews/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          product_id: selectedProduct.id,
          rating: reviewRating,
          comment: reviewComment
        })
      });
      
      if (response.ok) {
        showToast("Review submitted!", 'success');
        setShowReviewModal(false);
        await loadProducts();
        await loadReviewsForProduct(selectedProduct.id);
      } else {
        const data = await response.json();
        showToast(data.error || "Failed", 'error');
      }
    } catch (err) {
      showToast("Failed", 'error');
    }
  };

  const markNotificationRead = async (notificationId) => {
    try {
      await fetch(`https://ecommerce-backend-6i5c.onrender.com/api/notifications/${notificationId}/mark_read/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      await loadNotifications(user.token);
    } catch (err) {
      console.error("Failed");
    }
  };

  const renderStars = (rating) => '⭐'.repeat(Math.round(rating));

  const getProductImages = (product) => {
    const images = [product.image];
    if (product.image_2) images.push(product.image_2);
    if (product.image_3) images.push(product.image_3);
    return images.filter(img => img);
  };

  const shareProduct = (product, platform) => {
    const url = window.location.href;
    const text = `Check out ${product.name} for ₹${product.price}!`;
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(text + '\n\n' + url)}`
    };
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      showToast('Link copied!', 'success');
      setShowShareModal(false);
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank');
      setShowShareModal(false);
    }
  };

  // Filter & Sort
  let filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesStock = !showInStockOnly || product.in_stock;
    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });

  if (sortBy === "price-low") filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  else if (sortBy === "price-high") filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  else if (sortBy === "name") filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === "rating") filteredProducts = [...filteredProducts].sort((a, b) => b.average_rating - a.average_rating);
  else if (sortBy === "popular") filteredProducts = [...filteredProducts].sort((a, b) => b.views_count - a.views_count);
  else if (sortBy === "trending") filteredProducts = [...filteredProducts].sort((a, b) => b.likes_count - a.likes_count);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', fontSize: '24px' }}>Loading... ⏳</div>;
  if (error) return <div style={{ padding: '50px', textAlign: 'center', fontSize: '24px', color: 'red' }}>{error}</div>;

  const bgColor = darkMode ? '#1a1a1a' : '#ffffff';
  const textColor = darkMode ? '#ffffff' : '#000000';
  const cardBg = darkMode ? '#2a2a2a' : '#ffffff';
  const borderColor = darkMode ? '#444' : '#ccc';
    return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: bgColor, color: textColor, minHeight: '100vh' }}>
      <style>{styles}</style>

      {/* TOAST */}
      {toast.show && (
        <div style={{
          position: 'fixed', top: '80px', right: '20px', zIndex: 2000,
          backgroundColor: toast.type === 'success' ? '#28a745' : toast.type === 'error' ? '#dc3545' : toast.type === 'warning' ? '#ffc107' : '#007bff',
          color: 'white', padding: '15px 25px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          animation: 'slideIn 0.3s ease-out', fontSize: '16px', fontWeight: 'bold', maxWidth: '300px'
        }}>{toast.message}</div>
      )}

      {/* HEADER */}
      <div style={{ 
        backgroundColor: '#007bff', color: 'white', padding: '15px 20px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={() => setCurrentView('products')}>🛒 ShopHub</h2>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          {user && (
            <>
              <button onClick={() => setCurrentView('products')} style={{
                padding: '8px 15px', backgroundColor: currentView === 'products' ? '#28a745' : 'transparent',
                color: 'white', border: '2px solid white', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
              }}>🛍️ Shop</button>
              
              <button onClick={() => setCurrentView('wishlist')} style={{
                padding: '8px 15px', backgroundColor: currentView === 'wishlist' ? '#28a745' : 'transparent',
                color: 'white', border: '2px solid white', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
              }}>❤️ Wishlist ({wishlist.length})</button>
              
              <button onClick={() => setCurrentView('orders')} style={{
                padding: '8px 15px', backgroundColor: currentView === 'orders' ? '#28a745' : 'transparent',
                color: 'white', border: '2px solid white', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
              }}>📦 Orders ({orders.length})</button>

              <button onClick={() => setCurrentView('recommendations')} style={{
                padding: '8px 15px', backgroundColor: currentView === 'recommendations' ? '#28a745' : 'transparent',
                color: 'white', border: '2px solid white', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
              }}>✨ For You</button>
              
              <button onClick={() => setShowNotifications(!showNotifications)} style={{
                padding: '8px 15px', backgroundColor: 'transparent', color: 'white',
                border: '2px solid white', borderRadius: '5px', cursor: 'pointer', position: 'relative'
              }}>
                🔔
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <span style={{
                    position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#dc3545',
                    color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '12px', animation: 'pulse 2s infinite'
                  }}>{notifications.filter(n => !n.is_read).length}</span>
                )}
              </button>
            </>
          )}
          
          <button onClick={() => setDarkMode(!darkMode)} style={{
            padding: '8px 15px', backgroundColor: 'transparent', color: 'white',
            border: '2px solid white', borderRadius: '5px', cursor: 'pointer'
          }}>{darkMode ? '☀️' : '🌙'}</button>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span>Hi, <strong>{user.username}</strong>!</span>
              <button onClick={handleLogout} style={{ 
                padding: '8px 15px', backgroundColor: '#dc3545', color: 'white',
                border: 'none', borderRadius: '5px', cursor: 'pointer'
              }}>Logout</button>
            </div>
          ) : (
            <button onClick={() => { setShowAuthForm(true); setIsLogin(true); }} style={{ 
              padding: '8px 15px', backgroundColor: '#28a745', color: 'white',
              border: 'none', borderRadius: '5px', cursor: 'pointer'
            }}>Login / Register</button>
          )}
        </div>
      </div>

      {/* NOTIFICATIONS DROPDOWN */}
      {showNotifications && user && (
        <div style={{
          position: 'fixed', top: '70px', right: '20px', width: '350px', maxHeight: '500px',
          overflowY: 'auto', backgroundColor: cardBg, border: `1px solid ${borderColor}`,
          borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 200, padding: '15px', animation: 'fadeIn 0.3s'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <h3 style={{ marginTop: 0 }}>🔔 Notifications</h3>
            <button onClick={() => setShowNotifications(false)} style={{
              background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: textColor
            }}>×</button>
          </div>
          {notifications.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center' }}>No notifications</p>
          ) : (
            notifications.map(notif => (
              <div key={notif.id} style={{
                padding: '12px', marginBottom: '10px', backgroundColor: notif.is_read ? 'transparent' : '#e3f2fd',
                borderRadius: '8px', cursor: 'pointer', border: `1px solid ${borderColor}`, transition: 'transform 0.2s'
              }} onClick={() => markNotificationRead(notif.id)}>
                <strong style={{ color: textColor }}>{notif.title}</strong>
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>{notif.message}</p>
                <span style={{ fontSize: '12px', color: '#999' }}>{new Date(notif.created_at).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* AUTH MODAL */}
      {showAuthForm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ backgroundColor: cardBg, padding: '30px', borderRadius: '10px', width: '400px', maxWidth: '90%' }}>
            <h2 style={{ color: textColor }}>{isLogin ? 'Login' : 'Register'}</h2>
            <form onSubmit={isLogin ? handleLogin : handleRegister}>
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required
                style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }} />
              {!isLogin && (
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }} />
              )}
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
                style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }} />
              {authError && <p style={{ color: 'red', marginBottom: '10px' }}>{authError}</p>}
              <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', marginBottom: '10px' }}>
                {isLogin ? 'Login' : 'Register'}
              </button>
              <button type="button" onClick={() => setIsLogin(!isLogin)} style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#007bff', border: '1px solid #007bff', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', marginBottom: '10px' }}>
                {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
              </button>
              <button type="button" onClick={() => { setShowAuthForm(false); setAuthError(""); }} 
                style={{ width: '100%', padding: '12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {showShareModal && selectedProduct && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }} onClick={() => setShowShareModal(false)}>
          <div style={{ 
            backgroundColor: cardBg, padding: '30px', borderRadius: '15px', width: '400px', maxWidth: '90%', animation: 'fadeIn 0.3s'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0, color: textColor }}>📤 Share {selectedProduct.name}</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
              <button onClick={() => shareProduct(selectedProduct, 'whatsapp')} style={{
                padding: '15px', backgroundColor: '#25D366', color: 'white', border: 'none',
                borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold'
              }}>📱 WhatsApp</button>
              
              <button onClick={() => shareProduct(selectedProduct, 'facebook')} style={{
                padding: '15px', backgroundColor: '#1877F2', color: 'white', border: 'none',
                borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold'
              }}>👍 Facebook</button>
              
              <button onClick={() => shareProduct(selectedProduct, 'twitter')} style={{
                padding: '15px', backgroundColor: '#1DA1F2', color: 'white', border: 'none',
                borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold'
              }}>🐦 Twitter</button>
              
              <button onClick={() => shareProduct(selectedProduct, 'linkedin')} style={{
                padding: '15px', backgroundColor: '#0A66C2', color: 'white', border: 'none',
                borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold'
              }}>💼 LinkedIn</button>
              
              <button onClick={() => shareProduct(selectedProduct, 'email')} style={{
                padding: '15px', backgroundColor: '#EA4335', color: 'white', border: 'none',
                borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold'
              }}>📧 Email</button>
              
              <button onClick={() => shareProduct(selectedProduct, 'copy')} style={{
                padding: '15px', backgroundColor: '#6c757d', color: 'white', border: 'none',
                borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold'
              }}>📋 Copy Link</button>
            </div>
            
            <button onClick={() => setShowShareModal(false)} style={{
              width: '100%', marginTop: '20px', padding: '12px', backgroundColor: 'transparent',
              color: textColor, border: `2px solid ${borderColor}`, borderRadius: '10px', cursor: 'pointer', fontSize: '16px'
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ 
            backgroundColor: cardBg, padding: '30px', borderRadius: '15px', width: '500px', maxWidth: '90%', animation: 'fadeIn 0.3s'
          }}>
            <h2 style={{ marginTop: 0, color: textColor }}>💳 Choose Payment Method</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                padding: '20px', border: `2px solid ${paymentMethod === 'COD' ? '#28a745' : borderColor}`,
                borderRadius: '10px', marginBottom: '15px', cursor: 'pointer',
                backgroundColor: paymentMethod === 'COD' ? (darkMode ? '#1a3d1a' : '#e8f5e9') : 'transparent'
              }} onClick={() => setPaymentMethod('COD')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="radio" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} style={{ width: '20px', height: '20px' }} />
                  <div>
                    <strong style={{ fontSize: '18px', color: textColor }}>💵 Cash on Delivery</strong>
                    <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>Pay when you receive</p>
                  </div>
                </div>
              </div>
              
              <div style={{
                padding: '20px', border: `2px solid ${paymentMethod === 'ONLINE' ? '#28a745' : borderColor}`,
                borderRadius: '10px', cursor: 'pointer',
                backgroundColor: paymentMethod === 'ONLINE' ? (darkMode ? '#1a3d1a' : '#e8f5e9') : 'transparent'
              }} onClick={() => setPaymentMethod('ONLINE')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="radio" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} style={{ width: '20px', height: '20px' }} />
                  <div>
                    <strong style={{ fontSize: '18px', color: textColor }}>💳 Online Payment</strong>
                    <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>Card, UPI, Net Banking</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '20px', backgroundColor: darkMode ? '#333' : '#f8f9fa', borderRadius: '10px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Subtotal:</span>
                <span style={{ fontWeight: 'bold' }}>₹{calculateTotal()}</span>
              </div>
              {appliedCoupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#28a745' }}>
                  <span>Discount:</span>
                  <span style={{ fontWeight: 'bold' }}>-₹{appliedCoupon.discount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: `2px solid ${borderColor}`, fontSize: '20px', fontWeight: 'bold' }}>
                <span>Total:</span>
                <span style={{ color: '#007bff' }}>₹{appliedCoupon ? appliedCoupon.final_amount : calculateTotal()}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={processPayment} style={{
                flex: 1, padding: '15px', backgroundColor: '#28a745', color: 'white', border: 'none',
                borderRadius: '10px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold'
              }}>✅ Confirm Order</button>
              
              <button onClick={() => setShowPaymentModal(false)} style={{
                flex: 1, padding: '15px', backgroundColor: '#6c757d', color: 'white', border: 'none',
                borderRadius: '10px', cursor: 'pointer', fontSize: '18px'
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* COUPON MODAL - Continues below... */}
      {showCouponModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ backgroundColor: cardBg, padding: '30px', borderRadius: '10px', width: '500px', maxWidth: '90%' }}>
            <h2 style={{ color: textColor }}>🎫 Apply Coupon</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <input type="text" placeholder="Enter coupon code" value={couponCode} 
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box', marginBottom: '10px' }}
              />
              <button onClick={applyCoupon} style={{
                width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none',
                borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold'
              }}>Apply Coupon</button>
            </div>
            
            <div>
              <h4>Available Coupons:</h4>
              {coupons.length === 0 ? (
                <p style={{ color: '#666' }}>No coupons available</p>
              ) : (
                coupons.map(coupon => (
                  <div key={coupon.id} style={{
                    padding: '15px', border: `2px dashed ${borderColor}`, borderRadius: '8px', marginBottom: '10px', cursor: 'pointer'
                  }} onClick={() => setCouponCode(coupon.code)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ fontSize: '18px', color: '#007bff' }}>{coupon.code}</strong>
                        <p style={{ margin: '5px 0', color: textColor }}>
                          {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}
                        </p>
                        <small style={{ color: '#666' }}>Min: ₹{coupon.min_purchase_amount}</small>
                      </div>
                      <button style={{
                        padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
                      }}>Use</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <button onClick={() => setShowCouponModal(false)} style={{
              width: '100%', marginTop: '20px', padding: '12px', backgroundColor: '#6c757d', color: 'white',
              border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
            }}>Close</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex' }}>
        {/* MAIN CONTENT */}
        <div style={{ flex: 2, padding: '20px' }}>
          
          {/* PRODUCTS VIEW */}
          {currentView === 'products' && (
            <>
              <input type="text" placeholder="🔍 Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '15px', fontSize: '16px', border: `2px solid ${borderColor}`, borderRadius: '10px', boxSizing: 'border-box', marginBottom: '20px', backgroundColor: cardBg, color: textColor }} />
              
              <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: '10px' }}>
                <h3 style={{ marginTop: 0 }}>Filters</h3>
                
                <div style={{ marginBottom: '15px' }}>
                  <strong>Category:</strong>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {['All', 'Electronics', 'Accessories'].map(cat => (
                      <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ 
                        padding: '10px 20px', backgroundColor: selectedCategory === cat ? '#007bff' : 'transparent',
                        color: selectedCategory === cat ? 'white' : textColor, border: `2px solid ${borderColor}`,
                        cursor: 'pointer', borderRadius: '5px', fontWeight: selectedCategory === cat ? 'bold' : 'normal'
                      }}>{cat}</button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <strong>Sort By:</strong>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: `2px solid ${borderColor}`, borderRadius: '5px', fontSize: '16px', cursor: 'pointer', marginTop: '10px', backgroundColor: cardBg, color: textColor }}>
                    <option value="default">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name</option>
                    <option value="rating">Rating</option>
                    <option value="popular">Popular</option>
                    <option value="trending">Trending</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={showInStockOnly} onChange={() => setShowInStockOnly(!showInStockOnly)} style={{ width: '20px', height: '20px' }} />
                    In Stock Only
                  </label>
                </div>
              </div>

              <p style={{ marginBottom: '15px', fontSize: '18px' }}>Showing <strong>{filteredProducts.length}</strong> products</p>

              {filteredProducts.length === 0 && (
                <div style={{ padding: '50px', textAlign: 'center', backgroundColor: darkMode ? '#333' : '#fff3cd', borderRadius: '10px' }}>
                  <h3>No products found 😕</h3>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {filteredProducts.map((product) => (
                  <div key={product.id} style={{ 
                    border: `1px solid ${borderColor}`, padding: '15px', borderRadius: '10px', backgroundColor: cardBg,
                    position: 'relative', transition: 'transform 0.2s', cursor: 'pointer'
                  }} onClick={() => openProductModal(product)}>
                    
                    {product.discount_percentage > 0 && (
                      <div style={{
                        position: 'absolute', top: '10px', left: '10px', backgroundColor: '#ff5722',
                        color: 'white', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold', zIndex: 10
                      }}>{product.discount_percentage}% OFF</div>
                    )}

                    <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }} style={{
                      position: 'absolute', top: '10px', right: '10px', backgroundColor: 'white',
                      border: '2px solid #dc3545', borderRadius: '50%', width: '40px', height: '40px',
                      cursor: 'pointer', fontSize: '20px', zIndex: 10
                    }}>{isInWishlist(product.id) ? '❤️' : '🤍'}</button>

                    <div style={{ width: '100%', height: '220px', backgroundColor: '#ddd', borderRadius: '8px', marginBottom: '10px', overflow: 'hidden' }}>
                      {product.image ? (
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>No Image</div>
                      )}
                    </div>
                    
                    <h3 style={{ fontSize: '18px', margin: '10px 0', color: textColor }}>{product.name}</h3>
                    
                    <div style={{ marginBottom: '10px' }}>
                      {product.average_rating > 0 ? (
                        <span>{renderStars(product.average_rating)} ({product.review_count})</span>
                      ) : (
                        <span style={{ color: '#999' }}>No reviews</span>
                      )}
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      {product.discount_percentage > 0 ? (
                        <>
                          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745', marginRight: '10px' }}>₹{product.price}</span>
                          <span style={{ fontSize: '16px', textDecoration: 'line-through', color: '#999' }}>₹{product.original_price}</span>
                        </>
                      ) : (
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: textColor }}>₹{product.price}</span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <button onClick={(e) => { e.stopPropagation(); toggleLike(product); }} style={{
                        flex: 1, padding: '8px', backgroundColor: 'transparent', border: '2px solid #007bff',
                        borderRadius: '5px', cursor: 'pointer'
                      }}>
                        {likedProducts.includes(product.id) ? '👍' : '👍🏻'} {product.likes_count}
                      </button>
                      
                      <button onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); setShowShareModal(true); }} style={{
                        flex: 1, padding: '8px', backgroundColor: 'transparent', border: '2px solid #007bff',
                        borderRadius: '5px', cursor: 'pointer'
                      }}>📤 Share</button>
                    </div>

                    <p style={{ fontWeight: 'bold', marginBottom: '10px', color: product.in_stock ? '#28a745' : '#dc3545' }}>
                      {product.in_stock ? `✅ In Stock` : "❌ Out of Stock"}
                    </p>
                    
                    <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} disabled={!product.in_stock} style={{ 
                      backgroundColor: product.in_stock ? '#28a745' : '#ccc', color: 'white', padding: '12px',
                      border: 'none', cursor: product.in_stock ? 'pointer' : 'not-allowed', width: '100%',
                      borderRadius: '5px', fontSize: '16px', fontWeight: 'bold'
                    }}>{product.in_stock ? "Add to Cart" : "Unavailable"}</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* WISHLIST VIEW */}
          {currentView === 'wishlist' && (
            <>
              <h2>❤️ My Wishlist</h2>
              {!user ? (
                <div style={{ padding: '50px', textAlign: 'center', backgroundColor: darkMode ? '#333' : '#fff3cd', borderRadius: '10px' }}>
                  <h3>Please login to view wishlist</h3>
                  <button onClick={() => setShowAuthForm(true)} style={{
                    marginTop: '15px', padding: '12px 25px', backgroundColor: '#007bff', color: 'white',
                    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
                  }}>Login</button>
                </div>
              ) : wishlist.length === 0 ? (
                <div style={{ padding: '50px', textAlign: 'center', backgroundColor: darkMode ? '#333' : '#f8f9fa', borderRadius: '10px' }}>
                  <h3>No favorites yet 💔</h3>
                  <button onClick={() => setCurrentView('products')} style={{
                    padding: '12px 25px', backgroundColor: '#007bff', color: 'white',
                    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
                  }}>Browse Products</button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                  {wishlist.map((product) => (
                    <div key={product.id} style={{ 
                      border: `2px solid #dc3545`, padding: '15px', borderRadius: '10px',
                      backgroundColor: cardBg, position: 'relative', cursor: 'pointer'
                    }} onClick={() => openProductModal(product)}>
                      
                      <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }} style={{
                        position: 'absolute', top: '10px', right: '10px', backgroundColor: '#dc3545',
                        border: 'none', borderRadius: '50%', width: '40px', height: '40px',
                        cursor: 'pointer', fontSize: '20px', color: 'white', zIndex: 10
                      }}>❤️</button>

                      <div style={{ width: '100%', height: '220px', backgroundColor: '#ddd', borderRadius: '8px', marginBottom: '10px', overflow: 'hidden' }}>
                        {product.image && <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      
                      <h3 style={{ fontSize: '18px', margin: '10px 0', color: textColor }}>{product.name}</h3>
                      <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: textColor }}>₹{product.price}</p>
                      
                      <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} disabled={!product.in_stock} style={{ 
                        backgroundColor: product.in_stock ? '#28a745' : '#ccc', color: 'white', padding: '12px',
                        border: 'none', cursor: product.in_stock ? 'pointer' : 'not-allowed', width: '100%',
                        borderRadius: '5px', fontSize: '16px', fontWeight: 'bold'
                      }}>{product.in_stock ? "Add to Cart" : "Unavailable"}</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ORDERS VIEW */}
          {currentView === 'orders' && (
            <>
              <h2>📦 My Orders</h2>
              {!user ? (
                <div style={{ padding: '50px', textAlign: 'center', backgroundColor: darkMode ? '#333' : '#fff3cd', borderRadius: '10px' }}>
                  <h3>Please login to view orders</h3>
                  <button onClick={() => setShowAuthForm(true)} style={{
                    marginTop: '15px', padding: '12px 25px', backgroundColor: '#007bff', color: 'white',
                    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
                  }}>Login</button>
                </div>
              ) : orders.length === 0 ? (
                <div style={{ padding: '50px', textAlign: 'center', backgroundColor: darkMode ? '#333' : '#f8f9fa', borderRadius: '10px' }}>
                  <h3>No orders yet 📭</h3>
                  <button onClick={() => setCurrentView('products')} style={{
                    padding: '12px 25px', backgroundColor: '#007bff', color: 'white',
                    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
                  }}>Shop Now</button>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} style={{
                    border: `2px solid ${borderColor}`, borderRadius: '10px', padding: '20px',
                    marginBottom: '20px', backgroundColor: cardBg, cursor: 'pointer'
                  }} onClick={() => { setSelectedOrder(order); setShowOrderDetails(true); }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', paddingBottom: '10px', borderBottom: `1px solid ${borderColor}` }}>
                      <div>
                        <h3 style={{ margin: '0 0 5px 0', color: textColor }}>Order #{order.id}</h3>
                        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{new Date(order.created_at).toLocaleString()}</p>
                        <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>📦 {order.tracking_number}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: '0 0 5px 0', fontSize: '28px', fontWeight: 'bold', color: '#007bff' }}>₹{order.final_amount}</p>
                        <span style={{ 
                          backgroundColor: order.status === 'Delivered' ? '#28a745' : order.status === 'Shipped' ? '#007bff' : '#ffc107',
                          color: 'white', padding: '5px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold'
                        }}>{order.status}</span>
                      </div>
                    </div>
                    
                    <div>
                      <strong>Items ({order.items.length}):</strong>
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} style={{
                          display: 'flex', justifyContent: 'space-between', padding: '8px',
                          backgroundColor: darkMode ? '#444' : '#f8f9fa', borderRadius: '5px', marginTop: '5px'
                        }}>
                          <span>{item.product_name} x {item.quantity}</span>
                          <span style={{ fontWeight: 'bold' }}>₹{item.product_price * item.quantity}</span>
                        </div>
                      ))}
                      {order.items.length > 3 && <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>+{order.items.length - 3} more</p>}
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* RECOMMENDATIONS VIEW */}
          {currentView === 'recommendations' && (
            <>
              <h2>✨ Recommended For You</h2>
              {!user ? (
                <div style={{ padding: '50px', textAlign: 'center', backgroundColor: darkMode ? '#333' : '#fff3cd', borderRadius: '10px' }}>
                  <h3>Login for personalized recommendations</h3>
                  <button onClick={() => setShowAuthForm(true)} style={{
                    marginTop: '15px', padding: '12px 25px', backgroundColor: '#007bff', color: 'white',
                    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
                  }}>Login</button>
                </div>
              ) : (
                <>
                  {products.filter(p => p.is_trending).length > 0 && (
                    <div style={{ marginBottom: '40px' }}>
                      <h3>🔥 Trending Now</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {products.filter(p => p.is_trending).slice(0, 4).map((product) => (
                          <div key={product.id} style={{ 
                            border: `2px solid #ff9800`, padding: '15px', borderRadius: '10px',
                            backgroundColor: cardBg, cursor: 'pointer'
                          }} onClick={() => openProductModal(product)}>
                            <div style={{ width: '100%', height: '200px', backgroundColor: '#ddd', borderRadius: '8px', marginBottom: '10px', overflow: 'hidden' }}>
                              {product.image && <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                            </div>
                            <h4 style={{ color: textColor }}>{product.name}</h4>
                            <p style={{ fontSize: '20px', fontWeight: 'bold', color: textColor }}>₹{product.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {recentlyViewed.length > 0 && (
                    <div>
                      <h3>👁️ Recently Viewed</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {recentlyViewed.slice(0, 4).map((product) => (
                          <div key={product.id} style={{ 
                            border: `1px solid ${borderColor}`, padding: '15px', borderRadius: '10px',
                            backgroundColor: cardBg, cursor: 'pointer'
                          }} onClick={() => openProductModal(product)}>
                            <div style={{ width: '100%', height: '200px', backgroundColor: '#ddd', borderRadius: '8px', marginBottom: '10px', overflow: 'hidden' }}>
                              {product.image && <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                            </div>
                            <h4 style={{ color: textColor }}>{product.name}</h4>
                            <p style={{ fontSize: '20px', fontWeight: 'bold', color: textColor }}>₹{product.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* CART SIDEBAR */}
        <div style={{ 
          flex: 1, padding: '20px', backgroundColor: darkMode ? '#2a2a2a' : '#f8f9fa',
          borderLeft: `2px solid ${borderColor}`, minHeight: '100vh', position: 'sticky',
          top: '70px', height: 'calc(100vh - 70px)', overflowY: 'auto'
        }}>
          <h2>🛒 Cart</h2>
          <p>Items: <strong>{getTotalItems()}</strong></p>
          
          {!user && <p style={{ color: '#dc3545', fontSize: '14px' }}>Login to save cart</p>}
          
          {cart.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center' }}>
              <p style={{ color: '#666' }}>Cart is empty</p>
            </div>
          ) : (
            <div>
              {cart.map((item) => (
                <div key={item.id} style={{ 
                  border: `1px solid ${borderColor}`, padding: '12px', marginBottom: '12px',
                  borderRadius: '8px', backgroundColor: cardBg
                }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', color: textColor }}>{item.product.name}</h4>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>₹{item.product.price} each</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between', marginTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button onClick={() => updateQuantityOnBackend(item.id, item.quantity - 1)} style={{ 
                        backgroundColor: '#ffc107', color: 'black', padding: '5px 10px',
                        border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold'
                      }}>−</button>
                      <span style={{ fontSize: '16px', fontWeight: 'bold', minWidth: '30px', textAlign: 'center', color: textColor }}>{item.quantity}</span>
                      <button onClick={() => updateQuantityOnBackend(item.id, item.quantity + 1)} style={{ 
                        backgroundColor: '#28a745', color: 'white', padding: '5px 10px',
                        border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold'
                      }}>+</button>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '16px', color: textColor }}>₹{item.total_price}</span>
                      <button onClick={() => removeFromCart(item.id)} style={{ 
                        backgroundColor: '#dc3545', color: 'white', padding: '5px 10px',
                        border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '14px'
                      }}>🗑️</button>
                    </div>
                  </div>
                </div>
              ))}

              {user && (
                <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                  {appliedCoupon ? (
                    <div style={{ 
                      padding: '15px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb',
                      borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <div>
                        <strong style={{ color: '#155724' }}>Coupon Applied!</strong>
                        <p style={{ margin: '5px 0 0 0', color: '#155724' }}>Saved ₹{appliedCoupon.discount}</p>
                      </div>
                      <button onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} style={{
                        padding: '8px 12px', backgroundColor: '#dc3545', color: 'white',
                        border: 'none', borderRadius: '5px', cursor: 'pointer'
                      }}>Remove</button>
                    </div>
                  ) : (
                    <button onClick={() => setShowCouponModal(true)} style={{
                      width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#007bff',
                      border: '2px dashed #007bff', borderRadius: '8px', cursor: 'pointer',
                      fontSize: '16px', fontWeight: 'bold'
                    }}>🎫 Apply Coupon</button>
                  )}
                </div>
              )}

              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: darkMode ? '#333' : '#e3f2fd', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Subtotal:</span>
                  <span style={{ fontWeight: 'bold', color: textColor }}>₹{calculateTotal()}</span>
                </div>
                
                {appliedCoupon && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#28a745' }}>
                    <span>Discount:</span>
                    <span style={{ fontWeight: 'bold' }}>-₹{appliedCoupon.discount}</span>
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: `2px solid ${borderColor}`, marginTop: '10px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Total:</span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>₹{appliedCoupon ? appliedCoupon.final_amount : calculateTotal()}</span>
                </div>
              </div>

              {user && (
                <div style={{ marginTop: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: textColor }}>Shipping Address:</label>
                  <textarea value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter delivery address..." style={{
                      width: '100%', padding: '10px', border: `1px solid ${borderColor}`, borderRadius: '5px',
                      minHeight: '80px', boxSizing: 'border-box', backgroundColor: cardBg, color: textColor
                    }}
                  />
                </div>
              )}

              <button onClick={handleCheckout} style={{ 
                width: '100%', marginTop: '15px', padding: '18px', backgroundColor: user ? '#28a745' : '#007bff',
                color: 'white', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
                borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }}>{user ? '✅ Checkout' : '🔐 Login to Checkout'}</button>

              {user && <p style={{ marginTop: '10px', fontSize: '12px', color: '#666', textAlign: 'center' }}>💳 COD • 📦 Free Shipping • 🔒 Secure</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;


  // CONTINUE TO PART 2...
