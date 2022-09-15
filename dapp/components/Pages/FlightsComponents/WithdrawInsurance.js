import Container from "components/Container";
import FormTemplate from "components/FormTemplate";
import { useEth } from "contexts/EthContext";
import { useEffect, useState } from "react";
import truncateEthAddress from "truncate-eth-address";
import { toast } from "react-toastify";

export default function WithdrawInsurance() {
  const [fields, setFields] = useState([
    {
      name: "to_withdraw",
      title: "Available To Withdraw",
      type: "select",
      options: [],
    },
  ]);

  const {
    state: { contract, accounts, web3 },
  } = useEth();

  const account = accounts ? accounts[0] : "";

  const getPurchasedInsurances = async () => {
    if (!contract) return;
    const result = await contract.methods.getCustomerInsurances(account).call();

    setFields(
      (prev) =>
        prev &&
        prev.map((field) => {
          if (field.type === "select") {
            field.options = result.map((item) => {
              return {
                label: `Flight ${truncateEthAddress(
                  item[1]
                )} - ${web3.utils.fromWei(item[0], "ether")} Ether`,
                value: `${item[1]}`,
              };
            });
          }

          return field;
        })
    );
  };

  const updateCombo = () => {
    //Updated purchase
    contract.events
      .FlightStatusInfo({})
      .on("connected", (subID) => {
        console.log(`FlightStatusInfo - SubID: ${subID}`);
      })
      .on("data", async (event) => {
        getPurchasedInsurances();
      });
  };

  useEffect(() => {
    updateCombo();
    getPurchasedInsurances();
  }, [contract]);

  const submitAction = async (data) => {
    console.log(data);

    try {
      const result = await contract.methods
        .withdraw(data.to_withdraw)
        .send({ from: account });

      toast.success("Successfully withdraw");
      console.log(result);
    } catch (error) {
      toast.error("Error while trying to withdraw");
      console.log(error);
    }
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
