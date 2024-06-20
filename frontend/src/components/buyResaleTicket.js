import { useState } from "react";

import { commitmentHash, nullifierHash } from "../utils/createHash";

import {
  approve,
  getDetails,
  getL2contract,
  get_token_name,
  toHex,
  calculatePurchaseFeeLocal ,
} from "../web3/web3";

import random from "../utils/random";
import { CreateTicketQR } from "../utils/createTicketQR";
import { downloadTicket } from "../utils/downloadTicket";
import { useParams } from "react-router-dom";
import { errors } from "ethers";



export default  function BuyResaleTicket(props) {
    
    let old_nullifierhash_hash = toHex("451080864958729097514591881723044877613218272959133178948076815576142953112");
    let old_commitmenthash_hash   = toHex("2952130163293882645100394847402318473054464837513818682981193859388898847175") ;


let account = props.account ;
let contract = getL2contract(account) ;

async function getvalue(){
    let ticket_details = await contract.getTicket(toHex(old_commitmenthash_hash)) ; 
  let event_index = ticket_details.ticketEventIndex ; 
  getDetails(event_index) ; 
  const { event_price, event_name, token_address } = await getDetails(
    event_index
  );
  let price = Number(event_price) ; 
  let fees = price*0.01; 
  let total = price + fees ;   
  await approve(account, total); 
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log(typeof(Number(event_price)));
  let new_nullifier = random() ; 
let new_secret = random() ; 
const new_commitment_hash = commitmentHash(
    parseInt(new_nullifier),
    parseInt(new_secret)
  );
  const new_nullifier_hash = nullifierHash(parseInt(new_nullifier));
  try {
let txn = await contract.buyResaleTicket(new_commitment_hash , old_nullifierhash_hash , old_commitmenthash_hash ) ;
console.log(txn) ;
const noteString = `${new_nullifier},${new_secret},${new_nullifier_hash},${new_commitment_hash},${event_index},${event_price},${token_address}`;
const qrDataURL = await CreateTicketQR(noteString);
      const token_name = get_token_name(token_address);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      downloadTicket(qrDataURL, price, token_name, event_name);
  }catch(error) {
    alert(error)
  }
}
return(
        <div>
          <button onClick={getvalue}> getValues </button>
        </div>
)
}
