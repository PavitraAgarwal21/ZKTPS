import { toast } from "react-toastify";

import { getL2contract, apiurl } from "../web3/web3";
import { ScanNoteButton } from "./Scanner";

export async function allowResale(nullifierHash, commitmentHash, account) {
  try {
    console.log(account);
    let contract = getL2contract(account);
    let txn = await contract.approveToTicketResale(
      commitmentHash,
      nullifierHash
    );

    try {
      await addAllow(nullifierHash, commitmentHash);
    } catch (err) {
      console.log(err);
    }
    toast.success("Ticket is allow to Resale");
  } catch (error) {
    alert(`error in deployment ${error} `);
    toast.error("error in allow ticket ");
  }
}
async function addAllow(nullifier, commitment) {
  const data = new FormData();
  data.append("nullifier", nullifier);
  data.append("commitment", commitment);
  // console.log(data.get("old_nullifier")) ;
  fetch(apiurl, {
    method: "POST",
    body: data,
  })
    .then((res) => res.json())
    .then((result) => {
      alert(result);
    });
}
export default function AllowResale() {
  return (
    <div
      className="container mx-auto mt-64 flex flex-col items-center justify-center"
      style={{ marginTop: "90px" }}
    >
      <h2 className="font-bold text-white" style={{ fontSize: "55px" }}>
        Scan Here
      </h2>
      <p className="text-white" style={{ fontSize: "40px" }}>
        <span className="font-bold">Disclaimer! </span>
        Here you can scan the original ticket and can opt for resale!! This
        ticket will be available for resale and anyone can buy it if interested
        You will get your funds back on successful buying of ticket.
      </p>
      <div className="flex flex-col items-center mt-4">
        <h3 className="text-white">Resale Ticket</h3>
        <div className="flex justify-center mt-4">
          <ScanNoteButton
            dialogTitle="Scan for Ticket Reselling"
            func={"resale"}
          />
        </div>
      </div>
    </div>
  );
}
