import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { User, Mail, Shield } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <div className="layout-with-sidebar">
        <Sidebar />
        <main className="main-content">
          <div className="profile-header animate-fade-in">
            <h1>User Profile</h1>
            <p>Manage your account settings</p>
          </div>

          <div className="profile-content animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="profile-card glass-panel">
              <div className="profile-avatar-large">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span>{user?.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              
              <div className="profile-info">
                <div className="info-group">
                  <User size={20} className="info-icon" />
                  <div>
                    <label>Full Name</label>
                    <p>{user?.name}</p>
                  </div>
                </div>
                
                <div className="info-group">
                  <Mail size={20} className="info-icon" />
                  <div>
                    <label>Email Address</label>
                    <p>{user?.email}</p>
                  </div>
                </div>
                
                <div className="info-group">
                  <Shield size={20} className="info-icon" />
                  <div>
                    <label>Role</label>
                    <p className="role-badge">{user?.role}</p>
                  </div>
                </div>
              </div>
              
              <button className="btn-secondary mt-4">Edit Profile (Coming Soon)</button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Profile;
