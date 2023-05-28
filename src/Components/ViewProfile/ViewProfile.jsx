import { useDispatch, useSelector } from 'react-redux'
import './ViewProfile.css'
import { SetViewProfileState } from 'State/toggle';

export const ViewProfile = ({state})=>{
    const viewProfile = useSelector((store)=> store.viewProfile);
    const dispatch = useDispatch();

    const HandleViewProfileExitBtn = ()=>{
        dispatch(SetViewProfileState(false))
    }

    return state ? (
        <div className='view-profile-container'>
            <img onClick={HandleViewProfileExitBtn} className='view-profile-exit-btn' src="/chat-exitBtn.png" alt="" />
            <div className='view-profile-pic-container'>
                <img className='view-profile-img' src={viewProfile.imgUrl} alt="" />
            </div>
            <div className='view-profile-username-container'>{viewProfile.username}</div>
            <div className='view-profile-status-container'>{'grgsetgstgg'}</div>
        </div>
    ): null
}