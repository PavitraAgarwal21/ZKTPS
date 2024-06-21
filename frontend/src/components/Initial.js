import React, { useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { LoadingContext } from "../useContext/LoadingContext";
import CreateEvent from "./createEvent";
import JoinEvent from "./joinEvent";
import { Card } from "flowbite-react";
export default function Initial() {
  const [loading, setLoading] = useState(false);
  const override = {
    display: "block",
    marginTop: "250px",
  };
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      <div>
        {loading ? (
          <>
            <BeatLoader color="#ffffff" cssOverride={override} />
            <p className="text-white">Entering Event...</p>
          </>
        ) : (
          <div className="flex justify-center items-center h-screen bg-gray-900">
            <div className="flex space-x-6">
              <Card className="max-w-sm p-6 min-h-[200px]">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 text-center">
                  Create Event
                </h5>
                <CreateEvent />
              </Card>
              <Card className="max-w-sm p-6 min-h-[200px]">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 text-center">
                  Join Event
                </h5>
                <JoinEvent />
              </Card>
            </div>
          </div>
        )}
      </div>
    </LoadingContext.Provider>
  );
}
