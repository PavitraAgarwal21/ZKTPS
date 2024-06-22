import { Routes, Route } from "react-router-dom";
import EventRoute from "./EventRoute";
import Initial from "../components/Initial";
import InvalidateTicket from "../components/invalidateTicket";
import VerifyTicket from "../components/verifyTicket";
import AllowResale from "../components/allowResale";
const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Initial />} />
      <Route path="/home/:event_index" element={<EventRoute />} />
      <Route path="/verify" element={<VerifyTicket />} />
      <Route path="/invalidate" element={<InvalidateTicket />} />
      <Route path="/resale" element={<AllowResale />} />
    </Routes>
  );
};
export default Router;
