import useAppContext from "contexts/AppContext/useAppContext";
import { useEth } from "contexts/EthContext";
import { useEffect, useState } from "react";

export default function SubHeader() {
  const { currentPage } = useAppContext();
  const {
    state: { isOperational },
  } = useEth();

  return (
    <div className="z-0 h-20 w-full py-2 px-4 flex items-center justify-between bg-white shadow-sm mb-8">
      <h3 className="text-3xl font-bold text-stone-800">{currentPage.label}</h3>

      {currentPage.url === "/" && (
        <div className="flex items-center">
          {isOperational === null ? (
            <div className="animate-pulse py-1 px-2 w-24 rounded bg-slate-100  text-xs font-light"></div>
          ) : (
            <ShowContractStatus isOperational={isOperational} />
          )}
        </div>
      )}
    </div>
  );
}

function ShowContractStatus({ isOperational }) {
  return (
    <>
      {isOperational ? (
        <div className="py-1 px-2 rounded bg-green-100 text-green-700 text-xs font-light">
          isOperational
        </div>
      ) : (
        <div className="py-1 px-2 rounded bg-red-100 text-red-700 text-xs font-light">
          NOT Operational
        </div>
      )}
    </>
  );
}
