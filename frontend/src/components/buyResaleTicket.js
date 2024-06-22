import { useState } from "react";

import { commitmentHash, nullifierHash } from "../utils/createHash";

import {
  approve,
  getDetails,
  getL2contract,
  get_token_name,
  toHex,
  calculatePurchaseFeeLocal ,
  apiurl,
} from "../web3/web3";

import random from "../utils/random";
import { CreateTicketQR } from "../utils/createTicketQR";
import { downloadTicket } from "../utils/downloadTicket";
import { useParams } from "react-router-dom";
import { errors } from "ethers";




export default  function BuyResaleTicket(props) {
  
    let old_nullifierhash_hash = toHex("451080864958729097514591881723044877613218272959133178948076815576142953112");
    let old_commitmenthash_hash   = toHex("2952130163293882645100394847402318473054464837513818682981193859388898847175") ;
console.log(old_nullifierhash_hash) ;
console.log(old_commitmenthash_hash) ;



// this will give all the data in this of the condition 
async function getarr(){
  fetch(apiurl+"get")
  .then(response => response.json())
  .then(data => console.log(data))
 } 




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
// if this is done then we delete the value of the oldticket from the buyticket 
async function deleteOldTicket( nullifier , commitment  ){ 
  //  let nullifier = "0xff4d7f300812f82d8953fec346060c84232ee73ccdb7989b18bd0e6fc7ba98" ;
  // let commitment = "0x0686d8b197dba5dffd9c24b27e19659e8748cd390f079395ddcc4be66e24a9c7" ; 
  const data =new FormData() ; 
  data.append("nullifier",nullifier) ; 
  data.append("commitment",commitment) ;
  // console.log(data.get("old_nullifier")) ; 
  fetch(apiurl, {
    method: "DELETE" ,
    body: data ,
    }).then (res=>res.json())
    .then((result)=>{ alert (result);
    }) ; 
}

return(
        <div>
          <div>hello world</div>
          <button onClick={deleteOldTicket}>getvalue</button>

        </div>
)
}

