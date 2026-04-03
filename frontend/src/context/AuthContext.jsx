import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import { authService } from '../services/authService';
const AuthContext = createContext(undefined);
const STORAGE_KEY = 'wn:auth';
const getStoredAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, token: null };
    const parsed = JSON.parse(raw);
    return {
      user: parsed.user || null,
      token: parsed.token || null
    };
  } catch (error) {
    console.warn('Failed to parse auth storage', error);
    return { user: null, token: null };
  }
};
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => getStoredAuth());
  const [isProcessing, setIsProcessing] = useState(false);
  const persistAuth = useCallback((nextAuth) => {
    console.log('Persisting auth:', {
      hasToken: !!nextAuth.token,
      hasUser: !!nextAuth.user,
      userRole: nextAuth.user?.role
    });
    setAuthState(nextAuth);
    if (nextAuth.token && nextAuth.user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
      console.log('Auth saved to localStorage');
      const verify = localStorage.getItem(STORAGE_KEY);
      if (verify) {
        const parsed = JSON.parse(verify);
        console.log('Verified saved auth:', {
          hasToken: !!parsed.token,
          hasUser: !!parsed.user,
          userRole: parsed.user?.role
        });
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
      console.log('Auth removed from localStorage');
    }
  }, []);
  const login = useCallback(
    async (credentials) => {
      setIsProcessing(true);
      try {
        const response = await authService.login(credentials);
        console.log('Login response:', response);
        console.log('User from login:', response.user);
        console.log('User role from login:', response.user?.role);
        persistAuth({ user: response.user, token: response.token });
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        console.log('Saved to localStorage:', saved);
        console.log('Saved user role:', saved.user?.role);
        return response;
      } catch (error) {
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [persistAuth]
  );
  const refreshUser = useCallback(async () => {
    if (authState.token) {
      try {
        const response = await authService.getUserProfile();
        persistAuth({ user: response.user, token: authState.token });
        return response.user;
      } catch (error) {
        console.error('Failed to refresh user:', error);
        if (error.status === 401) {
          persistAuth({ user: null, token: null });
        }
        throw error;
      }
    }
  }, [authState.token, persistAuth]);
  const register = useCallback(
    async (payload) => {
      setIsProcessing(true);
      try {
        const response = await authService.register(payload);
        persistAuth({ user: response.user, token: response.token });
        return response;
      } catch (error) {
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [persistAuth]
  );
  const logout = useCallback(() => {
    persistAuth({ user: null, token: null });
  }, [persistAuth]);
  const value = useMemo(
    () => ({
      user: authState.user,
      token: authState.token,
      isAuthenticated: Boolean(authState.token),
      /** Alias for components that expect `loading` (e.g. ProtectedRoute). */
      loading: isProcessing,
      isProcessing,
      login,
      register,
      logout,
      refreshUser
    }),
    [authState, isProcessing, login, register, logout, refreshUser]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};