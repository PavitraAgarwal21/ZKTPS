import React, { useContext, useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import BuyTicket from "../components/buyTicket";
import { getDetails } from "../web3/web3";
import { storeContext } from "../useContext/storeContext";
import BeatLoader from "react-spinners/BeatLoader";
const EventRoute = (props) => {
  const { event_index } = useParams();
  const [isValid, setIsValid] = useState(null);
  const [loading, setLoading] = useState(false);
  const override = {
    display: "block",
    marginTop: "250px",
  };
  const { event_creation, setStatus, setIndex } = useContext(storeContext);
  setIndex(event_index);
  useEffect(() => {
    const checkEventIndex = async () => {
      if (!event_creation) {
        try {
          setLoading(true);
          const { event_price, event_name, token_address } = await getDetails(
            event_index
          );
          if (event_price == 0) {
            setLoading(false);
            setIsValid(false);
          } else {
            setLoading(false);
            setIsValid(true);
            setStatus(true);
          }
        } catch (error) {
          setLoading(false);
          setIsValid(false);
        }
      } else {
        setIsValid(true);
      }
    };

    checkEventIndex();
  }, [event_index]);

  if (isValid === null) {
    // Optionally, you can show a loading indicator while checking the event index
    return <div>Loading...</div>;
  }

  if (!isValid) {
    // Redirect or show an error message if the event index is not valid
    return <Navigate to="/error" />; // Adjust the path as necessary
  }

  return (
    <div>
      {loading ? (
        <>
          <BeatLoader color="#ffffff" cssOverride={override} />
          <p className="text-white">Fetching Tickets</p>
        </>
      ) : (
        <div style={{ marginTop: "250px" }}>
          <BuyTicket />
        </div>
      )}
    </div>
  );
};

export default EventRoute;
