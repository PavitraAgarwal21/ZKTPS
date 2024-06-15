

#[starknet::contract] 
mod RecieveMessage {

    #[storage]
    struct Storage {
        va : u128 
    } 

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
        // assert(from_address == ...);

        assert(value == 123, 'Invalid value');

        self.emit(ValueReceived { l1_address: from_address, value, });
    }

}