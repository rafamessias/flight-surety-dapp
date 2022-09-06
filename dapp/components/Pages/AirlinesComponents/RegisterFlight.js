import Container from "components/Container";
import FormTemplate from "components/FormTemplate";
import ListItems from "components/ListItems";
import { useEffect, useState } from "react";

const fields = [
  {
    name: "flight_number",
    title: "Flight Number",
    type: "text",
    placeHolder: "e.g. 9W301",
  },
];

export default function RegisterFlight() {
  const submitAction = (data) => {
    console.log(data);
  };

  const [flightRegister, setFlightRegister] = useState([]);

  useEffect(() => {
    setFlightRegister([
      {
        id: "Status",
        label: "0",
      },
      {
        id: "Time Stamp",
        label: new Date().toString(),
      },
      {
        id: "Airline Address",
        label: "0x000",
      },
    ]);
  }, []);

  return (
    <Container className="mt-10">
      <FormTemplate
        title="Register Flight"
        submitAction={submitAction}
        submitTitle="Register Flight"
        fields={fields}>
        <ListItems items={flightRegister} title="Flight Details" />
      </FormTemplate>
    </Container>
  );
}
