in the circuit we have uses the same concept that is of the tornado cash 
we have the private fields nullifier and commitment 
a particular commitment has particular nullifier 


To verify we take the input  
the nullifier , secret , nullifierhash , commitmenthash 



commitmenthash == hash(mullifeier , secret ) 
nullifierHash ==  hash(nullifier) 


we generate the nullifierhash and commitmenthash from the private secret and nullifier and check against the private nullifierhash and private commitmenthash 






