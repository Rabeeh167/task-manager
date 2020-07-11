const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const id = new ObjectID()
const timestamp = id.getTimestamp()
console.log("id", id)
console.log("timestamp", timestamp)

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log("err", error)
    }

    const db = client.db(databaseName) //automatically creates a new db with this name
    // console.log("connxn success", client)

    // db.collection('users').insertOne({
    //     name: 'Rabeeh',
    //     age: 26
    // }, (error, result)=>{
    //     if(error){
    //         return console.log("An error occured")
    //     }

    //     console.log(result)
    // })

    // db.collection('tasks').insertMany([{
    //     description: 'Purchase',
    //     completed: true},
    //     {
    //         description: 'Process',
    //         completed: true
    //     },
    //     {
    //         description:'Sale',
    //         completed: false
    //     }
    // ], (error, result) =>{
    //     if(error){
    //         return console.log("erroroccured while insertion")
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('users').findOne({ _id: new ObjectID('5eede0cbb109be22b4200677') }, (error, result) => {
    //     if (error) {
    //         return console.log("error", error)
    //     }
    //     console.log(result)
    // })

    // db.collection('users').find({ age: 26 }).toArray((error, result) => {
    //     if (error) {
    //         return console.log("error", error)
    //     }
    //     console.log(result)
    // })

    db.collection('users').updateOne({
        _id: new ObjectID('5eede0cbb109be22b4200677')
    },{
        $set:{
            name:'rabeeh updated'
        }
    })
    .then((res) =>{
        console.log(res)
    })
    .catch((err) =>{
        console.log(err)
    })

})