import React, { useContext, useState } from "react";
import { getL2contractRead } from "../web3/web3";
import { useNavigate } from "react-router-dom";
import { Button, TextInput } from "flowbite-react";
import { LoadingContext } from "../useContext/LoadingContext";
import { toast } from "react-toastify";
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
      toast.error("Invalid event_index");
      setLoading(false);
      return;
    } else {
      setLoading(false);
      history(`home/${event_index}`);
    }
  }
  return (
    <div className="space-y-4 flex justify-center flex-col items-center h-full">
      <TextInput id="eventId" placeholder="Enter Event Index" required />
      <Button color="light" onClick={join_event}>
        Join Event
      </Button>
    </div>
  );
}
