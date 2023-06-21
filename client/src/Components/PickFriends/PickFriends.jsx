import { useDispatch, useSelector } from "react-redux";
import "./PickFriends.css";
import { FriendSelector } from "Components/FriendSelector/FriendSelector";
import { useEffect, useState } from "react";
import axios from "axios";
import { CreateGroup } from "Components/CreateGroup/CreateGroup";
import { RefreshSideBar, SwichPickFriendsState } from "State/toggle";

export const PickFriends = () => {
  const dispatch = useDispatch(); 
    const userDetails = useSelector((store) => store.userDetails);
    const toggle = useSelector((store) => store.toggle);
    const [usernames, SetUsernames] = useState([]);
    const [showGroupComp, SetShowGroupComp] = useState(false);
    const[image, SetImage] = useState(null);
    const [isLoading,SetIsLoading] = useState(false);
    const state = toggle.pickFriendsState;
    const friendsArray = userDetails.friends;
    let friendSelectorElements = null;

    useEffect(()=>{
        usernames.push(userDetails.username);
    },[])

  if (friendsArray) {
     friendSelectorElements = friendsArray.map((friend,index) => {
      return <FriendSelector key={index} usernames ={usernames} SetUsernames={SetUsernames} username={friend.userName} />;
    });
  }

  const HandleCreateClick = ()=>{
    if(usernames.length === 2)
    {
      HandleCreatePrivateChat();
    }
    else{
      SetShowGroupComp(true);
    }
  }

  const HandleSubmitGroup = ()=>{
    SetIsLoading(true)
    const groupName = document.querySelector('#group-name-input').value;
    const desc = document.querySelector('#discription-input').value;
    const formData = new FormData();
    formData.append('image',image);
    formData.append('groupName',groupName);
    formData.append('desc', desc);
    formData.append('usernames',usernames)
    axios.post('/home/createroom',formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(()=>{
      SetIsLoading(false)
      dispatch(SwichPickFriendsState());
      SetShowGroupComp(false);
      SetUsernames([]);
      dispatch(RefreshSideBar());
    })
  }
  
  const HandleCreatePrivateChat = ()=>{
    const formData = new FormData();
    formData.append('usernames',usernames)
    axios.post('/home/createroom', {usernames: usernames})
    .then(()=>{
      dispatch(SwichPickFriendsState());
      SetUsernames([]);
      dispatch(RefreshSideBar());
    })
  }


  if(state && showGroupComp){
    return(
      <CreateGroup SetImage={SetImage} isLoading={isLoading} onSubmit={HandleSubmitGroup}></CreateGroup>
    )
  }
  if(state){
    return  (
      <div className="pick-friends-container">
        <div className="header-container">
          <div className="pick-friends-header">Create a room!</div>
        </div>
        <div className="friends-list-container">
          <div className="friends-list">{friendSelectorElements}</div>
        </div>
        <div className="pick-friends-btn-container">
          <button className="create-room-btn" onClick={HandleCreateClick}>
            Create
          </button>
        </div>
      </div>
    );
  }
}

