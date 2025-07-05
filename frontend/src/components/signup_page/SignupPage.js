import './signupPage.css'
import app_icon from '../../images/app_icon.png'
import { Link, Navigate } from 'react-router-dom'
import { useState } from 'react'

export default function SignupPage(props) {
  const [username, setUsername] = useState("");
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [pfp_url, setPfpUrl] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  function onUsernameInput(ele){
    setUsername(ele.target.value);
  }

  function onGmailInput(ele){
    setGmail(ele.target.value);
  }

  function onPasswordInput(ele){
    setPassword(ele.target.value);
  }

  function onPfpUrlInput(ele){
    if (ele.target.value.length >= 350){
      props.createMsgBox("Too long image URL\nImage URL must be between 350 characters.", "warn");
      return
    }
    setPfpUrl(ele.target.value);
  }

  function onAcceptTerms(ele){
    setAcceptedTerms(ele.target.checked);
  }

  async function onCreateAccount(){
    if (!username || !gmail || !password){
      props.createMsgBox("All fields are required. Please make sure to fill in every entry.", "error");
      return;
    }
    if (!gmail.endsWith("@gmail.com")){
      props.createMsgBox("Invalid email address – it must end with @gmail.com", "error");
      return;
    }

    let to_send = {
      "username": username,
      "gmail": gmail,
      "password": password,
      "pfp_url": pfp_url+"#"
    }
    let http_resp = await fetch("/signup/add_user", {method: "POST", body: JSON.stringify(to_send), headers: {"Content-Type": "application/json"}});
    http_resp = await http_resp.json();
    if (http_resp.status === "success"){
      props.createMsgBox("Signed up successfully.", "success");
      props.reload_users();
      props.get_login_creds();
    }
    else if (http_resp.status === "failed" && http_resp.error === "ALREADY_EXIST"){
      props.createMsgBox(`Signup failed — An account with the provided Gmail address already exists.`, "error");
    }
    else{
      props.createMsgBox(`Signup failed.\nError : ${http_resp["error"]}`, "error");
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
        <h2 className='form_title'>Sign up</h2>
        <input type="text" placeholder='username' className='form_entry' onChange={onUsernameInput} />
        <input type="email" placeholder='gmail' className='form_entry' onChange={onGmailInput} />
        <input type="password" placeholder='password' className='form_entry' onChange={onPasswordInput} />
        <div className='pfp_entry'>
          <img src={pfp_url+"#"} alt="No pfp" draggable={false} />
          <input type="text" placeholder='Image URL' className='form_entry' onChange={onPfpUrlInput} />
        </div>
        {acceptedTerms ?
          <button className='form_btn' onClick={onCreateAccount}>Create Account</button>
        :
          <button className='form_btn disabled' disabled>Create Account</button>
        }
        <span className='terms_n_conditions'>
          <input type="checkbox" name='agree' onChange={onAcceptTerms} />
          <label htmlFor="agree">Agree to the terms of use & privacy policy.</label>
        </span>
        <span className='switch_login'>Already have an account? <Link style={{color: "#8c4eec", fontWeight: "600", textDecoration: "none"}} to={"/login"}>Login here</Link></span>
      </div>
    </div>
  )
}
