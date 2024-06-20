import { useState } from "react";
import "./App.css";
import { connect } from "starknetkit";
import CreateEvent from "./components/createEvent";
import { RpcProvider } from "starknet";
import ScanNoteButton1 from "./components/invalidateTicket";
import Router from "./routes/Router";
import Header from "./components/Header";
import { storeContext } from "./useContext/storeContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [event_creation, setEvent_creation] = useState(false);
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
    <storeContext.Provider
      value={{
        account,
        setAccount,
        loading,
        setLoading,
        event_creation,
        setEvent_creation,
      }}
    >
      <div className="App">
        <Header />
        {/* <BuyTicket account={account} /> */}
        <Router account={account} />
        {/* <ScanNoteButton1 dialogTitle="Scan to verify ticket " /> */}
      </div>
    </storeContext.Provider>
  );
}

export default App;
