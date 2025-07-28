import express from 'express'
import {getDatabaseInstance} from '../database/mongo_client.mjs'
import { ObjectId } from 'mongodb';

const router = express.Router();

router.use(express.json());

router.post("/get_conversations", async (req, res)=>{
    let data_ = req.body;
    let db_resp = await getDatabaseInstance().collection("messages").find({"from": {"$in": data_["between"]}, "to": {"$in": data_["between"]}});
    let to_send = []
    while (await db_resp.hasNext()){
        to_send.push(await db_resp.next());
    }
    res.json({"chats": to_send});
});

router.post("/set_user_status", async (req, res)=>{
    let data_ = req.body;
    let db_resp = await getDatabaseInstance().collection("messages").updateOne({"_id": data_["_id"]}, {"$set": {"status": data_["status"]}}, {"upsert": true})
    console.log(db_resp);
    res.json({"status": "success"});
})

router.post("/delete_msg", async (req, res)=>{
    let msg_id_ = req.body;
    await getDatabaseInstance().collection("messages").deleteOne({"_id": ObjectId.createFromHexString(msg_id_["msg_id"])});
    res.json({"status": "success"});
});

export default router;