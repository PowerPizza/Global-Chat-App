import express from 'express'
import {getDatabaseInstance} from '../database/mongo_client.mjs'
import { ObjectId } from 'mongodb';

const login_route = express.Router();

login_route.use(express.json());

login_route.post("/user_creds", (req, res)=>{
    res.json(req.session["user_creds"] || {});
});

login_route.post("/log_in", async (req, res)=>{
    let data_ = req.body;
    let user_coll = getDatabaseInstance().collection("users");
    let already_exist = await user_coll.findOne({"gmail": data_["gmail"], "password": data_["password"]});
    if (already_exist === null){
        res.json({"status": "failed", "error": "NO_ACCOUNT"});
    }
    else{
        let db_resp = await user_coll.updateOne({"_id": already_exist["_id"]}, {"$set": {"status": "online"}}, {"upsert": true});
        console.log("Updated User Status : ", db_resp["modifiedCount"]);
        req.session["user_creds"] = already_exist;
        res.json({"status": "success"});
    }
});

login_route.post("/log_out", async (req, res)=>{
    await getDatabaseInstance().collection("users").updateOne({"_id": ObjectId.createFromHexString(req.session["user_creds"]["_id"])}, {"$set": {"status": "offline"}}, {"upsert": true});
    delete req.session["user_creds"];
    res.json({"status": "success"});
})


export default login_route;