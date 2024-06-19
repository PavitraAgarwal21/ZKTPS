import { Contract, RpcProvider, json } from "starknet";
import { writeFileSync } from "fs";
const provider = new RpcProvider({
  nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
});
const addrContract =
  "0x05abe5114de127e0ceec5322493b929da484af4af5a183e7bba3e79b03852913";
const compressedContract = await provider.getClassAt(addrContract);
writeFileSync(
  "./myAbi.json",
  json.stringify(compressedContract.abi, undefined, 2)
);
