import useAppContext from "contexts/AppContext/useAppContext";
import { useEth } from "contexts/EthContext";
import { useEffect, useState } from "react";

export default function SubHeader() {
  const { currentPage } = useAppContext();
  const {
    state: { contract, accounts },
  } = useEth();

  const account = !accounts ? "" : accounts[0];
  const [contractOperational, setContractOperational] = useState(true);

  const checkIfContractIsOperational = async () => {
    try {
      const result = await contract.methods
        .isOperational()
        .call({ from: account });

      setContractOperational(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!contract) return;
    checkIfContractIsOperational();
  }, [contract]);

  return (
    <div className="z-0 h-20 w-full py-2 px-4 flex items-center justify-between bg-white shadow-sm mb-8">
      <h3 className="text-3xl font-bold text-stone-800">{currentPage.label}</h3>

      {currentPage.url === "/" && (
        <div className="flex items-center">
          {contractOperational && (
            <div className="py-1 px-2 rounded bg-green-100 text-green-700 text-xs font-light">
              isOperational
            </div>
          )}
        </div>
      )}
    </div>
  );
}
