import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthersExtension } from "@dynamic-labs/ethers-v5";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <DynamicContextProvider
    settings={{
      environmentId: "0fc1b363-c12d-4727-a8b4-5cbe751f088d",
      walletConnectorExtensions: [EthersExtension],
    }}
  >
    <BrowserRouter>
      <App />
      <ToastContainer />
    </BrowserRouter>
  </DynamicContextProvider>
);
