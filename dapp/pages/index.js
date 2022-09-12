import AdminAirlines from "components/Pages/AdminAirlines";
import AdminOracles from "components/Pages/AdminOracles";
import ContractAdmin from "components/Pages/ContractAdmin";
import Tabs from "components/Tabs";
import { useState } from "react";

const items = [
  {
    id: 0,
    label: "Contract",
  },
  {
    id: 1,
    label: "Airlines",
  },
  {
    id: 2,
    label: "Oracles",
  },
];

export default function Home() {
  const [btnSelected, setBtnSelected] = useState(0);
  return (
    <Tabs items={items} tabsSelected={[btnSelected, setBtnSelected]}>
      {btnSelected === 0 && <ContractAdmin />}
      {btnSelected === 1 && <AdminAirlines />}
      {btnSelected === 2 && <AdminOracles />}
    </Tabs>
  );
}
