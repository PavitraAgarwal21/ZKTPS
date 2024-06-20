import { useState } from "react";
import "./App.css";
import { connect } from "starknetkit";
import CreateEvent from "./components/createEvent";
import { RpcProvider } from "starknet";
import ScanNoteButton1 from "./components/invalidateTicket";
import Router from "./routes/Router";
function App() {
  const [account, setAccount] = useState(null);
  async function connectWalletL2() {
    const { wallet } = await connect({
      provider: new RpcProvider({
        nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
      }),
      dappName: "ZKTPS",
    });
    if (wallet && wallet.isConnected) {
      setAccount(wallet.account);
      localStorage.setItem("account", wallet.account);
    }
  }
  return (
    <div>
      <button onClick={connectWalletL2}>connect</button>
      {/* <BuyTicket account={account} /> */}
      <Router account={account} />
      <ScanNoteButton1 dialogTitle="Scan to verify ticket" />
    </div>
  );
}

export default App;
