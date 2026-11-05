import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import Shell from './layouts/Shell.jsx';
import Home from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';
import AdminOverview from './pages/admin/AdminOverview.jsx';
import AdminItems from './pages/admin/AdminItems.jsx';
import ProjectModules from './pages/admin/ProjectModules.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminMessages from './pages/admin/AdminMessages.jsx';
import UserHome from './pages/user/UserHome.jsx';
import Items from './pages/user/Items.jsx';
import Detail from './pages/user/Detail.jsx';
import Profile from './pages/user/Profile.jsx';
import Activity from './pages/user/Activity.jsx';
import UserContact from './pages/user/UserContact.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/signup" element={<Auth mode="signup" />} />
      <Route path="/admin" element={<ProtectedRoute role="admin"><Shell role="admin" /></ProtectedRoute>}>
        <Route index element={<AdminOverview />} />
        <Route path="projects" element={<AdminItems type="projects" />} />
        <Route path="projects/:id" element={<ProjectModules />} />
        <Route path="posts" element={<AdminItems type="posts" />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="messages" element={<AdminMessages />} />
      </Route>
      <Route path="/user" element={<ProtectedRoute role="user"><Shell role="user" /></ProtectedRoute>}>
        <Route index element={<UserHome />} />
        <Route path="projects" element={<Items type="projects" />} />
        <Route path="projects/:id" element={<Detail type="projects" />} />
        <Route path="blog" element={<Items type="posts" />} />
        <Route path="blog/:id" element={<Detail type="posts" />} />
        <Route path="contact" element={<UserContact />} />
        <Route path="profile" element={<Profile />} />
        <Route path="activity" element={<Activity />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
