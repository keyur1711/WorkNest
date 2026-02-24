const ratingScale = [1, 2, 3, 4, 5];
export default function BookingReviewModal({
  booking,
  isOpen,
  reviewForm,
  onChange,
  onSubmit,
  onClose,
  submitting,
  error
}) {
  if (!isOpen || !booking) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/50">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Rate your experience</p>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{booking.spaceName || booking.space?.name}</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <span className="sr-only">Close</span>
            &times;
          </button>
        </div>
        <div className="px-6 py-5 space-y-5">
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-600 px-4 py-3 text-sm">
              {error}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your rating</p>
            <div className="flex items-center gap-2">
              {ratingScale.map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => onChange({ ...reviewForm, rating: star })}
                  className={`text-3xl transition ${
                    reviewForm.rating >= star
                      ? 'text-amber-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                >
                  ★
                </button>
              ))}
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {reviewForm.rating} / 5
              </span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Share your feedback
            </label>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
              placeholder="Tell us about your experience..."
              value={reviewForm.comment}
              onChange={(e) => onChange({ ...reviewForm, comment: e.target.value })}
            ></textarea>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting || !reviewForm.rating}
            className="px-4 py-2 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 transition disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit review'}
          </button>
        </div>
      </div>
    </div>
  );
}