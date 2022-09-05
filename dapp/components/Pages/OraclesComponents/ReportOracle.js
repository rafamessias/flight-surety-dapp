import Container from "components/Container";
import FormTemplate from "components/FormTemplate";
import ListItems from "components/ListItems";

const fields = [
  {
    name: "flight_number",
    title: "Flight Number",
    type: "text",
    placeHolder: "e.g. 9W301",
  },
  {
    name: "flight_status",
    title: "Flight Status",
    type: "number",
    placeHolder: "e.g. 10",
  },
];

const flightStatus = [
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

export default function ReportOracle() {
  const submitAction = (data) => {
    console.log(data);
  };
  return (
    <Container className="mt-10">
      <FormTemplate
        title="Report Flight info"
        submitAction={submitAction}
        submitTitle="Report Flight"
        fields={fields}>
        <ListItems items={flightStatus} title="Flight Status Code" />
      </FormTemplate>
    </Container>
  );
}
