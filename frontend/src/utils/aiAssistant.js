const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const parseFirstNumber = (text) => {
  if (!text) return null;
  const m = String(text).match(/(\d[\d,]*)/);
  if (!m) return null;
  const normalized = m[1].replace(/,/g, '');
  const num = Number(normalized);
  return Number.isFinite(num) ? num : null;
};

export const generateAssistantReply = (userText, opts = {}) => {
  const text = String(userText || '').trim().toLowerCase();
  const history = opts?.history || {};

  const has = (kw) => text.includes(kw);
  const wantsMeeting = ['meeting', 'conference', 'presentation', 'client call', 'workshop'].some(has);
  const wantsPrivate = ['private', 'office', 'room'].some(has);
  const wantsDedicated = ['dedicated', 'fixed desk', 'desk'].some(has);
  const wantsHot = ['hot desk', 'flex', 'cowork', 'coworking', 'shared'].some(has);
  const wantsQuiet = ['quiet', 'silent', 'focus', 'calm'].some(has);
  const wantsWifi = ['wifi', 'internet', 'fast internet', 'broadband'].some(has);
  const wantsParking = ['parking', 'bike', 'bikes'].some(has);

  let recommendedSpaceType = history?.recommendedSpaceType || 'Hot Desk';
  if (wantsMeeting) recommendedSpaceType = 'Meeting Room';
  else if (wantsPrivate && !wantsMeeting) recommendedSpaceType = 'Private Office';
  else if (wantsDedicated && !wantsMeeting) recommendedSpaceType = 'Dedicated Desk';
  else if (wantsHot) recommendedSpaceType = 'Hot Desk';

  const recommendedCity = history?.recommendedCity || null;

  const amenities = [];
  if (wantsWifi) amenities.push('Fast Wi-Fi / reliable internet');
  else amenities.push('Reliable Wi-Fi (recommended)');

  if (wantsMeeting) {
    amenities.push('Projector/TV support (if available)');
    amenities.push('Whiteboard / screen sharing');
  }

  if (wantsPrivate) amenities.push('Private work area / privacy');
  if (wantsDedicated) amenities.push('Dedicated seating / consistent setup');
  amenities.push('Comfortable seating and ergonomic chairs');
  if (wantsQuiet) amenities.push('Low-noise zones / focus-friendly setup');
  if (wantsParking) amenities.push('Parking availability');

  // Estimate a rough budget range based on the first number we can find.
  // This is not financial logic; it's just UX-friendly guidance.
  const rawBudget = parseFirstNumber(text);
  let budgetHint = 'Flexible pricing: choose based on your usage';
  if (rawBudget !== null) {
    if (rawBudget <= 200) budgetHint = `Estimated range: Hot Desk budgets (around 0 to 200)`;
    else if (rawBudget <= 400) budgetHint = `Estimated range: Dedicated Desk / Office lite budgets (around 200 to 400)`;
    else budgetHint = `Estimated range: Meeting Room / Private Office budgets (around 400+)`;
  }

  const filters = [
    recommendedSpaceType === 'Meeting Room' ? 'Meeting-friendly amenities' : 'Good for work sessions',
    wantsWifi ? 'Strong internet' : 'Wi-Fi included',
    wantsQuiet ? 'Quiet/focus' : 'Comfortable seating',
    wantsPrivate ? 'Privacy' : 'Flexible desk options'
  ];

  // Short “pro-style” response
  const summary = recommendedCity
    ? `Based on what you shared, I recommend: ${recommendedSpaceType} in ${recommendedCity}.`
    : `Based on what you shared, I recommend: ${recommendedSpaceType}.`;
  const nextSteps =
    'Next, open Search and use these filters: ' +
    filters
      .slice(0, 3)
      .map((f) => f)
      .join(', ') +
    '. Then pick a date and complete the booking flow. You can also switch plans anytime from Pricing.';

  const message = [summary, '', 'Suggested amenities:', ...amenities.map((a) => `- ${a}`), '', budgetHint, '', nextSteps].join(
    '\n'
  );

  // Keep the “structured” data for nicer UI cards.
  return {
    message,
    meta: {
      recommendedSpaceType,
      recommendedCity,
      amenities: Array.from(new Set(amenities)).slice(0, 6),
      budgetHint,
      filters: Array.from(new Set(filters)).slice(0, 4)
    }
  };
};

