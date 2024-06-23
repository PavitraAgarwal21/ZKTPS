import { useState } from "react";
import "./App.css";
import { connect } from "starknetkit";
import { RpcProvider } from "starknet";
import Router from "./routes/Router";
import Header from "./components/Header";
import { storeContext } from "./useContext/storeContext";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [event_creation, setEvent_creation] = useState(false);
  const [status, setStatus] = useState(false);
  const [index, setIndex] = useState(null);
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
        status,
        setStatus,
        index,
        setIndex,
      }}
    >
      <div className="App">
        <Header />
        <Router />
      </div>
    </storeContext.Provider>
  );
}

export default App;
