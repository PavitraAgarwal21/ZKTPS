// SPDX-License-Identifier: MIT
import "./starknet/IStarknetMessaging.sol";

/// @title TicketVerifier
/// @dev This contract is responsible for verifying the validity of a ticket using a zero-knowledge proof system.
/// It interacts with the StarkNet messaging system to send messages to Layer 2.
interface IVerifier {
    /// @notice Verifies a zero-knowledge proof.
    /// @param _pA The first part of the proof.
    /// @param _pB The second part of the proof (pairing).
    /// @param _pC The third part of the proof.
    /// @param _pubSignals The public signals that are used for verification.
    /// @return bool True if the proof is valid, otherwise false.
    function verifyProof(
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[3] calldata _pubSignals
    ) external view returns (bool);
}
pragma solidity >=0.7.0 <0.9.0;

contract TicketVerifier {
    IStarknetMessaging public _snMessaging;
    IVerifier public _verifierContract;
    /// @param starknetCore The address of the StarkNet core contract.
    constructor(address starknetCore, address _verifierAddress) {
        _snMessaging = IStarknetMessaging(starknetCore);
        _verifierContract = IVerifier(_verifierAddress);
    }
    
    /// @notice Invalidates a ticket by verifying the proof and sending a message to Layer 2.
    /// @dev This function checks the proof, ensures the sender is valid, and sends a message to the specified Layer 2 contract.
    /// @param _pA The first part of the proof.
    /// @param _pB The second part of the proof.
    /// @param _pC The third part of the proof.
    /// @param _nullifierHash The hash used to nullify the ticket.
    /// @param _commitment The commitment hash associated with the ticket.
    /// @param recipient The address of the recipient who is invalidating the ticket.
    /// @param contractAddress The address of the Layer 2 contract to which the message will be sent.
    /// @param selector The function selector to call on the Layer 2 contract.
    function invalidateTicket(
        uint256[2] calldata _pA,
        uint256[2][2] calldata _pB,
        uint256[2] calldata _pC,
        bytes32 _nullifierHash,
        bytes32 _commitment,
        address recipient,
        uint256 contractAddress,
        uint256 selector
    ) external payable {
        bool success = _verifierContract.verifyProof(
            _pA,
            _pB,
            _pC,
            [
                uint256(_nullifierHash),
                uint256(_commitment),
                uint256(uint160(recipient))
            ]
        );
        require(msg.sender == recipient, "Invalid Sender");
        require(success, "Invalid Proof");
        uint256[] memory payload = new uint256[](4);
        payload[0] = uint128(uint256(_nullifierHash));
        payload[1] = uint128(uint256(_nullifierHash) >> 128);
        payload[2] = uint128(uint256(_commitment));
        payload[3] = uint128(uint256(_commitment) >> 128);

        _snMessaging.sendMessageToL2{value: msg.value}(
            contractAddress,
            selector,
            payload
        );
    }
}
