const snarkjs = require("snarkjs");
export const generateProof = async (
  nullifier,
  secret,
  nullifierHash,
  commitmentHash, 
  recipient 
) => {
  const input = {
    nullifier: nullifier,
    secret: secret,
    nullifierHash: nullifierHash,
    commitment: commitmentHash,
    recipient : recipient ,
  };

  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input,
    "Ticket.wasm",
    "Ticket_0001.zkey"
  );
  return proof;
};
