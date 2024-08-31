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

const locations: Poi[] = [
  {
    key: "lucko",
    location: { lat: 45.762160830063344, lng: 15.896473847306092 },
  },
  {
    key: "trnje",
    location: { lat: 45.7948013349046, lng: 15.979294093511566 },
  },
  {
    key: "ivanja reka",
    location: { lat: 45.80013180911717, lng: 16.131190012246865 },
  },
  {
    key: "sredisce",
    location: { lat: 45.777784456109195, lng: 15.990552774054418 },
  },
  {
    key: "selska cesta",
    location: { lat: 45.7865242106891, lng: 15.951781913539993 },
  },
];

function CustomMap() {
  const map = useMap();
  const mapsLibrary = useMapsLibrary("maps");
  const apiIsLoaded = useApiIsLoaded();

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
      mapId="febfb6882721eadd"
      defaultCenter={{ lat: 45.815399, lng: 15.966568 }}
      onCameraChanged={(ev: MapCameraChangedEvent) =>
        console.log(
          "camera changed:",
          ev.detail.center,
          "zoom:",
          ev.detail.zoom
        )
      }
    >
      <PoiMarkers pois={locations} />
    </Map>
  );
}

export default CustomMap;
