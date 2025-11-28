export default function MapView({ spaces }) {
  return (
    <div className="w-full h-[500px] rounded-2xl border border-gray-100 bg-[linear-gradient(135deg,#f6f7fb,#eef2ff)] p-4">
      <div className="text-sm font-semibold text-gray-700">Map view (placeholder)</div>
      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-700">
        {spaces.map((s) => (
          <div key={s.id} className="p-3 rounded-lg bg-white shadow-sm border border-gray-100">
            <div className="font-medium">{s.name}</div>
            <div className="text-gray-500">{s.city}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


