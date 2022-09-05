export default function Tabs({ children, items, tabsSelected }) {
  const [btnSelected, setBtnSelected] = tabsSelected;

  return (
    <>
      <div className="w-full flex justify-center space-x-2 mb-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setBtnSelected(item.id)}
            className={`h-8 px-5 rounded hover:shadow hover:bg-indigo-50 hover:text-indigo-500 ${
              btnSelected === item.id
                ? "bg-indigo-100 text-indigo-500"
                : "text-slate-500"
            }`}>
            {item.label}
          </button>
        ))}
      </div>
      {children}
    </>
  );
}
