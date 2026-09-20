import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-brand" onClick={() => navigate('/')}>
        <div className="logo-circle"></div>
        <span>ProjectHub</span>
      </div>
      
      <div className="navbar-menu">
        {user ? (
          <div className="user-profile">
            <div className="avatar">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" />
              ) : (
                <UserIcon size={20} />
              )}
            </div>
            <span className="user-name">{user.name}</span>
            <button className="btn-logout" onClick={logout} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <button className="btn-secondary" onClick={() => navigate('/login')}>Login</button>
            <button className="btn-primary" onClick={() => navigate('/register')}>Register</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
