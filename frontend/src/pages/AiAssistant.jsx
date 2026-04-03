import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { useAuth } from '../hooks/useAuth';
import { generateAssistantReply } from '../utils/aiAssistant';
import { getMyBookings } from '../services/bookingService';
import { getSpaces } from '../services/spaceService';
import SpaceCard from '../components/SpaceCard';

const initialAssistant = {
  role: 'assistant',
  content:
    'Hi! Tell me what kind of workspace you need (budget, location, meeting or private office). I will suggest the best match and the filters to use in Search.'
};

const Chip = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="px-3 py-2 rounded-full border border-slate-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 text-sm text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 hover:border-sky-300 dark:hover:border-sky-500 transition"
  >
    {children}
  </button>
);

export default function AiAssistant() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([initialAssistant]);
  const [input, setInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [historyError, setHistoryError] = useState('');
  const listRef = useRef(null);

  const applyRecommendedFilters = (recommendedSpaceType, recommendedCity) => {
    const type = String(recommendedSpaceType || '').trim();
    const city = String(recommendedCity || '').trim();
    if (!type && !city) return;

    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (city) params.set('city', city);
    navigate(`/search?${params.toString()}`);
  };

  const [historyRecommendation, setHistoryRecommendation] = useState({
    recommendedSpaceType: null,
    recommendedCity: null
  });
  const [historyLoading, setHistoryLoading] = useState(false);
  const [recommendedSpaces, setRecommendedSpaces] = useState([]);
  const [recommendedSpacesLoading, setRecommendedSpacesLoading] = useState(false);

  const pushAssistantIfEmpty = (msg) => {
    setMessages((prev) => {
      if (!prev || prev.length === 0) return [initialAssistant, msg];
      if (prev.length === 1 && prev[0]?.role === 'assistant') return [...prev, msg];
      return prev;
    });
  };

  useEffect(() => {
    // Scroll to bottom when messages change.
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, generating]);

  useEffect(() => {
    let cancelled = false;

    const finishLoading = () => {
      setHistoryLoading(false);
      setRecommendedSpacesLoading(false);
    };

    const run = async () => {
      if (!user) {
        finishLoading();
        return;
      }

      setHistoryLoading(true);
      setRecommendedSpacesLoading(true);
      setError('');
      setHistoryError('');
      try {
        const bookingsRes = await getMyBookings();
        if (cancelled) return;
        const bookings = bookingsRes?.bookings || [];

        if (!bookings.length) {
          setHistoryRecommendation({ recommendedSpaceType: null, recommendedCity: null });
          try {
            const fallback = await getSpaces({ limit: 6, sort: '-rating' });
            if (!cancelled) {
              setRecommendedSpaces(fallback?.data?.slice(0, 6) || []);
            }
          } catch {
            if (!cancelled) setRecommendedSpaces([]);
          }
          return;
        }

        const paidBookings = bookings.filter((b) => b?.paymentStatus === 'paid');
        const historyBookings = paidBookings.length ? paidBookings : bookings;

        const typeCounts = {};
        const cityCounts = {};
        for (const b of historyBookings) {
          const t = b?.type;
          if (t) typeCounts[t] = (typeCounts[t] || 0) + 1;

          // Prefer Space.city (matches /spaces?city=) over free-text location strings.
          const c =
            b?.space?.city ||
            b?.spaceLocation ||
            b?.space?.locationText ||
            null;
          if (c) cityCounts[String(c).trim()] = (cityCounts[String(c).trim()] || 0) + 1;
        }

        const topKey = (counts) => {
          let top = null;
          let topCount = -1;
          for (const [k, v] of Object.entries(counts)) {
            if (v > topCount) {
              top = k;
              topCount = v;
            }
          }
          return top;
        };

        const topType = topKey(typeCounts) || null;
        const topCity = topKey(cityCounts) || null;

        if (cancelled) return;
        setHistoryRecommendation({ recommendedSpaceType: topType, recommendedCity: topCity });

        // Recommend spaces similar to the user's most-booked type/city.
        const bookedSpaceIds = new Set(
          (historyBookings || [])
            .map((b) => b?.space?._id || b?.space?.id)
            .filter(Boolean)
        );

        if (!topType) {
          try {
            const fallback = await getSpaces({ limit: 6, sort: '-rating' });
            if (!cancelled) {
              setRecommendedSpaces(fallback?.data?.slice(0, 6) || []);
            }
          } catch {
            if (!cancelled) setRecommendedSpaces([]);
          }
          return;
        }

        const fetchPersonalized = async () => {
          const res1 = await getSpaces({
            city: topCity || undefined,
            type: topType || undefined,
            limit: 12,
            sort: 'pricePerDay'
          });
          let spaces = res1?.data || [];
          if (!spaces.length && topCity) {
            const res2 = await getSpaces({
              type: topType || undefined,
              limit: 12,
              sort: 'pricePerDay'
            });
            spaces = res2?.data || [];
          }
          if (!spaces.length) {
            const res3 = await getSpaces({ limit: 6, sort: '-rating' });
            spaces = res3?.data || [];
          }
          return spaces;
        };

        const spaces = await fetchPersonalized();
        if (cancelled) return;

        const filtered = bookedSpaceIds.size
          ? spaces.filter((s) => {
              const sid = s?._id || s?.id;
              return sid ? !bookedSpaceIds.has(sid) : true;
            })
          : spaces;

        setRecommendedSpaces(filtered.slice(0, 6));

        pushAssistantIfEmpty({
          role: 'assistant',
          content: topCity
            ? `I noticed you often book ${topType} in ${topCity}. Here are some recommended spaces for you.`
            : `I noticed you often book ${topType}. Here are some recommended spaces for you.`,
          meta: {
            recommendedSpaceType: topType,
            recommendedCity: topCity,
            amenities: [],
            budgetHint: '',
            filters: []
          }
        });
      } catch (e) {
        if (!cancelled) {
          setHistoryError(
            e?.message ||
              e?.payload?.message ||
              'Failed to load your booking history for personalization.'
          );
        }
      } finally {
        // Always clear loading — never gate on `mounted` (React Strict Mode can
        // leave a stale request completing after unmount and skip this otherwise).
        finishLoading();
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const quickPrompts = useMemo(
    () => [
      'I need a meeting room for a client call',
      'Suggest a quiet workspace for deep work',
      'I want a dedicated desk with reliable Wi-Fi',
      'Budget is around 250, what should I choose?'
    ],
    []
  );

  const pushMessage = (msg) => setMessages((prev) => [...prev, msg]);

  const handleSend = async (text) => {
    const trimmed = String(text || '').trim();
    if (!trimmed || generating) return;

    setError('');
    pushMessage({ role: 'user', content: trimmed });
    setGenerating(true);
    setInput('');

    try {
      // Small delay to feel responsive.
      await new Promise((r) => setTimeout(r, 450));
      const { message, meta } = generateAssistantReply(trimmed, {
        history: historyRecommendation
      });
      pushMessage({ role: 'assistant', content: message, meta });
    } catch (e) {
      setError('Failed to generate suggestions. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleClear = () => {
    setError('');
    setInput('');
    setMessages([initialAssistant]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 opacity-10" />
          <div className="relative px-6 md:px-12 lg:px-16 pt-14 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  AI Workspace Assistant
                </h1>
                <p className="mt-3 text-base text-gray-700 dark:text-gray-200 max-w-2xl">
                  Smart recommendations for desk/day bookings. Share your needs, and we will suggest workspace type + filters.
                </p>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Signed in as <span className="font-semibold">{user?.fullName || 'User'}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/search"
                  className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold hover:from-indigo-700 hover:to-blue-700 transition shadow"
                >
                  Go to Search
                </Link>
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center justify-center h-11 px-6 rounded-xl border border-slate-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white font-semibold hover:bg-white dark:hover:bg-gray-800 transition"
                >
                  Clear chat
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-12 lg:px-16 pb-16">
          {error && (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm">
                <div className="p-5 border-b border-slate-200 dark:border-gray-700">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        Recommended for you
                      </div>
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {historyLoading
                          ? 'Analyzing your booking history...'
                          : historyRecommendation?.recommendedSpaceType
                            ? `Based on your past bookings (${historyRecommendation.recommendedSpaceType}${
                                historyRecommendation.recommendedCity ? ` in ${historyRecommendation.recommendedCity}` : ''
                              }).`
                            : recommendedSpaces?.length
                              ? 'No booking history yet — here are popular workspaces you can explore.'
                              : 'Make a booking to get personalized suggestions.'}
                      </div>
                      {historyError ? (
                        <div className="mt-2 text-sm text-rose-600 dark:text-rose-400">
                          {historyError}
                        </div>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        applyRecommendedFilters(
                          historyRecommendation?.recommendedSpaceType,
                          historyRecommendation?.recommendedCity
                        )
                      }
                      disabled={
                        !historyRecommendation?.recommendedSpaceType ||
                        recommendedSpacesLoading
                      }
                      className="inline-flex items-center justify-center h-9 px-4 rounded-xl bg-slate-100 dark:bg-gray-900/40 text-gray-900 dark:text-white font-semibold border border-slate-200 dark:border-gray-700 hover:bg-slate-200 dark:hover:bg-gray-900/60 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Explore matches
                    </button>
                  </div>

                  <div className="mt-4">
                    {recommendedSpacesLoading ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Array.from({ length: 4 }).map((_, idx) => (
                          <div
                            key={idx}
                            className="h-56 rounded-2xl bg-slate-100 dark:bg-gray-900/30 animate-pulse"
                          />
                        ))}
                      </div>
                    ) : recommendedSpaces?.length ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {recommendedSpaces.map((s) => (
                          <SpaceCard key={s._id || s.id} space={s} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        No recommendations found yet. Try booking a workspace first.
                      </div>
                    )}
                  </div>
                </div>

                <div
                  ref={listRef}
                  className="h-[520px] overflow-y-auto p-5"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {messages.map((m, idx) => {
                    const isUser = m.role === 'user';
                    return (
                      <div key={idx} className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={[
                            'max-w-[85%] rounded-2xl px-4 py-3 shadow-sm',
                            isUser
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-slate-200 dark:border-gray-700'
                          ].join(' ')}
                        >
                          {m.meta ? (
                            <div className="space-y-3">
                              <div className="text-sm font-bold">
                                {m.meta.recommendedSpaceType}
                              </div>
                              {m.meta.recommendedCity && (
                                <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                                  {m.meta.recommendedCity}
                                </div>
                              )}
                              <div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    applyRecommendedFilters(m.meta.recommendedSpaceType, m.meta.recommendedCity)
                                  }
                                  className="mt-2 inline-flex items-center justify-center h-9 px-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-sm"
                                >
                                  Apply to Search
                                </button>
                              </div>
                              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                                {m.content}
                              </div>

                              {m.meta.filters?.length ? (
                                <div className="rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800/60 p-3">
                                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                    Recommended filters
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {m.meta.filters?.map((f) => (
                                      <span
                                        key={f}
                                        className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 text-gray-800 dark:text-gray-100"
                                      >
                                        {f}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ) : null}

                              {m.meta.amenities?.length ? (
                                <div className="rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800/60 p-3">
                                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                    Suggested amenities
                                  </div>
                                  <ul className="text-sm text-gray-800 dark:text-gray-100 list-disc pl-5 space-y-1">
                                    {m.meta.amenities?.map((a) => (
                                      <li key={a}>{a}</li>
                                    ))}
                                  </ul>
                                </div>
                              ) : null}
                            </div>
                          ) : (
                            <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {generating && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl px-4 py-3 border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                        <div className="text-sm font-semibold mb-2">Assistant is typing...</div>
                        <div className="flex gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '120ms' }} />
                          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '240ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 border-t border-slate-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {quickPrompts.map((q) => (
                      <Chip key={q} onClick={() => handleSend(q)}>
                        {q}
                      </Chip>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Example: I need a quiet dedicated desk for 2 people with strong Wi-Fi..."
                      rows={2}
                      className="flex-1 resize-none rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 outline-none focus:border-sky-300 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-900/30"
                    />
                    <button
                      type="button"
                      disabled={generating || !input.trim()}
                      onClick={() => handleSend(input)}
                      className="h-[60px] px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold hover:from-indigo-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow"
                    >
                      {generating ? 'Generating...' : 'Send'}
                    </button>
                  </div>
                  <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    This assistant uses built-in logic (no external AI key). It still helps you decide the right workspace and filters.
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="rounded-3xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm p-5">
                <div className="text-lg font-extrabold text-gray-900 dark:text-white">How to get best results</div>
                <div className="mt-3 text-sm text-gray-700 dark:text-gray-200 space-y-3">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600/10 text-indigo-700 dark:text-indigo-200 flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      Tell us <span className="font-semibold">budget</span> (optional) and <span className="font-semibold">need</span> (meeting/private/dedicated).
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600/10 text-indigo-700 dark:text-indigo-200 flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>We will recommend a workspace type and filters to use immediately in Search.</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600/10 text-indigo-700 dark:text-indigo-200 flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>Upgrade/switch plans any time from the Pricing page.</div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900/40 p-4">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">Pro tip</div>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                    Try asking: “Meeting room for 8 people with projector, budget 300” to get more specific filter suggestions.
                  </p>
                </div>

                <div className="mt-5">
                  <Link
                    to="/pricing"
                    className="w-full inline-flex items-center justify-center h-11 px-6 rounded-xl border border-slate-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/50 text-gray-900 dark:text-white font-semibold hover:bg-white dark:hover:bg-gray-900 transition"
                  >
                    Manage subscription
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

