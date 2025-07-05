import { RefreshDouble } from 'iconoir-react'
import './loadingCircle.css'

export default function LoadingCircle(props) {
    return (
        <div className='loading_circle_body'>
            <RefreshDouble width={30} height={30} color={props.color || "#6836c9"} />
        </div>
    )
}