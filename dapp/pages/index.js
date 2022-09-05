import AdminAirlines from "components/Pages/AdminAirlines";
import AdminOracles from "components/Pages/AdminOracles";
import Tabs from "components/Tabs";
import { useState } from "react";

const items = [
  {
    id: 0,
    label: "Airlines",
  },
  {
    id: 1,
    label: "Oracles",
  },
];

export default function Home() {
  const [btnSelected, setBtnSelected] = useState(0);
  return (
    <Tabs items={items} tabsSelected={[btnSelected, setBtnSelected]}>
      {btnSelected === 0 && <AdminAirlines />}

      {btnSelected === 1 && <AdminOracles />}
    </Tabs>
  );
}
