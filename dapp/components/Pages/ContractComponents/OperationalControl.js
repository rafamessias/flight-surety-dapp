import Container from "components/Container";
import FormTemplate from "components/FormTemplate";
import { useEth } from "contexts/EthContext";
import { useState } from "react";
const fields = [
  {
    name: "set_contract_op",
    title: "Contract Operational",
    type: "checkbox",
    placeHolder: "",
  },
];

export default function OperationalControl() {
  const {
    state: { contract, accounts },
  } = useEth();

  const account = !accounts ? "" : accounts[0];
  const [contractOperational, setContractOperational] = useState(true);

  const checkIfContractIsOperational = async () => {
    try {
      const result = await contract.methods
        .isOperational()
        .send({ from: account });

      setContractOperational(result);
    } catch (error) {
      console.log(error);
    }
  };

  const submitAction = (data) => {
    console.log(data);
  };
  return (
    <Container>
      <FormTemplate
        title="Contract Operational Control"
        submitAction={submitAction}
        submitTitle={null}
        fields={fields}
      />
    </Container>
  );
}
