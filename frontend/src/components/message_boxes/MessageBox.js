import { CheckCircle, InfoCircle, WarningCircle, WarningTriangle, Xmark } from 'iconoir-react';
import './messageBox.css'

export default function MessageBox(props) {
    let icon_ = null;
    let color_ = "";
    switch (props.type) {
        case "error":
            icon_ = <WarningCircle color='#e84c3d' className='repr_icon' />
            color_ = "#e84c3d";
            break;
        case "info":
            icon_ = <InfoCircle color='#3598db' className='repr_icon' />
            color_ = "#3598db";
            break;
        case "warn":
            icon_ = <WarningTriangle color='#f0b849' className='repr_icon' />
            color_ = "#f0b849";
            break;
        default:
            icon_ = <CheckCircle color='#4cd137' className='repr_icon' />
            color_ = "#4cd137";
    }
  return (
    <div className='msg_main_body glass' style={{boxShadow: "0px 0px 2px 1px "+color_}}>
        {icon_}
        <div className='msg' style={{color: color_}}>
            <span>
                {props.msg}
            </span>
        </div>
        <Xmark color={color_} className='close_icon' onClick={props.on_close}/>
    </div>
  )
}
