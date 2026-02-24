import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { getMyBookings, cancelBooking } from '../services/bookingService';
import BookingReviewModal from '../components/BookingReviewModal';
import { submitBookingReview } from '../services/reviewService';
export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [reviewModalBooking, setReviewModalBooking] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const data = await getMyBookings();
        setBookings(data.bookings || []);
      } catch (err) {
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);
  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      setCancellingId(bookingId);
      await cancelBooking(bookingId);
      setBookings(prev => prev.filter(b => b._id !== bookingId));
    } catch (err) {
      alert(err.message || 'Failed to cancel booking');
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
  const canReview = (booking) => {
    const statusAllowed = ['confirmed', 'completed'].includes(booking.status);
    const isPaid = booking.paymentStatus === 'paid';
    return statusAllowed && isPaid && !booking.userRating;
  };
  const renderRatingStars = (rating) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1 text-amber-400">
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index} className={index < rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}>
            ★
          </span>
        ))}
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">{rating}/5</span>
      </div>
    );
  };
  const openReviewModal = (booking) => {
    setReviewModalBooking(booking);
    setReviewForm({
      rating: booking.userRating || 5,
      comment: booking.userReviewComment || ''
    });
    setReviewError(null);
  };
  const handleSubmitReview = async () => {
    if (!reviewModalBooking) return;
    try {
      setSubmittingReview(true);
      setReviewError(null);
      await submitBookingReview({
        bookingId: reviewModalBooking._id,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment == null ? '' : String(reviewForm.comment)
      });
      setBookings(prev => prev.map(b => (
        b._id === reviewModalBooking._id
          ? { ...b, userRating: reviewForm.rating, userReviewComment: reviewForm.comment }
          : b
      )));
      setReviewModalBooking(null);
    } catch (err) {
      const payload = err.payload || {};
      const validationMsg = payload.errors?.[0]?.msg || payload.errors?.[0]?.message;
      const detail = payload.detail || payload.message || err.message;
      setReviewError(validationMsg || detail || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
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
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading bookings...</p>
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
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Booking History</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage your workspace bookings</p>
        </div>
        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-800 px-4 py-3 text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}
        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No bookings yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Start exploring workspaces and make your first booking!</p>
            <Link to="/search" className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 transition">
              Explore Workspaces
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 hover:shadow-md transition">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{booking.spaceName || booking.space?.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{booking.spaceLocation || booking.space?.locationText}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {booking.type}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">₹{booking.totalAmount || booking.pricePerDay}</span>
                    </div>
                  </div>
                    <div className="flex flex-col items-start gap-3 md:items-end">
                      {booking.userRating && (
                        <div className="flex flex-col items-start md:items-end gap-1">
                          {renderRatingStars(booking.userRating)}
                          {booking.userReviewComment && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm text-left md:text-right">
                              “{booking.userReviewComment}”
                            </p>
                          )}
                        </div>
                      )}
                      {canReview(booking) && (
                        <button
                          onClick={() => openReviewModal(booking)}
                          className="px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-500 text-amber-700 dark:text-amber-300 font-medium hover:bg-amber-50 dark:hover:bg-amber-900/20 transition"
                        >
                          Rate experience
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:border-rose-300 dark:hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition disabled:opacity-50"
                      >
                        {cancellingId === booking._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                    <Link
                      to={`/spaces/${booking.space?._id || booking.space}`}
                      className="px-4 py-2 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition"
                    >
                      View Space
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <BookingReviewModal
        booking={reviewModalBooking}
        isOpen={!!reviewModalBooking}
        reviewForm={reviewForm}
        onChange={setReviewForm}
        onSubmit={handleSubmitReview}
        onClose={() => setReviewModalBooking(null)}
        submitting={submittingReview}
        error={reviewError}
      />
      <Footer />
    </div>
  );
}