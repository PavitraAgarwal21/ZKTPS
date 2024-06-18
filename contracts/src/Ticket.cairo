use starknet::ContractAddress ; 
// implementing the l1-l2 messaging system .
#[starknet::interface] 
pub trait IGetTicket<TContractState> 
{
    fn getContractOwner(self: @TContractState) -> ContractAddress ;  
    fn getTicketEventIndex(self: @TContractState) -> u128 ; 
    fn getVerifier(self: @TContractState) -> ContractAddress ;   
    fn getEventdetails(self : @TContractState , _ticketEventIndex : u128) -> Ticket::TicketEvent ; 
    fn createTicketEvent(ref self : TContractState , _price : u256 , _event_name : felt252 , _noOfTicket : u128 , _customToken: ContractAddress )  ;
    fn buyTicket(ref self : TContractState , event_index : u128 , commitment : u256 , token_address:ContractAddress ) ;
    fn calculateFees(self : @TContractState ,  _ticketPrice : u256  ) -> (u256 , u256)  ;
    fn getTicket(self : @TContractState , _commitment : u256 ) -> Ticket::TicketCommitment ;
    fn verifyTicket(self : @TContractState,  
        _commitment : u256 ,
        _nullifierhash : u256
    ) -> bool ;
    fn approveToTicketResale(ref self : TContractState , _commitment : u256 , _nullifierhash : u256 ) ; 
    fn buyResaleTicket(ref self : TContractState  , newCommitment : u256 , oldNullifier : u256 , oldCommitment : u256 ) ;
}
#[starknet::interface]
trait IERC20<TContractState> {
    fn name(self: @TContractState) -> felt252;

    fn symbol(self: @TContractState) -> felt252;

    fn decimals(self: @TContractState) -> u8;

    fn total_supply(self: @TContractState) -> u256;

    fn balance_of(self: @TContractState, account: ContractAddress) -> u256;

    fn allowance(self: @TContractState, owner: ContractAddress, spender: ContractAddress) -> u256;

    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256) -> bool;

    fn transfer_from(
        ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256
    ) -> bool;

    fn approve(ref self: TContractState, spender: ContractAddress, amount: u256) -> bool;
}

#[starknet::contract] 
mod Ticket {

    use starknet::{ContractAddress, get_caller_address, get_contract_address,storage_access::StorageBaseAddress}; 
    use super::IERC20DispatcherTrait;
    use super::IERC20Dispatcher;
    
    use super::IGetTicket ; 

    #[storage]
    struct Storage 
    {
    contractOwner : ContractAddress ,
    ticketEventIndex :u128 ,
    verifier : ContractAddress , 
    ticketEvents : LegacyMap::<u128 , TicketEvent> ,
    TicketCommitments : LegacyMap::<u256 , TicketCommitment > ,
    nullifierHashes : LegacyMap::<u256 , bool>  ,
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
        price : u256 ,
        eventName : felt252 ,
        noOfTicketAvl : u128 ,
        customToken : ContractAddress ,
    }
    #[derive(Drop, Serde , starknet::Store)] 
    pub struct TicketCommitment {
        buyer : ContractAddress ,
        ticketEventIndex : u128 ,
        used : bool ,
        resale : bool ,

    }


// creating the event there are two events 
#[event]
#[derive(Drop, starknet::Event)]
enum Event {
    newTicketEvent :  newTicketEvent  ,
    inValidatedTicket : inValidatedTicket ,
    buyingTicket : buyingTicket ,
}

#[derive(Drop , Serde , starknet::Event)] 
struct newTicketEvent { 
    #[key]
    creator : ContractAddress ,
    ticketEventIndex : u128 ,
    eventName : felt252 , 
    availableTickets : u128 ,
    price   : u256 
}

#[derive(Drop , Serde , starknet::Event)] 
struct inValidatedTicket { 
    #[key]
    buyer : ContractAddress ,
    ticketEventIndex : u128 ,
    creatorOfTicket : ContractAddress ,
    commitment  : u256 ,
    nullifierhash : u256 , 
}

#[derive(Drop , Serde , starknet::Event)] 
struct buyingTicket { 
    #[key]
    buyer : ContractAddress ,
    ticketEventIndex : u128 ,
    creatorOfTicket : ContractAddress ,
    commitment  : u256 ,
    nullifierhash : u256 , 
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
        fn getTicket(self : @ContractState , _commitment : u256 ) -> TicketCommitment {
            self.TicketCommitments.read(_commitment) 
        }
         fn createTicketEvent(ref self : ContractState , _price : u256 , _event_name : felt252 , _noOfTicket : u128  , _customToken: ContractAddress)  
        {
            // updating ticket event index 
            let eventIndex = self.ticketEventIndex.read() + 1 ;
            self.ticketEventIndex.write(eventIndex);
            let _ticket_event = TicketEvent {
                creator : get_caller_address() ,
                price : _price ,
                eventName : _event_name ,
                noOfTicketAvl : _noOfTicket,
                customToken : _customToken  , 

            };
            self.ticketEvents.write(eventIndex , _ticket_event);

            self.emit(newTicketEvent {
                creator : get_caller_address() ,
                ticketEventIndex : eventIndex ,
                eventName : _event_name ,
                availableTickets : _noOfTicket ,
                price : _price 
            });

        } 
        fn calculateFees(self : @ContractState ,  _ticketPrice : u256  ) -> (u256 , u256)  {
            let fees = _ticketPrice/100 ;
            let total = fees + _ticketPrice ; 
            (fees , total ) 
        } 
        fn buyTicket(ref self : ContractState , event_index : u128 , commitment : u256 , token_address:ContractAddress ) {

            let token=IERC20Dispatcher{contract_address:token_address};
            let contract_address=get_contract_address();
            let caller=get_caller_address();
            let price=self.ticketEvents.read(event_index).price;
            assert(token.allowance(caller,contract_address)>=price,'allow first');
            
            
            // tranfering the total token from the user to the this contract 
            let status=token.transfer_from(caller,contract_address,price);
            assert(status==true,'transfer failed');

            let ticket_commitment  = TicketCommitment {
                buyer : caller ,
                ticketEventIndex : event_index ,
                used : true  ,
                resale : false 
            };
            self.TicketCommitments.write(commitment , ticket_commitment);
            
            self.ticketEvents.write(event_index, TicketEvent {
                noOfTicketAvl: self.ticketEvents.read(event_index).noOfTicketAvl - 1 , 
                ..self.ticketEvents.read(event_index),
            });

            self.emit(buyingTicket {
                buyer : caller ,
                ticketEventIndex : event_index ,
                creatorOfTicket : self.ticketEvents.read(event_index).creator ,
                commitment : commitment ,
                nullifierhash : commitment , 
            });


            }

        fn verifyTicket( self : @ContractState,  
            _commitment : u256 ,
            _nullifierhash : u256
        ) -> bool {

            if (self.nullifierHashes.read(_nullifierhash)) {
                return false ; 
            
            }
            if (!self.TicketCommitments.read(_commitment).used) {
                return false ; 
            }
            return true ;  
        }

// function resealling of the ticket of the ticket . 
// so transfer ticket we have to make some changes related to the secret and nullifier 
// the person who get the ticket provide the nullifierhash and commitment hash 
// first we have to flag the ticket which is want to be resaled 

//so the actual owner of the ticket is first authorized that the ticket is belong to him and want to resale 
// to know the actual owner of the ticket there is 2 ways 
//1 provide the proof and then verify the proof but it take the l2tol1 messaging 
//2 the origin owner of the ticket address is same as the one who calling the this approve to resale the ticket 
fn approveToTicketResale(ref self : ContractState , _commitment : u256 , _nullifierhash : u256 ) {
    assert(self.verifyTicket(_commitment , _nullifierhash) , 'ticket is not valid');
    let caller = get_caller_address();
    assert(self.TicketCommitments.read(_commitment).buyer == caller , 'unauthorized ticket owner');
// till now its that the caller of this function actuall buy the ticket and it is not used yet 
    self.TicketCommitments.write(_commitment , TicketCommitment {
        resale : true ,
        ..self.TicketCommitments.read(_commitment)
    });
// this ticket is now available for the resale   

    // transfer the token to the buyer of the ticket
}

// this function is called by the person who want to buy the resaled ticket

fn buyResaleTicket(ref self : ContractState , newCommitment : u256 , oldNullifier : u256 , oldCommitment : u256 ) {

    // in this the token is send to the realholder of the ticket addresss
    // some of the fees of the resaling ticket is also been taken to it 

    //verfy that the old ticket is verified 
    assert(self.verifyTicket(oldCommitment , oldNullifier) , 'ticket is not valid');
    //old ticket is ready to resale 
    assert(self.TicketCommitments.read(oldCommitment).resale , 'ticket is not for resale');

    //calculate the fees of the resaling of the ticket
    let event_index = self.TicketCommitments.read(oldCommitment).ticketEventIndex ; 
    let event = self.ticketEvents.read(event_index);
    let (fees , total) = self.calculateFees(event.price);
    let token_address = event.customToken;
    let token=IERC20Dispatcher{contract_address:token_address};
            assert(token.allowance(get_caller_address(),get_contract_address())>=total,'allow first');
            // tranfering the total token from the user to the this contract 
            let status=token.transfer_from(get_caller_address(),get_contract_address(),total);
            assert(status==true,'transfer failed');
        // allowance of the token to this fucntion should be total 

// invalidate the ticket // or mark them that it has been used 
self.TicketCommitments.write(oldCommitment , TicketCommitment {
    used : false ,
    ..self.TicketCommitments.read(oldCommitment)    
});
//also nullifies the ticket  the ticket
self.nullifierHashes.write(oldNullifier , true) ;


   // make the new ticket with the new commitment and nullifier hash 
// making new commitment 
let new_ticket_commitment  = TicketCommitment {
    buyer : get_caller_address() ,
    ticketEventIndex : event_index ,
    used : true  ,
    resale : false 
};

self.TicketCommitments.write(newCommitment , new_ticket_commitment);

// the kick is the the buyer hash to pay the value of 101% of the ticket price
// transfer token to the first owner of the ticket
let buyer = self.TicketCommitments.read(oldCommitment).buyer;  
let status=token.transfer(buyer,event.price);
assert(status==true,'transfer failed buyer');

// the 1% is the fees of the resaling of the ticket goes to the event creator 
let status= token.transfer(event.creator , fees);
assert(status==true,'transfer failed event creator');

// emit event that the ticket is resaled sucessfully 



}





//fucntion if the event is over and the ticket is notinvalidated then refund the ticket holder the 50% of the ticket price 






    }
// invalidate function should be on the verfiercontract ;
// event should emit which that the ticket is invalidated ; 
// if this event is listen then notify the ticket creator for that ; 

// so what does the value should contain 
// public intputs and true/ false 
// the nullifier hash 
// the commitment hash 






    #[l1_handler]
    fn invalidateTicketL1Handler (ref self: ContractState, from_address: felt252 , nullifier1 : u128  , nullifier2 : u128, commitment1 : u128 , commitment2 :u128 ) {
    

        // let verifier=self.verifier.read();
        // contract address checking that it  is comming from the correct verifier contract 
        // assert(from_address == verifier , 'unauthorized contract calling handler') ;
        // first we have correctly serialized this value fucntion into this valueFromL1 struct 
            // assert(from_address == self.l1Address.read() ,'unauthorized contract calling handler') ; 

            let nullifierhash = u256{
                low : nullifier1,
                high : nullifier2
            };

            let commitmenthash = u256{
                low : commitment1,
                high : commitment2
            };

         // the calling of this is the creator of the ticket event 
        assert(self.verifyTicket(commitmenthash , nullifierhash) , 'ticket is not valid'); 

        self.nullifierHashes.write(nullifierhash, true ); 
        self.TicketCommitments.write(commitmenthash , TicketCommitment {
            used : false ,
            ..self.TicketCommitments.read(commitmenthash)    
        });

        // if all this is sucessfull then transfer the token to the creator of the event  




        self.emit(inValidatedTicket{
            buyer : self.TicketCommitments.read(commitmenthash).buyer,
            ticketEventIndex : self.TicketCommitments.read(commitmenthash).ticketEventIndex,
            creatorOfTicket : self.ticketEvents.read(self.TicketCommitments.read(commitmenthash).ticketEventIndex).creator,
            commitment : commitmenthash,
            nullifierhash : nullifierhash,
        });

    }
}