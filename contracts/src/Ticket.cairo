use starknet::ContractAddress ; 

// implementing the l1-l2 messaging system .
// how to implement the l1-l2 messagin system . 


#[starknet::interface] 
pub trait IGetTicket<TContractState> 
{
    fn getContractOwner(self: @TContractState) -> ContractAddress ;  
    fn getTicketEventIndex(self: @TContractState) -> u128 ; 
    fn getVerifier(self: @TContractState) -> ContractAddress ;   
    fn getEventdetails(self : @TContractState , _ticketEventIndex : u128) -> Ticket::TicketEvent ; 
    fn createTicketEvent(ref self : TContractState , _price : u128 , _event_name : felt252 , _noOfTicket : u128 )  ;
    fn buyTicket(ref self : TContractState , event_index : u128 , commitment : felt252  ) ;
    fn calculateFees(self : @TContractState ,  _ticketPrice : u128  ) -> (u128 , u128)  ;
    fn getTicket(self : @TContractState , _commitment : felt252 ) -> Ticket::TicketCommitment ;
    fn verifyTicket(self : @TContractState,  
        _commitment : felt252 ,
        _nullifierhash : felt252
    ) -> bool ;

}

#[starknet::contract] 
mod Ticket {

    use starknet::{ContractAddress, get_caller_address, storage_access::StorageBaseAddress}; 
    use openzeppelin::token::erc20::interface::{IERC20DispatcherTrait , IERC20Dispatcher}; 
    
    use super::IGetTicket ; 

    #[storage]
    struct Storage 
    {
    contractOwner : ContractAddress ,
    ticketEventIndex :u128 ,
    verifier : ContractAddress , 
    ticketEvents : LegacyMap::<u128 , TicketEvent> ,
    TicketCommitments : LegacyMap::<felt252 , TicketCommitment > ,
    nullifierHashes : LegacyMap::<felt252 , bool>  
    }

    #[constructor]
    fn constructor(ref self: ContractState , _verifier : ContractAddress) {
        self.verifier.write(_verifier);
        self.contractOwner.write(get_caller_address());
        self.ticketEventIndex.write(0); 
    }

    #[derive(Drop, Serde , starknet::Store)] 
    pub struct TicketEvent {
        creator : ContractAddress ,
        price : u128 ,
        eventName : felt252 ,
        noOfTicketAvl : u128 ,
    }
    #[derive(Drop, Serde , starknet::Store)] 
    pub struct TicketCommitment {
        buyer : ContractAddress ,
        ticketEventIndex : u128 ,
        used : bool 
    }


// creating the event there are two events 
#[event]
#[derive(Drop, starknet::Event)]
enum Event {
    newTicketEvent :  newTicketEvent  ,
    inValidatedTicket : inValidatedTicket 
}

#[derive(Drop , Serde , starknet::Event)] 
struct newTicketEvent { 
    #[key]
    creator : ContractAddress ,
    ticketEventIndex : u128 ,
    eventName : felt252 , 
    availableTickets : u128 ,
    price   : u128 
}

#[derive(Drop , Serde , starknet::Event)] 
struct inValidatedTicket { 
    #[key]
    buyer : ContractAddress ,
    ticketEventIndex : u128 ,
    creatorOfTicket : ContractAddress ,
    commitment  : felt252 ,
    nullifierhash : felt252 , 
}




#[abi(embed_v0)]
    impl  Ticket of IGetTicket<ContractState> 
    {
        fn getContractOwner(self: @ContractState) -> ContractAddress {
            self.contractOwner.read() 
        }
        fn getTicketEventIndex(self: @ContractState) -> u128 {
            self.ticketEventIndex.read() 
        }
        fn getVerifier(self: @ContractState) -> ContractAddress {
            self.verifier.read() 
        }
        fn getEventdetails(self : @ContractState , _ticketEventIndex : u128) -> TicketEvent {
            self.ticketEvents.read(_ticketEventIndex) 
        }
        fn getTicket(self : @ContractState , _commitment : felt252 ) -> TicketCommitment {
            self.TicketCommitments.read(_commitment) 
        }
         fn createTicketEvent(ref self : ContractState , _price : u128 , _event_name : felt252 , _noOfTicket : u128 )  
        {
            // updating ticket event index 
            let eventIndex = self.ticketEventIndex.read() + 1 ;
            self.ticketEventIndex.write(eventIndex);
            let _ticket_event = TicketEvent {
                creator : get_caller_address() ,
                price : _price ,
                eventName : _event_name ,
                noOfTicketAvl : _noOfTicket
            };
            self.ticketEvents.write(eventIndex , _ticket_event);
            // adding that the emit of newEventTicket event 



        } 
        fn calculateFees(self : @ContractState ,  _ticketPrice : u128  ) -> (u128 , u128)  {
            let fees = _ticketPrice/100 ;
            let total = fees + _ticketPrice ; 
            (fees , total ) 
        } 
        fn buyTicket(ref self : ContractState , event_index : u128 , commitment : felt252  ) {

            let ticket_commitment  = TicketCommitment {
                buyer : get_caller_address() ,
                ticketEventIndex : event_index ,
                used : true  
            };

            self.TicketCommitments.write(commitment , ticket_commitment);

            self.ticketEvents.write(event_index, TicketEvent {
                noOfTicketAvl: self.ticketEvents.read(event_index).noOfTicketAvl - 1 , 
                ..self.ticketEvents.read(event_index),
            });

            // tranfering the total token from the user to the this contract 

            // triger the emit of the event 


            }

        fn verifyTicket( self : @ContractState,  
            _commitment : felt252 ,
            _nullifierhash : felt252
        ) -> bool {

            if (self.nullifierHashes.read(_nullifierhash)) {
                return false ; 
            
            }
            if (!self.TicketCommitments.read(_commitment).used) {
                return false ; 
            }
            return true ;  
        }


    }

// invalidate function should be on the verfiercontract ;
// event should emit which that the ticket is invalidated ; 
// if this event is listen then notify the ticket creator for that ; 

// so what does the value should contain 
// public intputs and true/ false 
// the nullifier hash 
// the commitment hash 
#[derive(Drop, Serde , starknet::Store)] 
pub struct valueFromL1 {
    isProof : bool ,
    commitmenthash : felt252 ,
    nullifierhash :  felt252 
}
    #[l1_handler]
    fn invalidateTicketL1Handler (ref self: ContractState, from_address: felt252, valuee : valueFromL1 ) {

        // value comming from the l1 contract should be convert into the type of 
        // pub struct valueFromL1 {
        //     isProof : bool ,
        //     commitmenthash : felt252 ,
        //     nullifierhash :  felt252 

        // }
       let  value = valueFromL1 {
                isProof : true  ,
           commitmenthash : "12" ,
           nullifierhash :  "34" 
          } ; 





        // contract address checking that it  is comming from the correct verifier contract 
        assert(from_address == "" , "unauthorized contract calling handler " ) ;
        // first we have correctly serialized this value fucntion into this valueFromL1 struct 
        assert (!self.nullifierHashes.read(value.nullifierhash) , " Ticket was already used!" ) ; 
        assert(self.ticketCommitments.read(value.commitmenthash()).used, "Ticket does not exist" ) ;
        assert (value.isProof()  == true , "invalid Ticket") ;
        // chainging the state 
        self.nullifierHashes.write(value.nullifierhash(), true ) ; 
        // event to gave that ticket is invalidated and this event is listen by the ticket creator 
        let _invalidate_ticketevent = inValidatedTicket {
            Originalbuyer : self.ticketCommitments.read(value.commitmenthash()).buyer ,
            ticketEventIndex : self.ticketCommitments.read(value.commitmenthash()).ticketEventIndex ,
            creatorOfTicket : self.ticketEvents.read(self.ticketCommitments.read(value.commitmenthash()).ticketEventIndex).creator ,
            commitment : value.commitmenthash() ,
            nullifierhash : value.nullifierhash() ,
        } ;
        // tigerring the emit of the vent 
        self.emit(inValidatedTicket(_invalidate_ticketevent)) ;

    }
}