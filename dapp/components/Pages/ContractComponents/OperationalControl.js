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
    value: null,
  },
];

export default function OperationalControl() {
  const {
    state: { contractData, accounts, isOperational },
    dispatch,
  } = useEth();
  const account = accounts ? accounts[0] : "";

  const [controlFields, setControlFields] = useState(fields);

  useEffect(() => {
    setControlFields((prev) =>
      prev.map((field) => ({
        ...field,
        value: isOperational,
      }))
    );
  }, [isOperational]);

  const submitAction = async (data) => {
    try {
      const result = await contractData.methods
        .setOperatingStatus(data.set_contract_op)
        .send({ from: account });
      console.log(result);

      dispatch({
        type: "INIT",
        data: { isOperational: data.set_contract_op },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Container className="mt-10 min-w-80">
      <FormTemplate
        title="Operational Control"
        submitAction={submitAction}
        submitTitle={null}
        fields={controlFields}
      />
    </Container>
  );
}
