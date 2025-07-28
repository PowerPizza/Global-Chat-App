import { InfoCircleSolid, Trash, Xmark } from 'iconoir-react'
import './selfChat.css'
import { useContext, useState } from 'react';
import { SharedContext } from '../../contexts/SharedDataContext';
import LoadingCircle from '../loading_circle/LoadingCircle';

export default function SelfChat(props) {
  const [hold_timer, setHoldTimer] = useState(null);
  const [msg_opt_visible, setMsgOptVisible] = useState(false);
  const [show_del_loader, setShowDelLoader] = useState(false);
  const shared_data = useContext(SharedContext);


  function hold_begin(eve){
    hold_cancle();
    setHoldTimer(setTimeout(()=>{
      setMsgOptVisible(true);
    }, 700));
  }

  function hold_cancle(eve){
    clearInterval(hold_timer);
  }

  async function on_delete_msg(){
    setShowDelLoader(true);
    let http_resp = await fetch("/db_q/delete_msg", {method: "POST", body: JSON.stringify({"msg_id": props.msg_id}), headers: {"Content-Type": "application/json"}});
    http_resp = await http_resp.json();
    if (http_resp["status"] === "success"){
      shared_data.ws.emit("req_reload_msgs_broadcast", {"selected_user_id": shared_data.user_creds["_id"]}, ()=>{
        setShowDelLoader(false);
        setMsgOptVisible(false);
      });
    }
  }

  return (
    <div className='self_chat_body' onMouseDown={hold_begin} onMouseUp={hold_cancle} onTouchStart={hold_begin} onTouchEnd={hold_cancle}>
      {msg_opt_visible ?
        <div className='msg_options'>
          <span className='opt' onClick={on_delete_msg}>Delete  {show_del_loader ? <span className='icon'><LoadingCircle width={20} heigth={20} color={"#ecc4ff"} /></span> : <Trash width={25} height={25} className='icon'/>} </span>
          <span className='opt' onClick={()=>{setMsgOptVisible(false)}}>Close <Xmark width={25} height={25} className='icon'/></span>
        </div>
        : null}

        <div className='msg_holder'>
            {props.type === "text" ? 
            <span className='msg'>{props.msg}</span>
            :
            <>
            <img className="img_msg" src={props.img_url} alt="[not loaded] draw type chat" />
            <span className='img_warn'><InfoCircleSolid /> This chat will not be saved in database</span>
            </>}
        </div>
        <div className='pfp_holder'>
            <img src={props.pfp_url} alt="user pfp" />
            <span className='msg_time'>{props.time}</span>
        </div>
    </div>
  )
}
