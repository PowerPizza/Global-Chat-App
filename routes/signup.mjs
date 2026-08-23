import express from 'express'
import {getDatabaseInstance, getUsersCollection} from '../database/mongo-client.mjs'

const router = express.Router();

router.use(express.json());

router.post("/add-user", async (req, res)=>{
    try {
        let data_to_add = req.body;
        const users_coll = getUsersCollection();

        let already_exist = await users_coll.findOne({"gmail": data_to_add["gmail"]});
        if (already_exist !== null){
            res.json({"success": false, "error": "Gmail already exists."});
            return;
        }
        else {
            data_to_add.role = "user";
            console.log("Creating new user : ", data_to_add);
            const inserted = await users_coll.insertOne(data_to_add);
            console.log("User created : ", inserted);
            res.json({"success": inserted.acknowledged});
        }
    }
    catch (e) {
        res.json({"success": false, "error": e});
    }
});

export default router;