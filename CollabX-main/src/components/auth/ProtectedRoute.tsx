import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { currentUser, isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const isRoleAllowed = allowedRoles.includes(currentUser.role);

  if (!isRoleAllowed) {
    // Redirect unauthorized user to their default portal dashboard
    const defaultRoute = 
      currentUser.role === 'citizen' ? '/citizen' :
      currentUser.role === 'student' || currentUser.role === 'professor' ? '/university' :
      currentUser.role === 'industry' ? '/industry' :
      currentUser.role === 'government' ? '/government' :
      currentUser.role === 'expert' ? '/expert' : '/login';

    return <Navigate to={defaultRoute} replace />;
  }

  return <>{children}</>;
};
