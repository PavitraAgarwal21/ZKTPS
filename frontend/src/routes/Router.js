import { Routes, Route } from "react-router-dom";
import EventRoute from "./EventRoute";
import Initial from "../components/Initial";
import ScanNoteButton2 from "../components/verifyTicket";
const Router = (props) => {
  return (
    <Routes>
      <Route path="/" element={<Initial />} />
      <Route
        path="/home/:event_index"
        element={<EventRoute account={props.account} />}
      />
      <Route
        path="/home/:event_index/verify"
        element={
          <div className="container mx-auto mt-64 flex flex-col items-center justify-center">
            <h2 className="font-bold text-white">Scan Here</h2>
            <p className="text-white">
              <span className="font-bold">Disclaimer! </span>
              You can verify whether the ticket you've been given has already
              been invalidated. If it has, you can return it to the creator and
              request a newly issued ticket. Ensure this while taking the ticket
              from the creator.
            </p>
            <div className="flex flex-col items-center mt-4">
              <h3 className="text-white">Verify Ticket</h3>
              <div className="flex justify-center mt-4">
                <ScanNoteButton2 dialogTitle="Scan for verifying ticket" />
              </div>
            </div>
          </div>
        }
      />
    </Routes>
  );
};
export default Router;
