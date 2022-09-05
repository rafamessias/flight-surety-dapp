import Container from "components/Container";
import FormTemplate from "components/FormTemplate";

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
  return (
    <Container className="mt-10">
      <FormTemplate
        title="Register Flight"
        submitAction={submitAction}
        submitTitle="Register Flight"
        fields={fields}
      />
    </Container>
  );
}
