import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function AdminRoute({ children }) {
  const { isAuthenticated, user, token } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  // Use user from context immediately after login
  useEffect(() => {
    // If we have a user, use it immediately (from login response)
    if (user) {
      setIsChecking(false);
      return;
    }

    // If authenticated but no user yet, wait a bit for context to update
    if (isAuthenticated && token) {
      const timer = setTimeout(() => {
        setIsChecking(false);
      }, 100);
      return () => clearTimeout(timer);
    }

    // Not authenticated
    setIsChecking(false);
  }, [isAuthenticated, token, user]);

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

  // Use user from context (saved during login)
  const userRole = user?.role;
  
  console.log('AdminRoute Check:', {
    isAuthenticated,
    userRole,
    userRoleType: typeof userRole,
    userRoleValue: JSON.stringify(userRole),
    contextUser: user,
    token: token ? 'exists' : 'missing'
  });
  
  // Check if role is admin (case-insensitive and trim whitespace)
  const normalizedRole = String(userRole || '').toLowerCase().trim();
  
  if (normalizedRole !== 'admin') {
    console.error('❌ Admin access denied!', {
      detectedRole: userRole,
      normalizedRole: normalizedRole,
      expectedRole: 'admin',
      contextUser: JSON.stringify(user),
      contextUserRole: user?.role
    });
    return <Navigate to="/dashboard" replace />;
  }

  console.log('✅ Admin access granted!', {
    role: userRole,
    user: user
  });

  return children;
}

