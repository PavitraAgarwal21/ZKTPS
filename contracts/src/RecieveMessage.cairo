

// #[starknet::interface]
// pub trait IRecieveMessage<TContractState> 
// {
//     fn read_nullifier1(self : @TContractState) -> felt252  ; 
//     fn read_nullifier2(self : @TContractState) -> felt252  ;
//     fn read_commitment1(self : @TContractState) -> felt252  ;
//     fn read_commitment2(self : @TContractState) -> felt252  ;
//     }



#[starknet::contract] 
mod RecieveMessage {
    // use super::IRecieveMessage ; 
    #[storage]
    struct Storage {
        nullifier1 : felt252 ,
        nullifier2 : felt252 ,
        commitment1 : felt252 ,
        commitment2 : felt252 , 
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
            nullifier1 : felt252 ,
            nullifier2 : felt252 ,
            commitment1 : felt252 ,
            commitment2 : felt252 , 
        }
        #[l1_handler]
        fn msg_handler_value(ref self: ContractState, from_address: felt252 , nullifier1 : felt252  , nullifier2 : felt252, commitment1 : felt252 , commitment2 :felt252 ) {
            self.emit(ValueReceived {
                l1_address : from_address , 
                nullifier1 : nullifier1 , 
                nullifier2 : nullifier2 , 
                commitment1 : commitment1 , 
                commitment2 : commitment2 , 
            })
        }

// #[abi(embed_v0)]
// impl  RecieveMessage of IRecieveMessage<ContractState> {
//     fn read_nullifier1(self : @ContractState) -> felt252 {
//         return self.nullifier1.read() ; 
//     }
//     fn read_nullifier2(self : @ContractState) -> felt252 {
//         return self.nullifier2.read() ; 
//     }
//     fn read_commitment1(self : @ContractState) -> felt252 {
//         return self.commitment1.read() ; 
//     }
//     fn read_commitment2(self : @ContractState) -> felt252 {
//         return self.commitment2.read() ;
// }
//         }
    
}