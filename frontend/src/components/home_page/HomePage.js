import './homePage.css'
import ChatArea from '../chat_area/ChatArea'
import NoLoginWin from './NoLoginWin'
import NoChatOpen from './NoChatOpen'
import RightProfilePanel from './RightProfilePanel'
import LeftMenuPanel from './LeftMenuPanel'
import { isObjectEmpty } from '../../other_functions/OtherFunctions'
import { useEffect, useState } from 'react'

export default function HomePage(props) {
  const [device_width, setDeviceWidth] = useState(document.documentElement.clientWidth);
  const [show_profile, setShowProfile] = useState(false); 

  useEffect(() => {
    window.onresize = window.onload = () => {
      setDeviceWidth(document.documentElement.clientWidth);
    }
  }, [])

  function switch_profile(){
    setShowProfile(!show_profile);
  }

  if (device_width < 650){
    return (
      <div className='home_main_body'>
        <div className='home_content glass-light'>
          {!show_profile && props.selected_chat ? 
              <ChatArea device_width={device_width} disable_send_btn={props.disable_send_btn} />
            : 
              show_profile ? 
                <RightProfilePanel device_width={device_width} switch_profile={switch_profile} />
                :
                <LeftMenuPanel device_width={device_width} on_click_profile={()=>{setShowProfile(!show_profile)}} />
          }
        </div>
      </div>
    )
  }

  return (
    <div className='home_main_body'>
      <div className='home_content glass-light'>
        <LeftMenuPanel device_width={device_width} on_click_profile={()=>{setShowProfile(!show_profile)}} />

        {
          device_width > 650 ?
            <>
                {
                isObjectEmpty(props.user_creds) ? 
                  <NoLoginWin />
                 :
                  props.selected_chat ?
                    <ChatArea device_width={device_width} disable_send_btn={props.disable_send_btn} />
                  :
                  show_profile && device_width < 920? 
                    <RightProfilePanel device_width={device_width} />
                    :
                    <NoChatOpen /> }
            </>
            : null
        }

        {device_width > 920 && !isObjectEmpty(props.user_creds) ?
          <RightProfilePanel device_width={device_width} />
          :
          null
        }
      </div>
    </div>
  )
}
