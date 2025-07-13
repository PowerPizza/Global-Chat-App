import { useEffect, useRef, useState } from 'react'
import './App.css'
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import SignupPage from './components/signup_page/SignupPage'
import HomePage from './components/home_page/HomePage'
import LoginPage from './components/login_page/LoginPage'
import {io} from 'socket.io-client'
import MessageBox from './components/message_boxes/MessageBox'
import { SharedContext } from './contexts/SharedDataContext'

export default function App() {
  const [msgBox, setMsgBox] = useState();
  const [user_creds, setUserCreds] = useState({});
  const user_creds_ref = useRef(user_creds);
  const [available_users, setAvailableUsers] = useState(null);
  const [selected_chat, setSelectedChat] = useState(null);
  const selected_chat_ref = useRef(selected_chat);
  const [chats, setChats] = useState(null);
  const [disable_send_btn, setDisableSendBtn] = useState(false);
  const ws = useRef(null);

  function createMsgBox(msg, type) {
    let timer_ = setTimeout(()=>{
      setMsgBox(null);
    }, 8000);
    setMsgBox(<MessageBox msg={msg} type={type} on_close={()=>{setMsgBox(null); clearTimeout(timer_);}} />);
  }

  async function switchChat(metadata) {
    if (!metadata){
      setChats(null)
      setSelectedChat(null)
      return;
    }
    let http_resp = await fetch("/db_q/get_conversations", {method: "POST", body: JSON.stringify({between: [user_creds["_id"], metadata["_id"]]}), headers: {"Content-Type": "application/json"}});
    http_resp = await http_resp.json();
    setChats(http_resp["chats"]);
    setSelectedChat(metadata);
  }

  async function get_login_creds() {
    let http_resp = await fetch("/login/user_creds", {method: "POST"});
    http_resp = await http_resp.json();
    setUserCreds(http_resp);
    if (http_resp && Object.keys(http_resp).length){
      ws.current.emit("new_user_online");
    }
  }

  async function sendChat(msg_) {
    if (!msg_.replaceAll("\n", "").replaceAll(" ", "")) return;
    setDisableSendBtn(true);
    const d = new Date();
    let to_send = {
      "from": user_creds["_id"],
      "to": selected_chat["_id"],
      "msg": msg_,
      "date": `${String(d.getDate()).padStart(2, 0)}-${String(d.getMonth()).padStart(2, 0)}-${d.getFullYear()}`,
      "time": d.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})
    }
    await ws.current.emit("chat", to_send, (is_sent)=>{
      setChats((old_msgs)=>[...old_msgs, to_send])
      setDisableSendBtn(false);
    });
  }

  function reload_users(){
    ws.current.emit("new_user_online");
  }

  async function on_logout() {
    let http_resp = await fetch("/login/log_out", { method: "POST" });
    http_resp = await http_resp.json();
    if (http_resp.status === "success") {
      shared_data.ws.emit("new_user_online");
      shared_data.get_login_creds();
    }
  }

  useEffect(() => {
    user_creds_ref.current = user_creds;
    selected_chat_ref.current = selected_chat;
  }, [user_creds, selected_chat]);

  useEffect(()=>{
    ws.current = io();
    ws.current.on("users", (data_)=>{
      setAvailableUsers(data_);
      // setAvailableUsers([]);
    });
    ws.current.on("chat", (data)=>{
      if (selected_chat_ref.current && user_creds_ref.current && data["from"] === selected_chat_ref.current["_id"]){
        setChats((old_msgs)=>[...old_msgs, data]);
      }
      else {
        console.log("CHAT NOT OPEN");
      }
    });

    get_login_creds();
  }, []);

  const shared_data = {
    "ws": ws.current,
    "get_login_creds": get_login_creds,
    "create_msg_box": createMsgBox,
    "user_creds": user_creds,
    "available_users": available_users,
    "switch_chat": switchChat,
    "send_chat": sendChat,
    "selected_chat": selected_chat,
    "chats": chats,
    "on_logout": on_logout
  }

  return (
    <SharedContext.Provider value={shared_data}>
      <Router>
        {msgBox}
        <div className='main_body'>
          <Routes>
            <Route path='/' element={<HomePage user_creds={user_creds} selected_chat={selected_chat} disable_send_btn={disable_send_btn} />} />
            <Route path='/signup' element={<SignupPage createMsgBox={createMsgBox} get_login_creds={get_login_creds} user_creds={user_creds} reload_users={reload_users} />} />
            <Route path='/login' element={<LoginPage createMsgBox={createMsgBox} get_login_creds={get_login_creds} user_creds={user_creds} reload_users={reload_users} />} />
          </Routes>
        </div>
      </Router>
    </SharedContext.Provider>
  )
}
