import { useContext } from "react";
import DappContext from "contexts/DappContext";

const useAppContext = () => {
  const { currentPage, setCurrentPage } = useContext(DappContext);
  return { currentPage, setCurrentPage };
};

export default useAppContext;
