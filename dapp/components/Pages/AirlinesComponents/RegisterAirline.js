import Container from "components/Container";
import FormTemplate from "components/FormTemplate";

const fields = [
  {
    name: "airline_address",
    title: "Airline Address",
    type: "text",
    placeHolder: "e.g. 0x00",
  },
];

export default function RegisterAirlines() {
  const submitAction = (data) => {
    console.log(data);
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
