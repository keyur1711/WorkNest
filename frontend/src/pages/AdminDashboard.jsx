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
  useEffect(() => {
    const checkAndLoad = () => {
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
        const timer = setTimeout(() => {
          loadStats();
        }, 500);
        return () => clearTimeout(timer);
      } else {
        console.log('Auth not ready yet', {
          isAuthenticated,
          hasToken: !!token,
          hasUser: !!user
        });
        const timer = setTimeout(() => {
          checkAndLoad();
        }, 200);
        return () => clearTimeout(timer);
      }
    };
    checkAndLoad();
  }, [isAuthenticated, token, user]);
  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'spaces') loadSpaces();
    if (activeTab === 'bookings') loadBookings();
    if (activeTab === 'tours') loadTourBookings();
  }, [activeTab]);
  const loadStats = async () => {
    if (!isAuthenticated || !token) {
      console.warn('Cannot load stats - not authenticated', {
        isAuthenticated,
        hasToken: !!token
      });
      setLoading(false);
      return;
    }
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
        {}
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
        {}
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
        {}
        {activeTab === 'stats' && (
          stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {}
              <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl shadow-lg border border-blue-200/50 dark:border-blue-700/50 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 dark:bg-blue-700/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  </div>
                  <div className="text-4xl font-extrabold text-blue-900 dark:text-blue-100 mb-2">{stats.totalUsers}</div>
                  <div className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">Total Users</div>
                  <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="font-medium">Owners: {stats.workspaceOwners}</span>
                  </div>
                </div>
              </div>
              {}
              <div className="group relative bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 rounded-2xl shadow-lg border border-green-200/50 dark:border-green-700/50 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 dark:bg-green-700/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  </div>
                  <div className="text-4xl font-extrabold text-green-900 dark:text-green-100 mb-2">{stats.totalSpaces}</div>
                  <div className="text-sm font-semibold text-green-700 dark:text-green-300">Total Spaces</div>
                </div>
              </div>
              {}
              <div className="group relative bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-800/20 rounded-2xl shadow-lg border border-amber-200/50 dark:border-amber-700/50 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 dark:bg-amber-700/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                  </div>
                  <div className="text-4xl font-extrabold text-amber-900 dark:text-amber-100 mb-2">{stats.totalBookings}</div>
                  <div className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2">Total Bookings</div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Active: {stats.activeBookings}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Pending: {stats.pendingBookings}</span>
                    </div>
                  </div>
                </div>
              </div>
              {}
              <div className="group relative bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-800/20 rounded-2xl shadow-lg border border-purple-200/50 dark:border-purple-700/50 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/20 dark:bg-purple-700/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                  </div>
                  <div className="text-4xl font-extrabold text-purple-900 dark:text-purple-100 mb-2">₹{stats.totalRevenue?.toLocaleString('en-IN') || 0}</div>
                  <div className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">Total Revenue</div>
                  <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="font-medium">Recent (7d): {stats.recentBookings} bookings</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No statistics available. Please try refreshing the page.</p>
            </div>
          )
        )}
        {}
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
        {}
        {activeTab === 'spaces' && (
          <div className="space-y-4">
            {spaces.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">No spaces found</p>
              </div>
            ) : (
              spaces.map((space) => (
                <div key={space._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{space.name}</h3>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-4 flex-wrap">
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{space.city || 'Location not specified'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span className="capitalize">{space.type || 'N/A'}</span>
                              </div>
                            </div>
                            {space.locationText && (
                              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{space.locationText}</span>
                              </div>
                            )}
                            {space.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{space.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{space.pricePerDay}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">per day</span>
                        </div>
                        {space.capacity && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span>Capacity: {space.capacity} people</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 md:ml-6">
                    <button
                      onClick={() => handleDeleteSpace(space._id)}
                        className="min-w-[120px] px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:text-white border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors shadow-sm"
                    >
                        Delete Space
                    </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">No bookings found</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <div key={booking._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{booking.spaceName}</h3>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span>{booking.user?.fullName || booking.user?.email || 'Unknown User'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{new Date(booking.bookingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            {booking.space?.city && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{booking.space.city}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{booking.totalAmount}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Total Amount</span>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          booking.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                              booking.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 md:ml-6">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Update Status</label>
                    <select
                      value={booking.status}
                      onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
                        className="min-w-[160px] text-sm px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent shadow-sm font-medium"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {}
        {activeTab === 'tours' && (
          <div className="space-y-4">
            {tourBookings.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">No tour bookings found</p>
              </div>
            ) : (
              tourBookings.map((tour) => (
                <div key={tour._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tour.spaceName}</h3>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="font-medium">{tour.contactName || 'Unknown'}</span>
                              <span className="text-gray-400">({tour.contactEmail || 'No email'})</span>
                            </div>
                            {tour.contactPhone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>{tour.contactPhone}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{new Date(tour.tourDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{tour.tourTime || 'Time not specified'}</span>
                            </div>
                            {tour.space?.city && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{tour.space.city}</span>
                              </div>
                            )}
                            {tour.notes && (
                              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Notes:</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{tour.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${tour.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          tour.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            tour.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                              tour.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                      </span>
                    </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 md:ml-6">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Update Status</label>
                    <select
                      value={tour.status}
                      onChange={(e) => handleUpdateTourStatus(tour._id, e.target.value)}
                        className="min-w-[160px] text-sm px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent shadow-sm font-medium"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                    </div>
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