import { MongoClient } from 'mongodb'

let client = null;
let db_ = null;

export async function initDatabase(){
    client = new MongoClient(process.env.MONGODB_URL);
    if (!db_){
        await client.connect();
        db_ = client.db("GlobalChatApp");
    }
}

export function getDatabaseInstance(){
    if (!db_){
        console.log("ERROR : Mongodb instance is not initated yet!!!");
        return;
    }
    return db_;
}

export function getMongoDBClient(){
    if (!client){
        console.log("Client is not initialized yet.");
        return;
    }
    return client;
}