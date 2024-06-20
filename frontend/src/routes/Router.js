import { Routes, Route } from "react-router-dom";
import BuyTicket from "../components/buyTicket";
import CreateEvent from "../components/createEvent";
const Router = (props) => {
  return (
    <Routes>
      <Route path="/" element={<CreateEvent account={props.account} />} />
      <Route
        path="/home/:event_index"
        element={<BuyTicket account={props.account} />}
      />
    </Routes>
  );
};
export default Router;
