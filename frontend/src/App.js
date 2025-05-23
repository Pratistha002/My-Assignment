import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Stores from './Stores';
import AdminDashboard from './pages/AdminDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import Navbar from './components/Navbar';
import UpdatePassword from './UpdatePassword';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      {token && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Role-based dashboards */}
        <Route path="/admin" element={token ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/stores" element={token ? <Stores /> : <Navigate to="/" />} />
        <Route path="/owner" element={token ? <StoreOwnerDashboard /> : <Navigate to="/" />} />

        {/* Password update */}
        <Route path="/update-password" element={token ? <UpdatePassword /> : <Navigate to="/" />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
