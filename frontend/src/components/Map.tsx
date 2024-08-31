import {
  Map,
  MapCameraChangedEvent,
  useApiIsLoaded,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import PoiMarkers from "./PoiMarkers";
import { Poi } from "../types";
import { useEffect } from "react";
import rawCameraData from "../../../services/vehicle_detection/cameras.json";

interface CameraData {
  cameras: {
    cameraUrl: string;
    lanes: number[][][];
    location: {
      lat: number;
      lng: number;
    };
  }[];
}

function extractPoiData(data: CameraData): Poi[] {
  return data.cameras.map(camera => {
    const cameraId =
      camera.cameraUrl.split("/").pop()?.split(".")[0] || "unknown";
    return {
      key: cameraId,
      location: camera.location,
    };
  });
}

function CustomMap() {
  const map = useMap();
  const mapsLibrary = useMapsLibrary("maps");
  const apiIsLoaded = useApiIsLoaded();
  const locations = extractPoiData(rawCameraData as CameraData);

  useEffect(() => {
    console.log(apiIsLoaded);
    if (mapsLibrary && map && apiIsLoaded) {
      console.log("loaded");
      const trafficLayer = new mapsLibrary.TrafficLayer();
      trafficLayer.setMap(map);
    }
  }, [mapsLibrary, map, apiIsLoaded]);

  return (
    <Map
      style={{ width: "100vw", height: "100vh" }}
      defaultZoom={13}
      mapId="87b612fed2fb49d5"
      defaultCenter={{ lat: 45.815399, lng: 15.966568 }}
      onCameraChanged={(ev: MapCameraChangedEvent) =>
        console.log(
          "camera changed:",
          ev.detail.center,
          "zoom:",
          ev.detail.zoom,
        )
      }
    >
      <PoiMarkers pois={locations} />
    </Map>
  );
}

export default CustomMap;
