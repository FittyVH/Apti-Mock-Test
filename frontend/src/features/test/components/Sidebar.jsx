import React from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';
import { LayoutDashboard, Bookmark, History, User, LogOut } from 'lucide-react';

const Sidebar = () => {
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();

    const onLogout = async () => {
        await handleLogout();
        navigate('/landing');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">A</div>
                <h3>[ Brand Name ]</h3>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/saved-questions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Bookmark size={20} />
                    <span>Saved Questions</span>
                </NavLink>

                <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <History size={20} />
                    <span>Test History</span>
                </NavLink>

                <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <User size={20} />
                    <span>Profile</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-details">
                        <div className="user-name">{user?.username || 'User'}</div>
                        <div className="user-email">{user?.email || ''}</div>
                    </div>
                </div>

                <button onClick={onLogout} className="logout-btn">
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
