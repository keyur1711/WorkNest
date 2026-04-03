import { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { useAuth } from '../hooks/useAuth';
import {
  createSubscriptionOrder,
  getMySubscription,
  selectSubscriptionPlan,
  verifySubscriptionPayment
} from '../services/subscriptionService';

export default function Pricing() {
  const { user, refreshUser } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);

  const formatDate = (dateLike) => {
    if (!dateLike) return 'N/A';
    try {
      const d = new Date(dateLike);
      if (Number.isNaN(d.getTime())) return 'N/A';
      return d.toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  const userPlans = [
    {
      key: 'user_basic',
      name: 'User Basic',
      description: 'Free access. Perfect for trying WorkNest. AI features locked.',
      price: '0',
      unit: '/month'
    },
    {
      key: 'user_pro',
      name: 'User Pro',
      description: 'Unlock upcoming AI workspace assistant and smart suggestions.',
      price: '299',
      unit: '/month'
    }
  ];

  const ownerPlans = [
    {
      key: 'owner_basic',
      name: 'Owner Basic',
      description: 'Free plan. List 1 space only.',
      price: '0',
      unit: '/month'
    },
    {
      key: 'owner_pro',
      name: 'Owner Pro',
      description: 'List multiple spaces and grow your workspace business.',
      price: '499',
      unit: '/month'
    }
  ];

  const allPlans = [...userPlans, ...ownerPlans];

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSelectPlan = async (planKey) => {
    if (!user) {
      setError('Please log in to select a subscription plan.');
      setMessage('');
      return;
    }
    try {
      if (isPlanActive(planKey)) return;

      const selectedPlan = allPlans.find((p) => p.key === planKey);
      if (!selectedPlan) {
        setError('Invalid subscription plan selected.');
        return;
      }

      setIsUpdating(true);
      setError('');
      setMessage('');

      const isFreePlan = Number(selectedPlan.price) === 0;

      if (isFreePlan) {
        const response = await selectSubscriptionPlan(planKey);
        setCurrentSubscription(response?.subscription || null);
        await refreshUser();
        setMessage(response.message || 'Subscription updated successfully.');
        setIsUpdating(false);
        return;
      }

      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        throw new Error('Failed to load payment gateway. Please try again.');
      }

      const orderResponse = await createSubscriptionOrder(planKey);

      const options = {
        key: orderResponse.keyId,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: 'WorkNest',
        description: selectedPlan.name,
        order_id: orderResponse.orderId,
        handler: async function (response) {
          try {
            const verifyResponse = await verifySubscriptionPayment({
              planKey,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            setCurrentSubscription(verifyResponse?.subscription || null);
            await refreshUser();
            setMessage(verifyResponse.message || 'Subscription activated successfully.');
          } catch (err) {
            const msg = err.message || err.payload?.message || 'Failed to activate subscription.';
            setError(msg);
          } finally {
            setIsUpdating(false);
          }
        },
        prefill: {
          name: user.fullName || '',
          email: user.email || '',
          contact: user.phone || ''
        },
        theme: {
          color: '#2563eb'
        },
        modal: {
          ondismiss: function () {
            setIsUpdating(false);
            setError('Payment cancelled. Subscription was not activated.');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      const msg = err.message || err.payload?.message || 'Failed to update subscription.';
      setIsUpdating(false);
      setError(msg);
    }
  };
  const role = user?.role;

  useEffect(() => {
    const loadSubscription = async () => {
      if (!user) return;
      setIsLoadingSubscription(true);
      setError('');
      try {
        const response = await getMySubscription();
        setCurrentSubscription(response?.subscription || null);
      } catch (err) {
        // Non-blocking: the pricing cards still render without this info.
        setCurrentSubscription(null);
        setError(err.message || err.payload?.message || 'Failed to load current subscription.');
      } finally {
        setIsLoadingSubscription(false);
      }
    };
    loadSubscription();
  }, [user]);

  const currentPlanKey = currentSubscription?.plan;
  const isPlanActive = (planKey) => currentSubscription?.status === 'active' && currentPlanKey === planKey;
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <main className="flex-1">
        {message && (
          <div className="w-full px-6 md:px-12 lg:px-16 pt-4">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm px-4 py-3">
              {message}
            </div>
          </div>
        )}
        {error && (
          <div className="w-full px-6 md:px-12 lg:px-16 pt-4">
            <div className="rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-sm px-4 py-3">
              {error}
            </div>
          </div>
        )}
        <section className="relative overflow-hidden min-h-[50vh]">
          {}
          <div className="absolute inset-0">
            <img
              src="/Home_page.jpg"
              alt="Pricing"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.classList.add('bg-gradient-to-br', 'from-indigo-950', 'via-blue-950', 'to-indigo-950');
              }}
            />
          </div>
          {}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/50"></div>
          {}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-blue-950/20 to-indigo-950/30"></div>
          <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 pt-20 pb-16">
            <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">Choose your subscription</h1>
            <p className="mt-3 text-lg text-white/90 drop-shadow-md">
              Users unlock future AI features, workspace owners unlock multiple space listings.
            </p>
          </div>
          {}
        </section>
        {(role === undefined || role === 'user' || role === 'admin') && (
          <section className="w-full px-6 md:px-12 lg:px-16 py-8">
            <h2 className="text-2xl font-bold text-indigo-950 dark:text-white">Subscriptions for Users</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Choose a plan to control access to upcoming AI features in your account.
            </p>
            {user && (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                {isLoadingSubscription
                  ? 'Loading your subscription...'
                  : currentSubscription?.status === 'active'
                    ? `Current plan: ${currentSubscription.plan} (valid till ${formatDate(currentSubscription.expiresAt)})`
                    : 'No active subscription yet.'}
              </p>
            )}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {userPlans.map((plan) => (
                <div key={plan.key} className="p-6 rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-indigo-950 dark:text-white">{plan.name}</div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-indigo-950 dark:text-white">₹{plan.price}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{plan.unit}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectPlan(plan.key)}
                    disabled={
                      isUpdating ||
                      !user ||
                      (role !== 'user' && role !== 'admin') ||
                      isPlanActive(plan.key)
                    }
                    className="mt-4 w-full h-11 rounded-lg bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 text-white font-semibold hover:from-sky-600 hover:via-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isPlanActive(plan.key) ? 'Current plan' : isUpdating ? 'Updating...' : 'Select plan'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
        {role && (role === 'workspace_owner' || role === 'admin') && (
          <section className="w-full px-6 md:px-12 lg:px-16 py-8">
            <h2 className="text-2xl font-bold text-indigo-950 dark:text-white">Subscriptions for Workspace Owners</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Free plan lets you list 1 space. Upgrade to add multiple spaces.
            </p>
            {user && (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                {isLoadingSubscription
                  ? 'Loading your subscription...'
                  : currentSubscription?.status === 'active'
                    ? `Current plan: ${currentSubscription.plan} (valid till ${formatDate(currentSubscription.expiresAt)})`
                    : 'No active subscription yet.'}
              </p>
            )}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {ownerPlans.map((plan) => (
                <div key={plan.key} className="p-6 rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-indigo-950 dark:text-white">{plan.name}</div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-indigo-950 dark:text-white">₹{plan.price}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{plan.unit}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectPlan(plan.key)}
                    disabled={isUpdating || !user || isPlanActive(plan.key)}
                    className="mt-4 w-full h-11 rounded-lg bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white font-semibold hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isPlanActive(plan.key) ? 'Current plan' : isUpdating ? 'Updating...' : 'Select plan'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
        <section className="w-full px-6 md:px-12 lg:px-16 py-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently asked questions</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{
              q: 'Do prices vary by city?', a: 'Yes, prices can vary based on location, demand, and amenities. The list above reflects starting prices.'
            }, {
              q: 'Can I upgrade or switch plans?', a: 'Absolutely. You can switch plans anytime based on availability and billing adjustments.'
            }, {
              q: 'Are meeting rooms included?', a: 'Meeting rooms are offered as add‑ons with hourly pricing and credits on higher tiers.'
            }, {
              q: 'Do you support team billing?', a: 'Yes. We can consolidate invoices and support enterprise procurement workflows.'
            }].map((f) => (
              <div key={f.q} className="p-5 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-card">
                <div className="font-semibold text-gray-900 dark:text-white">{f.q}</div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">{f.a}</div>
              </div>
            ))}
          </div>
        </section>
        {}
        <section className="bg-gradient-to-r from-brand-600 to-brand-700">
          <div className="w-full px-6 md:px-12 lg:px-16 py-12 md:py-14 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-white text-2xl font-bold">Need a full‑floor or custom build‑out?</div>
              <p className="text-white/90 mt-1">Talk to sales for enterprise pricing, security, and SLAs.</p>
            </div>
            <a href="/contact" className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-white text-brand-700 font-semibold hover:bg-gray-100">Talk to sales</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}