import { Contract, RpcProvider, json } from "starknet";
import { writeFileSync } from "fs";
const provider = new RpcProvider({
  nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
});
const addrContract =
  "0x0771a2d2e4db1eeb822604d54a642acc953cf80103c940fa7bf29104b0f88433";
const compressedContract = await provider.getClassAt(addrContract);
writeFileSync(
  "./myAbi.json",
  json.stringify(compressedContract.abi, undefined, 2)
);
