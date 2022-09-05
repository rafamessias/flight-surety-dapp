import Link from "next/link";

export default function NavMenu({ items, action, menuSelected, className }) {
  return (
    <ul className={className}>
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
    </ul>
  );
}
