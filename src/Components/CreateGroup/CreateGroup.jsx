import './CreateGroup.css'

export const CreateGroup = ({onSubmit})=>{
    return(
        <div className='create-group-container'>
            <div className='create-group-exit-container'>
                <img className='exit-btn-create-group' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReBKjYJhzB-lApuM67GyvTwhk6SFbRxHC70w&usqp=CAU" alt="exit btn" />
            </div>
            <div className='group-name-container'>
                <input id='group-name-input' className='create-group-inputs' type="text" placeholder='Group name...' />
            </div>
            <div className='discription-container'>
                <input id='discription-input' className='create-group-inputs' type="text" placeholder='Description...' />
            </div>
            <div className='img-group-container'>
                <label className='group-label' htmlFor="">Choose an image:</label>
                <button className='browse-btn'>Browse</button>
            </div>
            <div className='submit-group-container'>
                <button onClick={onSubmit} className='submit-group-button'>Submit</button>
            </div>
        </div>
    )
}