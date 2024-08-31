import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

export const useTrafficLayer = () => {
  const [trafficLayerLoaded, setTrafficLayerLoaded] = useState<boolean>(false);
  const map = useMap();
  const mapsLibrary = useMapsLibrary("maps");

  useEffect(() => {
    if (mapsLibrary && map) {
      const trafficLayer = new mapsLibrary.TrafficLayer();
      trafficLayer.setMap(map);
      setTrafficLayerLoaded(true);
    }
  }, [mapsLibrary, map]);

  return trafficLayerLoaded;
};
