import React from "react";
import { Contract, RpcProvider } from "starknet";
import random from "../utils/random";
import { commitmentHash, nullifierHash } from "../utils/createHash";
import bigInt from "big-integer";

export default function buyTicket() {
  const abi1 = "";
  const account = "";
  const Contract_Address = "";
  const ETH_token_address = "";
  async function buy_ticket() {
    const provider = new RpcProvider({
      nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
    });
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
  return <div>buyTicket</div>;
}
