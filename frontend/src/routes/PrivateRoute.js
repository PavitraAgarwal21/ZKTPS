import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { storeContext } from "../useContext/storeContext";

const PrivateRoute = ({ Component }) => {
  const { status } = useContext(storeContext);
  return status ? <Component /> : <Navigate to="/" />;
};
export default PrivateRoute;
