import Airplane from "components/Icons/Airplane";
import CloseIcon from "components/Icons/CloseIcon";
import MenuIcon from "components/Icons/MenuIcon";
import SubHeader from "components/SubHeader";
import useAppContext from "contexts/AppContext/useAppContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NavMenu from "./NavMenu";

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
  const [menuOpened, setMenuOpened] = useState(false);

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
        <nav className="h-full py-2 px-4 relative flex items-center">
          <div className="grow-0 flex items-center">
            <Airplane className="fill-indigo-400 h-10 w-10 p-1 rounded" />
            <h1 className="text-md text-white font-medium ml-2">
              Flight Surety
            </h1>
          </div>
          <NavMenu
            items={items}
            action={selectPage}
            menuSelected={menuSelected}
            className="text-gray-300 ml-4 hidden sm:flex"
          />
          <div className="xs:flex sm:hidden grow h-10">
            <div className="flex justify-end">
              <button
                onClick={() => setMenuOpened(false)}
                className={`${menuOpened ? "flex" : "hidden"}`}>
                <CloseIcon className="fill-slate-200 h-10 w-10" />
              </button>
              <button
                onClick={() => setMenuOpened(true)}
                className={`${menuOpened ? "hidden" : "flex"}`}>
                <MenuIcon className="fill-slate-200 h-10 w-10" />
              </button>
            </div>
          </div>
          <div className="xs:flex sm:hidden absolute left-0 top-12 w-full pb-4 bg-slate-800">
            <NavMenu
              items={items}
              action={selectPage}
              menuSelected={menuSelected}
              className="text-gray-300 mt-4 space-y-4"
            />
          </div>
        </nav>
      </div>
      <SubHeader />
    </>
  );
}
