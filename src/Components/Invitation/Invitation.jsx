import './Invitation.css'


export const Invitation = ({userName, onClick})=>{
    return(
        <div className='invitation-container'>
            <div className='text'>{userName}</div>
            <button id='invitation-btn' onClick={onClick}>Send invitation!</button>
        </div>
    )
}