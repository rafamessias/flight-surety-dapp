import Container from "components/Container";
import FormTemplate from "components/FormTemplate";
import ListItems from "components/ListItems";
import { useEth } from "contexts/EthContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const fields = [
  {
    name: "flight_number",
    title: "Flight Number",
    type: "text",
    placeHolder: "e.g. 9W301",
  },
  {
    name: "airline_address",
    title: "Airline Address",
    type: "text",
    placeHolder: "e.g. 0x00",
  },
];

export default function RegisterFlight() {
  //set the update time
  let updatedTimestamp = new Date();
  updatedTimestamp.setMonth(updatedTimestamp.getMonth() + 2);
  const updatedTimestampMilliseconds = updatedTimestamp.getTime();

  const {
    state: { contract, accounts },
  } = useEth();
  const account = accounts ? accounts[0] : accounts;

  const submitAction = async (data) => {
    const { flight_number, airline_address } = data;

    if (flight_number === "" || airline_address === "") return;

    try {
      const result = await contract.methods
        .registerFlight(
          flight_number,
          updatedTimestampMilliseconds,
          airline_address
        )
        .send({ from: account });

      toast.success("Flight successfully registered");
      console.log(result);
    } catch (error) {
      toast.error("Error while trying to regiter the Flight");
      console.log(error);
    }
  };

  const [flightRegister, setFlightRegister] = useState([]);

  useEffect(() => {
    setFlightRegister([
      {
        id: "Status",
        label: "0",
      },
      {
        id: "Timestamp",
        label: updatedTimestamp.toString(),
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
