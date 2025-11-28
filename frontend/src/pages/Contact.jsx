// import Navbar from '../shared/Navbar';
// import Footer from '../shared/Footer';

// export default function Contact() {
//   const contacts = [
//     { label: 'General Support', value: 'support@worknest.com' },
//     { label: 'Sales', value: 'sales@worknest.com' },
//     { label: 'Phone', value: '+91 98765 43210' },
//     { label: 'HQ', value: 'Bengaluru, India' }
//   ];

//   const faqs = [
//     { q: 'How soon will you respond?', a: 'We typically respond within 24 hours on business days.' },
//     { q: 'Can I book a tour from here?', a: 'Yes. Share a date in the message and we will confirm availability.' },
//     { q: 'Do you support enterprise billing?', a: 'We support consolidated invoicing and SLAs for enterprise accounts.' },
//     { q: 'Where can I find refunds/cancellations?', a: 'See our Refund & Cancellation Policy in the Legal section of the footer.' }
//   ];

//   return (
//     <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
//       <Navbar />
//       <main className="flex-1">
//         {/* Hero */}
//         <section className="relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 via-white to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-900" />
//           <div className="relative w-full px-6 md:px-12 lg:px-16 pt-14 pb-10">
//             <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Contact WorkNest</h1>
//             <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">We’re here to help with bookings, partnerships, and product questions.</p>
//           </div>
//         </section>

//         {/* Contact grid */}
//         <section className="w-full px-6 md:px-12 lg:px-16 pb-12">
//           <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
//             {/* Info */}
//             <aside className="md:col-span-4">
//               <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition">
//                 <div className="flex items-center gap-2 mb-6">
//                   <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
//                     <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                     </svg>
//                   </div>
//                   <div className="text-lg font-bold text-gray-900 dark:text-white">Get in touch</div>
//                 </div>
//                 <ul className="space-y-4">
//                   {contacts.map((c) => (
//                     <li key={c.label} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
//                       <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 flex items-center justify-center flex-shrink-0">
//                         {c.label === 'General Support' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
//                         {c.label === 'Sales' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
//                         {c.label === 'Phone' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
//                         {c.label === 'HQ' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
//                       </div>
//                       <div>
//                         <div className="font-semibold text-gray-900 dark:text-white text-sm">{c.label}</div>
//                         <div className="text-lg font-bold text-gray-900 dark:text-white">Our offices</div>
//                       </div>
//                       <div className="grid grid-cols-2 gap-3">
//                         {['Bengaluru', 'Mumbai', 'Delhi', 'Pune'].map((c) => (
//                           <div key={c} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:border-brand-200 dark:hover:border-brand-800 transition text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-700 dark:hover:text-brand-300">{c}</div>
//                         ))}
//                       </div>
//                     </div>
//             </aside>

//                 {/* Form */}
//                 <div className="md:col-span-8">
//                   <form className="p-8 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg" onSubmit={(e) => e.preventDefault()}>
//                     <div className="flex items-center gap-2 mb-6">
//                       <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
//                         <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                         </svg>
//                       </div>
//                       <div className="text-lg font-bold text-gray-900 dark:text-white">Send us a message</div>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <input className="h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-400 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Full name" required />
//                       <input type="email" className="h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-400 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Work email" required />
//                       <input className="h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-400 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Company (optional)" />
//                       <input className="h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-400 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Phone (optional)" />
//                       <select className="h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-400 md:col-span-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" defaultValue="General inquiry">
//                         <option>General inquiry</option>
//                         <option>Book a tour</option>
//                         <option>Sales</option>
//                         <option>Owner partnership</option>
//                         <option>Support</option>
//                       </select>
//                       <textarea rows={5} className="md:col-span-2 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-400 transition resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Tell us how we can help" />
//                     </div>
//                     <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
//                       <div className="text-xs text-gray-500 dark:text-gray-400">By submitting, you agree to our Terms & Privacy.</div>
//                       <button className="w-full sm:w-auto h-12 px-8 rounded-lg bg-gradient-to-r from-brand-600 to-brand-700 text-white font-semibold hover:from-brand-700 hover:to-brand-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
//                         Send message
//                       </button>
//                     </div>
//                   </form>

//                   {/* Map placeholder */}
//                   <div className="mt-6 rounded-2xl border border-gray-100 dark:border-gray-700 bg-[linear-gradient(135deg,#f6f7fb,#eef2ff)] dark:bg-[linear-gradient(135deg,#1f2937,#111827)] h-60 flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">Map placeholder</div>
//                 </div>
//               </div>
//             </section>

//             {/* FAQ */}
//             <section className="w-full px-6 md:px-12 lg:px-16 pb-14">
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white">FAQs</h2>
//               <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {faqs.map((f) => (
//                   <div key={f.q} className="p-5 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-card">
//                     <div className="font-semibold text-gray-900 dark:text-white">{f.q}</div>
//                     <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">{f.a}</div>
//                   </div>
//                 ))}
//               </div>
//             </section>
//           </main>
//           <Footer />
//         </div>
//         );
// }



import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';

export default function Contact() {
  const contacts = [
    { label: 'General Support', value: 'support@worknest.com' },
    { label: 'Sales', value: 'sales@worknest.com' },
    { label: 'Phone', value: '+91 98765 43210' },
    { label: 'HQ', value: 'Bengaluru, India' }
  ];

  const faqs = [
    { q: 'How soon will you respond?', a: 'We typically respond within 24 hours on business days.' },
    { q: 'Can I book a tour from here?', a: 'Yes. Share a date in the message and we will confirm availability.' },
    { q: 'Do you support enterprise billing?', a: 'We support consolidated invoicing and SLAs for enterprise accounts.' },
    { q: 'Where can I find refunds/cancellations?', a: 'See our Refund & Cancellation Policy in the Legal section of the footer.' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 via-white to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-900" />
          <div className="relative w-full px-6 md:px-12 lg:px-16 pt-14 pb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Contact WorkNest
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
              We’re here to help with bookings, partnerships, and product questions.
            </p>
          </div>
        </section>

        {/* Contact grid */}
        <section className="w-full px-6 md:px-12 lg:px-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

            {/* Left Info Section */}
            <aside className="md:col-span-4">
              <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition">

                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">Get in touch</div>
                </div>

                {/* Contacts */}
                <ul className="space-y-4">
                  {contacts.map((c) => (
                    <li key={c.label} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 grid place-items-center">
                        {/* Icons */}
                        {c.label === 'General Support' && (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        )}
                        {c.label === 'Sales' && (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        )}
                        {c.label === 'Phone' && (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        )}
                        {c.label === 'HQ' && (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </div>

                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white text-sm">{c.label}</div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">{c.value}</div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Office Locations */}
                <div className="mt-6">
                  <div className="text-lg font-bold text-gray-900 dark:text-white mb-3">Our Offices</div>

                  <div className="grid grid-cols-2 gap-3">
                    {['Bengaluru', 'Mumbai', 'Delhi', 'Pune'].map((c) => (
                      <div
                        key={c}
                        className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-700 dark:hover:text-brand-300"
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Form Section */}
            <div className="md:col-span-8">
              <form
                className="p-8 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">Send us a message</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Full name" required />

                  <input type="email" className="h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Work email" required />

                  <input className="h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Company (optional)" />

                  <input className="h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Phone (optional)" />

                  <select className="h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-400 md:col-span-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>General inquiry</option>
                    <option>Book a tour</option>
                    <option>Sales</option>
                    <option>Owner partnership</option>
                    <option>Support</option>
                  </select>

                  <textarea rows={5} className="md:col-span-2 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-400 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Tell us how we can help"></textarea>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    By submitting, you agree to our Terms & Privacy.
                  </div>

                  <button className="w-full sm:w-auto h-12 px-8 rounded-lg bg-gradient-to-r from-brand-600 to-brand-700 text-white font-semibold hover:from-brand-700 hover:to-brand-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Send message
                  </button>
                </div>
              </form>

              <div className="mt-6 rounded-2xl border border-gray-100 dark:border-gray-700 bg-[linear-gradient(135deg,#f6f7fb,#eef2ff)] dark:bg-[linear-gradient(135deg,#1f2937,#111827)] h-60 flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                Map placeholder
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="w-full px-6 md:px-12 lg:px-16 pb-14">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">FAQs</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((f) => (
              <div
                key={f.q}
                className="p-5 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-card"
              >
                <div className="font-semibold text-gray-900 dark:text-white">{f.q}</div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">{f.a}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
