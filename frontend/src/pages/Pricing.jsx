import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';

export default function Pricing() {
  const plans = [
    { name: 'Hot Desk', tagline: 'For individuals & freelancers', price: 699, unit: '/day', highlight: false, features: ['Any seat access', 'High-speed Wi‑Fi', 'Tea/Coffee', 'Community access'] },
    { name: 'Dedicated Desk', tagline: 'For consistent daily work', price: 1099, unit: '/day', highlight: true, features: ['Personal desk', 'Locker access', '24x7 access', 'Phone booths'] },
    { name: 'Private Office', tagline: 'For teams that scale', price: 1999, unit: '/day', highlight: false, features: ['Private cabin', 'Meeting credits', 'Onsite reception', 'Custom branding'] }
  ];

  const addons = [
    { name: 'Meeting Rooms', price: 499, unit: '/hour', desc: 'Pay-as-you-go professional rooms with AV' },
    { name: 'Parking', price: 199, unit: '/day', desc: 'Reserved parking spot (limited availability)' },
    { name: 'Storage Lockers', price: 99, unit: '/day', desc: 'Secure personal storage lockers' }
  ];

  const compare = [
    { feature: 'Wi‑Fi', hot: true, desk: true, office: true },
    { feature: '24x7 access', hot: false, desk: true, office: true },
    { feature: 'Locker', hot: false, desk: true, office: true },
    { feature: 'Private cabin', hot: false, desk: false, office: true },
    { feature: 'Meeting credits', hot: false, desk: false, office: true },
    { feature: 'Phone booths', hot: false, desk: true, office: true },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <main className="flex-1">
        {/* Hero - Image Background */}
        <section className="relative overflow-hidden min-h-[50vh]">
          {/* Image Background */}
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

          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/50"></div>

          {/* Subtle Color Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-blue-950/20 to-indigo-950/30"></div>

          <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 pt-20 pb-16">
            <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">Simple, transparent pricing</h1>
            <p className="mt-3 text-lg text-white/90 drop-shadow-md">Flexible options for individuals, startups, and enterprises.</p>
          </div>
          {/* <div className="absolute bottom-0 left-0 w-full h-24 bg-white transform skew-y-[-1deg] origin-bottom z-10"></div> */}
        </section>

        {/* Plans */}
        <section className="w-full px-6 md:px-12 lg:px-16 pb-6 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div key={p.name} className={`group relative p-8 rounded-2xl border-2 ${p.highlight ? 'border-sky-400 bg-white dark:bg-gray-800 shadow-xl shadow-sky-100/50 dark:shadow-none ring-2 ring-sky-100 dark:ring-sky-900' : 'border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm'} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 text-white text-xs font-bold shadow-lg">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Most Popular
                  </div>
                )}
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{p.tagline}</div>
                <div className="mt-2 text-2xl font-extrabold text-indigo-950 dark:text-white">{p.name}</div>
                <div className="mt-4 flex items-baseline gap-1">
                  <div className="text-4xl font-extrabold text-indigo-950 dark:text-white">₹{p.price}</div>
                  <span className="text-base text-gray-500 dark:text-gray-400 font-medium">{p.unit}</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-sky-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="/search" className={`mt-8 inline-flex items-center justify-center h-12 w-full rounded-lg font-semibold transition-all duration-200 ${p.highlight ? 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 text-white hover:from-sky-600 hover:via-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' : 'bg-indigo-950 dark:bg-gray-700 text-white hover:bg-indigo-900 dark:hover:bg-gray-600 shadow-md hover:shadow-lg'}`}>Get started</a>
              </div>
            ))}
          </div>
        </section>

        {/* Add-ons */}
        <section className="w-full px-6 md:px-12 lg:px-16 py-8">
          <h2 className="text-2xl font-bold text-indigo-950 dark:text-white">Add‑ons</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {addons.map((a, idx) => (
              <div key={a.name} className="group p-6 rounded-2xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl hover:border-sky-400 dark:hover:border-sky-500 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${idx % 2 === 0 ? 'bg-sky-50 dark:bg-sky-900/30' : 'bg-rose-50 dark:bg-rose-900/30'}`}>
                  <svg className={`w-6 h-6 ${idx % 2 === 0 ? 'text-sky-600 dark:text-sky-400' : 'text-rose-600 dark:text-rose-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="text-indigo-950 dark:text-white font-semibold text-lg">{a.name}</div>
                <div className="mt-2 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{a.desc}</div>
                <div className="mt-4 text-2xl font-extrabold text-indigo-950 dark:text-white">₹{a.price}<span className="text-base text-gray-500 dark:text-gray-400 font-medium">{a.unit}</span></div>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section className="w-full px-6 md:px-12 lg:px-16 py-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Compare plans</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300">
                  <th className="text-left px-4 py-3 font-semibold">Feature</th>
                  <th className="px-4 py-3 font-semibold">Hot Desk</th>
                  <th className="px-4 py-3 font-semibold">Dedicated Desk</th>
                  <th className="px-4 py-3 font-semibold">Private Office</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                {compare.map((row) => (
                  <tr key={row.feature} className="border-t border-gray-100 dark:border-gray-700">
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{row.feature}</td>
                    {[row.hot, row.desk, row.office].map((v, i) => (
                      <td key={i} className="px-4 py-3 text-center">
                        {v ? (
                          <svg className="w-4 h-4 mx-auto text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        ) : (
                          <svg className="w-4 h-4 mx-auto text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">Prices are indicative and may vary by city and availability.</div>
        </section>

        {/* FAQ */}
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

        {/* Enterprise CTA */}
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


