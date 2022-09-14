import Container from "components/Container";
import FormTemplate from "components/FormTemplate";
import ListItems from "components/ListItems";
import { useEth } from "contexts/EthContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import truncateEthAddress from "truncate-eth-address";

export default function BuyInsurance() {
  const [fields, setFields] = useState([
    {
      name: "flight",
      title: "Available Flights",
      type: "select",
      options: [],
    },
    {
      name: "eths",
      title: "Eths",
      type: "number",
      placeHolder: "e.g: 0.01",
    },
  ]);

  const [insurances, setInsurances] = useState([]);

  const {
    state: { contract, accounts, web3 },
  } = useEth();

  const account = accounts ? accounts[0] : "";

  const getFlights = () => {
    if (!contract) return;

    try {
      contract.getPastEvents(
        "FlightRegistration",
        {
          fromBlock: 0,
        },
        function (error, event) {
          if (error) console.log(error);

          setFields(
            (prev) =>
              prev &&
              prev.map((field) => {
                if (field.type === "select") {
                  field.options = event.map((e) => {
                    let eventDate = new Date();
                    eventDate.setTime(e.returnValues[2]);
                    return {
                      label: `${e.returnValues[1]} - ${eventDate.toString()}`,
                      value: `${e.returnValues[1]};${e.returnValues[2]};${e.returnValues[3]}`,
                    };
                  });
                }

                return field;
              })
          );
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getPurchasedInsurances = async () => {
    if (!contract) return;
    const result = await contract.methods.getCustomerInsurances(account).call();

    setInsurances(
      result.map((item, idx) => ({
        id: "Flight " + truncateEthAddress(item[1]),
        label: web3.utils.fromWei(item[0], "ether") + " Ether",
      }))
    );
  };

  useEffect(() => {
    getFlights();
    getPurchasedInsurances();
  }, [contract]);

  const fetchFlightStatus = async (data) => {
    console.log(data);
    const { flight, eths } = data;

    if (flight === "") return;
    const flightInfo = flight.split(";");

    try {
      const result = await contract.methods
        .fetchFlightStatus(flightInfo[2], flightInfo[0], flightInfo[1])
        .send({ from: account });

      toast.success("Successfully called the Oracle");
      console.log(result);
    } catch (error) {
      toast.error("Error while trying to call the Oracle");
      console.log(error);
    }
  };

  const submitAction = async (data) => {
    const { flight, eths } = data;

    if (flight === "" || eths === "") return;
    const flightInfo = flight.split(";");

    try {
      const result = await contract.methods
        .buyInsurance(flightInfo[0], flightInfo[1], flightInfo[2])
        .send({ from: account, value: web3.utils.toWei(eths, "ether") });

      toast.success("Flight successfully registered");
      console.log(result);
    } catch (error) {
      toast.error("Error while trying to regiter the Flight");
      console.log(error);
    }
  };

  return (
    <Container>
      <FormTemplate
        title="Buy Insurance"
        submitAction={submitAction}
        submitTitle="BUY NOW!"
        secondAction={fetchFlightStatus}
        secondTitle="CALL ORACLE"
        fields={fields}>
        {insurances && (
          <ListItems items={insurances} title="My Purchased Insurances" />
        )}
      </FormTemplate>
    </Container>
  );
}
