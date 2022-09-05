import useAppContext from "contexts/AppContext/useAppContext";

export default function SubHeader() {
  const { currentPage } = useAppContext();

  return (
    <div className="h-20 w-full py-2 px-4 flex items-center bg-white shadow-sm mb-10">
      <h3 className="text-3xl font-bold text-stone-800">{currentPage.label}</h3>
    </div>
  );
}
