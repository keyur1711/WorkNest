import { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { useAuth } from '../hooks/useAuth';
import {
  getStats,
  getUsers,
  getAdminSpaces,
  getAdminBookings,
  getAdminTourBookings,
  updateUser,
  deleteUser,
  deleteSpace,
  updateBookingStatus,
  updateTourBookingStatus
} from '../services/adminService';

export default function AdminDashboard() {
  const { user, isAuthenticated, token } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tourBookings, setTourBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Wait for auth to be ready before loading data
  useEffect(() => {
    const checkAndLoad = () => {
      // Verify token exists in localStorage
      const stored = localStorage.getItem('wn:auth');
      if (!stored) {
        console.warn('No auth data in localStorage');
        setLoading(false);
        return;
      }

      if (isAuthenticated && token && user) {
        console.log('Auth ready, loading stats...', {
          isAuthenticated,
          hasToken: !!token,
          hasUser: !!user,
          userRole: user?.role
        });
        // Small delay to ensure token is fully ready
        const timer = setTimeout(() => {
          loadStats();
        }, 500); // Increased delay to ensure everything is ready
        return () => clearTimeout(timer);
      } else {
        console.log('Auth not ready yet', {
          isAuthenticated,
          hasToken: !!token,
          hasUser: !!user
        });
        // Wait a bit and check again
        const timer = setTimeout(() => {
          checkAndLoad();
        }, 200);
        return () => clearTimeout(timer);
      }
    };

    checkAndLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token, user]);

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'spaces') loadSpaces();
    if (activeTab === 'bookings') loadBookings();
    if (activeTab === 'tours') loadTourBookings();
  }, [activeTab]);

  const loadStats = async () => {
    // Don't make API call if not authenticated
    if (!isAuthenticated || !token) {
      console.warn('Cannot load stats - not authenticated', {
        isAuthenticated,
        hasToken: !!token
      });
      setLoading(false);
      return;
    }

    // Double-check token exists in localStorage
    const stored = localStorage.getItem('wn:auth');
    if (!stored) {
      console.error('Token not found in localStorage');
      setError('Authentication token not found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Loading admin stats...');
      const data = await getStats();
      console.log('Stats loaded successfully:', data);
      setStats(data.stats);
    } catch (err) {
      console.error('Error loading stats:', err);
      console.error('Error details:', {
        status: err.status,
        message: err.message,
        payload: err.payload
      });

      if (err.status === 401) {
        // Check if token still exists - if it does, might be a backend issue
        const stored = localStorage.getItem('wn:auth');
        if (stored) {
          setError('Authentication failed. Please try refreshing the page or log in again.');
          console.error('401 error but token exists in storage - possible backend issue');
        } else {
          setError('Your session has expired. Please log in again.');
        }
      } else {
        setError(err.message || 'Failed to load statistics');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getUsers();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error loading users:', err);
      if (err.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError(err.message || 'Failed to load users');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadSpaces = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getAdminSpaces();
      setSpaces(data.spaces || []);
    } catch (err) {
      console.error('Error loading spaces:', err);
      if (err.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError(err.message || 'Failed to load spaces');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getAdminBookings();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Error loading bookings:', err);
      if (err.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError(err.message || 'Failed to load bookings');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadTourBookings = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getAdminTourBookings();
      setTourBookings(data.tourBookings || []);
    } catch (err) {
      console.error('Error loading tour bookings:', err);
      if (err.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError(err.message || 'Failed to load tour bookings');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await updateUser(userId, { role: newRole });
      await loadUsers();
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(userId);
      await loadUsers();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const handleDeleteSpace = async (spaceId) => {
    if (!window.confirm('Are you sure you want to delete this space?')) return;
    try {
      await deleteSpace(spaceId);
      await loadSpaces();
    } catch (err) {
      alert(err.message || 'Failed to delete space');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      await loadBookings();
    } catch (err) {
      alert(err.message || 'Failed to update booking status');
    }
  };

  const handleUpdateTourStatus = async (tourId, status) => {
    try {
      await updateTourBookingStatus(tourId, status);
      await loadTourBookings();
    } catch (err) {
      alert(err.message || 'Failed to update tour status');
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage users, spaces, bookings, and platform statistics</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
              </div>
              {error.includes('session has expired') && (
                <a
                  href="/login"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Go to Login
                </a>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'stats', label: 'Statistics' },
                { key: 'users', label: 'Users' },
                { key: 'spaces', label: 'Spaces' },
                { key: 'bookings', label: 'Bookings' },
                { key: 'tours', label: 'Tour Bookings' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${activeTab === tab.key
                    ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.totalUsers}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Users</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">Owners: {stats.workspaceOwners}</div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.totalSpaces}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Spaces</div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.totalBookings}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Bookings</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">Active: {stats.activeBookings} | Pending: {stats.pendingBookings}</div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">₹{stats.totalRevenue?.toLocaleString() || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Revenue</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">Recent (7d): {stats.recentBookings}</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No statistics available. Please try refreshing the page.</p>
            </div>
          )
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{u.fullName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 dark:text-gray-300">{u.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                            className="text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                          >
                            <option value="user">User</option>
                            <option value="workspace_owner">Workspace Owner</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            disabled={u._id === user?._id}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Spaces Tab */}
        {activeTab === 'spaces' && (
          <div className="space-y-4">
            {spaces.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <p className="text-gray-500">No spaces found</p>
              </div>
            ) : (
              spaces.map((space) => (
                <div key={space._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{space.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{space.city} • {space.type}</p>
                      <p className="text-base font-semibold text-gray-900">₹{space.pricePerDay}/day</p>
                    </div>
                    <button
                      onClick={() => handleDeleteSpace(space._id)}
                      className="ml-4 px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-800 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <p className="text-gray-500">No bookings found</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <div key={booking._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{booking.spaceName}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        User: {booking.user?.fullName || booking.user?.email} • {new Date(booking.bookingDate).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-4">
                        <p className="text-base font-semibold text-gray-900">₹{booking.totalAmount}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                          }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                    <select
                      value={booking.status}
                      onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
                      className="ml-4 text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tour Bookings Tab */}
        {activeTab === 'tours' && (
          <div className="space-y-4">
            {tourBookings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <p className="text-gray-500">No tour bookings found</p>
              </div>
            ) : (
              tourBookings.map((tour) => (
                <div key={tour._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{tour.spaceName}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {tour.contactName} ({tour.contactEmail}) • {new Date(tour.tourDate).toLocaleDateString()} at {tour.tourTime}
                      </p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${tour.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        tour.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          tour.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                        {tour.status}
                      </span>
                    </div>
                    <select
                      value={tour.status}
                      onChange={(e) => handleUpdateTourStatus(tour._id, e.target.value)}
                      className="ml-4 text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
