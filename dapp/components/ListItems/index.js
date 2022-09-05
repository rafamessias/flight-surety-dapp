export default function ListItems({ items = [], title }) {
  return (
    <div>
      <h4 className="mb-2 text-base text-slate-700">{title}</h4>
      <ul className="space-y-1 text-sm text-slate-500">
        {items.map((item) => (
          <li key={item.id}>
            <span className="inline-block font-bold w-6">{item.id}</span>
            <span className="ml-2">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
