import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, FolderKanban, FileText, Users, Mail, LogOut, User, History, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const NAV = {
  admin: [['/admin', 'Overview', LayoutDashboard, true], ['/admin/projects', 'Projects', FolderKanban], ['/admin/posts', 'Blog Posts', FileText], ['/admin/users', 'Users', Users], ['/admin/messages', 'Messages', Mail]],
  user: [['/user', 'Dashboard', LayoutDashboard, true], ['/user/projects', 'Projects', FolderKanban], ['/user/blog', 'Blog', FileText], ['/user/contact', 'Contact', Mail], ['/user/profile', 'Profile', User], ['/user/activity', 'Activity', History]],
};

export default function Shell({ role }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  return (
    <div className="shell" data-role={role}>
      <aside className={open ? 'side open' : 'side'}>
        <Link to="/" className="brand">◆ FolioHub</Link>
        <span className="badge">{role === 'admin' ? 'Admin Console' : 'User Space'}</span>
        <nav>
          {NAV[role].map(([to, label, Icon, end]) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}><Icon size={18} />{label}</NavLink>
          ))}
        </nav>
        <button className="navbtn" onClick={() => { logout(); nav('/login'); }}><LogOut size={18} />Logout</button>
      </aside>
      <div className="main">
        <header className="top">
          <button className="icon menu" onClick={() => setOpen(!open)} aria-label="Menu"><Menu size={20} /></button>
          <span className="spacer" />
          <div className="me"><b>{user.name}</b><small>{role}</small></div>
          <div className="avatar">{user.name[0]?.toUpperCase()}</div>
        </header>
        <main className="content"><Outlet /></main>
      </div>
    </div>
  );
}
