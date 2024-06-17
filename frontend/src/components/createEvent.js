import React from "react";
import { Contract, RpcProvider } from "starknet";

export default function createEvent() {
  async function create_event() {
    const contract_address = "";
    const contract_abi = "";
    const account = "";
    const provider = new RpcProvider({
      nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
    });
    let price = document.querySelector("#price").value;
    let no_of_tickets = document.querySelector("#tickets").value;
    let event_name = document.querySelector("#name").value;
    const contract = new Contract(contract_abi, contract_address, account);
    try {
      const tx = contract.createTicketEvent(event_name, price, no_of_tickets);
      const transactionHash = tx.transaction_hash;
      const txReceipt = await provider.waitForTransaction(transactionHash);
      const listEvents = txReceipt.events;
      console.log(listEvents);
    } catch (error) {
      alert(error);
    }
  }
  return (
    <div>
      <input type="text" placeholder="enter event name" id="name" />
      <input type="text" placeholder="enter price" id="price" />
      <input type="text" placeholder="enter number of tickets" id="tickets" />
      <button onClick={create_event}>create</button>
    </div>
  );
}
