

#[starknet::interface] 
pub trait ITicketVerifier<TContractState>  {
    fn verify_ticket(self : @TContractState , proof : felt252 ) -> bool;
}

#[starknet::contract]
mod TicketVerifier {

    use super::ITicketVerifier; 
    #[storage]
    struct Storage {

    }
    #[abi(embed_v0)] 
    impl TicketVerifier  of  ITicketVerifier  <ContractState> {
        fn verify_ticket(self : @ContractState , proof : felt252 ) -> bool {
            true
        }
    }
    
}