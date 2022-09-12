import Container from "components/Container";
import FormTemplate from "components/FormTemplate";
import { useEth } from "contexts/EthContext";
import { useEffect, useState } from "react";

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
  const [controlFields, setControlFields] = useState(fields);

  const checkIfContractIsOperational = async () => {
    console.log(contract);
    try {
      const result = await contract.methods
        .isOperational()
        .call({ from: account });

      setContractOperational(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfContractIsOperational();
  }, [contract]);

  useEffect(() => {
    setControlFields((prev) =>
      prev.map((field) => ({ ...field, value: contractOperational }))
    );
  }, [contractOperational]);

  const submitAction = (data) => {
    console.log(data);

    try {
      contract.methods
        .setOperatingStatus({ mode: data.set_contract_op })
        .send({ from: account });
    } catch (error) {
      console.log(error);
    }
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
