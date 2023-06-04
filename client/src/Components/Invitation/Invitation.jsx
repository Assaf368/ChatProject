import './Invitation.css'


export const Invitation = ({userName, onClick,status})=>{
    return(
        <div className='invitation-container'>
            <div className='text'>{userName}</div>
            <button id='invitation-btn' onClick={onClick}>{status}</button>
        </div>
    )
}