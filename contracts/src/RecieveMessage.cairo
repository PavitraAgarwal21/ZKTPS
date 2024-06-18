
#[starknet::interface]

pub trait IRecieveMessage<TContractState> 
{
    fn read_nullifier(self : @TContractState) -> u256  ;
    fn read_commitment(self : @TContractState) -> u256  ; 
    fn read_nullifier1(self : @TContractState) -> u128  ; 
    fn read_nullifier2(self : @TContractState) -> u128  ;
    fn read_commitment1(self : @TContractState) -> u128  ;
    fn read_commitment2(self : @TContractState) -> u128  ;

}



#[starknet::contract] 
mod RecieveMessage {
    use super::IRecieveMessage ; 
    #[storage]
    struct Storage {

        nullifier : u256 ,
        commitment : u256 ,

        nullifierlow : u128 ,
        nullifierhigh : u128 ,
        commitmentlow : u128 ,
        commitmenthigh : u128 , 
    } 

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
    ValueReceivedFromL1: ValueReceived , 
        } 
    #[derive(Drop, Serde , starknet::Event  )]
        struct ValueReceived {   
            #[key]
            l1_address: felt252,
            nullifierlow : u128 ,
            nullifierhigh : u128 ,
            commitmentlow : u128 ,
            commitmenthigh : u128 , 
        }

#[l1_handler]
        fn msg_handler_value(ref self: ContractState, from_address: felt252 , nullifier1 : u128  , nullifier2 : u128, commitment1 : u128 , commitment2 :u128 ) {
           
           // means from correct smart contract 
           self.nullifier.write(u256{
            low : nullifier1,
            high : nullifier2
           });
           self.nullifier.write(u256{
            low : commitment1,
            high : commitment2
           });

            self.nullifierlow.write(nullifier1) ;
            self.nullifierhigh.write(nullifier2) ;
            self.commitmentlow.write(commitment1) ;
            self.commitmenthigh.write(commitment2) ;

        //    making the nullflieers into the u256 and then return it as a 

            self.emit(ValueReceived {
                l1_address : from_address , 
                nullifierlow : nullifier1 , 
                nullifierhigh : nullifier2 , 
                commitmentlow : commitment1 , 
                commitmenthigh : commitment2 , 
            })
        }

#[abi(embed_v0)]
impl  RecieveMessage of IRecieveMessage<ContractState> {
    fn read_nullifier(self : @ContractState) -> u256 {
        return self.nullifier.read() ; 
    }
    fn read_commitment(self : @ContractState) -> u256 {
        return self.commitment.read() ; 
    }
    fn read_nullifier1(self : @ContractState) -> u128 {
        return self.nullifierlow.read() ; 
    }
    fn read_nullifier2(self : @ContractState) -> u128 {
        return self.nullifierhigh.read() ; 
    }
    fn read_commitment1(self : @ContractState) -> u128 {
        return self.commitmentlow.read() ; 
    }
    fn read_commitment2(self : @ContractState) -> u128 {
        return self.commitmenthigh.read() ;
    }
        }
    
}