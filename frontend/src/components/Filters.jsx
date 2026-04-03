const controlBase =
  'md:col-span-3 h-11 px-3 rounded-lg border transition-colors ' +
  'text-gray-900 dark:text-gray-100 ' +
  'bg-white dark:bg-slate-800 ' +
  'border-gray-200 dark:border-slate-600 ' +
  'placeholder:text-gray-500 dark:placeholder:text-gray-400 ' +
  'focus:outline-none focus:ring-2 focus:ring-brand-400 dark:focus:ring-brand-500 ' +
  'focus:border-brand-400 dark:focus:border-brand-500';

const selectBase =
  `${controlBase} cursor-pointer dark:[color-scheme:dark]`;

const optionClass =
  'text-gray-900 bg-white dark:text-gray-100 dark:bg-slate-800';

export default function Filters({ cities, types, values, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
      <select
        className={selectBase}
        value={values.city}
        onChange={(e) => onChange({ ...values, city: e.target.value })}
      >
        <option className={optionClass} value="">
          All cities
        </option>
        {cities.map((c) => (
          <option className={optionClass} key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        className={selectBase}
        value={values.type}
        onChange={(e) => onChange({ ...values, type: e.target.value })}
      >
        <option className={optionClass} value="">
          All solutions
        </option>
        {types.map((t) => (
          <option className={optionClass} key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <input
        type="number"
        min={0}
        placeholder="Min price"
        className={controlBase}
        value={values.minPrice}
        onChange={(e) => onChange({ ...values, minPrice: e.target.value })}
      />
      <input
        type="number"
        min={0}
        placeholder="Max price"
        className={controlBase}
        value={values.maxPrice}
        onChange={(e) => onChange({ ...values, maxPrice: e.target.value })}
      />
    </div>
  );
}
