import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import TourModal from '../components/TourModal';
import { useAuth } from '../hooks/useAuth';
import { addToFavorites, removeFromFavorites, getFavorites } from '../services/favoritesService';
import { createBooking } from '../services/bookingService';
import LoginModal from '../components/LoginModal';
import { getSpace } from '../services/spaceService';

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFav, setIsFav] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    type: 'Hot Desk',
    bookingDate: ''
  });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Load space data
  useEffect(() => {
    const loadSpace = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSpace(id);
        setSpace(data);
        setBookingData(prev => ({ ...prev, type: data.type || 'Hot Desk' }));
      } catch (err) {
        console.error('Error loading space:', err);
        setError(err.message || 'Failed to load space');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      loadSpace();
    }
  }, [id]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user || !space) return;
      try {
        const data = await getFavorites();
        const favIds = (data.favorites || []).map(f => f._id || f.space?._id || f.space);
        setIsFav(favIds.includes(space._id || space.id));
      } catch (err) {
        console.error('Error loading favorites:', err);
      }
    };
    loadFavorites();
  }, [user, space]);

  const handleToggleFavorite = async () => {
    if (!user) {
      setLoginModalOpen(true);
      return;
    }

    try {
      const spaceId = space._id || space.id;
      if (isFav) {
        await removeFromFavorites(spaceId);
        setIsFav(false);
      } else {
        await addToFavorites(spaceId);
        setIsFav(true);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      alert('Failed to update favorites. Please try again.');
    }
  };

  const handleBookNow = async () => {
    if (!user) {
      setLoginModalOpen(true);
      return;
    }

    if (!bookingData.bookingDate) {
      setBookingError('Please select a booking date');
      return;
    }

    setIsBooking(true);
    setBookingError(null);

    try {
      const spaceId = space._id || space.id;
      await createBooking({
        spaceId,
        type: bookingData.type,
        bookingDate: bookingData.bookingDate
      });
      setBookingSuccess(true);
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } catch (err) {
      setBookingError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleBookTour = () => {
    if (!user) {
      setLoginModalOpen(true);
      return;
    }
    setTourOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <Navbar />
        <main className="flex-1 w-full px-6 md:px-12 lg:px-16 py-16 text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading space details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !space) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <Navbar />
        <main className="flex-1 w-full px-6 md:px-12 lg:px-16 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Space not found</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{error || 'The workspace you are looking for does not exist.'}</p>
          <Link to="/search" className="mt-6 inline-flex items-center justify-center h-11 px-6 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 transition">Back to search</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const spaceId = space._id || space.id;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/40 via-white to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-900">
          <div className="w-full px-6 md:px-12 lg:px-16 pt-8 pb-6">
            <Link to="/search" className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-700 dark:hover:text-brand-400 mb-6 group">
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to search
            </Link>
          </div>
        </section>

        <section className="w-full px-6 md:px-12 lg:px-16 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-12 rounded-2xl aspect-video bg-gradient-to-br from-brand-100 via-brand-200 to-brand-300 shadow-xl overflow-hidden group cursor-pointer">
                  <div className="w-full h-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                    <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="col-span-4 h-24 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:opacity-80 transition cursor-pointer" />
                <div className="col-span-4 h-24 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:opacity-80 transition cursor-pointer" />
                <div className="col-span-4 h-24 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:opacity-80 transition cursor-pointer" />
              </div>

              <div className="mt-6 flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">{space.name}</h1>
                  <div className="mt-3 flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm">{space.locationText}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{space.rating}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">(24 reviews)</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 ${isFav ? 'border-brand-600 text-brand-700 bg-brand-50 dark:bg-brand-900/20 dark:text-brand-400 shadow-sm' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:border-brand-300 dark:hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-gray-700'}`}
                >
                  {isFav ? (
                    <>
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Saved
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Save
                    </>
                  )}
                </button>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="text-gray-900 dark:text-white font-semibold text-lg">Amenities</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(space.amenities || []).map((a, idx) => (
                      <span key={idx} className="text-xs px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-medium border border-brand-100 dark:border-brand-800">{a}</span>
                    ))}
                  </div>
                </div>
                <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-gray-900 dark:text-white font-semibold text-lg">About</div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">Premium workspace with fast Wi‑Fi, comfortable seating, and meeting facilities. Walkable to transit and cafes. Perfect for teams looking for a professional yet flexible environment.</p>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-24 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-xl">
                <div className="flex items-baseline gap-2 mb-6">
                  <div className="text-3xl font-extrabold text-gray-900 dark:text-white">₹{space.pricePerDay}</div>
                  <span className="text-base font-medium text-gray-500 dark:text-gray-400">/day</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <select
                    value={bookingData.type}
                    onChange={(e) => setBookingData({ ...bookingData, type: e.target.value })}
                    className="h-11 px-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option>Hot Desk</option>
                    <option>Dedicated Desk</option>
                    <option>Private Office</option>
                    <option>Meeting Room</option>
                  </select>
                  <input
                    type="date"
                    value={bookingData.bookingDate}
                    onChange={(e) => setBookingData({ ...bookingData, bookingDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="h-11 px-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                {bookingError && (
                  <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-600 text-sm">
                    {bookingError}
                  </div>
                )}
                {bookingSuccess && (
                  <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-600 text-sm">
                    Booking created! Redirecting...
                  </div>
                )}
                <button
                  onClick={handleBookNow}
                  disabled={isBooking || bookingSuccess}
                  className="mt-4 w-full h-12 rounded-lg bg-gradient-to-r from-brand-600 to-brand-700 text-white font-semibold hover:from-brand-700 hover:to-brand-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBooking ? 'Booking...' : 'Book Now'}
                </button>
                <button
                  onClick={handleBookTour}
                  className="mt-3 w-full h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-semibold hover:border-brand-300 dark:hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Book a tour
                </button>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Secure payment • Auto agreement generated
                  </div>
                  <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Owner Contact</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">{space.ownerUser?.fullName || space.owner?.name || 'WorkNest Ops'}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{space.ownerUser?.phone || space.owner?.phone || 'Contact via WorkNest'}</div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <TourModal
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        spaceId={spaceId}
        spaceName={space.name}
      />
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSwitchToRegister={() => { }}
      />
      <Footer />
    </div>
  );
}
