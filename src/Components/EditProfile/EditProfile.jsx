import { useDispatch, useSelector } from "react-redux";
import "./EditProfile.css";
import { SetEditProfileState } from "State/toggle";
import { ImageUpload } from "UiKit/Layouts/Elements/ImageUpload/ImageUpload";
import { useState } from "react";
import axios from "axios";

export const EditProfile = ({ state }) => {
  const dispatch = useDispatch();
  const userDetails = useSelector((store)=> store.userDetails);
  const [image,SetImage] = useState(null);

  const HandleImgClick = ()=>{
    const imageUploadDiv = document.querySelector('#edit-profile-image-upload');
    const imageUploadInput = imageUploadDiv.children[0];
    imageUploadInput.click();
  }

  const HandleEtitProfileSumbit = (event)=>{
    const status = event.target.querySelector('.edit-profile-status-input').value;
    const formData = new FormData();
    formData.append('image', image);
    formData.append('status', status);
    formData.append('username',userDetails.username);
    axios.post('/home/updateprofile',formData,{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  
  return state ? (
    <form onSubmit={HandleEtitProfileSumbit} className="edit-profile-container">
      <div className="edit-profile-exit-btn-container">
        <img onClick={()=> dispatch(SetEditProfileState(false))} className="edit-profile-exit-btn" src="/chat-exitBtn.png" alt="" />
      </div>
      <div className="edit-profile-pic-container">
        <img onClick={HandleImgClick} className="edit-profile-img" src={userDetails.img} alt="" />
        <ImageUpload SetImage={SetImage} id={"edit-profile-image-upload"}/>
      </div>
      <div className="edit-profile-status-container">
          <input minLength={0} maxLength={50} className="edit-profile-status-input" placeholder={userDetails.status} type="text" />
      </div>
      <div className="edit-profile-submit-btn-container">
          <input  value={"Submit"} type="submit" />
      </div>
    </form>
  ) : null;
};
