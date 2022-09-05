import Container from "components/Container";
import FormTemplate from "components/FormTemplate";

const fields = [
  {
    name: "register_fee",
    title: "Register Fee (ether)",
    type: "number",
    placeHolder: "e.g. 0.101",
  },
];

export default function RegisterOracles() {
  const submitAction = (data) => {
    console.log(data);
  };
  return (
    <Container className="mt-10">
      <FormTemplate
        title="Register Oracles"
        submitAction={submitAction}
        submitTitle="Register Myself!"
        fields={fields}
      />
    </Container>
  );
}
