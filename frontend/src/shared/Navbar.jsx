import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const userInitials = useMemo(() => {
    if (!user?.fullName) return 'WN';
    const parts = user.fullName.split(' ').filter(Boolean);
    if (parts.length === 0) return 'WN';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [user]);

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">WorkNest</div>
              <div className="text-xs text-gray-500 -mt-1">Premium Workspaces</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/search" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Explore
            </Link>
            <Link to="/pricing" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Pricing
            </Link>
            <Link to="/about" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              About
            </Link>
            <Link to="/contact" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/favorites" 
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Favorites
                </Link>
                
                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-semibold text-sm">
                      {userInitials}
                    </div>
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isUserDropdownOpen && (
                    <>
                      <div 
                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
                        onMouseLeave={() => setIsUserDropdownOpen(false)}
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="font-semibold text-gray-900">{user?.fullName || 'User'}</div>
                          <div className="text-sm text-gray-500 truncate">{user?.email}</div>
                        </div>
                        <div className="py-2">
                          <Link
                            to="/dashboard"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Dashboard
                          </Link>
                          <Link
                            to="/bookings"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Bookings
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile
                          </Link>
                          {user?.role === 'admin' && (
                            <Link
                              to="/admin"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              Admin Panel
                            </Link>
                          )}
                          {user?.role === 'workspace_owner' && (
                            <Link
                              to="/workspace-owner"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              Owner Dashboard
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                          </button>
                        </div>
                      </div>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserDropdownOpen(false)}
                      />
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col gap-2">
              <Link to="/search" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Explore</Link>
              <Link to="/pricing" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Pricing</Link>
              <Link to="/about" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">About</Link>
              <Link to="/contact" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Contact</Link>
              {isAuthenticated && (
                <>
                  <Link to="/favorites" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Favorites</Link>
                  <Link to="/dashboard" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Dashboard</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
