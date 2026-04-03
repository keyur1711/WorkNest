import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { useAuth } from '../hooks/useAuth';
import { getMyBookings } from '../services/bookingService';
import { getMyTourBookings } from '../services/bookingService';
import { getFavorites } from '../services/favoritesService';
export default function Dashboard() {
  const { user } = useAuth();
  const isUserPro =
    user?.subscriptionStatus === 'active' &&
    user?.subscriptionPlan === 'user_pro' &&
    user?.subscriptionForRole === 'user';
  const [bookings, setBookings] = useState([]);
  const [tourBookings, setTourBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const [bookingsData, toursData, favoritesData] = await Promise.all([
          getMyBookings().catch((err) => {
            console.error('Error loading bookings:', err);
            return { bookings: [] };
          }),
          getMyTourBookings().catch((err) => {
            console.error('Error loading tour bookings:', err);
            return { tourBookings: [] };
          }),
          getFavorites().catch((err) => {
            console.error('Error loading favorites:', err);
            return { favorites: [] };
          })
        ]);
        setBookings(bookingsData.bookings || []);
        setTourBookings(toursData.tourBookings || []);
        setFavorites(favoritesData.favorites || []);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);
  const upcomingBookings = bookings.filter(b =>
    b.status !== 'cancelled' &&
    new Date(b.bookingDate) >= new Date()
  ).slice(0, 3);
  const upcomingTours = tourBookings.filter(t =>
    t.status !== 'cancelled' &&
    new Date(t.tourDate) >= new Date()
  ).slice(0, 2);
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-sky-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 py-10">
        <div className="mb-8">
          {error && (
            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-800 px-4 py-3 text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Welcome back, {user?.fullName || 'User'}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Here's an overview of your workspace activity</p>
            </div>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-indigo-700 transition shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Admin Panel
              </Link>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20">
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Total Bookings</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{bookings.length}</div>
            <Link to="/bookings" className="text-sm text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 font-medium mt-2 inline-block">
              View all →
            </Link>
          </div>
          <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20">
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Saved Spaces</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{favorites.length}</div>
            <Link to="/favorites" className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium mt-2 inline-block">
              View favorites →
            </Link>
          </div>
          <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Tour Requests</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{tourBookings.length}</div>
            <Link to="/tours" className="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium mt-2 inline-block">
              View all tours →
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  AI Workspace Assistant
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-xl">
                  {isUserPro
                    ? 'Chat to get smart workspace recommendations and filters.'
                    : 'Upgrade to User Pro to unlock AI suggestions for your bookings.'}
                </p>
                {!isUserPro && (
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/70 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100 text-xs font-semibold">
                    <span className="inline-block w-2 h-2 rounded-full bg-indigo-600" />
                    Pro locked
                  </div>
                )}
              </div>

              <div className="flex gap-3 flex-col sm:flex-row">
                <Link
                  to="/ai-assistant"
                  className={`inline-flex items-center justify-center h-11 px-6 rounded-xl font-bold transition shadow
                    ${isUserPro
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700'
                      : 'bg-slate-100 dark:bg-gray-900/40 text-gray-900 dark:text-white border border-slate-200 dark:border-gray-700 hover:bg-slate-200 dark:hover:bg-gray-900/60'
                    }`}
                >
                  {isUserPro ? 'Open assistant' : 'Unlock Pro'}
                </Link>
                {!isUserPro && (
                  <Link
                    to="/pricing"
                    className="inline-flex items-center justify-center h-11 px-6 rounded-xl border border-slate-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white font-semibold hover:bg-white dark:hover:bg-gray-800 transition"
                  >
                    View pricing
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Bookings</h2>
              <Link to="/bookings" className="text-sm text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 font-medium">
                View all
              </Link>
            </div>
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">No upcoming bookings</p>
                <Link to="/search" className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 transition text-sm">
                  Book a Space
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <div key={booking._id} className="p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-sky-200 dark:hover:border-sky-500 transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{booking.spaceName || booking.space?.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {new Date(booking.bookingDate).toLocaleDateString()} • {booking.type}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">₹{booking.totalAmount || booking.pricePerDay}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        booking.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Tours</h2>
              <Link to="/tours" className="text-sm text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 font-medium">
                View all
              </Link>
            </div>
            {upcomingTours.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">No scheduled tours</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Book a tour to visit a workspace</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTours.map((tour) => (
                  <div key={tour._id} className="p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-sky-200 dark:hover:border-sky-500 transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{tour.spaceName || tour.space?.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {new Date(tour.tourDate).toLocaleDateString()} at {tour.tourTime}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{tour.spaceLocation || tour.space?.locationText}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${tour.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        tour.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                        {tour.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/search"
            className="p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-500 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center group-hover:scale-110 transition">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Explore Workspaces</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Find your perfect workspace</p>
              </div>
            </div>
          </Link>
          <Link
            to="/profile"
            className="p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-500 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Edit Profile</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Update your account information</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}