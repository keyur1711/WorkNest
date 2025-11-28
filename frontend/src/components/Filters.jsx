export default function Filters({ cities, types, values, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
      <select
        className="md:col-span-3 h-11 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
        value={values.city}
        onChange={(e) => onChange({ ...values, city: e.target.value })}
      >
        <option value="">All cities</option>
        {cities.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select
        className="md:col-span-3 h-11 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
        value={values.type}
        onChange={(e) => onChange({ ...values, type: e.target.value })}
      >
        <option value="">All solutions</option>
        {types.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <input
        type="number"
        min={0}
        placeholder="Min price"
        className="md:col-span-3 h-11 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-400"
        value={values.minPrice}
        onChange={(e) => onChange({ ...values, minPrice: e.target.value })}
      />
      <input
        type="number"
        min={0}
        placeholder="Max price"
        className="md:col-span-3 h-11 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-400"
        value={values.maxPrice}
        onChange={(e) => onChange({ ...values, maxPrice: e.target.value })}
      />
    </div>
  );
}


