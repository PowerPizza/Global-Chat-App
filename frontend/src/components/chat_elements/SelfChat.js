import './selfChat.css'

export default function SelfChat(props) {
  return (
    <div className='self_chat_body'>
        <div className='msg_holder'>
            <span className='msg'>{props.msg}</span>
        </div>
        <div className='pfp_holder'>
            <img src={props.pfp_url} alt="user pfp" />
            <span className='msg_time'>{props.time}</span>
        </div>
    </div>
  )
}
