use starknet::ContractAddress;

#[starknet::interface]
pub trait IGetTicket<TContractState> {
    fn createTicketEvent(
        ref self: TContractState,
        _price: u256,
        _event_name: felt252,
        _noOfTicket: u128,
        _customToken: ContractAddress
    );
    fn buyTicket(
        ref self: TContractState,
        event_index: u256,
        commitment: u256,
        token_address: ContractAddress
    );
    fn calculateFees(self: @TContractState, _ticketPrice: u256) -> (u256, u256);
    fn verifyTicket(self: @TContractState, _commitment: u256, _nullifierhash: u256) -> bool;
    fn approveToTicketResale(ref self: TContractState, _commitment: u256, _nullifierhash: u256);
    fn buyResaleTicket(
        ref self: TContractState, newCommitment: u256, oldNullifier: u256, oldCommitment: u256
    );
    fn getTicket(self: @TContractState, _commitment: u256) -> Ticket::TicketCommitment;
    fn getEventdetails(self: @TContractState, _ticketEventIndex: u256) -> Ticket::TicketEvent;
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
    use starknet::{ContractAddress, get_caller_address, get_contract_address, storage::Map,};
    use super::IERC20DispatcherTrait;
    use super::IERC20Dispatcher;
    use super::IGetTicket;
    #[storage]
    struct Storage {
        ticketEvents: Map::<u256, TicketEvent>,
        TicketCommitments: Map::<u256, TicketCommitment>,
        nullifierHashes: Map::<u256, bool>,
        event_id: u256,
        verifier: felt252
    }

    #[constructor]
    fn constructor(ref self: ContractState, _verifier: felt252) {
        self.event_id.write(0);
        self.verifier.write(_verifier);
    }

    #[derive(Drop, Serde, starknet::Store)]
    pub struct TicketEvent {
        creator: ContractAddress,
        price: u256,
        eventName: felt252,
        noOfTicketAvl: u128,
        customToken: ContractAddress,
    }

    #[derive(Drop, Serde, starknet::Store)]
    pub struct TicketCommitment {
        buyer: ContractAddress,
        ticketEventIndex: u256,
        used: bool,
        resale: bool,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        newTicketEvent: newTicketEvent,
        inValidatedTicket: inValidatedTicket,
        buyingTicket: buyingTicket,
    }

    #[derive(Drop, Serde, starknet::Event)]
    struct newTicketEvent {
        creator: ContractAddress,
        ticketEventIndex: u256,
    }

    #[derive(Drop, Serde, starknet::Event)]
    struct inValidatedTicket {
        buyer: ContractAddress,
        ticketEventIndex: u256,
        creatorOfTicket: ContractAddress,
        commitment: u256,
        nullifierhash: u256,
        fromAddress: felt252
    }

    #[derive(Drop, Serde, starknet::Event)]
    struct buyingTicket {
        buyer: ContractAddress,
        ticketEventIndex: u256,
        creatorOfTicket: ContractAddress,
        commitment: u256,
    }

    #[abi(embed_v0)]
    impl Ticket of IGetTicket<ContractState> {
        /// @notice Creates a new ticketed event with a specified price, event name, number of
        /// tickets, and custom token.
        /// This function stores the event details and emits an event to log the creation of the new
        /// ticket event.
        /// @params :
        /// - `self`: A reference to the contract state.
        /// - `_price`: The price of a ticket for this event (in `u256` format).
        /// - `_event_name`: The name of the event (as a `felt252` string).
        /// - `_noOfTicket`: The total number of tickets available for the event.
        /// - `_customToken`: The address of the custom token used for payments for this event.
        fn createTicketEvent(
            ref self: ContractState,
            _price: u256,
            _event_name: felt252,
            _noOfTicket: u128,
            _customToken: ContractAddress
        ) {
            let eventIndex = self.event_id.read() + 1;
            let _ticket_event = TicketEvent {
                creator: get_caller_address(),
                price: _price,
                eventName: _event_name,
                noOfTicketAvl: _noOfTicket,
                customToken: _customToken,
            };
            self.ticketEvents.write(eventIndex, _ticket_event);

            self
                .emit(
                    newTicketEvent { creator: get_caller_address(), ticketEventIndex: eventIndex, }
                );
        }

        /// @dev This function calculates the fees for a ticket and the total price.
        /// @param _ticketPrice The original price of the ticket.
        /// @return (fees, total) Returns the calculated fee and the total price (including fees).
        fn calculateFees(self: @ContractState, _ticketPrice: u256) -> (u256, u256) {
            let fees = _ticketPrice / 100;
            let total = fees + _ticketPrice;
            (fees, total)
        }

        /// @notice This function allows users to purchase a ticket for an event by transferring the
        /// ticket price in the specified token to the contract. It updates the ticket commitment
        /// and decreases the number of available tickets for the event. The ticket purchase is
        /// confirmed through an emitted event.
        /// @dev Function to purchase a ticket for an event. It transfers the ticket price from the
        /// buyer to the event contract, stores the ticket commitment, and updates the event with
        /// one less available ticket.
        /// @param event_index The index of the event for which the ticket is being purchased.
        /// @param commitment A unique commitment value representing the ticket purchase.
        /// @param token_address The address of the token used to pay for the ticket.
        fn buyTicket(
            ref self: ContractState,
            event_index: u256,
            commitment: u256,
            token_address: ContractAddress
        ) {
            let token = IERC20Dispatcher { contract_address: token_address };
            let contract_address = get_contract_address();
            let caller = get_caller_address();
            let price = self.ticketEvents.read(event_index).price;
            let noOfTicket = self.ticketEvents.read(event_index).noOfTicketAvl;
            assert(noOfTicket >= 1, 'No tickets left');
            assert(token.allowance(caller, contract_address) >= price, 'allow first');
            let status = token.transfer_from(caller, contract_address, price);
            assert(status == true, 'transfer failed');
            let ticket_commitment = TicketCommitment {
                buyer: caller, ticketEventIndex: event_index, used: true, resale: false
            };
            self.TicketCommitments.write(commitment, ticket_commitment);
            self
                .ticketEvents
                .write(
                    event_index,
                    TicketEvent {
                        noOfTicketAvl: self.ticketEvents.read(event_index).noOfTicketAvl - 1,
                        ..self.ticketEvents.read(event_index),
                    }
                );
            let event_creator = self.ticketEvents.read(event_index).creator;
            let status = token.transfer(event_creator, price);
            assert(status == true, 'invalid');
            self
                .emit(
                    buyingTicket {
                        buyer: caller,
                        ticketEventIndex: event_index,
                        creatorOfTicket: self.ticketEvents.read(event_index).creator,
                        commitment: commitment,
                    }
                );
        }


        /// @notice Verifies if a ticket commitment is valid and has not been used before.
        /// @dev This function checks if the ticket has already been invalidated by verifying the
        /// nullifier hash.
        /// It also ensures the ticket commitment is marked as used.
        /// @param _commitment The unique commitment associated with the ticket.
        /// @param _nullifierhash The hash used to check if the ticket has already been nullified.
        /// @return bool Returns true if the ticket is valid and has not been used, otherwise false.
        fn verifyTicket(self: @ContractState, _commitment: u256, _nullifierhash: u256) -> bool {
            if (self.nullifierHashes.read(_nullifierhash)) {
                return false;
            }
            if (!self.TicketCommitments.read(_commitment).used) {
                return false;
            }
            return true;
        }

        /// @notice Approves a ticket for resale by marking it as available for resale.
        /// @dev This function verifies the ticket's validity and checks that the caller is the
        /// actual owner of the ticket.
        /// It allows the ticket owner to approve the resale, enabling the ticket to be transferred
        /// to another buyer.
        /// @param _commitment The unique commitment associated with the ticket to be resold.
        /// @param _nullifierhash The hash used to verify the ticket's validity.
        /// @require The ticket must be valid and not previously used.
        /// @require The caller must be the original buyer of the ticket.
        fn approveToTicketResale(ref self: ContractState, _commitment: u256, _nullifierhash: u256) {
            assert(self.verifyTicket(_commitment, _nullifierhash), 'ticket is not valid');
            let caller = get_caller_address();
            assert(
                self.TicketCommitments.read(_commitment).buyer == caller,
                'unauthorized ticket owner'
            );
            self
                .TicketCommitments
                .write(
                    _commitment,
                    TicketCommitment { resale: true, ..self.TicketCommitments.read(_commitment) }
                );
        }

        /// @notice Buys a resale ticket from the original ticket holder.
        /// @dev This function verifies the validity of the original ticket, checks if it's marked
        /// for resale, calculates resale fees, transfers tokens accordingly, and creates a new
        /// ticket commitment for the buyer.
        /// @param newCommitment The unique commitment for the new ticket being purchased.
        /// @param oldNullifier The hash used to invalidate the old ticket.
        /// @param oldCommitment The unique commitment of the original ticket being resold.
        /// @require The original ticket must be valid and marked for resale.
        /// @require The buyer must have enough allowance for the total ticket cost.
        fn buyResaleTicket(
            ref self: ContractState, newCommitment: u256, oldNullifier: u256, oldCommitment: u256
        ) {
            // Verify that the old ticket is valid and not previously nullified.
            assert(self.verifyTicket(oldCommitment, oldNullifier), 'ticket is not valid');
            // Check if the old ticket is marked for resale.
            assert(self.TicketCommitments.read(oldCommitment).resale, 'ticket is not for resale');
            let event_index = self.TicketCommitments.read(oldCommitment).ticketEventIndex;
            let event = self.ticketEvents.read(event_index);
            let (fees, total) = self.calculateFees(event.price);
            let token_address = event.customToken;
            let token = IERC20Dispatcher { contract_address: token_address };
            assert(
                token.allowance(get_caller_address(), get_contract_address()) >= total,
                'allow first'
            );
            // Ensure the buyer has approved enough tokens for the transaction.
            let status = token.transfer_from(get_caller_address(), get_contract_address(), total);
            assert(status == true, 'transfer failed');
            let new_ticket_commitment = TicketCommitment {
                buyer: get_caller_address(),
                ticketEventIndex: event_index,
                used: true,
                resale: false
            };
            // Transfer the original ticket price to the original ticket holder.
            let buyer = self.TicketCommitments.read(oldCommitment).buyer;
            let status = token.transfer(buyer, event.price);
            assert(status == true, 'transfer failed buyer');
            // the 1% is the fees of the resaling of the ticket goes to the event creator
            let status = token.transfer(event.creator, fees);
            assert(status == true, 'transfer failed event creator');
            // Write the new ticket commitment into the state.
            self.TicketCommitments.write(newCommitment, new_ticket_commitment);
            // Nullify the old ticket using the nullifier hash.
            self.nullifierHashes.write(oldNullifier, true);
            // Invalidate the old ticket by marking it as unused.
            self
                .TicketCommitments
                .write(
                    oldCommitment,
                    TicketCommitment { used: false, ..self.TicketCommitments.read(oldCommitment) }
                );

            self
                .emit(
                    buyingTicket {
                        buyer: get_caller_address(),
                        ticketEventIndex: event_index,
                        creatorOfTicket: self.ticketEvents.read(event_index).creator,
                        commitment: newCommitment,
                    }
                );
        }

        fn getEventdetails(self: @ContractState, _ticketEventIndex: u256) -> TicketEvent {
            self.ticketEvents.read(_ticketEventIndex)
        }
        fn getTicket(self: @ContractState, _commitment: u256) -> TicketCommitment {
            self.TicketCommitments.read(_commitment)
        }
    }

    /// @notice Invalidates a ticket when called by the designated verifier contract.
    /// @dev This function checks that the caller is authorized,
    /// writes the nullifier to the state to prevent reuse,
    /// and marks the ticket commitment as unused.
    /// It then emits an event indicating the invalidation of the ticket.
    /// @param from_address The address of the caller, which should be the verifier contract.
    /// @param nullifier1 The lower part of the nullifier hash.
    /// @param nullifier2 The upper part of the nullifier hash.
    /// @param commitment1 The lower part of the commitment hash.
    /// @param commitment2 The upper part of the commitment hash.
    /// @require The caller must be the authorized verifier contract.
    #[l1_handler]
    fn invalidateTicketL1Handler(
        ref self: ContractState,
        from_address: felt252,
        nullifier1: u128,
        nullifier2: u128,
        commitment1: u128,
        commitment2: u128
    ) {
        let verifier = self.verifier.read();
        assert(from_address == verifier, 'unauthorized caller');
        let nullifierhash = u256 { low: nullifier1, high: nullifier2 };
        let commitmenthash = u256 { low: commitment1, high: commitment2 };
        self.nullifierHashes.write(nullifierhash, true);
        self
            .TicketCommitments
            .write(
                commitmenthash,
                TicketCommitment { used: false, ..self.TicketCommitments.read(commitmenthash) }
            );
        self
            .emit(
                inValidatedTicket {
                    buyer: self.TicketCommitments.read(commitmenthash).buyer,
                    ticketEventIndex: self.TicketCommitments.read(commitmenthash).ticketEventIndex,
                    creatorOfTicket: self
                        .ticketEvents
                        .read(self.TicketCommitments.read(commitmenthash).ticketEventIndex)
                        .creator,
                    commitment: commitmenthash,
                    nullifierhash: nullifierhash,
                    fromAddress: from_address,
                }
            );
    }
}
