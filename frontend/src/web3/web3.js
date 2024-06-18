import { RpcProvider } from "starknet";
import { ethers } from "ethers";
import { Proofa, Proofb, Proofc } from "../utils/packToSolidityProof";
export const Contract_Address = "";
export const STRK_token_address =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
export const ETH_token_address =
  "0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7";

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
export const getContract = (provider, address) => {
  // const contractABI = abi.abi;
  const signer = provider.getSigner();
  // return new ethers.Contract(address, contractABI, signer);
};
export function toHex(number) {
  return ethers.BigNumber.from(number)._hex;
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
