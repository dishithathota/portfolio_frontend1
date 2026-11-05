import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const home = (u) => (u.role === 'admin' ? '/admin' : '/user');

export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={home(user)} replace />;
  return children;
}
