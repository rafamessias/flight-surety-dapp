import AppContext from "./AppContext";
import DappContext from "./DappContext";
import { EthContext } from "./EthContext";

export default function DappProvider({ children }) {
  return (
    <DappContext.Provider value={{ ...EthContext(), ...AppContext() }}>
      {children}
    </DappContext.Provider>
  );
}
