import { ImageUpload } from 'UiKit/Layouts/Elements/ImageUpload/ImageUpload'
import './CreateGroup.css'
import { Input } from 'UiKit/Layouts/Elements/Input/Input'
import { useDispatch } from 'react-redux'
import {SwichPickFriendsState  } from "State/toggle";


export const CreateGroup = ({onSubmit,SetImage})=>{
    const dispatch = useDispatch();
    return(
        <div className='create-group-container'>
            <div className='create-group-exit-container'>
            <img onClick={()=> dispatch(SwichPickFriendsState())} className="create-group-exit-btn" src="/chat-exitBtn.png" alt="" />
            </div>
            <div className='create-group-header'>Create a group!</div>
            <div className='group-name-container'>
                <Input title="Name" id='group-name-input' className='create-group-inputs' type="text" placeholder='Chose your group name...' />
            </div>
            <div className='discription-container'>
                <Input title="Description" id='discription-input' className='create-group-inputs' type="text" placeholder='Give the members a bit more information...' />
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