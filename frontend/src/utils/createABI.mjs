import { Contract, RpcProvider, json } from "starknet";
import { writeFileSync } from "fs";
const provider = new RpcProvider({
  nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
});
const addrContract =
  "0x006b1c6cc4be4d1f0c3314806c7e83515653e8c41e0fbfde569af8150dd615d1";
const compressedContract = await provider.getClassAt(addrContract);
writeFileSync(
  "./myAbi.json",
  json.stringify(compressedContract.abi, undefined, 2)
);
