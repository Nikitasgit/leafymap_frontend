import Map from "../../components/map/mapComponent/Map";
import "mapbox-gl/dist/mapbox-gl.css";

const MapPage = () => {
  return (
    <>
      <Map withPlacesInView />
    </>
  );
};

export default MapPage;
