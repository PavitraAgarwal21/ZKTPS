import { useState } from "react";
import "./App.css";
import { connect, disconnect } from "@argent/get-starknet";
function App() {
  const [account, setAccount] = useState(null);
  async function connectWallet() {
    const connection = await connect();
    if (connection && connection.account) {
      setAccount(connection.account);
      localStorage.setItem("account",account);
    }
  }
  return <button onClick={connectWallet}>connect</button>;
}

export default App;
