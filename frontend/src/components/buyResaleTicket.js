import { useContext, useEffect, useState } from "react";

import { commitmentHash, nullifierHash } from "../utils/createHash";

import {
  approve,
  getDetails,
  getL2contract,
  get_token_name,
  toHex,
  calculatePurchaseFeeLocal,
  apiurl,
  getL2contractRead,
} from "../web3/web3";
import BeatLoader from "react-spinners/BeatLoader";

import random from "../utils/random";
import { CreateTicketQR } from "../utils/createTicketQR";
import { downloadTicket } from "../utils/downloadTicket";
import { Button, Card } from "flowbite-react";
import { storeContext } from "../useContext/storeContext";

export default function BuyResaleTicket(props) {
  // this will give all the data in this of the condition
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const override = {
    display: "block",
    marginTop: "200px",
  };
  useEffect(() => {
    async function getarr() {
      fetch(apiurl + "get")
        .then((response) => response.json())
        .then((data) => setData(data));
    }
    getarr();
  }, []);

  let { account } = useContext(storeContext);
  let contract = getL2contract(account);

  async function getvalue(old_nullifier_hash, old_commitment_hash) {
    console.log(old_commitment_hash);

    let contractRead = getL2contractRead();
    let ticket_details = await contractRead.getTicket(
      old_commitment_hash.toString()
    );
    let event_index = ticket_details.ticketEventIndex;
    console.log(event_index);
    const { event_price, event_name, token_address } = await getDetails(
      event_index
    );
    let price = Number(event_price);
    let fees = price * 0.01;
    let total = price + fees;
    await approve(account, total);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    let new_nullifier = random();
    let new_secret = random();
    const new_commitment_hash = commitmentHash(
      parseInt(new_nullifier),
      parseInt(new_secret)
    );
    const new_nullifier_hash = nullifierHash(parseInt(new_nullifier));
    try {
      let txn = await contract.buyResaleTicket(
        new_commitment_hash,
        old_nullifier_hash.toString(),
        old_commitment_hash.toString()
      );
      console.log(txn);
      const noteString = `${new_nullifier},${new_secret},${new_nullifier_hash},${new_commitment_hash},${event_index},${event_price},${token_address}`;
      const qrDataURL = await CreateTicketQR(noteString);
      const token_name = get_token_name(token_address);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      downloadTicket(qrDataURL, price, token_name, event_name);
    } catch (error) {
      alert(error);
    }
  }
  async function deleteOldTicket(nullifier, commitment) {
    const data = new FormData();
    data.append("nullifier", nullifier);
    data.append("commitment", commitment);
    // console.log(data.get("old_nullifier")) ;
    fetch(apiurl, {
      method: "DELETE",
      body: data,
    })
      .then((res) => res.json())
      .then((result) => {
        alert(result);
      });
  }

  return (
    <div>
      {loading ? (
        <>
          <BeatLoader color="#ffffff" cssOverride={override} />
          <p className="text-light">Fetching Transactions...</p>
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {data.map((data, index) => (
            <Card
              key={index}
              className="w-full p-4 border rounded-lg shadow-md"
            >
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Buy Ticket
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                CommitmentHash: {data.old_commitment}
              </p>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                NullifierHash: {data.old_nullifier}
              </p>
              <Button
                onClick={() => {
                  getvalue(data.old_nullifier, data.old_commitment);
                }}
                className="mt-4 w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Buy Ticket
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
