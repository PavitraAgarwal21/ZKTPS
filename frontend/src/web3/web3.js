import { RpcProvider } from "starknet";
export const Contract_Address = "";
export const STRK_token_address =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
export const ETH_token_address =
  "0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7";

export const get_provider = () => {
    const provider = new RpcProvider({
      nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
    });
    return provider;
};
