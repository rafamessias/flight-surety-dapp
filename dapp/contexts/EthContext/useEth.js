import { useContext } from "react";
import DappContext from "../DappContext";

const useEth = () => {
  const { state, dispatch, connectWallet } = useContext(DappContext);
  return { state, dispatch, connectWallet };
};

export default useEth;
