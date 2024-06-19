import { Contract, RpcProvider, shortString } from "starknet";
import { ethers } from "ethers";
import { Proofa, Proofb, Proofc } from "../utils/packToSolidityProof";
import abi1 from "../abis/ETHAbi.json";
import abi2 from "../abis/STRKAbi.json";
import abi3 from "../abis/myAbi.json";
export const Contract_Address =
  "0x05abe5114de127e0ceec5322493b929da484af4af5a183e7bba3e79b03852913";
export const L1_Contract_Address = "";
export const STRK_token_address =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
export const ETH_token_address =
  "0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7";

export const getL2contract = (account) => {
  // const account = localStorage.getItem("account");
  console.log(account);
  let contract = new Contract(abi3, Contract_Address, account);
  return contract;
};
export const getL2contractRead = () => {
  const provider = getL2provider();
  let contract = new Contract(abi3, Contract_Address, provider);
  return contract;
};
export const getL2provider = () => {
  const provider = new RpcProvider({
    nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
  });
  return provider;
};
export function getL1Provider() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider;
}
export async function getChainId() {
  const chainId = await window.ethereum.request({
    method: "eth_chainId",
    params: [],
  });
  return chainId;
}
export async function requestAccounts(provider) {
  const accounts = await provider.send("eth_requestAccounts", []);
  return accounts[0];
}
export const getL1Contract = (provider, address) => {
  // const contractABI = abi.abi;
  const signer = provider.getSigner();
  // return new ethers.Contract(L1_Contract_Address, contractABI, signer);
};
export function toHex(number) {
  return ethers.BigNumber.from(number)._hex;
}
export function toDecimal(number) {
  return parseInt(number, 16);
}
export async function Invalidate(contract, proof, nullifierHash, commitment) {
  const proofA = Proofa(proof);
  const proofB = Proofb(proof);
  const proofC = Proofc(proof);
  return await contract.InvalidateTicket(
    proofA,
    proofB,
    proofC,
    nullifierHash,
    commitment
  );
}

export async function approve(account, amount) {
  const contract_token = new Contract(abi1, ETH_token_address, account);
  try {
    const tx = await contract_token.approve(Contract_Address, amount);
    console.log(tx);
  } catch (error) {
    alert(error);
    return;
  }
}
export async function connectWalletL1() {
  try {
    const { ethereum } = window;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
  } catch (error) {
    alert(error);
  }
}
export const getDetails = async (event_index) => {
  const provider = getL2provider();
  const contract = new Contract(abi1, Contract_Address, provider);
  try {
    const tx = await contract.getEventDetails(event_index);
    const event_name = shortString.decodeShortString(tx.eventName);
    const event_price = toDecimal(tx.price);
    return event_name;
  } catch (error) {
    alert(error);
  }
};
