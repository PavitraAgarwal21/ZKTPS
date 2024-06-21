import { Routes, Route } from "react-router-dom";
import EventRoute from "./EventRoute";
import Initial from "../components/Initial";
const Router = (props) => {
  return (
    <Routes>
      <Route path="/" element={<Initial />} />
      <Route
        path="/home/:event_index"
        element={<EventRoute account={props.account} />}
      />
    </Routes>
  );
};
export default Router;
