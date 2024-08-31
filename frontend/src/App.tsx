import { APIProvider } from "@vis.gl/react-google-maps";
import CustomMap from "./components/Map";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// import trafficData from "../../../services/vehicle_detection/traffic_data.json"
// import { columns } from "./cameras/columns";
// import { DataTable } from "./cameras/data-table";

function App() {
  return (
    <>
      <header className="fixed w-screen bg-black h-14"></header>
      <main className="flex flex-col items-center w-screen min-h-screen gap-10 pt-16">
        <APIProvider apiKey="AIzaSyDr-LVuWLuHDf58a2NBbfM5iuWb8WMqIyY">
          <section className="min-w-[80vw] min-h-[50vh]">
            <CustomMap />
          </section>
        </APIProvider>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Camera data</AccordionTrigger>
            <AccordionContent>
              {/* <DataTable columns={columns} data={data} /> */}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </>
  );
}

export default App;
