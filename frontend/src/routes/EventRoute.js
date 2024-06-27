import React, { useContext, useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import BuyTicket from "../components/buyTicket";
import { getDetails, get_token_name } from "../web3/web3";
import { storeContext } from "../useContext/storeContext";
import BeatLoader from "react-spinners/BeatLoader";
const EventRoute = () => {
  const { event_index } = useParams();
  const [isValid, setIsValid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(null);
  const [name, setName] = useState(null);
  const [address, setAddress] = useState(null);
  const [tName, setTName] = useState(null);
  const [tickets, setTickets] = useState(null);
  const override = {
    display: "block",
    marginTop: "250px",
  };
  const { setStatus, setIndex } = useContext(storeContext);
  setIndex(event_index);
  useEffect(() => {
    const checkEventIndex = async () => {
      try {
        setLoading(true);
        const { event_price, event_name, token_address, no_of_tickets } =
          await getDetails(event_index);
        console.log(event_price);
        if (event_price == 0) {
          setLoading(false);
          setIsValid(false);
        } else {
          setPrice(parseInt(event_price));
          setName(event_name);
          const t_name = get_token_name(token_address);
          setTName(t_name);
          setAddress(token_address);
          setTickets(no_of_tickets);
          setLoading(false);
          setIsValid(true);
          setStatus(true);
        }
      } catch (error) {
        setLoading(false);
        setIsValid(false);
      }
    };

    checkEventIndex();
  }, []);

  return (
    <div>
      {loading ? (
        <>
          <BeatLoader color="#ffffff" cssOverride={override} />
          <p className="text-white">Fetching Tickets</p>
        </>
      ) : (
        <div style={{ marginTop: "250px" }}>
          <BuyTicket
            tName={tName}
            price={price}
            name={name}
            tickets={tickets}
          />
        </div>
      )}
    </div>
  );
};

export default EventRoute;
