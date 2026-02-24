import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { useAuth } from '../hooks/useAuth';
import hotDeskImage from '../images/hot_desk1.jpeg';
const ROLE_OPTIONS = [
  {
    value: 'user',
    label: 'User',
    tagline: 'Discover & book workspaces',
    description: 'Search, filter, and reserve desks, meeting rooms, and offices on demand.'
  },
  {
    value: 'workspace_owner',
    label: 'Workspace Owner',
    tagline: 'Manage & monetize spaces',
    description: 'Publish listings, handle bookings, and grow your workspace business.'
  }
];
export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ROLE_OPTIONS[0].value
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password
      };
      if (!isAdminLogin) {
        payload.role = formData.role;
      }
      const response = await login(payload);
      setIsLoading(false);
      const stored = localStorage.getItem('wn:auth');
      if (!stored) {
        setError('Failed to save authentication. Please try again.');
        return;
      }
      const userRole = response?.user?.role;
      console.log('Login successful, redirecting user with role:', userRole);
      setTimeout(() => {
        if (userRole === 'admin') {
          navigate('/admin', { replace: true });
        } else if (userRole === 'workspace_owner') {
          navigate('/workspace-owner', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }, 300);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Unable to sign in. Please try again.');
    }
  };
  const handleChange = (e) => {
    if (error) setError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleRoleSelect = (roleValue) => {
    if (error) setError('');
    setFormData((prev) => ({ ...prev, role: roleValue }));
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {}
          <div className="hidden lg:block relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={hotDeskImage}
              alt="Workspace"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-800/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h2 className="text-3xl font-bold mb-3">Welcome Back</h2>
              <p className="text-blue-100">Sign in to access your workspace bookings and personalized recommendations.</p>
            </div>
          </div>
          {}
          <div className="flex items-center">
            <div className="w-full max-w-xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sign In</h1>
                  <p className="text-gray-600 dark:text-gray-300">Enter your credentials to access your account</p>
                </div>
                {error && (
                  <div className="mb-6 p-4 rounded-lg text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  {}
                  {!isAdminLogin && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Login As
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ROLE_OPTIONS.map((option) => {
                          const isActive = formData.role === option.value;
                          return (
                            <button
                              type="button"
                              key={option.value}
                              onClick={() => handleRoleSelect(option.value)}
                              className={`p-4 rounded-lg border-2 text-left transition-all ${isActive
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                                }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-semibold text-gray-900 dark:text-white">{option.label}</div>
                                <div className={`w-4 h-4 rounded-full border-2 ${isActive ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                                  }`}></div>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-300">{option.tagline}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAdminLogin}
                        onChange={() => setIsAdminLogin(!isAdminLogin)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Admin Login</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Password reset feature coming soon!')}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Forgot password?
                    </button>
                  </div>
                  {}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </form>
                {}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
                      Sign up for free
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}