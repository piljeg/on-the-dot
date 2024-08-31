import { APIProvider, Map } from "@vis.gl/react-google-maps";
import ControlPanel from "./components/ControlPanel";

function App() {
  return (
    <APIProvider apiKey="AIzaSyDr-LVuWLuHDf58a2NBbfM5iuWb8WMqIyY">
      <Map
        style={{ width: "100vw", height: "100vh" }}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        defaultZoom={3}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      />
      <ControlPanel />
    </APIProvider>
  );
}

export default App;
