import { useContext, useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import { storeContext } from "../useContext/storeContext";
import { Button, Card, Clipboard } from "flowbite-react";
function BuyTicket() {
  const { account } = useContext(storeContext);
  const { event_index } = useParams();
  const eventUrl = `${window.location.origin}/home/${event_index}`;
  const [price, setPrice] = useState(null);
  const [name, setName] = useState(null);
  const [address, setAddress] = useState(null);
  const [tName, setTName] = useState(null);
  useEffect(() => {
    async function fetchDetails() {
      const { event_price, event_name, token_address } = await getDetails(
        event_index
      );
      setPrice(parseInt(event_price));
      setName(event_name);
      const t_name = get_token_name(token_address);
      setTName(t_name);
      setAddress(token_address);
    }
    fetchDetails();
  }, []);
  async function buy_ticket() {
    const { event_price, event_name, token_address } = await getDetails(
      event_index
    );
    const amount = event_price;
    let status = await approve(account, amount, toHex(token_address));
    if (status != true) {
      toast.error("failed to approve");
      return;
    }
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
      downloadTicket(
        qrDataURL,
        amount,
        token_name,
        event_index,
        event_name,
        account.address
      );
      toast.success("ticket bought successfully");
    } catch (error) {
      toast.error("transaction failed");
    }
  }
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="flex items-center w-full max-w-[23rem] gap-2 mb-4">
        <label htmlFor="text" className="sr-only">
          Label
        </label>
        <input
          id="text"
          type="text"
          className="flex-grow block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          value={eventUrl}
          disabled
          readOnly
        />
        <Clipboard valueToCopy={eventUrl} label="Copy" />
      </div>
      <Card className="max-w-sm w-full">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Buy Ticket
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Event Id: {event_index}
        </p>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Event Name : {name}
        </p>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Price: {price} {tName}
        </p>
        <Button onClick={buy_ticket}>Buy Ticket</Button>
      </Card>
    </div>
  );
}
export default BuyTicket;
