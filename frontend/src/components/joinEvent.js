import React, { useContext, useState } from "react";
import { getL2contractRead } from "../web3/web3";
import { useNavigate } from "react-router-dom";
import { Button, TextInput } from "flowbite-react";
import { LoadingContext } from "../useContext/LoadingContext";
export default function JoinEvent() {
  const history = useNavigate();
  const { setLoading } = useContext(LoadingContext);
  async function join_event() {
    setLoading(true);
    const event_index = document.querySelector("#eventId").value;
    const contract = getL2contractRead();
    const tx = await contract.getEventdetails(event_index);
    console.log(tx);
    if (tx.creator == "0") {
      alert("Invalid event_index");
      return;
    } else {
      setLoading(false);
      history(`home/${event_index}`);
    }
  }
  return (
    <div>
      <TextInput id="eventId" placeholder="Enter Event Index" required />
      <Button color="light" onClick={join_event}>
        Join Event
      </Button>
    </div>
  );
}
