import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { StarknetWalletConnectors } from "@dynamic-labs/starknet";
// import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <DynamicContextProvider
    settings={{
      environmentId: "0fc1b363-c12d-4727-a8b4-5cbe751f088d",
      walletConnectors: [StarknetWalletConnectors],
      initialAuthenticationMode: "connect-only",
      events: {
        onAuthSuccess: () => {
          toast.success("connected");
        },
      },
    }}
  >
    <BrowserRouter>
      <App />
      <ToastContainer />
    </BrowserRouter>
  </DynamicContextProvider>
);
