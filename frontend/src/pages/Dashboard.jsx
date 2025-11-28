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
  const [bookings, setBookings] = useState([]);
  const [tourBookings, setTourBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [bookingsData, toursData, favoritesData] = await Promise.all([
          getMyBookings().catch(() => ({ bookings: [] })),
          getMyTourBookings().catch(() => ({ tourBookings: [] })),
          getFavorites().catch(() => ({ favorites: [] }))
        ]);
        setBookings(bookingsData.bookings || []);
        setTourBookings(toursData.tourBookings || []);
        setFavorites(favoritesData.favorites || []);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-sky-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 py-10">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                Welcome back, {user?.fullName || 'User'}!
              </h1>
              <p className="text-gray-600 mt-2">Here's an overview of your workspace activity</p>
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
          <div className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-gradient-to-br from-sky-50 to-blue-50">
            <div className="text-sm text-gray-600 mb-1">Total Bookings</div>
            <div className="text-3xl font-bold text-gray-900">{bookings.length}</div>
            <Link to="/bookings" className="text-sm text-sky-600 hover:text-sky-700 font-medium mt-2 inline-block">
              View all →
            </Link>
          </div>
          <div className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-gradient-to-br from-emerald-50 to-green-50">
            <div className="text-sm text-gray-600 mb-1">Saved Spaces</div>
            <div className="text-3xl font-bold text-gray-900">{favorites.length}</div>
            <Link to="/favorites" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium mt-2 inline-block">
              View favorites →
            </Link>
          </div>
          <div className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50">
            <div className="text-sm text-gray-600 mb-1">Tour Requests</div>
            <div className="text-3xl font-bold text-gray-900">{tourBookings.length}</div>
            <div className="text-sm text-amber-600 font-medium mt-2">Scheduled tours</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Bookings</h2>
              <Link to="/bookings" className="text-sm text-sky-600 hover:text-sky-700 font-medium">
                View all
              </Link>
            </div>
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No upcoming bookings</p>
                <Link to="/search" className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 transition text-sm">
                  Book a Space
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <div key={booking._id} className="p-4 rounded-lg border border-gray-100 hover:border-sky-200 transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{booking.spaceName || booking.space?.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(booking.bookingDate).toLocaleDateString()} • {booking.type}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">₹{booking.totalAmount || booking.pricePerDay}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                        booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Tours</h2>
            </div>
            {upcomingTours.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No scheduled tours</p>
                <p className="text-sm text-gray-500">Book a tour to visit a workspace</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTours.map((tour) => (
                  <div key={tour._id} className="p-4 rounded-lg border border-gray-100 hover:border-sky-200 transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{tour.spaceName || tour.space?.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(tour.tourDate).toLocaleDateString()} at {tour.tourTime}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{tour.spaceLocation || tour.space?.locationText}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        tour.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                        tour.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
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
            className="p-6 rounded-2xl border-2 border-gray-200 hover:border-brand-300 bg-white shadow-sm hover:shadow-md transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center group-hover:scale-110 transition">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Explore Workspaces</h3>
                <p className="text-sm text-gray-600">Find your perfect workspace</p>
              </div>
            </div>
          </Link>

          <Link
            to="/profile"
            className="p-6 rounded-2xl border-2 border-gray-200 hover:border-sky-300 bg-white shadow-sm hover:shadow-md transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Edit Profile</h3>
                <p className="text-sm text-gray-600">Update your account information</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
