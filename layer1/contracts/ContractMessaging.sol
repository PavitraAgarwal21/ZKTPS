// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0; 

import "./starknet/IStarknetMessaging.sol" ; 

contract ContractMessaging {
 
        IStarknetMessaging public  _snMessaging;  

// The address of Starknet Core contract, 
        constructor(address starknetCore) {
            _snMessaging = IStarknetMessaging(starknetCore); 
        }
        
        // now we want to send the message to the to starknet contract 
        // sending the perdefined function 
           function sendMessageValue(
        uint256 contractAddress,
        uint256 selector
    )
        external
        payable
    {
        uint256[] memory payload = new uint256[](1);
        payload[0] = 1 ;

        _snMessaging.sendMessageToL2{value: msg.value}(
            contractAddress,
            selector,
            payload
        );
    }
}
