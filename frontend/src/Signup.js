import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

    function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
       const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  
  function validate() {
    const newErrors = {};
    if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = 'Name must be 20 to 60 characters';
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (formData.address.length > 400) {
      newErrors.address = 'Address is too long';
    }
    if (
      formData.password.length < 8 ||
      formData.password.length > 16 ||
      !/[A-Z]/.test(formData.password) ||
      !/[!@#$%^&*]/.test(formData.password)
    ) {
      newErrors.password = 'Password must be 8–16 chars with uppercase & special char';
    }
    return newErrors;
  }

       function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/signup', formData);
      alert('Signup successful! Please log in.');
      navigate('/');
    } catch (error) {
      alert('Signup failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sign Up</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="name"
          type="text"
          placeholder="Full Name (20–60 chars)"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.name && <p style={styles.error}>{errors.name}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.email && <p style={styles.error}>{errors.email}</p>}

        <input
          name="address"
          type="text"
          placeholder="Address (max 400 chars)"
          value={formData.address}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.address && <p style={styles.error}>{errors.address}</p>}

        <input
          name="password"
          type="password"
          placeholder="Password (8–16 chars, 1 uppercase, 1 special)"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.password && <p style={styles.error}>{errors.password}</p>}

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: 'auto',
    marginTop: '60px',
    padding: '30px',
    backgroundColor: '#fdfdfd',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333'
  },
  form: { display: 'flex', flexDirection: 'column' },
  input: {
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc'
  },
  error: { color: 'red', marginBottom: '10px' },
  button: {
    padding: '10px',
    backgroundColor: '#2196f3',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};

export default Signup;
