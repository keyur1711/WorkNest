import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
export default function LoginModal({ open, onClose, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState('');
  const { login } = useAuth();
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setError('');
      setSuccess('');
      setToken('');
    } else {
      document.body.style.overflow = 'unset';
      setFormData({
        email: '',
        password: ''
      });
      setShowPassword(false);
      setIsLoading(false);
      setSuccess('');
      setToken('');
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);
  if (!open) return null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await login({
        email: formData.email,
        password: formData.password
      });
      setIsLoading(false);
      setSuccess('Login successful!');
      setToken(response.token);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Unable to sign in. Please try again.');
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return (
    <div className="fixed inset-0 z-[100]">
      {}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      {}
      <div className="relative z-[101] flex min-h-full items-center justify-center p-4">
        {}
        <div
          role="dialog"
          aria-modal="true"
          className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl border-2 border-slate-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl transition"
          onClick={(e) => e.stopPropagation()}
        >
          {}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-gray-700 transition hover:bg-slate-200 dark:hover:bg-gray-600"
          >
            <svg className="h-6 w-6 text-slate-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="max-h-[90vh] overflow-y-auto p-8 md:p-10 lg:p-12">
            {}
            <div className="mb-10">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg">
                  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-4xl font-black text-indigo-950 dark:text-white">Sign In</div>
                  <p className="mt-1 text-base text-slate-600 dark:text-gray-400">Enter your credentials to access your account</p>
                </div>
              </div>
            </div>
            {}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-600">
                  {error}
                </div>
              )}
              {success && (
                <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
                  <div>{success}</div>
                  {token && (
                    <div className="rounded-lg bg-white/70 px-3 py-2 text-sm font-mono text-emerald-700 break-all">
                      Token: {token}
                    </div>
                  )}
                </div>
              )}
              {}
              <div>
                <label className="mb-3 block text-base font-bold text-slate-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                    <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    className="h-14 w-full rounded-xl border-2 border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 pl-14 pr-5 text-base font-medium text-slate-900 dark:text-white transition placeholder:text-slate-400 hover:border-sky-300 focus:border-sky-400 focus:outline-none"
                  />
                </div>
              </div>
              {}
              <div>
                <label className="mb-3 block text-base font-bold text-slate-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                    <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="h-14 w-full rounded-xl border-2 border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 pl-14 pr-14 text-base font-medium text-slate-900 dark:text-white transition placeholder:text-slate-400 hover:border-sky-300 focus:border-sky-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-5 text-slate-400 transition hover:text-sky-600"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {}
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-2 focus:ring-sky-400"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset feature coming soon! Please contact support.')}
                  className="text-sm font-bold text-sky-600 transition hover:text-sky-700"
                >
                  Forgot password?
                </button>
              </div>
              {}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-8 flex h-14 w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 px-6 text-lg font-bold text-white shadow-lg transition hover:from-sky-600 hover:via-blue-600 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg className="mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>
            {}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-gray-800 px-4 font-medium text-slate-500 dark:text-gray-400">Or continue with</span>
              </div>
            </div>
            {}
            <div className="mb-6 grid grid-cols-1 gap-3">
              <button className="flex h-14 items-center justify-center gap-3 rounded-xl border-2 border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 font-bold text-slate-700 dark:text-white transition hover:border-sky-300 hover:bg-slate-50 dark:hover:bg-gray-600 text-base">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
            </div>
            {}
            <div className="border-t border-slate-100 dark:border-gray-700 pt-6 text-center">
              <p className="text-sm text-slate-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    onClose();
                    onSwitchToRegister();
                  }}
                  className="font-bold text-sky-600 transition hover:text-sky-700"
                >
                  Sign up for free
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}