import { useState } from "react";
import "./App.css";
import { connect } from "@argent/get-starknet";
function App() {
  const [account, setAccount] = useState(null);
  async function connectWalletL2() {
    const connection = await connect();
    if (connection && connection.account) {
      setAccount(connection.account);
      localStorage.setItem("account", account);
    }
  }
  async function connectWalletL1() {
    try {
      const { ethereum } = window;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
    } catch (error) {
      alert(error);
    }
  }
  return <button onClick={connectWalletL2}>connect</button>;
}

export default App;
