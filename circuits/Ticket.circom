pragma circom 2.1.9 ;
include "node_modules/circomlib/circuits/poseidon.circom";

template Hasher() {
    // generating the nullifierhash and commitmenthash 
    signal input nullifier ; 
    signal input secret ; 
    signal output commitmenthash ; 
    signal output nullifierhash ; 
    component CommitmentHasher = Poseidon(2) ;  
    CommitmentHasher.inputs[0] <== nullifier ;
    CommitmentHasher.inputs[1] <== secret ;

    commitmenthash <==  CommitmentHasher.out ;

    component nullifierHasher  = Poseidon(1) ;
    nullifierHasher.inputs[0] <== nullifier ;

    nullifierhash <== nullifierHasher.out ; 


 }

template Ticket () {
    signal input nullifier  ;
    signal input  secret ; 
    signal input nullifierhash ;
    signal input commitmenthash ;  
   signal input recipient ; 

   signal recipientSquare;

    component hasher = Hasher() ;     
    hasher.nullifier <== nullifier ;
    hasher.secret <== secret ; 


hasher.commitmenthash ===  commitmenthash ; 
hasher.nullifierhash === nullifierhash ; 

// so that only the proof creator can able to submit the proof r
recipientSquare <== recipient * recipient;
    
    
}
component main {public [nullifierhash, commitmenthash, recipient ]} = Ticket();
