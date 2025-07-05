import './NoChatOpen.css'
import app_icon from '../../images/app_icon.png'

export default function NoChatOpen() {
  return (
      <div className='no_chat_body'>
        <img src={app_icon} alt="app icon" draggable={false} className='app_icon' />
        <h2 className='tag_line'>One World. One Chat.</h2>
        <span className='additional_msg'>Select any person from left side menu to begin chatting.</span>
    </div>
  )
}
