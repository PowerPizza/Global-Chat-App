import './homePage.css'
import app_icon from '../../images/app_icon.png'
import { RefreshDouble, Search } from 'iconoir-react'
import { Link } from 'react-router-dom'
import ChatArea from '../chat_area/ChatArea'
import { useState } from 'react'
import LoadingCircle from '../loading_circle/LoadingCircle'
import NoLoginWin from './NoLoginWin'
import NoChatOpen from './NoChatOpen'

function UserChatElement(props) {
  return (
    <div className='user_chat_ele' onClick={props.onclick}>
      <img src={props.pfp_url} alt="User pfp" className='pfp'/>
      <div className='info'>
        <span className='username'>{props.username}</span>
        <span className={`status ${props.status}`}>{props.status}</span>
      </div>
      <span className='notification'>{props.messages_unread}</span>
    </div>
  )
}

export default function HomePage(props) {
  async function on_logout() {
    let http_resp = await fetch("/login/log_out", { method: "POST" });
    http_resp = await http_resp.json();
    if (http_resp.status === "success") {
      props.reload_users();
      props.get_login_creds();
    }
  }

  return (
    <div className='home_main_body'>
      <div className='home_content glass-light'>
        <div className='left_side glass-light'>
          <div className='left_side_header'>
            <img src={app_icon} alt="app icon" className='app_icon' />
            <h2 className='app_title'>Global Chat</h2>
            <svg className='menu_dot' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
          </div>
          <div className='search_area'>
            <Search width={20} height={20} strokeWidth={3} color='white' className='search_icon' />
            <input type="search" className='search_area' placeholder='Search User...' />
          </div>
          <div className='chat_list'>
            {props.available_users === null ?
              <LoadingCircle />
              :
              props.available_users.length ?
                props.available_users.map((ele, idx) => {
                  if (props.user_creds["_id"] === ele["_id"]) return null;
                  return <UserChatElement username={ele.username} messages_unread={0} pfp_url={ele["pfp_url"]} status={ele["status"] || "offline"} key={idx + "_usrr"} onclick={(!props.user_creds || !Object.keys(props.user_creds).length) ? ()=>{} : ()=>{props.switch_chat(ele)}}/>
                })
                :
                <span className='no_user'>No users are available yet.</span>
            }
          </div>
        </div>

        {(!props.user_creds || !Object.keys(props.user_creds).length) ?
          <NoLoginWin />
          :
          props.selected_chat ? 
            <ChatArea user_creds={props.user_creds} send_chat={props.send_chat} selected_chat={props.selected_chat} chats={props.chats} disable_send_btn={props.disable_send_btn} />
            :
            <NoChatOpen />
        }

        {(!props.user_creds || !Object.keys(props.user_creds).length) ?
          null :
          <div className='profile_info glass-light'>
            <img src={props.user_creds["pfp_url"]} alt="" className='pfp' />
            <span className='user_name'><span style={{ color: "#48cb03" }}>●</span> {props.user_creds["username"]}</span>
            <div className='btn_holder'>
              <button className='form_btn logout_btn' onClick={on_logout}>Logout</button>
            </div>
          </div>
        }
      </div>
    </div>
  )
}
