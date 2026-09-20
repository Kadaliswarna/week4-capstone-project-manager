import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, ShieldCheck, User } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/projects" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FolderKanban size={20} />
          <span>Projects</span>
        </NavLink>
        
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <User size={20} />
          <span>Profile</span>
        </NavLink>
        
        {user.role === 'admin' && (
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <ShieldCheck size={20} />
            <span>Admin Panel</span>
          </NavLink>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
