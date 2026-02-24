import { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import SpaceCard from '../components/SpaceCard';
import MapView from '../components/MapView';
import Filters from '../components/Filters';
import searchImage from '../images/infralist-com-kmIKEGO7Vl4-unsplash.jpg';
import { getSpaces, getFilters } from '../services/spaceService';
import { getFavorites } from '../services/favoritesService';
import { useAuth } from '../hooks/useAuth';
function useFavorites() {
  const [fav, setFav] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setFav([]);
        return;
      }
      try {
        const data = await getFavorites();
        const favIds = (data.favorites || []).map(f => f._id || f.space?._id || f.space);
        setFav(favIds);
      } catch (err) {
        console.error('Error loading favorites:', err);
        setFav([]);
      }
    };
    loadFavorites();
  }, [user]);
  const toggle = (id) => setFav((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  return { favorites: fav, toggle };
}
export default function Search() {
  const [filterValues, setFilterValues] = useState({ city: '', type: '', minPrice: '', maxPrice: '' });
  const { favorites, toggle } = useFavorites();
  const [sortBy, setSortBy] = useState('relevance');
  const [showMap, setShowMap] = useState(false);
  const [spaces, setSpaces] = useState([]);
  const [cities, setCities] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [homeCity, setHomeCity] = useState(() => {
    try {
      return localStorage.getItem('wn:homeCity') || '';
    } catch { return ''; }
  });
  useEffect(() => {
    localStorage.setItem('wn:homeCity', homeCity);
  }, [homeCity]);
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const data = await getFilters();
        setCities(data.cities || []);
        setTypes(data.types || []);
      } catch (err) {
        console.error('Error loading filters:', err);
      }
    };
    loadFilters();
  }, []);
  useEffect(() => {
    const loadSpaces = async () => {
      try {
        setLoading(true);
        setError(null);
        const filters = {
          city: filterValues.city || undefined,
          type: filterValues.type || undefined,
          minPrice: filterValues.minPrice || undefined,
          maxPrice: filterValues.maxPrice || undefined,
          limit: 100
        };
        let sort = 'pricePerDay';
        if (sortBy === 'price-asc') sort = 'pricePerDay';
        else if (sortBy === 'price-desc') sort = '-pricePerDay';
        else if (sortBy === 'rating-desc') sort = '-rating';
        filters.sort = sort;
        const response = await getSpaces(filters);
        setSpaces(response.data || []);
      } catch (err) {
        console.error('Error loading spaces:', err);
        setError(err.message || 'Failed to load spaces');
        setSpaces([]);
      } finally {
        setLoading(false);
      }
    };
    loadSpaces();
  }, [filterValues, sortBy]);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1">
        {}
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={searchImage}
              alt="Explore Workspaces"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/70 to-gray-900/60"></div>
          </div>
          <div className="relative z-10 max-w-full mx-auto px-6 md:px-12 lg:px-16 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Explore <span className="text-blue-400">Workspaces</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8">Find the perfect space for your team</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold">{loading ? '...' : spaces.length}</span>
                </div>
                <span className="font-semibold">results found</span>
              </div>
              <select
                className="h-12 px-5 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
              >
                <option value="" className="text-gray-900">Commute from</option>
                {cities.map((c) => (
                  <option key={c} value={c} className="text-gray-900">{c}</option>
                ))}
              </select>
              <select
                className="h-12 px-5 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance" className="text-gray-900">Sort: Relevance</option>
                <option value="price-asc" className="text-gray-900">Price: Low to High</option>
                <option value="price-desc" className="text-gray-900">Price: High to Low</option>
                <option value="rating-desc" className="text-gray-900">Rating: High to Low</option>
              </select>
              <button
                className={`h-12 px-6 rounded-lg font-semibold transition-all ${showMap
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
                  }`}
                onClick={() => setShowMap(!showMap)}
              >
                {showMap ? 'List View' : 'Map View'}
              </button>
            </div>
          </div>
        </section>
        {}
        <section className="py-8">
          <div className="max-w-full mx-auto px-6 md:px-12 lg:px-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
              <Filters cities={cities} types={types} values={filterValues} onChange={setFilterValues} />
            </div>
            {loading ? (
              <div className="col-span-full py-16 text-center">
                <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-gray-600">Loading spaces...</p>
              </div>
            ) : error ? (
              <div className="col-span-full py-16 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error loading spaces</h3>
                <p className="text-gray-600 dark:text-gray-300">{error}</p>
              </div>
            ) : !showMap ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {spaces.length === 0 ? (
                  <div className="col-span-full py-16 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No spaces found</h3>
                    <p className="text-gray-600 dark:text-gray-300">Try adjusting your filters to see more results.</p>
                  </div>
                ) : (
                  spaces.map((s) => {
                    const commuteMins = homeCity ? (s.city === homeCity ? Math.floor(Math.random() * 20) + 15 : Math.floor(Math.random() * 45) + 45) : undefined;
                    return (
                      <SpaceCard
                        key={s._id || s.id}
                        space={s}
                        onToggleFavorite={toggle}
                        isFavorite={favorites.includes(s._id || s.id)}
                        commuteMins={commuteMins}
                      />
                    );
                  })
                )}
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                <MapView spaces={spaces} />
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}