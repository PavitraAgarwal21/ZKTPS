

#[starknet::contract] 
mod RecieveMessage {

    #[storage]
    struct Storage {} 

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        ValueReceivedFromL1: ValueReceived,
        } 

    #[derive(Drop, starknet::Event)]
        struct ValueReceived {
            #[key]
            l1_address: felt252,
            value: felt252,
        }

    #[l1_handler]
    fn msg_handler_value(ref self: ContractState, from_address: felt252, value: felt252) {

        self.emit(ValueReceived { l1_address: from_address, value, }); 
    }

}