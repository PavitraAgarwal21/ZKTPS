import { Contract, RpcProvider, shortString } from "starknet";
import { BigNumber, ethers } from "ethers";
import { Proofa, Proofb, Proofc } from "../utils/packToSolidityProof";
import abi1 from "../abis/ETHAbi.json";
import abi2 from "../abis/STRKAbi.json";
import abi3 from "../abis/myAbi.json";
import TicketVerifierABI from "../abis/TicketVerifierABI.json";
export const Contract_Address =
  "0x006b1c6cc4be4d1f0c3314806c7e83515653e8c41e0fbfde569af8150dd615d1";
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
  const signer = provider.getSigner();
  return new ethers.Contract(address, TicketVerifierABI, signer);
};
export function toHex(number) {
  return ethers.BigNumber.from(number)._hex;
}
export function toDecimal(number) {
  return parseInt(number, 16);
}
export async function Invalidate(
  contract,
  proof,
  nullifierHash,
  commitment,
  recipient
) {
  const proofA = Proofa(proof);
  const proofB = Proofb(proof);
  const proofC = Proofc(proof);
  return await contract.InvalidateTicket(
    proofA,
    proofB,
    proofC,
    nullifierHash,
    commitment,
    recipient
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
  const contract = getL2contractRead();
  try {
    const tx = await contract.getEventdetails(event_index);
    const event_name = shortString.decodeShortString(tx.eventName);
    const event_price = tx.price;
    const token_address = tx.customToken;
    return { event_price, event_name, token_address };
  } catch (error) {
    alert(error);
  }
};
export const get_token_name = (address) => {
  if (
    address ==
    "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"
  ) {
    return "STRK";
  } else if (
    address ==
    "0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7"
  ) {
    return "ETH";
  }
};
export const get_token_address = (name) => {
  if (name == "STRK") {
    return "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
  } else if (name == "ETH") {
    return "0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7";
  }
};
export function calculatePurchaseFeeLocal(purchasePrice) {
  const fee = purchasePrice.div(100);
  const total = purchasePrice.add(fee);
  return [total, fee];
}

