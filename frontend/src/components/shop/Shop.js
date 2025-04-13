import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Shop.css';

const Shop = () => {
  const [items, setItems] = useState([]);
  const [petTypes, setPetTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchShopItems();
  }, []);

  const fetchShopItems = async () => {
    try {
      const response = await axios.get('/api/shop/items');
      setItems(response.data.data.items || []);
      setPetTypes(response.data.data.petTypes || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load shop items');
      setLoading(false);
    }
  };

  const adoptPet = async (petType) => {
    try {
      const response = await axios.post('/api/pets', {
        name: `${petType.species} Pet`,
        petTypeId: petType._id,
        position: { x: 50, y: 50 } // Default center position
      });
      
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to adopt pet');
    }
  };

  const purchaseItem = async (item) => {
    try {
      const response = await axios.post('/api/shop/purchase', {
        itemId: item._id,
        quantity: 1
      });
      
      updateUser({ coins: response.data.data.user.coins });
    } catch (err) {
      setError('Failed to purchase item');
    }
  };

  const sortItems = (items) => {
    return [...items].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rarity':
          comparison = a.rarity.localeCompare(b.rarity);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="shop-container">
        <h1>Pet Shop</h1>
        <div className="loading">Loading shop items...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shop-container">
        <h1>Pet Shop</h1>
        <div className="error">{error}</div>
      </div>
    );
  }

  const sortedItems = sortItems(items);

  return (
    <div className="shop-container">
      <h1>Pet Shop</h1>
      <div className="user-coins">
        <span className="coin-icon">🪙</span>
        <span className="coin-amount">{user?.coins || 0} coins</span>
      </div>
      
      <section className="pets-section">
        <h2>Available Pets</h2>
        <div className="pets-grid">
          {petTypes.length === 0 ? (
            <div className="no-items">No pets available at the moment</div>
          ) : (
            petTypes.map((petType) => (
              <div key={petType._id} className="pet-card">
                <div className="pet-info">
                  <h3>{petType.name}</h3>
                  <p>Species: {petType.species}</p>
                  <p>Rarity: {petType.rarity}</p>
                  <button 
                    onClick={() => adoptPet(petType)}
                    className="adopt-button"
                  >
                    Adopt Me!
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="items-section">
        <h2>Pet Items</h2>
        <div className="sort-controls">
          <button 
            className={`sort-button ${sortBy === 'name' ? 'active' : ''}`}
            onClick={() => handleSort('name')}
          >
            Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            className={`sort-button ${sortBy === 'price' ? 'active' : ''}`}
            onClick={() => handleSort('price')}
          >
            Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            className={`sort-button ${sortBy === 'rarity' ? 'active' : ''}`}
            onClick={() => handleSort('rarity')}
          >
            Rarity {sortBy === 'rarity' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
        <div className="items-grid">
          {sortedItems.length === 0 ? (
            <div className="no-items">No items available at the moment</div>
          ) : (
            sortedItems.map((item) => (
              <div key={item._id} className="item-card">
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p className="item-price">
                    <span className="coin-icon">🪙</span>
                    {item.price} coins
                  </p>
                  <p className="item-rarity">Rarity: {item.rarity}</p>
                  <button 
                    onClick={() => purchaseItem(item)}
                    className={`purchase-button ${user?.coins < item.price ? 'disabled' : ''}`}
                    disabled={user?.coins < item.price}
                  >
                    {user?.coins < item.price ? 'Not enough coins' : 'Purchase'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
