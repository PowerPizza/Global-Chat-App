import { ArrowLeft, InfoCircle, MediaImage, SendDiagonalSolid } from 'iconoir-react'
import './chatArea.css'
import { useContext, useState } from 'react'
import OthersChat from '../chat_elements/OthersChat';
import SelfChat from '../chat_elements/SelfChat';
import LoadingCircle from '../loading_circle/LoadingCircle';
import { SharedContext } from '../../contexts/SharedDataContext';

export default function ChatArea(props) {
    const [msg_, setMsg] = useState("");
    const shared_data = useContext(SharedContext);

    function onMsgInput(ele){
        setMsg(ele.target.value);
    }

    function onSend(){
        shared_data.send_chat(msg_);
    }

    function go_back(){
        shared_data.switch_chat(null);
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
            {props.device_width < 920 ? 
            <ArrowLeft width={25} height={25} color='white' strokeWidth={2} onClick={go_back} style={{cursor: "pointer"}}/>
            : null}
            <img src={shared_data.selected_chat["pfp_url"]} alt="" className='pfp' />
            <span className='user_name'>{shared_data.selected_chat["username"]} <span style={{color: (shared_data.selected_chat["status"] || "offline") === "offline" ? "#89888c" : "#48cb03"}}>●</span></span>
            <InfoCircle width={30} height={30} color='white' className='info_icon'/>
        </div>

        <div className='chat_area' id='chat_area'>
            {!shared_data.chats ?
            <LoadingCircle />
            :
                !shared_data.chats.length ?
                <span style={{textAlign: "center"}}>No chats found! Send 'Hi' to start chatting.</span>
                :
                shared_data.chats.map((ele, idx)=>{
                    if (idx === shared_data.chats.length-1) {
                        scroll_to_bottom();
                    }
                    if (ele["from"] === shared_data.selected_chat["_id"]) {
                        return <OthersChat key={idx+"_other_chat"} msg={ele["msg"]} time={ele["time"]} pfp_url={shared_data.selected_chat["pfp_url"]} />
                    }
                    else {
                        return <SelfChat key={idx+"_self_chat"} msg={ele["msg"]} time={ele["time"]} pfp_url={shared_data.user_creds["pfp_url"]} />
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
