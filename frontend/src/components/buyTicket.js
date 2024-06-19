import { useEffect, useState } from "react";
import { Contract, RpcProvider } from "starknet";
import random from "../utils/random";
import { commitmentHash, nullifierHash } from "../utils/createHash";
import {
  Contract_Address,
  approve,
  getDetails,
  getL2contract,
  toHex,
} from "../web3/web3";
import { CreateTicketQR } from "../utils/createTicketQR";
import { downloadTicket } from "../utils/downloadTicket";

function BuyTicket(props) {
  const [ticketDetails, setTicketDetails] = useState(null);
  const [price, setPrice] = useState(null);
  const abi1 = "";
  const account = props.account;
  const token_address =
    "0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7";

  // useEffect(() => {
  //   const event_name = getDetails();
  //   downloadTicket(ticketDetails, price, event_name);
  // }, [ticketDetails]);
  async function buy_ticket() {
    const provider = new RpcProvider({
      nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
    });
    const amount = 1000;
    setPrice(amount);
    const event_index = 1;
    // await approve(account, amount);
    await new Promise((resolve) => setTimeout(resolve, 3000));
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
      const noteString = `${nullifier},${secret},${nullifier_hash},${commitment_hash},${amount},${token_address}`;
      const qrDataURL = await CreateTicketQR(noteString);
      downloadTicket(qrDataURL, price, "hi there");
      setTicketDetails(qrDataURL);
    } catch (error) {
      alert(error);
    }
  }
  return (
    <div>
      <button onClick={buy_ticket}>buy</button>
    </div>
  );
}
export default BuyTicket;
