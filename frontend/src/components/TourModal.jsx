import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createTourBooking } from '../services/bookingService';
import { useAuth } from '../hooks/useAuth';
export default function TourModal({ open, onClose, spaceId, spaceName }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    tourDate: '',
    tourTime: '',
    contactName: user?.fullName || '',
    contactEmail: user?.email || '',
    contactPhone: user?.phone || '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  if (!open) return null;
  if (!spaceId) {
    return (
      <div className="fixed inset-0 z-[100]">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative z-[101] flex min-h-full items-center justify-center p-4">
          <div
            className="relative w-full max-w-md transform overflow-hidden rounded-3xl border-2 border-slate-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl transition p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-gray-700 transition hover:bg-slate-200 dark:hover:bg-gray-600"
            >
              <svg className="h-6 w-6 text-slate-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select a Workspace</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Please browse our workspaces and select one to schedule a tour.
              </p>
              <Link
                to="/search"
                onClick={onClose}
                className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 text-white font-bold hover:from-sky-600 hover:via-blue-600 hover:to-indigo-700 transition"
              >
                Browse Workspaces
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to book a tour');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await createTourBooking({
        spaceId,
        tourDate: formData.tourDate,
        tourTime: formData.tourTime,
        contactName: formData.contactName.trim(),
        contactEmail: formData.contactEmail.trim(),
        contactPhone: formData.contactPhone.trim(),
        notes: formData.notes?.trim() || ''
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          tourDate: '',
          tourTime: '',
          contactName: user?.fullName || '',
          contactEmail: user?.email || '',
          contactPhone: user?.phone || '',
          notes: ''
        });
      }, 2000);
    } catch (err) {
      console.error('Tour booking error:', err);
      let errorMessage = 'Failed to book tour. Please try again.';
      if (err.message) {
        errorMessage = err.message;
      } else if (err.payload?.message) {
        errorMessage = err.payload.message;
      } else if (err.payload?.errors && Array.isArray(err.payload.errors)) {
        errorMessage = err.payload.errors.map(e => e.msg || e.message || e).join(', ');
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative z-[101] flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-md transform overflow-hidden rounded-3xl border-2 border-slate-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl transition"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-gray-700 transition hover:bg-slate-200 dark:hover:bg-gray-600"
          >
            <svg className="h-6 w-6 text-slate-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="p-8">
            <div className="mb-6">
              <div className="text-2xl font-black text-indigo-950 dark:text-white">Book a Tour</div>
              <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
                {spaceName && `Tour for ${spaceName}`}
              </p>
            </div>
            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tour Requested!</h3>
                <p className="text-gray-600 dark:text-gray-300">We'll confirm your visit shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-600 text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Tour Date</label>
                  <input
                    type="date"
                    name="tourDate"
                    value={formData.tourDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full h-11 px-3 rounded-lg border-2 border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Tour Time</label>
                  <select
                    name="tourTime"
                    value={formData.tourTime}
                    onChange={handleChange}
                    required
                    className="w-full h-11 px-3 rounded-lg border-2 border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-sky-400"
                  >
                    <option value="" className="dark:bg-gray-700">Select time</option>
                    <option value="09:00" className="dark:bg-gray-700">9:00 AM</option>
                    <option value="10:00" className="dark:bg-gray-700">10:00 AM</option>
                    <option value="11:00" className="dark:bg-gray-700">11:00 AM</option>
                    <option value="12:00" className="dark:bg-gray-700">12:00 PM</option>
                    <option value="13:00" className="dark:bg-gray-700">1:00 PM</option>
                    <option value="14:00" className="dark:bg-gray-700">2:00 PM</option>
                    <option value="15:00" className="dark:bg-gray-700">3:00 PM</option>
                    <option value="16:00" className="dark:bg-gray-700">4:00 PM</option>
                    <option value="17:00" className="dark:bg-gray-700">5:00 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full h-11 px-3 rounded-lg border-2 border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    className="w-full h-11 px-3 rounded-lg border-2 border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    required
                    placeholder="+1 234 567 8900"
                    className="w-full h-11 px-3 rounded-lg border-2 border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Any special requirements..."
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-lg bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 text-white font-bold hover:from-sky-600 hover:via-blue-600 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Requesting...' : 'Request Tour'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}