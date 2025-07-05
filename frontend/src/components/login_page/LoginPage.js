import './loginPage.css'
import '../signup_page/signupPage.css'
import app_icon from '../../images/app_icon.png'
import { Link, Navigate } from 'react-router-dom'
import { useState } from 'react'

export default function LoginPage(props) {
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");

  function onGmailInput(ele){
    setGmail(ele.target.value);
  }
  function onPasswordInput(ele){
    setPassword(ele.target.value);
  }

  async function onSubmitLogin() {
    let to_send = {
      "gmail": gmail,
      "password": password
    }
    let http_resp = await fetch("/login/log_in", {method: "POST", body: JSON.stringify(to_send), headers: {"Content-Type": "application/json"}});
    http_resp = await http_resp.json();
    if (http_resp.status === "success") {
      props.createMsgBox("Logged in successfully.", "success");
      props.reload_users();
      props.get_login_creds();
    }
    else{
      props.createMsgBox(`Failed to login.\nError : ${http_resp.error}`, "error");
    }
  }

  if (props.user_creds && Object.keys(props.user_creds).length) {
    return (<Navigate to={"/"}/>)
  }

  return (
    <div className='signup_main_window'>
      <div className='app_icon_holder'>
        <img src={app_icon} alt="App icon" className='app_icon' draggable={false} />
        <h2 className='app_name'>Global Chat</h2>
      </div>
      <div className='form_area glass-light'>
        <h2 className='form_title'>Login</h2>
        <input type="email" placeholder='gmail' className='form_entry' onChange={onGmailInput} />
        <input type="password" placeholder='password' className='form_entry' onChange={onPasswordInput} />
        <span className='forgot_password'>Forgot password?</span>
        <button className='form_btn' onClick={onSubmitLogin}>Login</button>
        <span className='switch_signup'>Don't have an account? <Link style={{color: "#8c4eec", fontWeight: "600", textDecoration: "none"}} to={"/signup"}>Signup here</Link></span>
      </div>
    </div>
  )
}
