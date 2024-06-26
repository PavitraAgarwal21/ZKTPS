import { generateProof } from "../utils/createProof";
import { QrReader } from "react-qr-reader";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { isMobile } from "react-device-detect";
import { Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";

import {
  Invalidate,
  getL2contract,
  getL2provider,
  toHex,
  apiurl,
} from "../web3/web3";
import { useContext, useState } from "react";
import { on } from "process";
import { nullifierHash } from "../utils/createHash";
import { storeContext } from "../useContext/storeContext";
// const { MongoClient } = require("mongodb");

// async function connectmongoDB() {
//   const uri = "mongodb+srv://agarwalpavitra3000:eeyPoKbnsQGiYAR1@allowresale.nfcdiym.mongodb.net/?retryWrites=true&w=majority&appName=ALLOWRESALE";
// const client = new MongoClient(uri);
// await client.connect();
// const dbName = "AllowResaleInfo";
// const collectionName = "allows";
// const database = client.db(dbName);
// const collection = database.collection(collectionName);
// return collection;
// }

export default function AllowResale(props) {
  const { account } = useContext(storeContext);

  const QRReader = (props) => {
    console.log(props);
    const facingMode = isMobile ? "environment" : "user";
    return (
      <div style={{ width: "100%" }}>
        <QrReader
          ViewFinder={ViewFinder}
          constraints={{ facingMode }}
          onResult={async (result, error) => {
            await getData(result, error, props);
          }}
        />
      </div>
    );
  };

  function ScanNoteDialog(props) {
    const { onClose, open } = props;

    const handleClose = () => {
      onClose();
    };

    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>{props.dialogTitle}</DialogTitle>
        <QRReader
          handleClose={handleClose}
          setData={props.setData}
          handleError={props.handleError}
          account={props.account}
        ></QRReader>
      </Dialog>
    );
  }
  function ScanNoteButton3(props) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <div>
        <Tooltip arrow title="Scan a QR code">
          <Button
            variant="contained"
            sx={{ height: "100%", fontWeight: 800 }}
            onClick={handleClickOpen}
          >
            Scan
          </Button>
        </Tooltip>
        <ScanNoteDialog
          open={open}
          onClose={handleClose}
          setData={props.setData}
          handleError={props.handleError}
          dialogTitle={props.dialogTitle}
        />
      </div>
    );
  }
  const ViewFinder = () => (
    <>
      <svg
        width="50px"
        viewBox="0 0 100 100"
        style={{
          top: 0,
          left: 0,
          zIndex: 1,
          boxSizing: "border-box",
          border: "50px solid rgba(0, 0, 0, 0.3)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      >
        <path
          fill="none"
          d="M13,0 L0,0 L0,13"
          stroke="rgba(255, 0, 0, 0.5)"
          strokeWidth="5"
        />
        <path
          fill="none"
          d="M0,87 L0,100 L13,100"
          stroke="rgba(255, 0, 0, 0.5)"
          strokeWidth="5"
        />
        <path
          fill="none"
          d="M87,100 L100,100 L100,87"
          stroke="rgba(255, 0, 0, 0.5)"
          strokeWidth="5"
        />
        <path
          fill="none"
          d="M100,13 L100,0 87,0"
          stroke="rgba(255, 0, 0, 0.5)"
          strokeWidth="5"
        />
      </svg>
    </>
  );

  // taking the recipient from the calling one
  async function getData(result, error, props) {
    if (!!result) {
      alert("Qr Scanned Successful");
      props.handleClose();
      try {
        const values = result?.text.split(",");
        // const nullifier = parseInt(values[0]);
        // console.log(nullifier);
        // const secret = parseInt(values[1]);
        // console.log(values[2]);
        const nullifierHash = toHex(values[2]);
        // console.log(nullifierHash);
        const commitmentHash = toHex(values[3]);

        //   console.log(props.account) ;

        // how we get the values of the recipient from the one who is calling the function ,
        // so we what to know the address of recipient which is the one who is calling the function
        await allowResale(nullifierHash, commitmentHash);
      } catch (error) {
        console.log(error);
      }
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

  async function allowResale(nullifierHash, commitmentHash) {
    try {
      console.log(account);
      let contract = getL2contract(account);
      let txn = await contract.approveToTicketResale(
        commitmentHash,
        nullifierHash
      );

      try {
        addAllow(nullifierHash, commitmentHash);
      } catch (err) {
        console.log(err);
      }
      toast.success("Ticket is allow to Resale");
    } catch (error) {
      alert(`error in deployment ${error} `);
      toast.error("error in allow ticket ");
    }
  }

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
          <ScanNoteButton3 dialogTitle="Scan for Ticket Reselling" />
        </div>
      </div>
    </div>
  );
}
