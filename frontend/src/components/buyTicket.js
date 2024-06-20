import { useEffect, useState } from "react";
import random from "../utils/random";
import { commitmentHash, nullifierHash } from "../utils/createHash";
import {
  approve,
  getDetails,
  getL2contract,
  get_token_name,
  toHex,
} from "../web3/web3";
import { CreateTicketQR } from "../utils/createTicketQR";
import { downloadTicket } from "../utils/downloadTicket";
import { useParams } from "react-router-dom";
function BuyTicket(props) {
  const [ticketDetails, setTicketDetails] = useState(null);
  const [price, setPrice] = useState(null);
  const account = props.account;
  const { event_index } = useParams();
  const eventUrl = `${window.location.origin}/event/${event_index}`;
  async function buy_ticket() {
    const { event_price, event_name, token_address } = await getDetails(
      event_index
    );
    const amount = event_price;
    console.log(event_price);
    setPrice(amount);
    await approve(account, amount);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const secret = random();
    const nullifier = random();
    const commitment_hash = commitmentHash(
      parseInt(nullifier),
      parseInt(secret)
    );
    const nullifier_hash = nullifierHash(parseInt(nullifier));
    const hex_commitment_hash = toHex(commitment_hash);
    const contract = getL2contract(account);
    try {
      const tx2 = await contract.buyTicket(
        event_index,
        hex_commitment_hash,
        token_address
      );
      const noteString = `${nullifier},${secret},${nullifier_hash},${commitment_hash},${event_index},${amount},${token_address}`;
      const qrDataURL = await CreateTicketQR(noteString);
      const token_name = get_token_name(token_address);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      downloadTicket(qrDataURL, price, token_name, event_name);
      setTicketDetails(qrDataURL);
    } catch (error) {
      alert(error);
    }
  }
  return (
    <div>
      <p>{eventUrl}</p>
      <button onClick={buy_ticket}>buy</button>
    </div>
  );
}
export default BuyTicket;
