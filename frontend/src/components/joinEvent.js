import React, { useContext, useState } from "react";
import { getL2contractRead } from "../web3/web3";
import { useNavigate } from "react-router-dom";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { LoadingContext } from "../useContext/LoadingContext";
import { toast } from "react-toastify";
export default function JoinEvent() {
  const history = useNavigate();
  const { setLoading } = useContext(LoadingContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState("ETH");
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  async function join_event() {
    setLoading(true);
    const event_index = document.querySelector("#eventId").value;
    const contract = getL2contractRead();
    const tx = await contract.getEventdetails(event_index);
    console.log(tx);
    if (tx.creator == "0") {
      toast.error("Invalid event_index");
      setLoading(false);
      return;
    } else {
      setLoading(false);
      history(`home/${event_index}`);
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
          Join Event
        </Button>
        <Modal show={modalIsOpen} size="md" onClose={closeModal} popup>
          <Modal.Header />
          <Modal.Body>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Join Event
              </h3>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="number" value="Event Index:" />
                </div>
                <TextInput
                  id="eventId"
                  placeholder="Enter event index"
                  required
                />
              </div>
              <div className="w-full">
                <Button onClick={join_event}>Join</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
