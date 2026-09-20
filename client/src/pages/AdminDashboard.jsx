import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Users, FolderKanban, Activity } from 'lucide-react';
import api from '../api/axios';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="layout-with-sidebar">
        <Sidebar />
        <main className="main-content">
          <div className="projects-header animate-fade-in">
            <div>
              <h1>Admin Dashboard</h1>
              <p>System overview and user management</p>
            </div>
          </div>

          <div className="stats-grid animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="stat-card glass-panel">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>
                <Users size={24} />
              </div>
              <div className="stat-details">
                <h3>Total Users</h3>
                <p className="stat-value">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="dashboard-recent animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2>System Users</h2>
            {loading ? (
              <p>Loading users...</p>
            ) : (
              <div className="glass-panel" style={{ padding: '1rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '1rem' }}>Name</th>
                      <th style={{ padding: '1rem' }}>Email</th>
                      <th style={{ padding: '1rem' }}>Role</th>
                      <th style={{ padding: '1rem' }}>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '1rem' }}>{u.name}</td>
                        <td style={{ padding: '1rem' }}>{u.email}</td>
                        <td style={{ padding: '1rem' }}>
                          <span className="role-badge">{u.role}</span>
                        </td>
                        <td style={{ padding: '1rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
