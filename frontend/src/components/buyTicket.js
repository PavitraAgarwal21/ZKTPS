import { useContext, useEffect, useState } from "react";
import random from "../utils/random";
import { commitmentHash, nullifierHash } from "../utils/createHash";
import {
  approve,
  getDetails,
  getL2contract,
  get_token_name,
  toHex,
  fetchData,
  toDecimal,
} from "../web3/web3";
import { CreateTicketQR } from "../utils/createTicketQR";
import { downloadTicket } from "../utils/downloadTicket";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { storeContext } from "../useContext/storeContext";
import { Button, Card, Clipboard } from "flowbite-react";
import BeatLoader from "react-spinners/BeatLoader";
function BuyTicket(props) {
  const { account } = useContext(storeContext);
  const { event_index } = useParams();
  const eventUrl = `${window.location.origin}/home/${event_index}`;
  const tName = props.tName;
  const name = props.name;
  const price = props.price;
  const [loading, setLoading] = useState(false);
  const override = {
    display: "block",
    marginTop: "250px",
  };
  async function buy_ticket() {
    if (account == null) {
      toast.error("Connect Wallet first");
      return;
    }
    const { event_price, event_name, token_address } = await getDetails(
      event_index
    );
    const amount = event_price;
    setLoading(true);
    let status = await approve(account, amount, toHex(token_address));
    if (status != true) {
      toast.error("failed to approve");
      setLoading(false);
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

      const transactionHash = tx2.transaction_hash;

      let data = await fetchData(transactionHash, 3);
      let buyer = data[0].value;
      let ticketEventIndex = data[1].value;
      let creatorOfTicket = data[2].value;
      let commitment = data[3].value;
      let nullifier = data[4].value;

      console.log(
        `buyer - ${buyer} ticketEventIndex - ${ticketEventIndex} creatorOfTicket - ${creatorOfTicket} commitment - ${commitment} nullifier - ${nullifier}`
      );
      // event emit values creator of the  event and their event inde

      const noteString = `${nullifier},${secret},${nullifier_hash},${commitment_hash},${event_index},${amount},${token_address}`;
      const qrDataURL = await CreateTicketQR(noteString);
      const token_name = get_token_name(token_address);
      setLoading(false);
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
      setLoading(false);
      toast.error("transaction failed");
    }
  }
  return (
    <div>
      {loading ? (
        <>
          <BeatLoader color="#ffffff" cssOverride={override} />
          <p className="text-white">Fetching...</p>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <div className="grid w-full max-w-96 mb-3">
            <div className="relative">
              <label htmlFor="npm-install" className="sr-only">
                Label
              </label>
              <input
                id="npm-install"
                type="text"
                className="col-span-6 block w-full rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-4 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                value={eventUrl}
                disabled
                readOnly
              />
              <Clipboard.WithIconText valueToCopy={eventUrl} />
            </div>
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
      )}
    </div>
  );
}
export default BuyTicket;
