import { Link } from 'react-router-dom';

const PlanDetails = ({ userPlan, expiresAt }) => {
  if (!userPlan) return null;
  return (
    <div className="mt-4 rounded-xl border border-slate-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/50 p-4">
      <div className="text-sm text-gray-700 dark:text-gray-200">
        Current subscription: <span className="font-semibold">{userPlan}</span>
      </div>
      {expiresAt && (
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Valid till: {new Date(expiresAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default function ProPaywall({
  title = 'Unlock WorkNest AI',
  subtitle = 'Upgrade to Pro to access the AI Workspace Assistant and smart suggestions.',
  userPlan,
  expiresAt
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <div className="flex-1 flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-2xl">
          <div className="rounded-3xl border border-slate-200 dark:border-gray-800 bg-gradient-to-b from-indigo-50/70 to-white dark:from-gray-900/40 dark:to-gray-900 p-8 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 dark:bg-indigo-900/40 dark:text-indigo-100 text-sm font-semibold">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-600" />
              Pro feature locked
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {title}
            </h1>
            <p className="mt-3 text-gray-700 dark:text-gray-200 text-base leading-relaxed">
              {subtitle}
            </p>

            <ul className="mt-6 space-y-2 text-sm text-gray-700 dark:text-gray-200">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-block w-6 h-6 rounded-lg bg-indigo-600/10 text-indigo-700 dark:text-indigo-200 flex items-center justify-center font-bold">
                  ✓
                </span>
                AI workspace recommendations tailored to your needs
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-block w-6 h-6 rounded-lg bg-indigo-600/10 text-indigo-700 dark:text-indigo-200 flex items-center justify-center font-bold">
                  ✓
                </span>
                Smart filters you can use when booking spaces
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-block w-6 h-6 rounded-lg bg-indigo-600/10 text-indigo-700 dark:text-indigo-200 flex items-center justify-center font-bold">
                  ✓
                </span>
                Faster planning for meeting rooms and private offices
              </li>
            </ul>

            <PlanDetails userPlan={userPlan} expiresAt={expiresAt} />

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold hover:from-indigo-700 hover:to-blue-700 transition shadow"
              >
                Upgrade to User Pro
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center justify-center h-12 px-6 rounded-xl border border-slate-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white font-semibold hover:bg-white dark:hover:bg-gray-800 transition"
              >
                Browse spaces
              </Link>
            </div>

            <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
              Tip: Once you upgrade, return here to start chatting with the assistant.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

