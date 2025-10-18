import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderForm, setOrderForm] = useState({
    productId: '',
    quantity: '1',
    customerName: '',
    customerEmail: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/orders`, {
        productId: parseInt(orderForm.productId),
        quantity: parseInt(orderForm.quantity),
        customerName: orderForm.customerName,
        customerEmail: orderForm.customerEmail
      });

      if (response.data.success) {
        alert(`Order created! Order ID: ${response.data.data.id}`);
        setOrderForm({
          productId: '',
          quantity: '1',
          customerName: '',
          customerEmail: ''
        });
        fetchProducts(); // Refresh products
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Order failed');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="App">
      <header className="header">
        <h1>🛍️ E-Commerce Store</h1>
      </header>

      <main>
        <div className="order-section">
          <h2>Place Order</h2>
          <form onSubmit={handleOrderSubmit} className="order-form">
            <div className="form-group">
              <label>Product:</label>
              <select 
                value={orderForm.productId} 
                onChange={(e) => setOrderForm({...orderForm, productId: e.target.value})}
                required
              >
                <option value="">Select a product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Quantity:</label>
              <input
                type="number"
                value={orderForm.quantity}
                onChange={(e) => setOrderForm({...orderForm, quantity: e.target.value})}
                min="1"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Your Name:</label>
              <input
                type="text"
                value={orderForm.customerName}
                onChange={(e) => setOrderForm({...orderForm, customerName: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Your Email:</label>
              <input
                type="email"
                value={orderForm.customerEmail}
                onChange={(e) => setOrderForm({...orderForm, customerEmail: e.target.value})}
                required
              />
            </div>
            
            <button type="submit" className="submit-btn">
              Place Order
            </button>
          </form>
        </div>

        <div className="products-section">
          <h2>Products</h2>
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <h3>{product.name}</h3>
                <p className="price">${product.price}</p>
                <p className="stock">Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
