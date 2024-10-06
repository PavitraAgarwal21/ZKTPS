pragma circom 2.1.9 ;
include "node_modules/circomlib/circuits/poseidon.circom";

/// @title Hasher
/// @dev Template for generating nullifier and commitment hashes using the Poseidon hash function.
template Hasher() {
    // generating the nullifierhash and commitmenthash 
    signal input nullifier ; 
    signal input secret ; 
    signal output commitmenthash ; 
    signal output nullifierhash ; 
    // Commitment hash generation using the Poseidon hash function.
    component CommitmentHasher = Poseidon(2) ;  
    CommitmentHasher.inputs[0] <== nullifier ;
    CommitmentHasher.inputs[1] <== secret ;
    commitmenthash <==  CommitmentHasher.out ;
    // Nullifier hash generation using the Poseidon hash function.
    component nullifierHasher  = Poseidon(1) ;
    nullifierHasher.inputs[0] <== nullifier ;
    nullifierhash <== nullifierHasher.out ; 
 }

/// @title Ticket
/// @dev Template for handling ticket-related information and proof creation.
template Ticket () {
    signal input nullifier  ;
    signal input  secret ; 
    signal input nullifierhash ;
    signal input commitmenthash ;  
   signal input recipient ; 
   signal recipientSquare;
    // Instantiate the Hasher to generate commitment and nullifier hashes.
    component hasher = Hasher() ;     
    hasher.nullifier <== nullifier ;
    hasher.secret <== secret ; 
    // Ensure that the generated hashes match the input hashes.
    hasher.commitmenthash ===  commitmenthash ; 
    hasher.nullifierhash === nullifierhash ; 
    // Calculate the square of the recipient to enforce constraints in proof.
    recipientSquare <== recipient * recipient;
}
// Define the main component with public outputs: nullifierhash, commitmenthash, and recipient.
component main {public [nullifierhash, commitmenthash, recipient ]} = Ticket();
