import { poseidon } from "circomlibjs";
import bigInt from "big-integer";
export const nullifierHash = (nullifier) => {
  return poseidon([bigInt(nullifier)]);
};

export const commitmentHash = (nullifier, secret) => {
  return poseidon([bigInt(nullifier), bigInt(secret)]);
};
