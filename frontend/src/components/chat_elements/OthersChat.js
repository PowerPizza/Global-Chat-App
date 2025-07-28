import { InfoCircleSolid, Xmark } from 'iconoir-react'
import './othersChat.css'
import { useState } from 'react'

export default function OthersChat(props) {
  const [hold_timer, setHoldTimer] = useState(null);
  const [msg_opt_visible, setMsgOptVisible] = useState(false);

  function hold_begin(eve){
    hold_cancle();
    setHoldTimer(setTimeout(()=>{
      setMsgOptVisible(true);
    }, 700));
  }

  function hold_cancle(eve){
    clearInterval(hold_timer);
  }

  return (
    <div className='others_chat_body' onMouseDown={hold_begin} onMouseUp={hold_cancle}>
      {msg_opt_visible ?
      <div className='msg_options'>
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
