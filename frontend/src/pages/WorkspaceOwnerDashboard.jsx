import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { ownerService } from '../services/ownerService';

const OWNER_CAPABILITIES = [
  { key: 'listings', icon: '🏢', title: 'Manage Workspace Listings', description: 'Create, update, and publish every workspace you offer.', tab: 'spaces' },
  { key: 'bookings', icon: '📅', title: 'Manage Bookings', description: 'Track reservations, statuses, and payments in one place.', tab: 'bookings' },
  { key: 'agreements', icon: '📄', title: 'Manage Agreements/Documents', description: 'Store links to contracts, NDAs, and compliance docs.', tab: 'agreements' },
  { key: 'images', icon: '🖼️', title: 'Manage Workspace Images', description: 'Keep photo galleries fresh and compelling.', tab: 'spaces' },
  { key: 'reviews', icon: '⭐', title: 'Manage Reviews', description: 'Capture voice-of-the-customer feedback and respond quickly.', tab: 'reviews' },
  { key: 'reports', icon: '📈', title: 'View Earnings & Reports', description: 'Understand performance trends, payouts, and top spaces.', tab: 'stats' },
  { key: 'history', icon: '🗂️', title: 'View Booking History', description: 'Audit past bookings for reconciliation and insights.', tab: 'bookings' },
  { key: 'support', icon: '💬', title: 'Contact Support', description: 'Reach WorkNest concierge for payouts, onboarding, and more.', tab: 'support' }
];

const DASHBOARD_TABS = [
  { key: 'stats', label: 'Overview' },
  { key: 'spaces', label: 'Listings' },
  { key: 'bookings', label: 'Bookings' },
  { key: 'tours', label: 'Tours' },
  { key: 'agreements', label: 'Agreements' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'support', label: 'Support' }
];

const DEFAULT_SPACE_FORM = {
  name: '',
  city: '',
  type: '',
  pricePerDay: '',
  amenitiesInput: '',
  imagesInput: '',
  description: ''
};

const DEFAULT_AGREEMENT_FORM = {
  space: '',
  title: '',
  documentUrl: '',
  documentType: ''
};

const DEFAULT_REVIEW_FORM = {
  space: '',
  reviewerName: '',
  rating: 5,
  comment: ''
};

const DEFAULT_SUPPORT_FORM = {
  subject: '',
  priority: 'normal',
  message: ''
};

const formatCurrency = (value = 0) => {
  try {
    return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
  } catch {
    return `₹${Number(value || 0).toFixed(0)}`;
  }
};

export default function WorkspaceOwnerDashboard() {
  const [activeTab, setActiveTab] = useState('stats');
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [overview, setOverview] = useState(null);
  const [earningsReport, setEarningsReport] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingScope, setBookingScope] = useState('active');
  const [tourBookings, setTourBookings] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [spaceForm, setSpaceForm] = useState(DEFAULT_SPACE_FORM);
  const [editingSpaceId, setEditingSpaceId] = useState(null);
  const [agreementForm, setAgreementForm] = useState(DEFAULT_AGREEMENT_FORM);
  const [reviewForm, setReviewForm] = useState(DEFAULT_REVIEW_FORM);
  const [supportForm, setSupportForm] = useState(DEFAULT_SUPPORT_FORM);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        setPageLoading(true);
        await Promise.all([loadOverview(), loadSpaces()]);
      } catch (err) {
        setError(err.message || 'Failed to load workspace dashboard');
      } finally {
        setPageLoading(false);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    if (activeTab === 'bookings') {
      loadBookings(bookingScope);
    } else if (activeTab === 'tours') {
      loadTourBookings();
    } else if (activeTab === 'agreements') {
      loadAgreements();
    } else if (activeTab === 'reviews') {
      loadReviews();
    } else if (activeTab === 'stats') {
      loadOverview();
      loadEarningsReport();
    }
  }, [activeTab, bookingScope]);

  const ownerSpacesForSelect = useMemo(
    () => spaces.map((space) => ({ id: space._id, label: `${space.name} • ${space.city}` })),
    [spaces]
  );

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  const loadOverview = async () => {
    const data = await ownerService.getOverview();
    setOverview(data);
  };

  const loadSpaces = async () => {
    const data = await ownerService.getSpaces();
    setSpaces(data.spaces || []);
  };

  const loadBookings = async (scope = 'active') => {
    const data = await ownerService.getBookings(scope);
    setBookings(data.bookings || []);
  };

  const loadTourBookings = async () => {
    const data = await ownerService.getTourRequests();
    setTourBookings(data.tourBookings || []);
  };

  const loadAgreements = async () => {
    const data = await ownerService.getAgreements();
    setAgreements(data.agreements || []);
  };

  const loadReviews = async () => {
    const data = await ownerService.getReviews();
    setReviews(data.reviews || []);
  };

  const loadEarningsReport = async () => {
    const data = await ownerService.getEarningsReport();
    setEarningsReport(data.earnings || []);
  };

  const handleCapabilitySelect = (capability) => {
    if (capability.tab) {
      setActiveTab(capability.tab);
      document.getElementById('owner-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (capability.href) {
      window.location.href = capability.href;
    }
  };

  const startSpaceEdit = (space) => {
    resetMessages();
    setEditingSpaceId(space._id);
    setSpaceForm({
      name: space.name || '',
      city: space.city || '',
      type: space.type || '',
      pricePerDay: space.pricePerDay || '',
      amenitiesInput: (space.amenities || []).join(', '),
      imagesInput: (space.images || []).join('\n'),
      description: space.description || ''
    });
  };

  const handleSpaceSubmit = async (event) => {
    event.preventDefault();
    resetMessages();
    try {
      const payload = {
        name: spaceForm.name.trim(),
        city: spaceForm.city.trim(),
        type: spaceForm.type.trim(),
        pricePerDay: Number(spaceForm.pricePerDay),
        amenities: spaceForm.amenitiesInput.split(',').map((item) => item.trim()).filter(Boolean),
        images: spaceForm.imagesInput.split('\n').map((item) => item.trim()).filter(Boolean),
        description: spaceForm.description.trim()
      };

      if (editingSpaceId) {
        await ownerService.updateSpace(editingSpaceId, payload);
        setSuccess('Workspace updated successfully.');
      } else {
        await ownerService.createSpace(payload);
        setSuccess('Workspace created successfully.');
      }

      await loadSpaces();
      await loadOverview();
      setEditingSpaceId(null);
      setSpaceForm(DEFAULT_SPACE_FORM);
    } catch (err) {
      setError(err.message || 'Failed to save workspace.');
    }
  };

  const handleDeleteSpace = async (spaceId) => {
    if (!window.confirm('Delete this workspace?')) return;
    resetMessages();
    try {
      await ownerService.deleteSpace(spaceId);
      await loadSpaces();
      await loadOverview();
      setSuccess('Workspace deleted.');
    } catch (err) {
      setError(err.message || 'Failed to delete workspace.');
    }
  };

  const handleAgreementSubmit = async (event) => {
    event.preventDefault();
    resetMessages();
    try {
      if (!agreementForm.space) {
        throw new Error('Choose a workspace for this agreement.');
      }
      await ownerService.createAgreement(agreementForm);
      await loadAgreements();
      setAgreementForm(DEFAULT_AGREEMENT_FORM);
      setSuccess('Agreement saved.');
    } catch (err) {
      setError(err.message || 'Failed to save agreement.');
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    resetMessages();
    try {
      if (!reviewForm.space) {
        throw new Error('Select a workspace to attach the review.');
      }
      await ownerService.createReview(reviewForm);
      await loadReviews();
      setReviewForm(DEFAULT_REVIEW_FORM);
      setSuccess('Review captured.');
    } catch (err) {
      setError(err.message || 'Failed to save review.');
    }
  };

  const toggleReviewStatus = async (review) => {
    resetMessages();
    const nextStatus = review.status === 'published' ? 'hidden' : 'published';
    await ownerService.updateReview(review._id, { status: nextStatus });
    await loadReviews();
  };

  const handleSupportSubmit = async (event) => {
    event.preventDefault();
    resetMessages();
    try {
      if (!supportForm.subject.trim() || !supportForm.message.trim()) {
        throw new Error('Subject and message are required.');
      }
      await ownerService.submitSupportTicket(supportForm);
      setSupportForm(DEFAULT_SUPPORT_FORM);
      setSuccess('Support ticket submitted.');
    } catch (err) {
      setError(err.message || 'Failed to submit support ticket.');
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-sky-600 mx-auto" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
            </svg>
            <p className="mt-4 text-gray-600">Loading workspace owner dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 py-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">Workspace Owner Dashboard</h1>
          <p className="text-gray-600 mt-2">Operate every workspace workflow from a single control centre.</p>
        </div>

        {error && <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-600">{error}</div>}
        {success && <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">{success}</div>}

        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">Owner Capabilities</p>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">Everything you can manage with WorkNest</h2>
            </div>
            <span className="text-sm text-gray-500">{OWNER_CAPABILITIES.length} workflows</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OWNER_CAPABILITIES.map((capability) => (
              <button
                key={capability.key}
                type="button"
                onClick={() => handleCapabilitySelect(capability)}
                className="text-left p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="text-3xl mb-3">{capability.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900">{capability.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{capability.description}</p>
              </button>
            ))}
          </div>
        </section>

        <div id="owner-tabs" className="mb-6 border-b border-gray-200 overflow-x-auto">
          <nav className="-mb-px flex space-x-6">
            {DASHBOARD_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-3 px-1 border-b-2 font-semibold text-sm whitespace-nowrap ${
                  activeTab === tab.key ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'stats' && overview && (
          <section className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Spaces" value={overview.stats.totalSpaces} />
              <StatCard label="Active Bookings" value={overview.stats.activeBookings} helper={`Total: ${overview.stats.totalBookings}`} />
              <StatCard label="Total Revenue" value={formatCurrency(overview.stats.totalRevenue)} />
              <StatCard label="Tour Requests" value={overview.stats.tourRequests} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
                <SectionHeader title="Revenue trend" helper="Monthly totals" />
                {overview.trends.earningsByMonth.length === 0 ? (
                  <EmptyState message="No revenue yet. Earnings will appear once bookings are confirmed." />
                ) : (
                  <div className="space-y-3 mt-4">
                    {overview.trends.earningsByMonth.map((entry) => (
                      <div key={entry._id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 text-sm">
                        <span className="font-medium text-slate-600">{entry._id}</span>
                        <span className="font-semibold text-slate-900">{formatCurrency(entry.total)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
                <SectionHeader title="Top earning spaces" helper="Based on bookings" />
                {overview.trends.topSpaces.length === 0 ? (
                  <EmptyState message="No booking data yet." />
                ) : (
                  <div className="space-y-4 mt-4 text-sm">
                    {overview.trends.topSpaces.map((space) => (
                      <div key={space.spaceId} className="p-4 border border-slate-100 rounded-xl">
                        <p className="font-semibold text-slate-900">{space.name}</p>
                        <p className="text-xs text-slate-500">{space.city}</p>
                        <p className="text-xs text-slate-600 mt-1">Revenue: {formatCurrency(space.totalRevenue)}</p>
                        <p className="text-xs text-slate-500">Bookings: {space.bookings}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
              <SectionHeader title="Workspace earnings report" helper="Per listing breakdown" />
              {earningsReport.length === 0 ? (
                <EmptyState message="No earnings data available yet." />
              ) : (
                <div className="overflow-x-auto mt-4 text-sm">
                  <table className="min-w-full text-left divide-y divide-slate-100">
                    <thead>
                      <tr className="text-xs uppercase text-slate-500">
                        <th className="py-2">Workspace</th>
                        <th className="py-2">City</th>
                        <th className="py-2">Paid revenue</th>
                        <th className="py-2">Total revenue</th>
                        <th className="py-2">Completed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {earningsReport.map((row) => (
                        <tr key={row.spaceId}>
                          <td className="py-2 font-semibold">{row.name}</td>
                          <td className="py-2 text-slate-500">{row.city}</td>
                          <td className="py-2">{formatCurrency(row.paidRevenue)}</td>
                          <td className="py-2">{formatCurrency(row.totalRevenue)}</td>
                          <td className="py-2">{row.completed}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'spaces' && (
          <section className="space-y-8">
            <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
              <SectionHeader title={editingSpaceId ? 'Update workspace' : 'Create workspace'} helper="Provide detail-rich listings" />
              <form onSubmit={handleSpaceSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <TextField label="Workspace name" value={spaceForm.name} onChange={(value) => setSpaceForm((prev) => ({ ...prev, name: value }))} required />
                <TextField label="City" value={spaceForm.city} onChange={(value) => setSpaceForm((prev) => ({ ...prev, city: value }))} required />
                <TextField label="Type" value={spaceForm.type} onChange={(value) => setSpaceForm((prev) => ({ ...prev, type: value }))} placeholder="Hot Desk, Private Office ..." required />
                <TextField label="Price per day" type="number" value={spaceForm.pricePerDay} onChange={(value) => setSpaceForm((prev) => ({ ...prev, pricePerDay: value }))} required />
                <TextArea label="Amenities (comma separated)" value={spaceForm.amenitiesInput} onChange={(value) => setSpaceForm((prev) => ({ ...prev, amenitiesInput: value }))} rows={2} />
                <TextArea label="Image URLs (one per line)" value={spaceForm.imagesInput} onChange={(value) => setSpaceForm((prev) => ({ ...prev, imagesInput: value }))} rows={3} />
                <div className="md:col-span-2">
                  <TextArea label="Description" value={spaceForm.description} onChange={(value) => setSpaceForm((prev) => ({ ...prev, description: value }))} rows={3} />
                </div>
                <div className="md:col-span-2 flex items-center gap-3">
                  {editingSpaceId && (
                    <button type="button" onClick={() => { setEditingSpaceId(null); setSpaceForm(DEFAULT_SPACE_FORM); }} className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold">
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 text-white font-semibold shadow-md">
                    {editingSpaceId ? 'Update workspace' : 'Create workspace'}
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Your listings</h3>
              {spaces.length === 0 ? (
                <EmptyState message="No spaces yet. Use the form above to publish your first listing." />
              ) : (
                spaces.map((space) => (
                  <div key={space._id} className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-lg font-bold text-slate-900">{space.name}</p>
                      <p className="text-sm text-slate-500">{space.city} • {space.type}</p>
                      <p className="text-sm text-slate-800 mt-1">Rate: {formatCurrency(space.pricePerDay)}</p>
                      <p className="text-xs text-slate-500 mt-1">Amenities: {(space.amenities || []).join(', ') || '—'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold" onClick={() => startSpaceEdit(space)}>
                        Edit
                      </button>
                      <button className="px-4 py-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-semibold" onClick={() => handleDeleteSpace(space._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {activeTab === 'bookings' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <SectionHeader title="Bookings" helper="Monitor reservations and history" />
              <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50">
                {['active', 'history'].map((scope) => (
                  <button
                    key={scope}
                    type="button"
                    onClick={() => setBookingScope(scope)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${bookingScope === scope ? 'bg-white text-sky-600 shadow' : 'text-slate-500'}`}
                  >
                    {scope === 'active' ? 'Active' : 'History'}
                  </button>
                ))}
              </div>
            </div>
            {bookings.length === 0 ? (
              <EmptyState message="No bookings to show for this view." />
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col sm:flex-row sm:justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{booking.space?.name}</p>
                      <p className="text-xs text-slate-500">{booking.space?.city}</p>
                      <p className="text-sm text-slate-600 mt-1">Guest: {booking.user?.fullName || booking.user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                      <p className="text-sm text-slate-600">Type: {booking.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-800">{formatCurrency(booking.totalAmount)}</p>
                      <span className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                        booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'tours' && (
          <section className="space-y-6">
            <SectionHeader title="Tour requests" helper="Coordinate walk-throughs and demos" />
            {tourBookings.length === 0 ? (
              <EmptyState message="No tour requests yet." />
            ) : (
              <div className="space-y-4">
                {tourBookings.map((tour) => (
                  <div key={tour._id} className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col sm:flex-row sm:justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{tour.space?.name}</p>
                      <p className="text-xs text-slate-500">{tour.space?.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">{tour.contactName}</p>
                      <p className="text-xs text-slate-500">{tour.contactEmail}</p>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                      {new Date(tour.tourDate).toLocaleDateString()} • {tour.tourTime}
                      <p className="text-xs text-slate-500">{tour.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'agreements' && (
          <section className="space-y-6">
            <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
              <SectionHeader title="Store agreements" helper="Keep documents handy for every booking" />
              <form onSubmit={handleAgreementSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <SelectField label="Workspace" value={agreementForm.space} onChange={(value) => setAgreementForm((prev) => ({ ...prev, space: value }))} options={ownerSpacesForSelect} required />
                <TextField label="Document title" value={agreementForm.title} onChange={(value) => setAgreementForm((prev) => ({ ...prev, title: value }))} required />
                <TextField label="Document link" value={agreementForm.documentUrl} onChange={(value) => setAgreementForm((prev) => ({ ...prev, documentUrl: value }))} placeholder="https://..." required />
                <TextField label="Document type" value={agreementForm.documentType} onChange={(value) => setAgreementForm((prev) => ({ ...prev, documentType: value }))} placeholder="NDA, Contract, License ..." />
                <div className="md:col-span-2 flex justify-end">
                  <button type="submit" className="px-6 py-3 rounded-xl bg-sky-600 text-white font-semibold">Save agreement</button>
                </div>
              </form>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Documents</h3>
              {agreements.length === 0 ? (
                <EmptyState message="No agreements saved yet." />
              ) : (
                agreements.map((agreement) => (
                  <div key={agreement._id} className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col sm:flex-row sm:justify-between gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-slate-900">{agreement.title}</p>
                      <p className="text-xs text-slate-500">{agreement.space?.name}</p>
                    </div>
                    <div className="text-slate-500 text-xs flex-1">
                      {agreement.documentType && <p>Type: {agreement.documentType}</p>}
                    </div>
                    <div className="text-right">
                      <a href={agreement.documentUrl} target="_blank" rel="noreferrer" className="text-sky-600 font-semibold text-sm">
                        View document
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {activeTab === 'reviews' && (
          <section className="space-y-6">
            <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
              <SectionHeader title="Add review" helper="Record client feedback after visits" />
              <form onSubmit={handleReviewSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <SelectField label="Workspace" value={reviewForm.space} onChange={(value) => setReviewForm((prev) => ({ ...prev, space: value }))} options={ownerSpacesForSelect} required />
                <TextField label="Reviewer name" value={reviewForm.reviewerName} onChange={(value) => setReviewForm((prev) => ({ ...prev, reviewerName: value }))} placeholder="Optional" />
                <TextField label="Rating (1-5)" type="number" value={reviewForm.rating} onChange={(value) => setReviewForm((prev) => ({ ...prev, rating: Number(value) }))} min="1" max="5" required />
                <div className="md:col-span-2">
                  <TextArea label="Comment" value={reviewForm.comment} onChange={(value) => setReviewForm((prev) => ({ ...prev, comment: value }))} rows={3} required />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button type="submit" className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold">Save review</button>
                </div>
              </form>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Guest feedback</h3>
              {reviews.length === 0 ? (
                <EmptyState message="No reviews captured yet." />
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{review.space?.name}</p>
                        <p className="text-xs text-slate-500">{review.reviewerName || 'Guest'}</p>
                      </div>
                      <p className="text-lg font-bold text-amber-500">{review.rating} ⭐</p>
                    </div>
                    <p className="text-slate-600 mt-3">{review.comment}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>Status: {review.status}</span>
                      <button onClick={() => toggleReviewStatus(review)} className="text-sky-600 font-semibold">
                        {review.status === 'published' ? 'Hide review' : 'Publish review'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {activeTab === 'support' && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
              <SectionHeader title="Contact WorkNest support" helper="We usually reply within a business day" />
              <form onSubmit={handleSupportSubmit} className="space-y-4 mt-4">
                <TextField label="Subject" value={supportForm.subject} onChange={(value) => setSupportForm((prev) => ({ ...prev, subject: value }))} required />
                <div>
                  <label className="text-sm font-medium text-slate-600">Priority</label>
                  <select
                    className="mt-2 w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:outline-none focus:border-sky-400"
                    value={supportForm.priority}
                    onChange={(e) => setSupportForm((prev) => ({ ...prev, priority: e.target.value }))}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <TextArea label="Message" value={supportForm.message} onChange={(value) => setSupportForm((prev) => ({ ...prev, message: value }))} rows={5} required />
                <button type="submit" className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 text-white font-semibold">
                  Send message
                </button>
              </form>
            </div>
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
                <p className="text-sm font-semibold text-slate-500 uppercase">Profile</p>
                <h3 className="text-xl font-bold text-slate-900">Keep your contact details fresh</h3>
                <p className="text-sm text-slate-600 mt-2">Support and payout teams rely on your profile to reach you.</p>
                <Link to="/profile" className="inline-flex items-center mt-4 text-sky-600 font-semibold">
                  Update profile
                  <span className="ml-2">→</span>
                </Link>
              </div>
              <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
                <p className="text-sm font-semibold text-slate-500 uppercase">Need immediate help?</p>
                <h3 className="text-xl font-bold text-slate-900">Email support@worknest.com</h3>
                <p className="text-sm text-slate-600 mt-2">We’re available Monday–Saturday, 9am–8pm IST.</p>
                <a href="mailto:support@worknest.com" className="inline-flex items-center mt-4 text-sky-600 font-semibold">
                  support@worknest.com
                </a>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

function StatCard({ label, value, helper }) {
  return (
    <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
      {helper && <p className="text-xs text-slate-500 mt-1">{helper}</p>}
    </div>
  );
}

function SectionHeader({ title, helper }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      {helper && <p className="text-xs text-slate-500">{helper}</p>}
    </div>
  );
}

function EmptyState({ message }) {
  return <div className="text-center py-14 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-sm">{message}</div>;
}

function TextField({ label, value, onChange, type = 'text', placeholder, required, min, max }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-600">{label}</label>
      <input
        type={type}
        value={value}
        min={min}
        max={max}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:outline-none focus:border-sky-400"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3, required }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-600">{label}</label>
      <textarea
        rows={rows}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:outline-none focus:border-sky-400"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options, required }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-600">{label}</label>
      <select
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:outline-none focus:border-sky-400"
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

