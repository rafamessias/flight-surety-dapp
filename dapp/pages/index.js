import Tabs from "components/Tabs";

const items = [
  {
    id: 0,
    label: "Airline",
  },
  {
    id: 1,
    label: "Oracles",
  },
];

export default function Home() {
  return (
    <Tabs items={items}>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </Tabs>
  );
}
