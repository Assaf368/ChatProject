import { useDispatch, useSelector } from "react-redux";
import "./EditProfile.css";
import { SetEditProfileState } from "State/toggle";
import { ImageUpload } from "UiKit/Layouts/Elements/ImageUpload/ImageUpload";
import { useRef, useState } from "react";
import axios from "axios";
import { Input } from "UiKit/Layouts/Elements/Input/Input";
import { Loading } from "UiKit/Layouts/Elements/Loading/Loading";

export const EditProfile = ({ state }) => {
  const dispatch = useDispatch();
  const userDetails = useSelector((store)=> store.userDetails);
  const [image,SetImage] = useState(null);
  const [isLoading,SetIsLoading]=useState(false);
  const statusInputEl = useRef(null);

  const HandleImgClick = ()=>{
    const imageUploadDiv = document.querySelector('#edit-profile-image-upload');
    const imageUploadInput = imageUploadDiv.children[0];
    imageUploadInput.click();
  }

  const HandleEtitProfileSumbit = (event)=>{
    event.preventDefault();
    SetIsLoading(true);
    const status = statusInputEl.current.value;
    const formData = new FormData();
    formData.append('image', image);
    formData.append('status', status);
    formData.append('username',userDetails.username);
    axios.post('/home/updateprofile',formData,{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(()=>{
      window.location.reload();
    })
  }

  if(isLoading === false){
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
            <Input ref={statusInputEl} id={"edit-profile-status-input"} title="Status:" minLength={0} maxLength={50} className="edit-profile-status-input" placeholder={userDetails.status} type="text" />
        </div>
        <div className="edit-profile-submit-btn-container">
            <input className="edit-profile-submit-btn"  value={"Submit"} type="submit" />
        </div>
      </form>
    ) : null;
  }else{
    return <Loading/>
  }
  
};
