import { useEth } from "contexts/EthContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import truncateEthAddress from "truncate-eth-address";

export default function NavMenu({ items, action, menuSelected, className }) {
  const [walletAddress, setWalletAddress] = useState(null);
  const {
    state: { accounts },
    connectWallet,
  } = useEth();

  useEffect(() => {
    setWalletAddress(accounts ? truncateEthAddress(accounts[0]) : "");
  }, [accounts]);

  return (
    <ul className={`${className} items-center w-full`}>
      {items.map((item) => (
        <li key={item.id}>
          <Link href={item.url} passHref>
            <a
              className={`hover:text-white hover:bg-gray-700 py-2 px-4 ml-2 rounded cursor-pointer ${
                item.id === menuSelected ? "bg-gray-900 text-white" : ""
              }`}
              onClick={() => action(item)}>
              {item.label}
            </a>
          </Link>
        </li>
      ))}
      <li className="sm:grow sm:flex sm:justify-end ml-2 ">
        {walletAddress ? (
          <div className="text-sm text-slate-300 bg-slate-700 py-2 px-4 rounded border border-white">
            {walletAddress}
          </div>
        ) : (
          <button
            className="py-1 px-2 rounded shadow-purple-100 bg-indigo-500 hover:bg-indigo-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => connectWallet()}>
            Connect Wallet
          </button>
        )}
      </li>
    </ul>
  );
}
