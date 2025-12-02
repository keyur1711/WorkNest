import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import SpaceCard from '../components/SpaceCard';
import { getFavorites } from '../services/favoritesService';
import { useAuth } from '../hooks/useAuth';

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const data = await getFavorites();
        setFavorites(data.favorites || []);
      } catch (err) {
        console.error('Error loading favorites:', err);
        setError('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  if (loading) {
    return (
      // return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-sky-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading favorites...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/40 via-white to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-900">
          <div className="w-full px-6 md:px-12 lg:px-16 pt-12 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Saved Spaces</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Your favorite workspaces</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-200 dark:border-gray-700 w-fit">
              <svg className="w-4 h-4 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{favorites.length}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">saved workspace{favorites.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </section>

        <section className="w-full px-6 md:px-12 lg:px-16 py-8">
          {error && (
            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-600">
              {error}
            </div>
          )}
          {favorites.length === 0 ? (
            <div className="max-w-md mx-auto py-16 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No saved spaces yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Explore workspaces and click Save on any that catch your eye.</p>
              <Link to="/search" className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 transition">
                Explore Workspaces
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((fav) => {
                // Handle both direct space objects and nested space objects
                const space = fav.space || fav;
                const spaceId = space._id || space.id;
                return (
                  <SpaceCard key={spaceId} space={space} />
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
