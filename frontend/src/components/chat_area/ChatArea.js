import { ArrowLeft, Edit, InfoCircle, MessageText, MoreHorizCircle, SendDiagonalSolid } from 'iconoir-react'
import './chatArea.css'
import { useContext, useRef, useState } from 'react'
import OthersChat from '../chat_elements/OthersChat';
import SelfChat from '../chat_elements/SelfChat';
import LoadingCircle from '../loading_circle/LoadingCircle';
import { SharedContext } from '../../contexts/SharedDataContext';
import DrawChatArea from '../chat_mode_draw/DrawChatArea';

export default function ChatArea(props) {
    const [msg_, setMsg] = useState("");
    const [chat_mode, setChatMode] = useState("text");
    const [opt_menu_opened, setOptMenuOpened] = useState(false);
    const [draw_sending, setDrawSending] = useState(false);
    const [is_typing, setIsTyping] = useState(false);
    const shared_data = useContext(SharedContext);
    const typing_interval = useRef(null);

    function onMsgInput(ele) {
        setMsg(ele.target.value);
        if (!is_typing){
            setIsTyping(true);
            shared_data.ws.emit("add_typing_user", shared_data.user_creds["_id"]);
            console.log("typing start");
        }
        clearInterval(typing_interval.current);
        typing_interval.current = setTimeout(()=>{
            console.log("Typing stopped");
            shared_data.ws.emit("remove_typing_user", shared_data.user_creds["_id"]);
            setIsTyping(false);
        }, 5000);
    }

    function onSend() {
        clearInterval(typing_interval.current);
        shared_data.ws.emit("remove_typing_user", shared_data.user_creds["_id"]);
        setIsTyping(false);
        shared_data.send_chat(msg_, ()=>{
            setMsg("");
            try{
                document.getElementById("msg_text_type_input").value = "";
            } catch (e) {};
        });
    }

    function go_back() {
        shared_data.switch_chat(null);
    }

    function scroll_to_bottom() {
        let chat_area = document.getElementById("chat_area");
        let iv = setInterval(() => {
            chat_area = document.getElementById("chat_area");
            if (chat_area) {
                chat_area.scrollBy(0, chat_area.scrollHeight);
                clearInterval(iv);
            }
        }, 500);
    }

    function onSendDrawMsg() {
        setDrawSending(true);
        let draw_area = document.getElementById("draw_area");
        const d = new Date();
        let to_send = {
            "from": shared_data.user_creds["_id"],
            "to": shared_data.selected_chat["_id"],
            "type": "img",
            "img_url": draw_area.toDataURL("image/jpeg"),
            "date": `${String(d.getDate()).padStart(2, 0)}-${String(d.getMonth()).padStart(2, 0)}-${d.getFullYear()}`,
            "time": d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        }
        shared_data.ws.emit("draw_chat", to_send, (data) => {
            shared_data.setChats((old)=>[...old, to_send]);
            setDrawSending(false);
        })
    }

    return (
        <div className='chat_area_body'>
            <div className='chat_header'>
                {props.device_width < 920 ?
                    <ArrowLeft width={25} height={25} color='white' strokeWidth={2} onClick={go_back} style={{ cursor: "pointer" }} />
                    : null}
                <img src={shared_data.selected_chat["pfp_url"]} alt="" className='pfp' />
                <div className='labels_holder'>
                    <span className='user_name'>{shared_data.selected_chat["username"]} <span style={{ color: (shared_data.selected_chat["status"] || "offline") === "offline" ? "#89888c" : "#48cb03" }}>●</span></span>
                    {shared_data.typing_users.includes(shared_data.selected_chat["_id"]) ?
                        <span className='typing_status'>typing</span>
                        :
                        null
                    }
                </div>
                <InfoCircle width={30} height={30} color='white' className='info_icon' />
            </div>

            <div className='chat_area' id='chat_area'>
                {/* <SelfChat type="img" img_url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM9z173vC6Sdhj1LDXB8B9mO-aAhuMrf67zw&s"/> */}
                {!shared_data.chats ?
                    <LoadingCircle />
                    :
                    !shared_data.chats.length ?
                        <span style={{ textAlign: "center" }}>No chats found! Send 'Hi' to start chatting.</span>
                        :
                        shared_data.chats.map((ele, idx) => {
                            if (idx === shared_data.chats.length - 1) {
                                scroll_to_bottom();
                            }
                            if (ele["from"] === shared_data.selected_chat["_id"]) {
                                return <OthersChat key={idx + "_other_chat"} type={ele["type"]} msg={ele["msg"]} img_url={ele["img_url"]} time={ele["time"]} pfp_url={shared_data.selected_chat["pfp_url"]} />
                            }
                            else {
                                return <SelfChat key={idx + "_self_chat"} type={ele["type"]} msg={ele["msg"]} img_url={ele["img_url"]} time={ele["time"]} pfp_url={shared_data.user_creds["pfp_url"]} />
                            }
                        })
                }

            </div>

            <div className='chat_entry'>
                <div className={`input_holder ${chat_mode}`}>
                    {chat_mode === "text" ?
                        <textarea className='msg_entry form_entry' id='msg_text_type_input' placeholder='Send a message' onChange={onMsgInput}></textarea>
                        :
                        <DrawChatArea />
                    }
                    <div className='send_options'>
                        {opt_menu_opened ?
                            <div className='opt_holder glass-light' onClick={() => { setOptMenuOpened(!opt_menu_opened) }}>
                                <div className='opt' onClick={() => { setChatMode("draw") }} >
                                    <Edit width={30} height={30} color='white' className='icon' />
                                    <span>Draw Chat</span>
                                </div>

                                <div className='opt' onClick={() => { setChatMode("text") }} >
                                    <MessageText width={30} height={30} color='white' className='icon' />
                                    <span>Text Chat</span>
                                </div>
                            </div>
                            : null}
                        <MoreHorizCircle width={30} height={30} color='gray' className='send_img_icon' onClick={() => { setOptMenuOpened(!opt_menu_opened) }} />
                        {chat_mode === "draw" ? 
                        <button className='msg_send_btn form_btn' onClick={props.disable_send_btn ? () => { } : onSendDrawMsg}>
                            {draw_sending ? <LoadingCircle color="white" /> : <SendDiagonalSolid />}
                        </button>
                        : null}
                    </div>
                    {/* <MediaImage width={30} height={30} color='gray' className='send_img_icon' /> */}
                    
                </div>
                {chat_mode === "text" ?
                    <button className='msg_send_btn form_btn' onClick={props.disable_send_btn ? () => { } : onSend}>
                        {props.disable_send_btn ? <LoadingCircle color="white" /> : <SendDiagonalSolid />}
                    </button>
                    : null
                    // <button className='msg_send_btn form_btn' onClick={props.disable_send_btn ? () => { } : onSendDrawMsg}>
                    //     {draw_sending ? <LoadingCircle color="white" /> : <SendDiagonalSolid />}
                    // </button>
                }
            </div>
        </div>
    )
}
