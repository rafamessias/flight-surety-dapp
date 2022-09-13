import Container from "components/Container";
import FormTemplate from "components/FormTemplate";
import { useEth } from "contexts/EthContext";
import { toast } from "react-toastify";

const fields = [
  {
    name: "airline_address",
    title: "Airline Address",
    type: "text",
    placeHolder: "e.g. 0x00",
  },
  {
    name: "airline_name",
    title: "Airline Name",
    type: "text",
    placeHolder: "e.g. Delta Airlines",
  },
];

export default function RegisterAirlines() {
  const {
    state: { contract, accounts },
  } = useEth();
  const account = accounts ? accounts[0] : "";

  const submitAction = async (data) => {
    console.log(data);

    const { airline_address, airline_name } = data;
    if (airline_address === "" || airline_name === "") return;

    try {
      // register airline, parameters: address, name
      const result = await contract.methods
        .registerAirline(airline_address, airline_name)
        .send({ from: account });
      console.log(result);
      toast.success(`Airline successfuly registered`);
    } catch (error) {
      toast.error("Could not register the Airline");
      console.log(error);
    }
  };
  return (
    <Container className="mt-10">
      <FormTemplate
        title="Register Airline"
        submitAction={submitAction}
        submitTitle="Register Airline!"
        fields={fields}
      />
    </Container>
  );
}
