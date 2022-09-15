import Container from "components/Container";
import FormTemplate from "components/FormTemplate";
import ListItems from "components/ListItems";
import { useEth } from "contexts/EthContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import truncateEthAddress from "truncate-eth-address";

const flightStatusCode = [
  {
    id: 0,
    label: "STATUS_CODE_UNKNOWN",
  },
  {
    id: 10,
    label: "STATUS_CODE_ON_TIME",
  },
  {
    id: 20,
    label: "STATUS_CODE_LATE_AIRLINE",
  },
  {
    id: 30,
    label: "STATUS_CODE_LATE_WEATHER",
  },
  {
    id: 40,
    label: "STATUS_CODE_LATE_TECHNICAL",
  },
  {
    id: 50,
    label: "STATUS_CODE_LATE_OTHER",
  },
];

export default function BuyInsurance() {
  const [fields, setFields] = useState([
    {
      name: "flight",
      title: "Available Flights",
      type: "select",
      options: [],
      callFunction: true,
    },
    {
      name: "eths",
      title: "Eths",
      type: "number",
      placeHolder: "e.g: 0.01",
    },
  ]);

  const [insurances, setInsurances] = useState([]);
  const [flightStatus, setFlightStatus] = useState([]);

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
                  if (field.callFunction) {
                    field.callFunction = getFlightStatus;
                  }
                }

                return field;
              })
          );
        }
      );

      //Updated purchase
      contract.events
        .FlightStatusInfo({})
        .on("connected", (subID) => {
          console.log(`FlightStatusInfo - SubID: ${subID}`);
        })
        .on("data", async (event) => {
          getPurchasedInsurances();
        });
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

  const getFlightStatus = async (data) => {
    try {
      const flightInfo = data.split(";");

      if (!contract) return;
      const result = await contract.methods
        .getFlight(flightInfo[0], flightInfo[1], flightInfo[2])
        .call();

      setFlightStatus(Object.values(result));
    } catch (error) {
      console.log(error);
    }
  };

  const transformStatusCode = (statusCode) => {
    const status = flightStatusCode.filter(
      (item) => item.id === Number(statusCode)
    )[0];

    return `${status.label}: ${status.id}`;
  };

  const fetchFlightStatus = async (data) => {
    const { flight } = data;

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

      getPurchasedInsurances();
      toast.success("Purchase successfully registered");
      console.log(result);
    } catch (error) {
      toast.error("Error while trying to purchase the insurance");
      console.log(error);
    }
  };

  return (
    <div className="md:flex">
      <Container className="max-h-fit">
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
      <div className="mt-4 md:mt-0 md:ml-4 py-2 px-4">
        <h1 className="text-xl font-medium text-gray-700">Flight Status</h1>
        <div className="mt-4">
          <ul>
            {flightStatus.map((item, idx) => (
              <li className="mt-3" key={idx}>
                <h4 className="text-sm text-gray-400 font-semibold uppercase">
                  {idx === 0 && "Flight Key"}
                  {idx === 1 && "Airline"}
                  {idx === 2 && "Flight"}
                  {idx === 3 && "Updated Timestamp"}
                  {idx === 4 && "Is Registered"}
                  {idx === 5 && "Status Code"}
                </h4>
                <h5 className="text-base text-gray-700">
                  {idx === 0 && truncateEthAddress(item)}
                  {idx === 1 && truncateEthAddress(item)}
                  {idx === 2 && item}
                  {idx === 3 && new Date(Number(item)).toDateString()}
                  {idx === 4 && (item ? "TRUE" : "FALSE")}
                  {idx === 5 && transformStatusCode(item)}
                </h5>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
