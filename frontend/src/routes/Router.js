import { Routes, Route } from "react-router-dom";
import EventRoute from "./EventRoute";
import Initial from "../components/Initial";
import InvalidateTicket from "../components/invalidateTicket";
import VerifyTicket from "../components/verifyTicket";
import AllowResale from "../components/allowResale";
import BuyResaleTicket from "../components/buyResaleTicket";
import PrivateRoute from "./PrivateRoute";
const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Initial />} />
      <Route path="/home/:event_index" element={<EventRoute />} />
      <Route
        path="/verify"
        element={<PrivateRoute Component={VerifyTicket} />}
      />
      <Route
        path="/invalidate"
        element={<PrivateRoute Component={InvalidateTicket} />}
      />
      <Route
        path="/resale"
        element={<PrivateRoute Component={AllowResale} />}
      />
      <Route path="/buyResale" element={<BuyResaleTicket />} />
    </Routes>
  );
};
export default Router;
