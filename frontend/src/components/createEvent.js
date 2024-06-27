import { shortString } from "starknet";
import {
  getL2contract,
  getL2provider,
  get_token_address,
  fetchData,
  toDecimal,
} from "../web3/web3";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import "../styles/eventModal.css";
import { toast } from "react-toastify";
import { storeContext } from "../useContext/storeContext";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";

import { LoadingContext } from "../useContext/LoadingContext";
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
  const { loading, setLoading } = useContext(LoadingContext);
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
  const { account } = useContext(storeContext);

  async function create_event() {
    setLoading(true);
    let token_address = get_token_address(selectedToken);
    if (selectedToken === "custom") {
      token_address = document.querySelector("address").value;
    }
    const provider = getL2provider();
    console.log(account);
    let price = document.querySelector("#price").value;
    let no_of_tickets = document.querySelector("#tickets").value;
    let event_name = document.querySelector("#name").value;
    let felt_event_name = shortString.encodeShortString(event_name.toString());
    console.log(felt_event_name);
    const contract = getL2contract(account);
    console.log(contract);
    try {
      const tx = await contract.createTicketEvent(
        price,
        felt_event_name,
        no_of_tickets,
        token_address
      );
      const transactionHash = tx.transaction_hash;
      console.log(`transaction hash - ${transactionHash}`);

      let data = await fetchData(transactionHash, 2);
      let creator = data[0].value;
      let eventIndex = toDecimal(data[1].value);
      console.log(`creator - ${creator} eventIndex - ${eventIndex}`);
      setLoading(false);
      toast.success("Event created successfully");
      toast.success(`Your Event Index:${eventIndex}`);
      history(`home/${eventIndex}`);
    } catch (error) {
      setLoading(false);
      toast.error("error in creating event");
      return;
    }
  }
  return (
    <div>
      <div className="flex justify-center h-full items-center">
        <Button
          color="light"
          onClick={() => setModalIsOpen(true)}
          className="mt-12"
        >
          Create Event
        </Button>
        <Modal show={modalIsOpen} size="md" onClose={closeModal} popup>
          <Modal.Header />
          <Modal.Body>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Create Event
              </h3>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="text" value="Event Name:" />
                </div>
                <TextInput id="name" placeholder="Enter event name" required />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="number" value="Price:" />
                </div>
                <TextInput
                  id="price"
                  placeholder="Enter ticket price"
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="number" value="Number of Tickets:" />
                </div>
                <TextInput
                  id="tickets"
                  placeholder="Enter no of tickets"
                  required
                />
              </div>
              <div>
                <Label htmlFor="text" value="Select Token:" />
                <Select
                  value={selectedToken}
                  onChange={handleTokenChange}
                  required
                >
                  <option value="ETH">ETH</option>
                  <option value="STRK">STRK</option>
                  <option value="custom">Custom</option>
                </Select>
              </div>
              {selectedToken === "custom" && (
                <div>
                  <Label htmlFor="text" value="Custom Token Address:" />
                  <TextInput type="text" id="address" required />
                </div>
              )}
              <div className="w-full">
                <Button onClick={create_event} color="purple">
                  Create
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
