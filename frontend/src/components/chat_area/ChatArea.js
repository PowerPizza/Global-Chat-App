import { InfoCircle, MediaImage, SendDiagonalSolid } from 'iconoir-react'
import './chatArea.css'
import { useState } from 'react'
import OthersChat from '../chat_elements/OthersChat';
import SelfChat from '../chat_elements/SelfChat';
import LoadingCircle from '../loading_circle/LoadingCircle';

export default function ChatArea(props) {
    const [msg_, setMsg] = useState("");

    function onMsgInput(ele){
        setMsg(ele.target.value);
    }

    function onSend(){
        props.send_chat(msg_);
    }

    function scroll_to_bottom() {
        let chat_area = document.getElementById("chat_area");
        let iv = setInterval(()=>{
            chat_area = document.getElementById("chat_area");
            if (chat_area){
                chat_area.scrollBy(0, chat_area.scrollHeight);
                clearInterval(iv);
            }
        }, 500);
    }

  return (
    <div className='chat_area_body'>
        <div className='chat_header'>
            <img src={props.selected_chat["pfp_url"]} alt="" className='pfp' />
            <span className='user_name'>{props.selected_chat["username"]} <span style={{color: (props.selected_chat["status"] || "offline") === "offline" ? "#89888c" : "#48cb03"}}>●</span></span>
            <InfoCircle width={30} height={30} color='white' className='info_icon'/>
        </div>

        <div className='chat_area' id='chat_area'>
            {!props.chats ?
            <LoadingCircle />
            :
                !props.chats.length ?
                <span style={{textAlign: "center"}}>No chats found! Send 'Hi' to start chatting.</span>
                :
                props.chats.map((ele, idx)=>{
                    if (idx === props.chats.length-1) {
                        scroll_to_bottom();
                    }
                    if (ele["from"] === props.selected_chat["_id"]) {
                        return <OthersChat key={idx+"_other_chat"} msg={ele["msg"]} time={ele["time"]} pfp_url={props.selected_chat["pfp_url"]} />
                    }
                    else {
                        return <SelfChat key={idx+"_self_chat"} msg={ele["msg"]} time={ele["time"]} pfp_url={props.user_creds["pfp_url"]} />
                    }
                })
            }
            
        </div>

        <div className='chat_entry'>
            <div className='input_holder'>
                <textarea className='msg_entry form_entry' placeholder='Send a message' onChange={onMsgInput}></textarea>
                <MediaImage width={30} height={30} color='gray' className='send_img_icon' />
            </div>
            <button className='msg_send_btn form_btn' onClick={props.disable_send_btn ? ()=>{} : onSend}>
                {props.disable_send_btn ? 
                <LoadingCircle color="white"/>
                :
                <SendDiagonalSolid />
                }
            </button>
        </div>
    </div>
  )
}
