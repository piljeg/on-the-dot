import { APIProvider } from "@vis.gl/react-google-maps";
import CustomMap from "./components/Map";

import trafficData from "../../services/vehicle_detection/traffic_data.json";
import { columns } from "./cameras/columns";
import { DataTable } from "./cameras/data-table";

// Define the input type based on the structure of your JSON data
interface TrafficDataInput {
  timestamp: string;
  camera_id: string;
  lanes: {
    lane_number: string;
    total_vehicles: number;
    traffic_intensity: string;
  }[];
}

// Define the output type based on your specified structure
export interface StructuredTrafficData {
  id: string;
  lastDay: number;
  lastHour: number;
  intensity: string;
}

function structureTrafficData(
  data: TrafficDataInput[]
): StructuredTrafficData[] {
  const currentTime = new Date(
    Math.max(...data.map((item) => new Date(item.timestamp).getTime()))
  );
  const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);
  const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);

  const cameraData: { [key: string]: StructuredTrafficData } = {};

  data.forEach((item) => {
    const timestamp = new Date(item.timestamp);
    const cameraId = item.camera_id;

    if (!cameraData[cameraId]) {
      cameraData[cameraId] = {
        id: cameraId,
        lastDay: 0,
        lastHour: 0,
        intensity: item.lanes[0].traffic_intensity,
      };
    }

    const totalVehicles = item.lanes.reduce(
      (sum, lane) => sum + lane.total_vehicles,
      0
    );

    if (timestamp >= oneDayAgo) {
      cameraData[cameraId].lastDay += totalVehicles;
    }

    if (timestamp >= oneHourAgo) {
      cameraData[cameraId].lastHour += totalVehicles;
    }

    // Update intensity with the most recent value
    if (timestamp > new Date(cameraData[cameraId].intensity)) {
      cameraData[cameraId].intensity = item.lanes[0].traffic_intensity;
    }
  });

  return Object.values(cameraData);
}

// Example usage:
const rawData: TrafficDataInput[] = trafficData;
const data = structureTrafficData(rawData);

function App() {
  return (
    <>
      <header className="fixed w-full bg-black h-[80px] flex items-center px-[15vw] z-10">
        <div className="max-height-[64px]">
          <p className="font-bold text-[44px] text-white">On the ●</p>
        </div>
      </header>
      <main className="flex flex-col items-center w-[calc(screen-20px)] min-h-screen gap-10 pt-[30px] justify-center">
        <APIProvider apiKey="AIzaSyDr-LVuWLuHDf58a2NBbfM5iuWb8WMqIyY">
          <CustomMap />
        </APIProvider>
        <div className="w-screen text-white">
          <DataTable columns={columns} data={data} />
        </div>
      </main>
    </>
  );
}

export default App;
