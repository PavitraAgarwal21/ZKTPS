// async function run() {
//     const uri = "mongodb+srv://agarwalpavitra3000:eeyPoKbnsQGiYAR1@allowresale.nfcdiym.mongodb.net/?retryWrites=true&w=majority&appName=ALLOWRESALE";
//     const client = new MongoClient(uri);
//     await client.connect();
    
    
//     const dbName = "AllowResaleInfo";
//     const collectionName = "allows";
//     const database = client.db(dbName);
//     const collection = database.collection(collectionName);
    
    
//     let nullifier = "0xyy4d7f300812f82d8953fec346060c84232ee73ccdb7989b18bd0e6fc7ba98" ; 
//     let commitment  = "0xrr86d8b197dba5dffd9c24b27e19659e8748cd390f079395ddcc4be66e24a9c7" ; 
    
//     // we have to convert it into this object 
//     const allowTicket = 
//         {
//         "old_nullifier" : `${nullifier}`, 
//         "old_commitment": `${commitment}` ,
//         } ;
    
//     // interset the Element in the collection  
    
//     try {
//         const insertManyResult = await collection.insertOne(allowTicket);
//         console.log(`documents successfully inserted.\n`);
//       } catch (err) {
//         console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
//       }
    
//     // trying to delete the the commitment and nullifierhash 
//     const deleteQuery = {
//         "old_nullifier" : "0xpp4d7f300812f82d8953fec346060c84232ee73ccdb7989b18bd0e6fc7ba98",
//         "old_commitment": "0xaa86d8b197dba5dffd9c24b27e19659e8748cd390f079395ddcc4be66e24a9c7"
//         };
//     try {
//       const deleteResult = await collection.deleteOne(deleteQuery);
//       console.log(`Deleted ${deleteResult.deletedCount} documents\n`);
//     } catch (err) {
//       console.error(`Something went wrong trying to delete documents: ${err}\n`);
//     }
    
//     // getall the data from the collection 
//     try {
//         const cursor = await collection.find() ; 
//         const results = await cursor.toArray() ;
//         console.log(results) ;
//     }catch(err){
//         console.error(`Something went wrong trying to get the data from the collection: ${err}\n`);
    
//     }
    
//     await client.close();
//     }
//     run().catch(console.dir);


const express = require("express");
const  MongoClient  = require("mongodb").MongoClient; 
const cors = require("cors"); 
const multer = require("multer"); 
const CONNECTION_STRING = "mongodb+srv://agarwalpavitra3000:eeyPoKbnsQGiYAR1@allowresale.nfcdiym.mongodb.net/?retryWrites=true&w=majority&appName=ALLOWRESALE";
const dbName = "AllowResaleInfo";
const collectionName = "allows";  
let collection ; 
const app = express();
app.use(cors());

app.listen (5038, async ()=>{

   const uri = "mongodb+srv://agarwalpavitra3000:eeyPoKbnsQGiYAR1@allowresale.nfcdiym.mongodb.net/?retryWrites=true&w=majority&appName=ALLOWRESALE";
    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db(dbName);
    collection = database.collection(collectionName);
console.log(`Server running on port 5038`);
}) ; 


app.get('/get', async (request, response)=>{
            const cursor = await collection.find({}) ; 
            const results = await cursor.toArray() ;
            response.send(results) ;
         }) ; 


// app post or add the nullifier and commitment hash 
app.post('/', multer().none(), async (request, response)=>{
    let nullifier = request.body.nullifier ;
    let commitment = request.body.commitment ;
    const allowTicket = 
        {
        "old_nullifier" : `${nullifier}`, 
        "old_commitment": `${commitment}` ,
        } ; 
    try {
        const insertManyResult = await collection.insertOne(allowTicket);
        console.log(`documents successfully inserted.\n`);
      } catch (err) {
        console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
      }
});


// delete the nullifier and commitment hash 
app.delete('/', multer().none(), async (request, response)=>{   
    // console.log(`delete query information ${request.body}`) ;
    let nullifier = request.body.nullifier ;
    let commitment = request.body.commitment ;

    const deleteQuery = {
        "old_nullifier" : `${nullifier}`,
        "old_commitment": `${commitment}`
        };
    try {
      const deleteResult = await collection.deleteOne(deleteQuery);
      console.log(`Deleted ${deleteResult.deletedCount} documents\n`);
    } catch (err) {
      console.error(`Something went wrong trying to delete documents: ${err}\n`);
    }
 }) ; 







        // app. post ('/api/todoapp/AddNotes', multer ().none(), (request, response)=>{
        // database. collection ("todoappcollection"). count({}, function(error, numOfDocs)=>
        // database, collection ("todoappcollection"). insertOne({
        // id: (numOfDocs+1). toString(),
        // description:request.body.newNotes
        // })

