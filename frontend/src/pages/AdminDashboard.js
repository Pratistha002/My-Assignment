import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
    const [userSortField, setUserSortField] = useState('name');
  const [userSortAsc, setUserSortAsc] = useState(true);
  const [storeSortField, setStoreSortField] = useState('name');
   const [storeSortAsc, setStoreSortAsc] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [statsRes, usersRes, storesRes] = await Promise.all([
           axios.get('http://localhost:5000/api/admin/stats', config),
        axios.get('http://localhost:5000/api/admin/users', config),
          axios.get('http://localhost:5000/api/admin/stores', config)
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setStores(storesRes.data);
    } catch (err) {
      alert('Failed to load dashboard data');
    }
  }

  const sortByField = (list, field, asc) => {
    return [...list].sort((a, b) => {
      if (field === 'averageRating') {
         return asc ? (a[field] || 0) - (b[field] || 0) : (b[field] || 0) - (a[field] || 0);
      }
      return asc
        ? String(a[field] || '').localeCompare(b[field] || '')
        : String(b[field] || '').localeCompare(a[field] || '');
    });
  };

  const toggleUserSort = (field) => {
    if (userSortField === field) {
      setUserSortAsc(!userSortAsc);
    } else {
      setUserSortField(field);
      setUserSortAsc(true);
    }
  };

  const toggleStoreSort = (field) => {
     if (storeSortField === field) {
      setStoreSortAsc(!storeSortAsc);
    } else {
      setStoreSortField(field);
      setStoreSortAsc(true);
    }
  };

  const sortedUsers = sortByField(users, userSortField, userSortAsc);
  const sortedStores = sortByField(stores, storeSortField, storeSortAsc);

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
      <h2> Admin Dashboard</h2>
      <p>Total Users: <strong>{stats.totalUsers}</strong></p>
      <p>Total Stores: <strong>{stats.totalStores}</strong></p>
      <p>Total Ratings: <strong>{stats.totalRatings}</strong></p>

      <hr />

      <h3> Users</h3>
      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th onClick={() => toggleUserSort('name')}>Name</th>
            <th onClick={() => toggleUserSort('email')}>Email</th>
            <th onClick={() => toggleUserSort('role')}>Role</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h3> Stores</h3>
      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th onClick={() => toggleStoreSort('name')}>Name</th>
            <th onClick={() => toggleStoreSort('email')}>Email</th>
            <th onClick={() => toggleStoreSort('averageRating')}>Avg Rating</th>
          </tr>
        </thead>
        <tbody>
          {sortedStores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.averageRating ? s.averageRating.toFixed(1) : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
