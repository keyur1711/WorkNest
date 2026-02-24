import { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { getSpaces, getFilters } from '../services/spaceService';
export default function Locations() {
  const [cityToCount, setCityToCount] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [filtersData, spacesData] = await Promise.all([
          getFilters().catch(() => ({ cities: [] })),
          getSpaces({ limit: 1000 }).catch(() => ({ data: [] }))
        ]);
        const cities = filtersData.cities || [];
        const spaces = spacesData.data || [];
        const counts = cities.map((city) => ({
          city,
          count: spaces.filter((s) => s.city === city).length
        }));
        setCityToCount(counts);
      } catch (err) {
        console.error('Error loading locations:', err);
        setCityToCount([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <main className="flex-1">
        {}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/40 via-white to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-900">
          <div className="w-full px-6 md:px-12 lg:px-16 pt-12 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Find WorkNest in your city</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Discover premium workspaces across India</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full px-6 md:px-12 lg:px-16 py-8">
          {loading ? (
            <div className="text-center py-12">
              <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading locations...</p>
            </div>
          ) : cityToCount.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">No locations available</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityToCount.map(({ city, count }) => (
                <a key={city} href={`/search`} className="group relative p-6 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden block">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-brand-500/10 to-brand-600/10 rounded-full -mr-10 -mt-10" />
                  <div className="h-32 rounded-xl bg-gradient-to-br from-brand-100 via-brand-200 to-brand-300 mb-4 group-hover:opacity-90 transition" />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition">{city}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{count} workspace{count !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}