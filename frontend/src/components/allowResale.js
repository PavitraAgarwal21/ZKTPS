import { generateProof } from "../utils/createProof";
import { QrReader } from "react-qr-reader";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { isMobile } from "react-device-detect";
import { Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import { Invalidate, getL2contract, getL2provider, toHex } from "../web3/web3";
import { useState } from "react";
import { on } from "process";

/**
 * @typedef {Object} QRReaderProps
 * @property {(d: string) => void} setData - Function to set the scanned data
 * @property {(msg: string) => void} handleError - Function to handle errors
 * @property {() => void} handleClose - Function to handle the close event
 */

// Usage example
/**
 * @param {QRReaderProps} props
 */

let account;
const QRReader = (props) => {
  const facingMode = isMobile ? "environment" : "user";
  return (
    <div style={{ width: "100%" }}>
      <QrReader
        ViewFinder={ViewFinder}
        constraints={{ facingMode }}
        onResult={async (result, error) => {
          await getData(result, error, props, props.account);
        }}
      />
    </div>
  );
};

/**
 * @typedef {Object} ScanNoteDialogProps
 * @property {boolean} open - Indicates if the dialog is open
 * @property {() => void} onClose - Function to handle the close event
 * @property {(d: string) => void} setData - Function to set the scanned data
 * @property {(msg: string) => void} handleError - Function to handle errors
 * @property {string} dialogTitle - The title of the dialog
 */

// Usage example
/**
 * @param {ScanNoteDialogProps} props
 */
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
      ></QRReader>
    </Dialog>
  );
}

/**
 * @typedef {Object} ScanNoteButtonProps
 * @property {(d: string) => void} setData - Function to set the scanned data
 * @property {(msg: string) => void} handleError - Function to handle errors
 * @property {string} dialogTitle - The title of the dialog
 */

// Usage example
/**
 * @param {ScanNoteButtonProps} props
 */
export function ScanNoteButton3(props) {
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
export const ViewFinder = () => (
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
      const nullifierHash = values[2];
      const commitmentHash = values[3];
      //   console.log(props.account) ;

      // how we get the values of the recipient from the one who is calling the function ,
      // so we what to know the address of recipient which is the one who is calling the function
      await allowResale(nullifierHash, commitmentHash);
    } catch (error) {
      console.log(error);
    }
  }
}

async function allowResale(nullifierhash, commitmentHash) {
  try {
    const contract = getL2contract(account);
    let txn = await contract.approveToTicketResale(
      toHex(commitmentHash),
      toHex(nullifierhash)
    );
    console.log(txn);

    // store this ticket in the datababase
  } catch (error) {
    alert(error);
  }
}

export default function AllowResale() {
  return (
    <div className="container mx-auto mt-64 flex flex-col items-center justify-center">
      <h2 className="font-bold text-white">Scan Here</h2>
      <p className="text-white">
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
