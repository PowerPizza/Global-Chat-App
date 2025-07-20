import { InfoCircleSolid } from 'iconoir-react'
import './selfChat.css'

export default function SelfChat(props) {
  return (
    <div className='self_chat_body'>
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
