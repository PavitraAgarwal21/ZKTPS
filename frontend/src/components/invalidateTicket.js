import { generateProof } from "../utils/createProof";
import {
  Invalidate,
  connectWalletL1,
  getL1Contract,
  getL1Provider,
  requestAccounts,
  toHex,
  L1_Contract_Address,
} from "../web3/web3";
import { toast } from "react-toastify";
import { ScanNoteButton } from "./Scanner";

const fetchDataContract = async (commitment) => {
  const url =
    "https://sepolia-api.voyager.online/beta/events?ps=10&p=1&contract=0x06f52ba412b2b8fd27bd552f734265bf0071808587aca3552bd80bb58e17741a";

  const apiKey = "qN25adhQX38RewEouZjWa6Bd1dj7AFuKUrxVBnX2";

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  while (true) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "x-api-key": apiKey,
        },
      });

      const data = await response.json();
      const firstEvent = data.items[0];
      console.log(firstEvent);
      const firstEventName = firstEvent.name;
      const firstEventData = firstEvent.dataDecoded;
      if (firstEventName === "inValidatedTicket") {
        if (firstEventData[3].value == commitment) {
          console.log("The event is found");
          handleInvalidatedTicketEvent(firstEventData, firstEventData[0].value);
          break;
        } else {
          console.log(
            "please wait .. The event with particular commitment is not found "
          );
        }
      } else {
        console.log("Please wait... as event with invalidate is not found ");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
    await delay(2000); // Wait for 1 second before making the next request
  }
};
function handleInvalidatedTicketEvent(event, buyer) {
  console.log("Custom code executed for inValidated Ticket event:", event);
  toast.success(`invalidate Successful from l2 from buyer ${buyer}`);
  // Add your custom code here
}

export async function invalidateTicket(
  nullifier,
  secret,
  nullifierHash,
  commitmentHash
) {
  try {
    console.log(commitmentHash);
    await connectWalletL1();
    const contractAddress = L1_Contract_Address;
    const provider = getL1Provider();
    const recipient = await requestAccounts(provider);
    console.log(recipient);
    const contract = getL1Contract(provider, contractAddress);
    const selector =
      "0x02ee206af5b468bd3a0f382f37441601d9b049ebb71196c282d2bab1af7b7062";
    const Proof = await generateProof(
      nullifier,
      secret,
      nullifierHash,
      commitmentHash,
      recipient
    );
    console.log(Proof);
    try {
      const transaction = await Invalidate(
        contract,
        Proof,
        toHex(nullifierHash),
        toHex(commitmentHash),
        recipient,
        selector
      );
      await transaction.wait();
      toast.success("invalidate Successful from l1");
      try {
        fetchDataContract(toHex(commitmentHash));
      } catch (error) {
        console.log(`error in the fectching api ${error}`);
      }
    } catch (error) {
      alert(error);
    }
  } catch (error) {
    console.log(error);
  }
}

export default function InvalidateTicket() {
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
        Here you can invalidate the ticket for prevention of further use case or
        black marketing of these tickets.
      </p>
      <div className="flex flex-col items-center mt-4">
        <h3 className="text-white">Invalidate Ticket</h3>
        <div className="flex justify-center mt-4">
          <ScanNoteButton
            dialogTitle="Scan for invalidate ticket"
            func={"invalidate"}
          />
        </div>
      </div>
    </div>
  );
}
