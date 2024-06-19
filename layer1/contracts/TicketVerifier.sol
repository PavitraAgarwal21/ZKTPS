// SPDX-License-Identifier: MIT
import "./starknet/IStarknetMessaging.sol"  ; 
 
interface  IVerifier {
    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[3] calldata _pubSignals) external view  returns (bool)  ;
}
pragma solidity >=0.7.0 <0.9.0;
contract TicketVerifier 
{
    IStarknetMessaging public  _snMessaging; 
    IVerifier public _verifierContract ; 
     constructor(address starknetCore , address _verifierAddress) {
            _snMessaging = IStarknetMessaging(starknetCore); 
            _verifierContract = IVerifier(_verifierAddress) ;
        }
function invalidateTicket(uint256[2] calldata _pA, uint256[2][2] calldata _pB, uint256[2] calldata _pC, bytes32 _nullifierHash, bytes32 _commitment, address recipient,uint256 contractAddress,
        uint256 selector)external payable{ 
    bool success=_verifierContract.verifyProof(_pA, _pB, _pC, [uint256(_nullifierHash),uint256(_commitment),uint256(uint160(recipient))]);
    require(msg.sender == recipient,"Invalid Sender") ; 
    require(success,"Invalid Proof");    
       uint256[] memory payload = new uint256[](4);
        payload[0] = uint128(uint256(_nullifierHash)) ;
        payload[1] = uint128(uint256(_nullifierHash) >>128) ; 
        payload[2] = uint128(uint256(_commitment));
        payload[3] = uint128(uint256(_commitment)>>128 );

         _snMessaging.sendMessageToL2{value: msg.value}(
            contractAddress,
            selector,
            payload 
        );
    }
}