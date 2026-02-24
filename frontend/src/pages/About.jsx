import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import homePageImage from '../images/Home_page.jpg';
import coworkingSpace1 from '../images/running-a-successful-coworking-space-5aaa98c0bb414814ce745dc8.jpg';
import coworkingSpace2 from '../images/austin-distel-wawEfYdpkag-unsplash.jpg';
import coworkingSpace3 from '../images/infralist-com-kmIKEGO7Vl4-unsplash.jpg';
import coworkingSpace4 from '../images/pawel-chu-ULh0i2txBCY-unsplash.jpg';
import coworkingSpace5 from '../images/suryadhityas-NrDZJ9oWV_Y-unsplash.jpg';
import coworkingSpace6 from '../images/uneebo-office-design-UgYT5nkXdK4-unsplash.jpg';
import meetingRoom from '../images/meeting_room.jpeg';
import privateOffice from '../images/private_office.jpeg';
import hotDesk from '../images/hot_desk.jpeg';
import workspaceDesign1 from '../images/The-Anatomy-of-Good-Coworking-Space-Design-In-Pictures-Fohlio-Product-Specification-and-Materials-Budget-Calculator-The-Assemblage-1.webp';
import workspaceDesign2 from '../images/The-Anatomy-of-Good-Coworking-Space-Design-In-Pictures-Fohlio-Product-Specification-and-Materials-Budget-Calculator-WeWork-Shanghai-1.webp';
export default function About() {
  const stats = [
    { label: 'Cities Served', value: '12+', image: coworkingSpace1 },
    { label: 'Spaces Listed', value: '1,200+', image: coworkingSpace2 },
    { label: 'Bookings Completed', value: '50k+', image: coworkingSpace3 },
    { label: 'Avg. Rating', value: '4.7/5', image: coworkingSpace4 }
  ];
  const values = [
    {
      title: 'Customer-first',
      desc: 'Every decision puts our users and owners at the center.',
      image: coworkingSpace5
    },
    {
      title: 'Trust & Security',
      desc: 'Secure payments, verified listings, and transparent policies.',
      image: coworkingSpace6
    },
    {
      title: 'Speed & Reliability',
      desc: 'Fast discovery, real-time availability, and dependable support.',
      image: meetingRoom
    },
    {
      title: 'Sustainability',
      desc: 'Optimizing utilization to reduce unused space and energy.',
      image: privateOffice
    }
  ];
  const timeline = [
    {
      year: '2023',
      title: 'Concept & Research',
      desc: 'Studied the workspace market and pain points across cities.',
      image: workspaceDesign1
    },
    {
      year: '2024',
      title: 'MVP & Early Partners',
      desc: 'Launched MVP with select owners and validated key flows.',
      image: workspaceDesign2
    },
    {
      year: '2025',
      title: 'Scale & Polish',
      desc: 'Introduced payments, reviews, dashboards, and a modern UI.',
      image: coworkingSpace1
    }
  ];
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <main className="flex-1">
        {}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={homePageImage}
              alt="WorkNest Workspace"
              className="w-full h-full object-cover opacity-20 dark:opacity-10"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-900" />
          </div>
          <div className="relative w-full px-6 md:px-12 lg:px-16 pt-16 pb-12">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">About WorkNest</h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">We are building the most seamless way to discover, compare, and book co-working spaces—so teams can focus on their best work, not logistics.</p>
            </div>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'Cities Served', value: '12+', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', bgClass: 'bg-blue-50', textClass: 'text-blue-600', gradientClass: 'from-blue-500 to-blue-600', image: stats[0].image },
                { label: 'Spaces Listed', value: '1,200+', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', bgClass: 'bg-brand-50', textClass: 'text-brand-600', gradientClass: 'from-brand-500 to-brand-600', image: stats[1].image },
                { label: 'Bookings Completed', value: '50k+', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', bgClass: 'bg-green-50', textClass: 'text-green-600', gradientClass: 'from-green-500 to-green-600', image: stats[2].image },
                { label: 'Avg. Rating', value: '4.7/5', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', bgClass: 'bg-amber-50', textClass: 'text-amber-600', gradientClass: 'from-amber-500 to-amber-600', image: stats[3].image }
              ].map((s) => (
                <div key={s.label} className="group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                    <img src={s.image} alt={s.label} className="w-full h-full object-cover" />
                  </div>
                  <div className="relative p-6">
                    <div className={`w-10 h-10 rounded-lg ${s.bgClass} dark:bg-opacity-20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <svg className={`w-5 h-5 ${s.textClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                      </svg>
                    </div>
                    <div className={`text-2xl md:text-3xl font-extrabold bg-gradient-to-r ${s.gradientClass} bg-clip-text text-transparent`}>{s.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {}
        <section className="w-full px-6 md:px-12 lg:px-16 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-7">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Our mission</h2>
              <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">WorkNest exists to make quality workspaces accessible to everyone—from founders and freelancers to fast-growing teams. We bring transparency to availability and pricing, unify communication between users and owners, and streamline the booking experience with secure payments and clear agreements.</p>
              <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">By connecting under-utilized spaces with flexible demand, we help cities run more efficiently while giving teams the choice to work where they produce their best.</p>
            </div>
            <div className="md:col-span-5">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={coworkingSpace1}
                  alt="Modern coworking space"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </section>
        {}
        <section className="w-full px-6 md:px-12 lg:px-16 py-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our values</h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Customer-first', desc: 'Every decision puts our users and owners at the center.', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', bgClass: 'bg-brand-50', textClass: 'text-brand-600', image: values[0].image },
              { title: 'Trust & Security', desc: 'Secure payments, verified listings, and transparent policies.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', bgClass: 'bg-green-50', textClass: 'text-green-600', image: values[1].image },
              { title: 'Speed & Reliability', desc: 'Fast discovery, real-time availability, and dependable support.', icon: 'M13 10V3L4 14h7v7l9-11h-7z', bgClass: 'bg-blue-50', textClass: 'text-blue-600', image: values[2].image },
              { title: 'Sustainability', desc: 'Optimizing utilization to reduce unused space and energy.', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', bgClass: 'bg-emerald-50', textClass: 'text-emerald-600', image: values[3].image }
            ].map((v) => (
              <div key={v.title} className="group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                  <img src={v.image} alt={v.title} className="w-full h-full object-cover" />
                </div>
                <div className="relative p-6">
                  <div className={`w-12 h-12 rounded-xl ${v.bgClass} dark:bg-opacity-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <svg className={`w-6 h-6 ${v.textClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={v.icon} />
                    </svg>
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{v.title}</div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        {}
        <section className="w-full px-6 md:px-12 lg:px-16 py-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our journey</h3>
          <div className="mt-6 relative">
            <div className="absolute left-3 md:left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-6">
              {timeline.map((t, idx) => (
                <div key={t.year} className="relative pl-12 group">
                  <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white text-xs font-bold flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform z-10">{t.year.slice(2)}</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="md:col-span-2 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{t.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">{t.year}</div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t.desc}</div>
                    </div>
                    <div className="md:col-span-1">
                      <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                        <img
                          src={t.image}
                          alt={t.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {}
        <section className="w-full px-6 md:px-12 lg:px-16 py-12 bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Workspace Types We Offer</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Discover the perfect workspace solution for your needs.</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Hot Desk', desc: 'Flexible shared workspace perfect for freelancers and remote workers.', image: hotDesk, gradient: 'from-amber-400 to-orange-600' },
              { name: 'Private Office', desc: 'Dedicated private spaces for teams needing focused work environments.', image: privateOffice, gradient: 'from-blue-400 to-blue-600' },
              { name: 'Meeting Room', desc: 'Professional meeting spaces equipped with modern technology.', image: meetingRoom, gradient: 'from-purple-400 to-purple-600' }
            ].map((workspace, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={workspace.image}
                    alt={workspace.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${workspace.gradient} shadow-lg mb-4 flex items-center justify-center`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-white">{workspace.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{workspace.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {}
        <section className="bg-gradient-to-r from-brand-600 to-brand-700">
          <div className="w-full px-6 md:px-12 lg:px-16 py-12 md:py-14 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-white text-2xl font-bold">Join WorkNest</h4>
              <p className="text-white/90 mt-1">List your space or book your next workspace today.</p>
            </div>
            <div className="flex gap-3">
              <a href="/search" className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-white text-brand-700 font-semibold hover:bg-gray-100">Explore spaces</a>
              <a href="#list-space" className="inline-flex items-center justify-center h-11 px-6 rounded-lg border border-white/40 text-white font-semibold hover:bg-white/10">List your space</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}