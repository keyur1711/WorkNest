import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { getMyTourBookings, cancelTourBooking } from '../services/bookingService';
export default function TourHistory() {
  const [tourBookings, setTourBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  useEffect(() => {
    const loadTourBookings = async () => {
      try {
        setLoading(true);
        const data = await getMyTourBookings();
        setTourBookings(data.tourBookings || []);
      } catch (err) {
        setError('Failed to load tour bookings');
      } finally {
        setLoading(false);
      }
    };
    loadTourBookings();
  }, []);
  const handleCancel = async (tourId) => {
    if (!window.confirm('Are you sure you want to cancel this tour?')) return;
    try {
      setCancellingId(tourId);
      await cancelTourBooking(tourId);
      setTourBookings(prev => prev.map(tour =>
        tour._id === tourId ? { ...tour, status: 'cancelled' } : tour
      ));
    } catch (err) {
      alert(err.message || 'Failed to cancel tour');
    } finally {
      setCancellingId(null);
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'cancelled': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };
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
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading tour bookings...</p>
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
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Tour History</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage your workspace tour bookings</p>
        </div>
        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-800 px-4 py-3 text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}
        {tourBookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tour bookings yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Schedule a tour to visit a workspace in person!</p>
            <Link to="/search" className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 transition">
              Explore Workspaces
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tourBookings.map((tour) => (
              <div key={tour._id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 hover:shadow-md transition">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{tour.spaceName || tour.space?.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(tour.status)}`}>
                        {tour.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{tour.spaceLocation || tour.space?.locationText}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(tour.tourDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(tour.tourTime)}
                      </span>
                      {tour.contactName && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {tour.contactName}
                        </span>
                      )}
                    </div>
                    {tour.notes && (
                      <div className="mt-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-semibold">Notes: </span>
                          {tour.notes}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <div className="flex items-center gap-3">
                      {tour.status !== 'cancelled' && tour.status !== 'completed' && (
                        <button
                          onClick={() => handleCancel(tour._id)}
                          disabled={cancellingId === tour._id}
                          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:border-rose-300 dark:hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition disabled:opacity-50"
                        >
                          {cancellingId === tour._id ? 'Cancelling...' : 'Cancel Tour'}
                        </button>
                      )}
                      <Link
                        to={`/spaces/${tour.space?._id || tour.space}`}
                        className="px-4 py-2 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition"
                      >
                        View Space
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}