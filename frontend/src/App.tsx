import { APIProvider } from "@vis.gl/react-google-maps";
import ControlPanel from "./components/ControlPanel";
import CustomMap from "./components/Map";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Payment, columns } from "./cameras/columns";
import { DataTable } from "./cameras/data-table";

function getData(): Payment[] {
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
  ];
}

function App() {
  const data = getData();
  return (
    <div style={{ height: "100vh" }}>
      <APIProvider apiKey="AIzaSyDr-LVuWLuHDf58a2NBbfM5iuWb8WMqIyY">
        <CustomMap />
        <ControlPanel />
      </APIProvider>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Camera data</AccordionTrigger>
          <AccordionContent>
            <DataTable columns={columns} data={data} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default App;
