import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProPaywall from './ProPaywall';

const isUserPro = (user) => {
  if (!user) return false;
  return (
    user.subscriptionStatus === 'active' &&
    user.subscriptionPlan === 'user_pro' &&
    user.subscriptionForRole === 'user'
  );
};

export default function UserProRoute({ children }) {
  const { user, refreshUser } = useAuth();
  const [checking, setChecking] = useState(true);
  const [userSnapshot, setUserSnapshot] = useState(user);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        if (refreshUser) {
          const refreshed = await refreshUser();
          if (mounted) setUserSnapshot(refreshed || user);
        } else {
          if (mounted) setUserSnapshot(user);
        }
      } catch {
        if (mounted) setUserSnapshot(user);
      } finally {
        if (mounted) setChecking(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const allowed = useMemo(() => isUserPro(userSnapshot), [userSnapshot]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-sky-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Checking Pro access...</p>
        </div>
      </div>
    );
  }

  if (!allowed) {
    // Pricing page is the upgrade path.
    return (
      <ProPaywall
        userPlan={userSnapshot?.subscriptionPlan}
        expiresAt={userSnapshot?.subscriptionExpiresAt}
      />
    );
  }

  return children;
}

