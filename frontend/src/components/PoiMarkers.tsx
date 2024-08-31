import { useCallback, useEffect, useRef, useState } from "react";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { Poi } from "../types.ts";
import CameraIcon from "../assets/icons/camera-icon.svg";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import rawData from "../../../services/vehicle_detection/traffic_data.json";

interface Lane {
  lane_number: string;
  total_vehicles: number;
  traffic_intensity: string;
}

interface CameraData {
  timestamp: string;
  camera_id: string;
  lanes: Lane[];
}

const trafficData = rawData as CameraData[];

const colors = {
  greenFill: "rgb(190, 242, 100,0.8)",
  greenStroke: "rgba(101, 163, 13,0.8)",
  orangeFill: "rgb(253, 186, 116, 0.8)",
  orangeStroke: "rgba(234, 88, 12,0.8)",
  redFill: "rgba(252, 165, 165,0.8)",
  redStroke: "rgba(220, 38, 38,0.8)",
};

const PoiMarkers = (props: { pois: Poi[] }) => {
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  const map = useMap();
  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers(prev => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  const handleClick = useCallback(
    (ev: google.maps.MapMouseEvent) => {
      if (!map) return;
      if (!ev.latLng) return;
      console.log("marker clicked:", ev.latLng.toString());
      map.panTo(ev.latLng);
    },
    [map],
  );

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  return (
    <>
      {props.pois.map((poi: Poi) => {
        const obj = trafficData.find(item => item.camera_id === poi.key);
        const trafficIntensity = obj?.lanes[0].traffic_intensity;

        return (
          <AdvancedMarker
            key={poi.key}
            position={poi.location}
            ref={marker => setMarkerRef(marker, poi.key)}
            clickable={true}
            onClick={handleClick}
          >
            <div className="w-[75px] h-[75px] flex justify-center items-center">
              <img className="w-10 h-10" src={CameraIcon} alt="camera icon" />
              <svg width="100" height="100" className="absolute -z-20">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={
                    trafficIntensity === "Heavy"
                      ? colors.redStroke
                      : trafficIntensity === "Moderate"
                      ? colors.orangeStroke
                      : colors.greenStroke
                  }
                  stroke-width="4"
                  fill={
                    trafficIntensity === "Heavy"
                      ? colors.redFill
                      : trafficIntensity === "Moderate"
                      ? colors.orangeFill
                      : colors.greenFill
                  }
                />
              </svg>
            </div>
          </AdvancedMarker>
        );
      })}
    </>
  );
};

export default PoiMarkers;
