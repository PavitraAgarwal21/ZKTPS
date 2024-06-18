import { Contract, RpcProvider, json } from "starknet";
import { writeFileSync } from "fs";
const provider = new RpcProvider({
  nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
});
const addrContract =
  "0x0301f87f63e0b50484347e52590c46f2a1e86cbd424a8c427aa0b11223557277";
const compressedContract = await provider.getClassAt(addrContract);
writeFileSync(
  "./myAbi.json",
  json.stringify(compressedContract.abi, undefined, 2)
);
