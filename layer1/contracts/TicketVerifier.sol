// SPDX-License-Identifier: MIT
import "./starknet/IStarknetMessaging.sol"  ; 
interface  IVerifier {
    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[2] calldata _pubSignals) external view  returns (bool)  ;
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


struct  Proof  {
    uint[2]  _pA   ; 
    uint[2][2]  _pB  ;  
    uint[2]  _pC   ;
    uint[2] _pubSignals ;
}

function InvalidateTicket( Proof calldata proof ,  uint256 contractAddress, uint256 selector  ) external payable    {

require(_verifierContract.verifyProof(proof._pA , proof._pB , proof._pC , proof._pubSignals ) ,  "invalid prove  ") ;

// defining the payload here from the public signals 

uint256[] memory payload = new uint256[](1);
        payload[0] = 1 ;
        _snMessaging.sendMessageToL2{value: msg.value}(
            contractAddress,
            selector,
            payload
        );

}
}