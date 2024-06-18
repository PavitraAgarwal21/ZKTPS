import { useEffect, useState } from "react";
import { Contract, RpcProvider } from "starknet";
import random from "../utils/random";
import { commitmentHash, nullifierHash } from "../utils/createHash";
import { approve, getDetails, toHex } from "../web3/web3";
import { CreateTicketQR } from "../utils/createTicketQR";
import { downloadTicket } from "../utils/downloadTicket";

function BuyTicket() {
  const [ticketDetails, setTicketDetails] = useState(null);
  const [price, setPrice] = useState(null);
  const abi1 = "";
  const account = "";
  const Contract_Address = "";
  const token_address = "";

  useEffect(() => {
    const event_name = getDetails();
    downloadTicket(ticketDetails, price, event_name);
  }, [ticketDetails]);
  async function buy_ticket() {
    const provider = new RpcProvider({
      nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
    });
    const amount = localStorage.getItem("event_price");
    setPrice(amount);
    const event_index = localStorage.getItem("event_index");
    await approve(amount);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const secret = random();
    const nullifier = random();
    const commitment_hash = commitmentHash(
      parseInt(nullifier),
      parseInt(secret)
    );
    const nullifier_hash = nullifierHash(parseInt(nullifier));
    const hex_commitment_hash = toHex(commitment_hash);
    const contract = new Contract(abi1, Contract_Address, account);
    try {
      const tx2 = await contract.buy_ticket(
        event_index,
        hex_commitment_hash,
        token_address
      );
      const noteString = `${nullifier},${secret},${nullifier_hash},${commitment_hash},${amount},${token_address}`;
      const qrDataURL = await CreateTicketQR(noteString);
      setTicketDetails(qrDataURL);
    } catch (error) {
      alert(error);
    }
  }
  return <div>hello there</div>;
}
export default BuyTicket;
