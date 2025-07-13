import { useContext, useState } from 'react';
import './rightProfilePanel.css'
import LoadingCircle from '../loading_circle/LoadingCircle';
import { SharedContext } from '../../contexts/SharedDataContext';
import { ArrowLeft } from 'iconoir-react';

export default function RightProfilePanel(props) {
  const [loggingOut, setLoggingOut] = useState(false);
  const shared_data = useContext(SharedContext);

  function on_logout() {
    setLoggingOut(true);
    shared_data.on_logout().then(()=>{
      setLoggingOut(false);
    })
  }

  return (
    <div className='profile_info_body glass-light'>
      <ArrowLeft width={30} height={30} color='white' className='go_back' onClick={props.switch_profile} />
      <img src={shared_data.user_creds["pfp_url"]} alt="user_pfp" className='pfp' draggable={false} />
      <span className='user_name'><span style={{ color: "#48cb03" }}>●</span> {shared_data.user_creds["username"]}</span>
      <div className='btn_holder'>
        <button className='form_btn logout_btn' onClick={on_logout}>
          Logout
          {loggingOut ?
            <span>
              <LoadingCircle color="white" />
            </span> : null}
        </button>
      </div>
    </div>
  )
}
