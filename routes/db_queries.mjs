import express from 'express'
import {getDatabaseInstance} from '../database/mongo_client.mjs'
import { ObjectId } from 'mongodb';

const router = express.Router();

router.use(express.json());

router.post("/get-conversations-between", async (req, res)=>{
    let data_ = req.body;
    let db_resp = await getDatabaseInstance().collection("messages").find({"from": {"$in": data_["between"]}, "to": {"$in": data_["between"]}});
    let to_send = []
    while (await db_resp.hasNext()){
        to_send.push(await db_resp.next());
    }
    res.json({"chats": to_send});
});

router.put("/set-user-status", async (req, res)=>{
    let data_ = req.body;
    let db_resp = await getDatabaseInstance().collection("messages").updateOne({"_id": data_["_id"]}, {"$set": {"status": data_["status"]}}, {"upsert": true})
    console.log(db_resp);
    res.json({"status": "success"});
})

router.delete("/delete-msg-by-id/:msgId", async (req, res)=>{
    try {
        const {msgId} = req.params;
        await getDatabaseInstance().collection("messages").deleteOne({"_id": ObjectId.createFromHexString(msgId)});
        res.json({"status": "success"});
    }
    catch (e) {
        res.json({"status": "failed", "error": String(e)});
    }
});

export default router;