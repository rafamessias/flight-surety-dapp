import Link from "next/link";

export default function NavMenu({ items, action, menuSelected, className }) {
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
        <button className="py-1 px-2 rounded bg-indigo-500 hover:bg-indigo-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Connect Wallet
        </button>
      </li>
    </ul>
  );
}
