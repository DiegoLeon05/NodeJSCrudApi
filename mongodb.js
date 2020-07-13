const log = require('../Generic/log');
const enumerator = require('../Generic/Enumerators');
const className = 'MongoDB';
const connectionURL = "mongodb://127.0.0.1:27017";
// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;
const databaseName = 'task-manager';

const {MongoClient, ObjectID} = require('mongodb');

// const id = new ObjectID();
// console.log(id);
// console.log(id.getTimestamp());

//#region Insert
// MongoClient.connect(connectionURL, {useNewUrlParser:true, useUnifiedTopology: true}, (error, client) =>{
//     if (error){
//      return console.log('Unable to connect to database');   
//     }
//     const db = client.db(databaseName);

//     db.collection('users').insertOne({
//         _id: id,
//         UserId: id,
//         UserName: "Mathias",
//         UserPassword: "LeonGutierrez",
//         UserBirthDay: new Date(),
//         UserAge: 10,
//         UserActive: true
//     }) 
//     .then(result => {console.log(result.ops); log.Write({class:className, method: 'Insert', message:result.ops, TypeMessage: enumerator.TypeMessage.Success})})
//     .catch(error => log.Write({class:className, method: 'Insert', message:error, TypeMessage: enumerator.TypeMessage.Success}))

//     db.collection('users').insertMany([{
//         // UserId: objUser.UserId,
//         UserName: "Diego",
//         UserPassword: "LeonZamora",
//         UserBirthDay: new Date(),
//         UserAge: 32,
//         UserActive: true
//     },
//     {
//         // UserId: objUser.UserId,
//         UserName: "Deisy",
//         UserPassword: "GutierrezGaitan",
//         UserBirthDay: new Date(),
//         UserAge: 33,
//         UserActive: true
//     }]) 
//     .then(result => log.Write({class:className, method: 'Insert', message:result.ops, TypeMessage: enumerator.TypeMessage.Success}))
//     .catch(error => log.Write({class:className, method: 'Insert', message:error, TypeMessage: enumerator.TypeMessage.Success}))
// });
//#endregion

//#region Read
// MongoClient.connect(connectionURL, {useNewUrlParser:true, useUnifiedTopology: true}, (error, client) =>{
//     if (error){
//      return console.log('Unable to connect to database');   
//     }
//     const db = client.db(databaseName);
//     db.collection('users').findOne({
//         _id: new ObjectID('5f0376fc9aacdc2a28fa0812'),
//         UserName: "Mathias",
//         UserAge: 15,
//     }) 
//     .then(result => {
//         console.log(result); 
//         log.Write({class:className, method: 'Read', message:result.ops, TypeMessage: enumerator.TypeMessage.Success})})
//     .catch(error => log.Write({class:className, method: 'Read', message:error, TypeMessage: enumerator.TypeMessage.Success}))
//     db.collection('users').find({
//         _id: id,
//         UserId: id,
//         UserName: "Mathias",
//         UserPassword: "LeonGutierrez",
//         UserBirthDay: new Date(),
//         UserAge: 15,
//         UserActive: true
//     })
//     .toArray()
//     .then(result => {
//         console.log(result); 
//         log.Write({class:className, method: 'Read', message:result.ops, TypeMessage: enumerator.TypeMessage.Success})
//     })
//     .catch(error => log.Write({class:className, method: 'Read', message:error, TypeMessage: enumerator.TypeMessage.Success}))
// });
//endregion

//#region Update
// MongoClient.connect(connectionURL, {useNewUrlParser:true, useUnifiedTopology: true}, (error, client) =>{
//     if (error){
//      return console.log('Unable to connect to database');   
//     }
//     const db = client.db(databaseName);

//     db.collection('users').updateOne({
//         _id: new ObjectID('5f0376fc9aacdc2a28fa0812'),
//     },{
//         $set:{
//             UserName:'Estefania'
//         }
//     }) 
//     .then(result => {
//         console.log(result); 
//         log.Write({class:className, method: 'Read', message:result.ops, TypeMessage: enumerator.TypeMessage.Success})})
//     .catch(error => log.Write({class:className, method: 'Read', message:error, TypeMessage: enumerator.TypeMessage.Success}))

//     db.collection('users').updateOne({
//         _id: new ObjectID('5f0376fc9aacdc2a28fa0812'),
//     },{
//         $inc:{
//             UserAge: 1
//         }
//     }) 
//     .then(result => {
//         console.log(result); 
//         log.Write({class:className, method: 'Read', message:result.ops, TypeMessage: enumerator.TypeMessage.Success})})
//     .catch(error => log.Write({class:className, method: 'Read', message:error, TypeMessage: enumerator.TypeMessage.Success}))

//     db.collection('users').updateMany({
//         UserName: 'Mathias',
//     },{
//         $inc:{
//             UserAge: 1
//         }
//     }) 
//     .then(result => {
//         console.log(result.modifiedCount); 
//         log.Write({class:className, method: 'Read', message:result.ops, TypeMessage: enumerator.TypeMessage.Success})})
//     .catch(error => log.Write({class:className, method: 'Read', message:error, TypeMessage: enumerator.TypeMessage.Success}))

// });
//endregion

//#region Delete
MongoClient.connect(connectionURL, {useNewUrlParser:true, useUnifiedTopology: true}, (error, client) =>{
    if (error){
     return console.log('Unable to connect to database');   
    }
    const db = client.db(databaseName);

    db.collection('users').deleteOne({
        _id: new ObjectID('5f0376fc9aacdc2a28fa0812'),
    }) 
    .then(result => {
        console.log(result.deletedCount); 
        log.Write({class:className, method: 'Read', message:result.ops, TypeMessage: enumerator.TypeMessage.Success})})
    .catch(error => log.Write({class:className, method: 'Read', message:error, TypeMessage: enumerator.TypeMessage.Success}))

    db.collection('users').deleteMany({
        UserName: 'Mathias',
    }) 
    .then(result => {
        console.log(result.deletedCount); 
        log.Write({class:className, method: 'Read', message:result.ops, TypeMessage: enumerator.TypeMessage.Success})})
    .catch(error => log.Write({class:className, method: 'Read', message:error, TypeMessage: enumerator.TypeMessage.Success}))

});
//endregion