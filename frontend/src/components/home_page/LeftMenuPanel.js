import "./leftMenuPanel.css"
import app_icon from '../../images/app_icon.png'
import { RefreshDouble, Search } from "iconoir-react";
import LoadingCircle from "../loading_circle/LoadingCircle";
import { useContext, useState } from "react";
import { SharedContext } from "../../contexts/SharedDataContext";
import { Link } from "react-router-dom";
import { isObjectEmpty } from '../../other_functions/OtherFunctions'

function UserChatElement(props) {
  return (
    <div className='user_chat_ele' onClick={props.onclick}>
      <img src={props.pfp_url} alt="User pfp" className='pfp' />
      <div className='info'>
        <span className='username'>{props.username}</span>
        <span className={`status ${props.status}`}>{props.status}</span>
      </div>
      <span className='notification'>{props.messages_unread}</span>
    </div>
  )
}

export default function LeftMenuPanel(props) {
  const shared_context = useContext(SharedContext);
    const [dot_menu_opened, setDotMenuOpened] = useState(false);
    const [logout_loader, setLogoutLoader] = useState(false);

    
    function toggle_dot_menu(){
        setDotMenuOpened(!dot_menu_opened);
    }

    function on_logout(){
      setLogoutLoader(true);
      shared_context.on_logout().then(()=>{
        setLogoutLoader(false);
        toggle_dot_menu();
      });
    }

  return (
    <div className='left_menu_body glass-light'>
      <div className='left_side_header'>
        <img src={app_icon} alt="app icon" className='app_icon' />
        <h2 className='app_title'>Global Chat</h2>
        {props.device_width < 920 && !isObjectEmpty(shared_context.user_creds)? 
          <span className="menu_dot">
            <svg onClick={toggle_dot_menu} className='menu_dot' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            {dot_menu_opened ? 
              <div className="menu_box">
                <span className="menu_opt" onClick={props.on_click_profile}>Profile</span>
                <span className="menu_opt" onClick={on_logout}>
                  Logout
                  {logout_loader ? 
                  <LoadingCircle color={"white"} width={20} height={20} />
                  : null}
                </span>
              </div>
          : null}
        </span>
        : null
        }
      </div>
      {isObjectEmpty(shared_context.user_creds) ? 
      <div className="no_login_btns">
        <Link to={"/login"}>
          <button className='form_btn opt_btn'>Login</button>
        </Link>
        <Link to={"/signup"}>
          <button className='form_btn opt_btn'>Signup</button>
        </Link>
      </div> : null
      }
      
      <div className='search_area'>
        <Search width={20} height={20} strokeWidth={3} color='white' className='search_icon' />
        <input type="search" className='search_area' placeholder='Search User...' />
      </div>
      <div className='chat_list'>
        {shared_context.available_users === null ?
          <LoadingCircle />
          :
          shared_context.available_users.length ?
            shared_context.available_users.map((ele, idx) => {
              if (shared_context.user_creds["_id"] === ele["_id"]) return null;
              return <UserChatElement username={ele.username} messages_unread={0} pfp_url={ele["pfp_url"]} status={ele["status"] || "offline"} key={idx + "_usrr"} onclick={(!shared_context.user_creds || !Object.keys(shared_context.user_creds).length) ? () => { } : () => { shared_context.switch_chat(ele) }} />
            })
            :
            <span className='no_user'>No users are available yet.</span>
        }
      </div>
    </div>
  )
}
