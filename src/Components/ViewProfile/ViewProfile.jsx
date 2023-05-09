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
            <img onClick={HandleViewProfileExitBtn} className='view-profile-exit-btn' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReBKjYJhzB-lApuM67GyvTwhk6SFbRxHC70w&usqp=CAU" alt="" />
            <div className='view-profile-pic-container'>
                <img className='view-profile-img' src={viewProfile.imgUrl} alt="" />
            </div>
            <div className='view-profile-username-container'>{viewProfile.username}</div>
            <div className='view-profile-status-container'>{'grgsetgstgg'}</div>
        </div>
    ): null
}