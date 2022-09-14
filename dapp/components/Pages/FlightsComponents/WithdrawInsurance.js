import Container from "components/Container";
import FormTemplate from "components/FormTemplate";
import { useState } from "react";

export default function WithdrawInsurance() {
  const [fields, setFields] = useState([
    {
      name: "to_withdraw",
      title: "Available To Withdraw",
      type: "select",
      options: [],
    },
  ]);

  const submitAction = async (data) => {
    console.log(data);
  };

  return (
    <Container className="mt-10">
      <FormTemplate
        title="Indemnity Insurance"
        submitAction={submitAction}
        submitTitle="WITHDRAW!"
        fields={fields}></FormTemplate>
    </Container>
  );
}
