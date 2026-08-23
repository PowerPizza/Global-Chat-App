import { MongoClient } from 'mongodb'
import USERS_COLLECTION_SCHEMA from './schemas/users-collection-schema.json' assert { type: 'json' }

let client = null;
let db_ = null;

export async function initDatabase(){
    client = new MongoClient(process.env.MONGODB_URL);
    if (!db_){
        await client.connect();
        db_ = client.db("GlobalChatApp");

        // Creating users collection
        createCollectionWithValidation(db_, "users", USERS_COLLECTION_SCHEMA);
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

export function getUsersCollection() {
    return getDatabaseInstance().collection("users");
}

async function createCollectionWithValidation(db_instance, collection_name, validation) {
    const user_coll_exists = await db_instance.listCollections({ name: collection_name }).hasNext();
    if (!user_coll_exists) {
        db_.createCollection(collection_name, {
            validator: validation,
            validationLevel: "moderate",
            validationAction: "error"
        });
    }
    else {
        db_.command({
            collMod: collection_name,
            validator: validation,
            validationLevel: "moderate",
            validationAction: "error"
        })
    }
}