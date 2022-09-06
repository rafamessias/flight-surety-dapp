import useAppContext from "contexts/AppContext/useAppContext";

export default function SubHeader() {
  const { currentPage } = useAppContext();

  return (
    <div className="z-0 h-20 w-full py-2 px-4 flex items-center justify-between bg-white shadow-sm mb-8">
      <h3 className="text-3xl font-bold text-stone-800">{currentPage.label}</h3>

      {currentPage.url === "/" && (
        <div className="flex items-center">
          <div className="text-slate-700 text-xs font-medium">Contract: </div>
          <div className="ml-2 py-1 px-2 rounded bg-green-200 text-slate-700 text-xs font-light">
            isOperational
          </div>
        </div>
      )}
    </div>
  );
}
