import './signupPage.css'
import app_icon from '../../images/app_icon.png'
import { Link, Navigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import LoadingCircle from '../loading_circle/LoadingCircle';
import { isObjectEmpty } from '../../other_functions/OtherFunctions'
import { CameraSolid, Eye, EyeClosed } from 'iconoir-react';
import CountryCodeJson from '../../datasets/CountryCodes.json';
import ApiClient from '../../api/api-client';
import { SharedContext } from '../../contexts/SharedDataContext';

export default function SignupPage(props) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [pfpFile, setPfpFile] = useState(null);
  const [pfpUrl, setPfpUrl] = useState("");

  const [countryCodeList, setCountryCodeList] = useState([]);
  const [countryList, setCountryList] = useState([]);

  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const shared_data = useContext(SharedContext);

  function onPfpUrlInput(ele){
    if (ele.target.value.length >= 350){
      props.createMsgBox("Too long image URL\nImage URL must be between 350 characters.", "warn");
      return
    }
    setPfpUrl(ele.target.value);
    setPfpFile(null);
  }

  function onPfpImagePaste(event){
    const items = (event.clipboardData || event.originalEvent?.clipboardData).items;
    for (const item of items) {
      if (item.type.indexOf("image") >= 0) {
        const file_blob = item.getAsFile();
        setPfpFile(file_blob);
      }
    }
  }

  function onChoosePfpFile() {
    const file_input = document.createElement("input");
    file_input.type = 'file';
    file_input.onchange = () => {
      setPfpFile(file_input.files[0]);
      setPfpUrl('');
    }
    file_input.click();
  }

  async function onCreateAccount(event){
    event.preventDefault();
    event.stopPropagation();

    const form = document.getElementById('signup-form');
    const form_data = new FormData(form);
    let data = Object.fromEntries(form_data.entries());
    data.termsAccepted = acceptedTerms;
    data.age = Number(data.age);
    console.log(data)

    const response = await ApiClient.post("/signup/add-user", data);
    console.log(response);
    if (response?.success) {
      shared_data.create_msg_box("Account has been created successfully.", "success");
    }
    else {
      shared_data.create_msg_box(response.error, "error");
    }
    /*
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
      "pfp_url": pfpUrl+"#"
    }
    setIsLogin(true);
    let http_resp = await fetch("/signup/add-user", {method: "POST", body: JSON.stringify(to_send), headers: {"Content-Type": "application/json"}});
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
    setIsLogin(false);
    */
  }

  useEffect(()=>{
    setCountryCodeList(
      [...CountryCodeJson.map(item => Number(item.dial_code)).sort((a, b) => a - b).map((dial_code, idx) => 
        <option value={dial_code} key={"cc-"+idx}>
          +{dial_code}
        </option>)
      ]
    );

    setCountryList([...CountryCodeJson.map((item, idx) => <option value={item.name} key={`country-${idx}`}>{item.name}</option>)]);
  }, []);

  if (!isObjectEmpty(props.user_creds)) {
    return (<Navigate to={"/"}/>)
  }

  return (
    <div className='signup_main_window'>
      <div className='app_icon_holder'>
        <img src={app_icon} alt="App icon" className='app_icon' draggable={false} />
        <h2 className='app_name'>Global Chat</h2>
      </div>

      <form className='form_area glass-light' id='signup-form' onSubmit={onCreateAccount}>
        <h2 className='form_title'>Sign up</h2>

        <input type="text" name="username" placeholder='Username*' className='form_entry' required tabIndex={0} />

        <input type="email" name="gmail" placeholder='Gmail*' className='form_entry' required tabIndex={1} />

        <div className='form-row password'>
          <input type={showPassword ? "text" : "password"} name="password" placeholder='Password*' className='form_entry' required tabIndex={2} />
          {showPassword ? 
            <Eye width={25} height={25} color='white' className='eye-icon' onClick={()=>{setShowPassword(false)}} />
          :
            <EyeClosed width={25} height={25} color='white' className='eye-icon' onClick={()=>{setShowPassword(true)}}/>
          }
        </div>

        <div className='form-grid'>
          <input type="number" name="age" placeholder='Age' className='form_entry' min={1} max={200} tabIndex={3} />

          <select name="gender" className='form_select' defaultValue={'gender'} required tabIndex={4}>
            <option value="gender" disabled>Gender*</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="rather-not-say">Rather Not Say</option>
            <option value="others">Others</option>
          </select>

          <select name="countryCode" className='form_select' tabIndex={5} >
            {countryCodeList}
          </select>

          <input type="number" name="phoneNumber" placeholder='Ph. No.' className='form_entry' tabIndex={6} />

          <select name="country" className='form_select' defaultValue={""} required tabIndex={7} >
            <option value={""} disabled>Country*</option>
            {countryList}
          </select>
        
          <input type="text" name="city" placeholder='City' className='form_entry' tabIndex={8} />
        </div>

        <div className='form-row pfp-entry'>
          <div className='image-select' onClick={onChoosePfpFile}>
            <img src={(pfpFile ? URL.createObjectURL(pfpFile) : pfpUrl)+"#"} alt="No pfp" draggable={false} />
            <CameraSolid width={30} height={30} className='cam-icon' />
          </div>
          <input type="text" name='pfpUrl' placeholder='Pase image, gif or url' className='form_entry' onChange={onPfpUrlInput} onPaste={onPfpImagePaste} value={pfpUrl || ''} tabIndex={9} />
        </div>

        <div className='terms_n_conditions'>
          <input type="checkbox" name='termsAccepted' onChange={(eve)=>{setAcceptedTerms(eve.target.checked)}} required tabIndex={10} />
          <label htmlFor="agreeTerms">Agree to the terms of use & privacy policy.</label>
        </div>

        <button className='form_btn' type='submit' tabIndex={11}>
            Create Account
            {isLogin ?
            <span>
              <LoadingCircle color="white" />
            </span> : null
            }
        </button>
        
        <span className='switch_login'>Already have an account? <Link style={{color: "#8c4eec", fontWeight: "600", textDecoration: "none"}} to={"/login"}>Login here</Link></span>
        <br />
      </form>
    </div>
  )
}
