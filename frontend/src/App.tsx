import { APIProvider } from "@vis.gl/react-google-maps";
import ControlPanel from "./components/ControlPanel";
import CustomMap from "./components/Map";

function App() {
  return (
    <APIProvider apiKey="AIzaSyDr-LVuWLuHDf58a2NBbfM5iuWb8WMqIyY">
      <CustomMap />
      <ControlPanel />
    </APIProvider>
  );
}

export default App;
