import React from "react";
import { shortString } from "starknet";
import { getL2contract, getL2provider, toDecimal } from "../web3/web3";

export default function CreateEvent(props) {
  async function create_event() {
    const token_address = document.querySelector("#address").value;
    const provider = getL2provider();
    let price = document.querySelector("#price").value;
    let no_of_tickets = document.querySelector("#tickets").value;
    let event_name = document.querySelector("#name").value;
    let felt_event_name = shortString.encodeShortString(event_name.toString());
    console.log(felt_event_name);
    const contract = getL2contract(props.account);
    try {
      const tx = contract.createTicketEvent(
        price,
        felt_event_name,
        no_of_tickets,
        token_address
      );
      const transactionHash = tx.transaction_hash;
      const txReceipt = await provider.waitForTransaction(transactionHash);
      const listEvents = txReceipt.events;
      console.log(listEvents[2].keys[1]);
      const event_index = toDecimal(listEvents[2].data[0]);
      const event_price = toDecimal(listEvents[2].data[3]);
      localStorage.setItem("eventIndex", event_index);
      localStorage.setItem("eventName", event_name);
      localStorage.setItem("eventPrice", event_price);
      console.log(event_index);
    } catch (error) {
      alert(error);
    }
  }
  return (
    <div>
      <input type="text" placeholder="enter event name" id="name" />
      <input type="text" placeholder="enter price" id="price" />
      <input type="text" placeholder="enter number of tickets" id="tickets" />
      <input type="text" placeholder="enter token address here" id="address" />
      <button onClick={create_event}>create</button>
    </div>
  );
}
