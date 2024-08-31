import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { Poi } from "../types.ts";
import CameraIcon from "../assets/icons/camera-icon.svg";

const PoiMarkers = (props: { pois: Poi[] }) => {
  return (
    <>
      {props.pois.map((poi: Poi) => (
        <AdvancedMarker key={poi.key} position={poi.location}>
          <div>
            <img className="w-10 h-10" src={CameraIcon} alt="camera icon" />
          </div>
          {/* <Pin
            background={"#FBBC04"}
            glyphColor={"#000"}
            borderColor={"#000"}
          /> */}
        </AdvancedMarker>
      ))}
    </>
  );
};

export default PoiMarkers;
