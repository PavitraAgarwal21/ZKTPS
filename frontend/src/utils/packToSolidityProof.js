import { toHex } from "../web3/web3";
export const Proofa = (Proof) => {
  return [toHex(Proof.pi_a[0]), toHex(Proof.pi_a[1])];
};
export const Proofb = (Proof) => {
  return [
    [toHex(Proof.pi_b[0][1]), toHex(Proof.pi_b[0][0])],
    [toHex(Proof.pi_b[1][1]), toHex(Proof.pi_b[1][0])],
  ];
};
export const Proofc = (Proof) => {
  return [toHex(Proof.pi_c[0]), toHex(Proof.pi_c[1])];
};
