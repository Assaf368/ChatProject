import { ImageUpload } from 'UiKit/Layouts/Elements/ImageUpload/ImageUpload'
import './CreateGroup.css'

export const CreateGroup = ({onSubmit,SetImage})=>{
    return(
        <div className='create-group-container'>
            <div className='create-group-exit-container'>
                <img className='exit-btn-create-group' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReBKjYJhzB-lApuM67GyvTwhk6SFbRxHC70w&usqp=CAU" alt="exit btn" />
            </div>
            <div className='create-group-header'>Create a group!</div>
            <div className='group-name-container'>
                <input id='group-name-input' className='create-group-inputs' type="text" placeholder='Group name...' />
            </div>
            <div className='discription-container'>
                <input id='discription-input' className='create-group-inputs' type="text" placeholder='Description...' />
            </div>
            <div className='img-group-container'>
                <ImageUpload SetImage={SetImage}/>
            </div>
            <div className='submit-group-container'>
                <button onClick={onSubmit} className='submit-group-button'>Submit</button>
            </div>
        </div>
    )
}