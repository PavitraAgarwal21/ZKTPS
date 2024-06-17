import { useState } from "react";
import "./App.css";
import { connect, disconnect } from "@argent/get-starknet";
import { Contract, RpcProvider } from "starknet";
import abi1 from "./abis/ETHAbi.json";
import abi2 from "./abis/STRKAbi.json";
import random from "./utils/random";
import { commitmentHash, nullifierHash } from "./utils/createHash";
import bigInt from "big-integer";
function App() {
  const Contract_Address = "";
  const STRK_token_address =
    "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
  const ETH_token_address =
    "0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7";
  const [account, setAccount] = useState(null);
  async function connectWallet() {
    const connection = await connect();
    if (connection && connection.account) {
      setAccount(connection.account);
    }
  }
  async function buy_ticket() {
    const amount = "";
    const event_index = "";
    const contract_token = new Contract(abi1, ETH_token_address, account);
    try {
      const tx = await contract_token.approve(Contract_Address, amount);
      console.log(tx);
    } catch (error) {
      alert(error);
      return;
    }
    const secret = random();
    const nullifier = random();
    const commitment_hash = commitmentHash(
      parseInt(nullifier),
      parseInt(secret)
    );
    const nullifier_hash = nullifierHash(parseInt(nullifier));
    const hex_commitment_hash = toHex(commitment_hash);
    const contract = new Contract(abi1, Contract_Address, account);
    try {
      const tx2 = contract.buy_ticket(
        event_index,
        hex_commitment_hash,
        ETH_token_address
      );
    } catch (error) {
      alert(error);
    }
  }

  function toHex(number) {
    const bigIntNumber = bigInt(number);
    const hexString = bigIntNumber.toString(16);
    return "0x" + hexString;
  }
  return <button onClick={connectWallet}>connect</button>;
}

export default App;
