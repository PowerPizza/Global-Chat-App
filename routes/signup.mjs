import express from 'express'
import {getDatabaseInstance} from '../database/mongo_client.mjs'

const router = express.Router();

router.use(express.json());

router.post("/add-user", async (req, res)=>{
    try {
        let data_to_add = req.body;
        let user_coll = getDatabaseInstance().collection("users");
        let already_exist = await user_coll.findOne({"gmail": data_to_add["gmail"]});
        if (already_exist !== null){
            res.json({"status": "failed", "error": "ALREADY_EXIST"});
            return;
        }
        let db_resp = await user_coll.insertOne(data_to_add);
        data_to_add["_id"] = db_resp.insertedId.toString();
        if (db_resp.acknowledged) {
            req.session["user_creds"] = data_to_add;
            res.json({"status": "success", "userId": data_to_add["_id"]});
        }
        else{
            res.json({"status": "failed", "error": "Unknown"});
        }
    }
    catch (e) {
        res.json({"status": "failed", "error": e});
    }
});

export default router;