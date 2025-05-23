import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 
import { jwtDecode } from 'jwt-decode';

function Login() {
      const [formData, setFormData] = useState({ email: '', password: '' });
   const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', formData);
      const token = res.data.token;
      localStorage.setItem('token', token);
      const role = jwtDecode(token).role;

      if (role === 'admin') navigate('/admin');
      else if (role === 'storeOwner') navigate('/owner');
      else navigate('/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>

     
      <p style={styles.linkText}>
           Don't have an account?{' '}
        <Link to="/signup" style={styles.link}>Sign up here</Link>
      </p>
        </div>
  );
}





const styles = {
  container: {
    maxWidth: '350px',
    margin: 'auto',
    padding: '30px',
    backgroundColor: '#f2f2f2',
    borderRadius: '12px',
    marginTop: '80px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  title: { textAlign: 'center', marginBottom: '20px', color: '#333' },
  error: { color: 'red', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column' },
  input: {
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '6px'
  },
  button: {
    padding: '10px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  linkText: {
    textAlign: 'center',
    marginTop: '15px',
    color: '#333'
  },
  link: {
    color: '#2196f3',
    textDecoration: 'none',
    fontWeight: 'bold'
  }
};

export default Login;
