import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

export default function WorkspaceOwnerRoute({ children }) {
  const { isAuthenticated, user, token, refreshUser } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState(user);

  // Refresh user data from backend to ensure we have latest role
  useEffect(() => {
    const checkUserRole = async () => {
      if (isAuthenticated && token) {
        try {
          // Try using refreshUser from context first
          if (refreshUser) {
            const refreshedUser = await refreshUser();
            setCurrentUser(refreshedUser);
          } else {
            // Fallback to direct API call
            const response = await authService.getUserProfile();
            setCurrentUser(response.user);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // If fetch fails, use the user from context
          setCurrentUser(user);
        }
      }
      setIsChecking(false);
    };

    checkUserRole();
  }, [isAuthenticated, token, user, refreshUser]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-sky-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Use currentUser (from backend) or fallback to user (from context)
  const userRole = currentUser?.role || user?.role;
  
  // Check if role is workspace_owner (case-insensitive and trim whitespace)
  const normalizedRole = String(userRole || '').toLowerCase().trim();
  
  if (normalizedRole !== 'workspace_owner') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

