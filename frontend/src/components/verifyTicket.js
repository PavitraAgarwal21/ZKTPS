import { getL2contractRead, toHex } from "../web3/web3";
import { ScanNoteButton } from "./Scanner";

export async function verifyTicket(nullifierHash, commitmentHash) {
  try {
    const contract = getL2contractRead();
    try {
      let txn = await contract.verifyTicket(
        toHex(commitmentHash),
        toHex(nullifierHash)
      );
      console.log(txn);
      if (txn == true) {
        alert("Ticket is valid");
      } else {
        alert("Ticket is invalid");
      }
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}

export default function VerifyTicket() {
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
        You can verify whether the ticket you've been given has already been
        invalidated. If it has, you can return it to the creator and request a
        newly issued ticket. Ensure this while taking the ticket from the
        creator.
      </p>
      <div className="flex flex-col items-center mt-4">
        <h3 className="text-white">Verify Ticket</h3>
        <div className="flex justify-center mt-4">
          <ScanNoteButton
            dialogTitle="Scan for verifying ticket"
            func={"verify"}
          />
        </div>
      </div>
    </div>
  );
}
