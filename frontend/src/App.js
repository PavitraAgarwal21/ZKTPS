import { useState } from "react";
import "./App.css";
import { connect } from "@argent/get-starknet";
// import BuyTicket from "./components/buyTicket";
import CreateEvent from "./components/createEvent";
function App() {
  const [account, setAccount] = useState(null);
  async function connectWalletL2() {
    const connection = await connect({ dappName: "ZKTPS" });
    if (connection && connection.account) {
      setAccount(connection.account);
      localStorage.setItem("account", connection.account);
    }
  }
  return (
    <div>
      <button onClick={connectWalletL2}>connect</button>
      {/* <BuyTicket /> */}
      <CreateEvent account={account} />
    </div>
  );
}

export default App;
