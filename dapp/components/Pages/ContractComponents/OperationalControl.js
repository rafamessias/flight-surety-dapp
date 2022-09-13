import Container from "components/Container";
import FormTemplate from "components/FormTemplate";
import { useEth } from "contexts/EthContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const fields = [
  {
    name: "set_contract_op",
    title: "Contract Operational",
    type: "checkbox",
    placeHolder: "",
    value: null,
    onChange: true,
  },
  {
    name: "authorized_caller",
    title: "Authorized Caller",
    type: "text",
    placeHolder: "0x000",
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
      prev.map((field) => {
        if (field.type === "checkbox")
          return {
            ...field,
            value: isOperational,
          };

        return { ...field };
      })
    );
  }, [isOperational]);

  const submitAction = async (data) => {
    const { set_contract_op, authorized_caller } = data;

    if (authorized_caller !== "") {
      authorizeCaller(authorized_caller);
    } else {
      setContractOperational(set_contract_op);
    }
  };

  async function authorizeCaller(authorized_caller) {
    try {
      const result = await contractData.methods
        .authorizeCaller(authorized_caller)
        .send({ from: account });
      toast.success("New Authorized caller successfully added");

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  async function setContractOperational(set_contract_op) {
    //set contract operational
    try {
      const result = await contractData.methods
        .setOperatingStatus(set_contract_op)
        .send({ from: account });

      toast.info(`Contract Operational is ${set_contract_op}`);
      console.log(result);

      dispatch({
        type: "INIT",
        data: { isOperational: set_contract_op },
      });
    } catch (error) {
      toast.error("Error while set contract Operational status");
      console.log(error);
    }
  }

  return (
    <Container className="mt-10 ">
      <FormTemplate
        title="Operational Control"
        submitAction={submitAction}
        submitTitle="Register New Caller"
        fields={controlFields}
      />
    </Container>
  );
}
