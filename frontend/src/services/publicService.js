const API_BASE =
  (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api').replace(
    /\/$/,
    ''
  );

/**
 * Public marketing stats (no auth).
 */
export async function getPublicStats() {
  const url = `${API_BASE}/public/stats`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    const err = new Error('Failed to load stats');
    err.status = res.status;
    throw err;
  }
  return res.json();
}
