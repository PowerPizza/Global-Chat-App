import express from 'express';
import os from 'os';
import path from 'path';
import { Server } from 'socket.io';
import http from 'http';
import signup_route from './routes/signup.mjs'
import login_route from './routes/login.mjs'
import db_route from './routes/db_queries.mjs'
import dotenv from 'dotenv'
import {initDatabase, getDatabaseInstance, getMongoDBClient} from './database/mongo_client.mjs'
import session from 'express-session';
import MongoStore from 'connect-mongo'

dotenv.config();
await initDatabase();


const app = express();
const http_svr = http.createServer(app);
const ws = new Server(http_svr);

const PUBLIC_FOLDER = path.join(import.meta.dirname, "frontend/build");
app.use(express.static(PUBLIC_FOLDER));
const sessionMW = session({
    secret: process.env.APP_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        client: getMongoDBClient(),
        dbName: "GlobalChatApp",
        collectionName: "sessions",
        ttl: 14 * 24 * 60 * 60
    }),
    cookie: {maxAge: 1000 * 60 * 60 * 24}
});

app.use(sessionMW);
ws.engine.use(sessionMW);

async function logger(req, resp, next) {
    req.on("data", (data_)=>{
        console.log(data_.toString());
    });
    process.stdout.write(`${new Date().toLocaleDateString()} - ${req.method} ${req.url} `);
    console.log("\n");
    next();
}
app.use(logger);

app.use("/signup", signup_route);
app.use("/login", login_route);
app.use("/db_q", db_route);

app.get("*ANY", (req, res)=>{
    res.sendFile(path.join(PUBLIC_FOLDER, "index.html"));
});

ws.on("connection", async (soc)=>{
    console.log("CONNECTED", soc.id);
    
    soc.on("new_user_online", async ()=>{
        let user_coll = getDatabaseInstance().collection("users");
        let users_ = user_coll.find({}, {projection: {"password": 0, "gmail": 0}});
        let to_send = [];
        while (await users_.hasNext()){
            to_send.push(await users_.next());
        }
        ws.emit("users", to_send);
    })

    soc.on("chat", (data, callback)=>{
        console.log(data);
        let msg_coll = getDatabaseInstance().collection("messages");
        msg_coll.insertOne(data);
        soc.broadcast.emit("chat", data);
        callback(true);
    });

    soc.on("draw_chat", (data, callback)=>{
        soc.broadcast.emit("draw_chat", data);
        callback(true);
    })

    soc.on("disconnect", async ()=>{
        if ("user_creds" in soc.request.session) {
            console.log("DISCONNECTED : ", soc.request.session.user_creds);
        }
            console.log("DISCONNECTED : ", soc.request.session);
    })

    if (!("user_creds" in soc.request.session)) {
        let user_coll = getDatabaseInstance().collection("users");
        let users_ = user_coll.find({}, {projection: {"password": 0, "gmail": 0}});
        let to_send = [];
        while (await users_.hasNext()){
            to_send.push(await users_.next());
        }
        soc.emit("users", to_send);
    }
});


http_svr.listen(process.env.PORT, process.env.IP, ()=>{
    console.log("**Server is running at :- ");
    try {
        console.log(`\t**http://${os.networkInterfaces()["Wi-Fi"][1]["address"]}:${process.env.PORT}`);
        console.log(`\t**http://127.0.0.1:${process.env.PORT}`);
    }
    catch (e) {
        console.log(`OS ERROR : ${e} | But server is running...`);
    }
})