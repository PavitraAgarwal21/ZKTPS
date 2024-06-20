import { shortString } from "starknet";
import {
  getL2contract,
  getL2contractRead,
  getL2provider,
  get_token_address,
  toDecimal,
} from "../web3/web3";
import random from "../utils/random";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { useContext, useState } from "react";
import "../styles/eventModal.css";
import { toast } from "react-toastify";
import BeatLoader from "react-spinners/BeatLoader";
import { storeContext } from "../useContext/storeContext";
const customStyles = {
  overlay: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  content: {
    position: "relative",
    top: "auto",
    left: "auto",
    right: "auto",
    bottom: "auto",
    marginRight: "0",
    transform: "none",
  },
};
export default function CreateEvent() {
  const history = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState("ETH");
  const [loading, setLoading] = useState(false);
  const override = {
    display: "block",
    marginTop: "250px",
  };
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleTokenChange = (event) => {
    setSelectedToken(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await create_event();
    closeModal();
  };
  const { account, setEvent_creation } = useContext(storeContext);
  async function create_event() {
    setLoading(true);
    let token_address = get_token_address(selectedToken);
    if (selectedToken === "custom") {
      token_address = document.querySelector("address").value;
    }
    const provider = getL2provider();
    let event_index = random();
    console.log(account);
    let price = document.querySelector("#price").value;
    let no_of_tickets = document.querySelector("#tickets").value;
    let event_name = document.querySelector("#name").value;
    let felt_event_name = shortString.encodeShortString(event_name.toString());
    console.log(felt_event_name);
    const contract = getL2contract(account);
    console.log(contract);
    try {
      setEvent_creation(true);
      const tx = await contract.createTicketEvent(
        event_index,
        price,
        felt_event_name,
        no_of_tickets,
        token_address
      );
      console.log(tx);
      // const transactionHash = tx.transaction_hash;
      // console.log(transactionHash);
      // const txReceipt = await provider.waitForTransaction(transactionHash);
      // console.log(txReceipt);
      // const listEvents = txReceipt.events;
      // console.log(listEvents);
    } catch (error) {
      setEvent_creation(false);
      setLoading(false);
      toast.error("error in creating event");
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
    setLoading(false);
    toast.success("Event created successfully");
    history(`home/${event_index}`);
  }
  async function join_event() {
    const event_index = document.querySelector("#eventId").value;
    const contract = getL2contractRead();
    const tx = await contract.getEventdetails(event_index);
    console.log(tx);
    if (tx.creator == "0") {
      alert("Invalid event_index");
      return;
    } else {
      history(`home/${event_index}`);
    }
  }
  return (
    <div>
      {loading ? (
        <>
          <BeatLoader color="#ffffff" cssOverride={override} />
          <p className="text-light">Fetching Transactions...</p>
        </>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ marginTop: "300px" }}
        >
          <button onClick={openModal} className="btn btn-success">
            Create Event
          </button>
          <button onClick={join_event} className="btn btn-warning">
            Join Event
          </button>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            overlayClassName="modal-overlay_custom"
            className="modal-content_custom"
            style={customStyles}
            contentLabel="Create Event Modal"
          >
            <h2>Create Event</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Event Name:</label>
                <input type="text" id="name" required />
              </div>
              <div>
                <label>Ticket Price:</label>
                <input type="number" id="price" required />
              </div>
              <div>
                <label>Number of Tickets:</label>
                <input type="number" id="tickets" required />
              </div>
              <div>
                <label>Select Token:</label>
                <select
                  value={selectedToken}
                  onChange={handleTokenChange}
                  required
                >
                  <option value="ETH">ETH</option>
                  <option value="STRK">STRK</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              {selectedToken === "custom" && (
                <div>
                  <label>Custom Token Address:</label>
                  <input type="text" id="address" required />
                </div>
              )}
              <div>
                <button type="submit" className="create-button">
                  Create Event
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </Modal>
        </div>
      )}
    </div>
  );
}
