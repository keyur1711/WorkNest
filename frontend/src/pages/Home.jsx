import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import SpaceCard from '../components/SpaceCard';
import { useState, useEffect } from 'react';
import TourModal from '../components/TourModal';
import { Link } from 'react-router-dom';
import { getSpaces, getFilters } from '../services/spaceService';
import heroImage from '../images/Home_page.jpg';
import workspace1 from '../images/austin-distel-wawEfYdpkag-unsplash.jpg';
import workspace2 from '../images/infralist-com-kmIKEGO7Vl4-unsplash.jpg';
import workspace3 from '../images/uneebo-office-design-UgYT5nkXdK4-unsplash.jpg';
import workspace4 from '../images/pawel-chu-ULh0i2txBCY-unsplash.jpg';
import workspace5 from '../images/suryadhityas-NrDZJ9oWV_Y-unsplash.jpg';
import workspace6 from '../images/running-a-successful-coworking-space-5aaa98c0bb414814ce745dc8.jpg';
const workspaceImages = [workspace1, workspace2, workspace3, workspace4, workspace5, workspace6];
export default function Home() {
  const [tourOpen, setTourOpen] = useState(false);
  const [spaces, setSpaces] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [spacesData, filtersData] = await Promise.all([
          getSpaces({ limit: 6 }).catch(() => ({ data: [] })),
          getFilters().catch(() => ({ types: [] }))
        ]);
        setSpaces(spacesData.data || []);
        setTypes(filtersData.types || []);
      } catch (err) {
        console.error('Error loading home data:', err);
        setSpaces([]);
        setTypes([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1">
        {}
        <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          {}
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Premium Workspace"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/70 to-gray-900/60"></div>
          </div>
          {}
          <div className="relative z-10 max-w-full mx-auto px-6 md:px-12 lg:px-16 text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold uppercase tracking-wider">Premium Workspaces</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              Find Your Perfect
              <span className="block text-blue-400">Workspace</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
              Discover and book premium coworking spaces that adapt to your needs, whenever and wherever you need them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/search"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Explore Spaces
              </Link>
              <button
                onClick={() => setTourOpen(true)}
                className="px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all duration-200"
              >
                Book a Tour
              </button>
            </div>
            {}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { value: '12+', label: 'Cities' },
                { value: '1,200+', label: 'Spaces' },
                { value: '50k+', label: 'Bookings' },
                { value: '4.8/5', label: 'Rating' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-300 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          {}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>
        {}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-full mx-auto px-6 md:px-12 lg:px-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Why Choose WorkNest</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Everything you need to discover, compare, and book flexible workspaces with confidence.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: '🔍',
                  title: 'Smart Search',
                  desc: 'Find the perfect workspace with advanced filters and real-time availability.'
                },
                {
                  icon: '💳',
                  title: 'Transparent Pricing',
                  desc: 'Clear daily/hourly rates with no hidden fees or surprises.'
                },
                {
                  icon: '🔒',
                  title: 'Secure Payments',
                  desc: 'PCI-compliant checkout with reliable invoicing and refunds.'
                },
                {
                  icon: '⭐',
                  title: 'Verified Spaces',
                  desc: 'Curated listings with authentic photos and verified reviews.'
                },
                {
                  icon: '⏱️',
                  title: 'Real-time Availability',
                  desc: 'Accurate capacity and calendar slots to avoid conflicts.'
                },
                {
                  icon: '💬',
                  title: '24/7 Support',
                  desc: 'Priority help for urgent changes, tours, or billing questions.'
                }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-600"
                >
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-full mx-auto px-6 md:px-12 lg:px-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Explore by Type</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">Find the workspace solution that fits your needs</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-8">
                  <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : types.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">No workspace types available</div>
              ) : (
                types.map((type, idx) => {
                  const imageIndex = idx % workspaceImages.length;
                  return (
                    <Link
                      key={type}
                      to="/search"
                      className="group relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                      <img
                        src={workspaceImages[imageIndex]}
                        alt={type}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{type}</h3>
                        <div className="flex items-center text-white/90 text-sm">
                          <span>Explore</span>
                          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </section>
        {}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-full mx-auto px-6 md:px-12 lg:px-16">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Featured Spaces</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">Handpicked premium workspaces</p>
              </div>
              <Link
                to="/search"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-2"
              >
                View All
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            {loading ? (
              <div className="text-center py-12">
                <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-gray-600">Loading featured spaces...</p>
              </div>
            ) : spaces.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No featured spaces available</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {spaces.map((space) => (
                  <div key={space._id || space.id}>
                    <SpaceCard space={space} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        {}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="max-w-full mx-auto px-6 md:px-12 lg:px-16 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Workspace?</h2>
            <p className="text-xl text-blue-100 mb-10">
              Join thousands of teams using WorkNest to work better, together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg transition-all duration-200 shadow-lg"
              >
                Start Searching
              </Link>
              <button
                onClick={() => setTourOpen(true)}
                className="px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all duration-200"
              >
                Schedule a Tour
              </button>
            </div>
          </div>
        </section>
        <TourModal open={tourOpen} onClose={() => setTourOpen(false)} />
      </main>
      <Footer />
    </div>
  );
}