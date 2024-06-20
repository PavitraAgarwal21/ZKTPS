import React, { useContext, useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import BuyTicket from "../components/buyTicket";
import { getDetails } from "../web3/web3";
import { storeContext } from "../useContext/storeContext";

const EventRoute = (props) => {
  const { event_index } = useParams();
  const [isValid, setIsValid] = useState(null);
  const { event_creation } = useContext(storeContext);
  useEffect(() => {
    const checkEventIndex = async () => {
      if (!event_creation) {
        try {
          const { event_price, event_name, token_address } = await getDetails(
            event_index
          );
          if (event_price == 0) {
            setIsValid(false);
          } else {
            setIsValid(true);
          }
        } catch (error) {
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

  return <BuyTicket account={props.account} />;
};

export default EventRoute;
