import SubHeader from "../SubHeader";

export default function Header() {
  return (
    <>
      <div className="w-full h-16 bg-gray-800">
        <nav className="h-full py-2 px-4 flex items-center">
          <div className="grow-0 text-white">logo</div>
          <ul className="text-gray-200 ml-4">
            <li className="hover:text-white hover:bg-gray-500 py-1 px-2 rounded cursor-pointer">
              Nav button
            </li>
          </ul>
        </nav>
      </div>
      <SubHeader />
    </>
  );
}
