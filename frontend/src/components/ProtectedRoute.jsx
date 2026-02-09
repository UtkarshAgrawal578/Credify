// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, type = 'student' }) {
  const token = localStorage.getItem(`${type}Token`);
  
  if (!token) {
    return <Navigate to={`/${type}/login`} replace />;
  }
  
  return children;
}