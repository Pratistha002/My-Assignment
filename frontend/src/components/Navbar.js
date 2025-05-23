import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let role = '';

  try {
    if (token) {
         const decoded = jwtDecode(token);
      role = decoded.role;
    }
  } catch {
    localStorage.removeItem('token');
    role = '';
  }
  
       const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

    
  
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', background: '#333', color: 'white', padding: '10px' }}>
      <div><strong>Store Rating App</strong></div>
      <div style={{ display: 'flex', gap: '15px' }}>
        {role === 'admin' && <button onClick={() => navigate('/admin')} style={btnStyle}>Admin</button>}
        {role === 'storeOwner' && <button onClick={() => navigate('/owner')} style={btnStyle}>My Store</button>}
        {role === 'user' && <button onClick={() => navigate('/stores')} style={btnStyle}>Stores</button>}
        {token && <button onClick={handleLogout} style={btnStyle}>Logout</button>}
      </div>
    </nav>
  );
}

         
const btnStyle = {
  background: 'none',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px'
};

export default Navbar;
