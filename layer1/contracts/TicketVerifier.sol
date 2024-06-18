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

function InvalidateTicket(uint[2] calldata  _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[2] calldata _pubSignals , uint256 selector , uint256 contractAddress  ) external payable    {

require(_verifierContract.verifyProof(_pA ,_pB , _pC , _pubSignals ) ,  "invalid prove  ") ;


uint256[] memory payload = new uint256[](4);
        payload[0] = uint128(_pubSignals[0]) ;
        payload[1] = uint128(_pubSignals[0] >>128) ; 
        payload[2] = uint128(_pubSignals[1]);
        payload[3] = uint128(_pubSignals[1]>>128 );

         _snMessaging.sendMessageToL2{value: msg.value}(
            contractAddress,
            selector,
            payload 
        );
}
}