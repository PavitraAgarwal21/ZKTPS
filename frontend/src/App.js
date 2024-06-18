import { useState } from "react";
import "./App.css";
import { connect } from "@argent/get-starknet";
function App() {
  const [account, setAccount] = useState(null);
  async function connectWalletL2() {
    const connection = await connect({ dappName: "ZKTPS" });
    if (connection && connection.account) {
      setAccount(connection.account);
      localStorage.setItem("account", account);
    }
  }
  return <button onClick={connectWalletL2}>connect</button>;
}

export default App;
