import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function Stores() {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const role = token ? jwtDecode(token).role : '';

  useEffect(() => {
    fetchStores();
  }, []);

  async function fetchStores() {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/stores', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStores(res.data.stores);
      setFilteredStores(res.data.stores);
      setUserRatings(res.data.userRatings || {});
    } catch (error) {
      alert('Error fetching stores');
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    const text = e.target.value.toLowerCase();
    setSearch(text);

    const filtered = stores.filter(
      (store) =>
        store.name.toLowerCase().includes(text) ||
        store.address.toLowerCase().includes(text)
    );

    setFilteredStores(filtered);
  }

  async function submitRating(storeId, rating) {
    try {
      await axios.post(
        'http://localhost:5000/api/ratings',
        { storeId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Rating submitted!');
      fetchStores();
    } catch (error) {
      alert('Failed to submit rating');
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center' }}>🛒 Browse & Rate Stores</h2>
      <input
        type="text"
        placeholder="Search by name or address..."
        value={search}
        onChange={handleSearch}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}
      />

      {loading ? (
        <p>Loading stores...</p>
      ) : filteredStores.length === 0 ? (
        <p>No matching stores found.</p>
      ) : (
        filteredStores.map((store) => (
          <div
            key={store.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '20px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <h3>{store.name}</h3>
            <p><strong>Address:</strong> {store.address}</p>
            <p><strong>Overall Rating:</strong> {store.averageRating ? store.averageRating.toFixed(1) : 'Not rated yet'}</p>
            <p><strong>Your Rating:</strong> {userRatings[store.id] || 'Not rated'}</p>

            {role === 'user' && (
              <div style={{ marginTop: '10px' }}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => submitRating(store.id, num)}
                    style={{
                      margin: '2px',
                      backgroundColor: userRatings[store.id] === num ? '#4caf50' : '#e0e0e0',
                      color: userRatings[store.id] === num ? 'white' : 'black',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '5px 10px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {num} ★
                  </button>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Stores;
