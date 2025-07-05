import './noLoginWin.css'
import app_icon from '../../images/app_icon.png'
import { Link } from 'react-router-dom'

export default function NoLoginWin() {
  return (
    <div className='no_login_body'>
        <img src={app_icon} alt="app icon" draggable={false} className='app_icon' />
        <h2 className='tag_line'>One World. One Chat.</h2>
        <span className='msg'>Log in or sign up now to start chatting with the world.</span>
        <br />
        <Link to={"/signup"}>
            <button className='form_btn opt_btn'>Signup</button>
        </Link>
        <h2 style={{ margin: "0px", fontWeight: "600" }}>OR</h2>
        <Link to={"/login"}>
            <button className='form_btn opt_btn'>Login</button>
        </Link>
    </div>
  )
}
