import { shortString } from "starknet";
import { getL2contract, getL2provider, toDecimal } from "../web3/web3";
import random from "../utils/random";

export default function CreateEvent(props) {
  async function create_event() {
    const token_address = document.querySelector("#address").value;
    const provider = getL2provider();
    let event_index = random();
    let price = document.querySelector("#price").value;
    let no_of_tickets = document.querySelector("#tickets").value;
    let event_name = document.querySelector("#name").value;
    let felt_event_name = shortString.encodeShortString(event_name.toString());
    console.log(felt_event_name);
    const contract = getL2contract(props.account);
    console.log(contract);
    try {
      const tx = await contract.createTicketEvent(
        event_index,
        price,
        felt_event_name,
        no_of_tickets,
        token_address
      );
      console.log(tx);
      const transactionHash = tx.transaction_hash;
      console.log(transactionHash);
      const txReceipt = await provider.waitForTransaction(transactionHash);
      console.log(txReceipt);
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
      <input type="text" placeholder="enter token address here" id="address" />
      <button onClick={create_event}>create</button>
    </div>
  );
}
