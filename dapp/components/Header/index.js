import Airplane from "components/Icons/Airplane";
import SubHeader from "components/SubHeader";
import useAppContext from "contexts/AppContext/useAppContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const items = [
  {
    id: 0,
    label: "Admin",
    url: "/",
  },
  {
    id: 1,
    label: "Customer",
    url: "/customer",
  },
];

export default function Header() {
  const router = useRouter();
  const { currentPage, setCurrentPage } = useAppContext();
  const [menuSelected, setMenuSelected] = useState(currentPage.id || 0);

  //get the url to set the context
  useEffect(() => {
    const pageFound = items.filter((item) => item.url === router.pathname);
    const page =
      pageFound.length > 0 ? pageFound[0] : { id: -1, label: "Page not Found" };

    setMenuSelected(page.id);
    setCurrentPage(page);
  }, [router]);

  const selectPage = (page) => {
    setMenuSelected(page.id);
    setCurrentPage(page);
  };

  return (
    <>
      <div className="w-full h-16 bg-gray-800 sticky top-0">
        <nav className="h-full py-2 px-4 flex items-center">
          <div className="grow-0 flex items-center">
            <Airplane className="fill-indigo-400 h-10 w-10 p-1 rounded" />
            <h1 className="text-md text-white font-medium ml-2">
              Flight Surety
            </h1>
          </div>
          <ul className="text-gray-300 ml-4 flex">
            {items.map((item) => (
              <li key={item.id}>
                <Link href={item.url} passHref>
                  <a
                    className={`hover:text-white hover:bg-gray-700 py-2 px-4 ml-2 rounded cursor-pointer ${
                      item.id === menuSelected ? "bg-gray-900 text-white" : ""
                    }`}
                    onClick={() => selectPage(item)}>
                    {item.label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <SubHeader />
    </>
  );
}
