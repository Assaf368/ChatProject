import { useDispatch, useSelector } from "react-redux";
import "./PickFriends.css";
import produce from "immer";
import { FriendSelector } from "Components/FriendSelector/FriendSelector";
import { useEffect, useState } from "react";
import axios from "axios";
import { CreateGroup } from "Components/CreateGroup/CreateGroup";
import { EmitCreateRoom } from "State/socket";

export const PickFriends = () => {
    const userDetails = useSelector((store) => store.userDetails);
    const toggle = useSelector((store) => store.toggle);
    const dispatch = useDispatch();
    const [usernames, SetUsernames] = useState([]);
    const [showGroupComp, SetShowGroupComp] = useState(false);
    const state = toggle.pickFriendsState;
    const friendsArray = userDetails.friends;
    let friendSelectorElements = null;

    useEffect(()=>{
        usernames.push(userDetails.username);
    },[])

  if (friendsArray) {
     friendSelectorElements = friendsArray.map((friend) => {
      return <FriendSelector SetUsernames={SetUsernames} username={friend.userName} />;
    });
  }

  const HandleCreateClick = ()=>{
    if(usernames.length === 1)
    {
      HandleCreatePrivateChat();
    }
    else{
      SetShowGroupComp(true);
    }
  }

  const HandleSubmitGroup = ()=>{
    const groupName = document.querySelector('#group-name-input').value;
    const desc = document.querySelector('#discription-input').value;
    const img = null;
    // axios.post('/home/createroom',{usernames:usernames,roomName:groupName,desc:desc,img:img}).catch(err => console.log(err));
    dispatch(EmitCreateRoom({usernames:usernames,roomName:groupName,desc:desc,img:img}));
    SetShowGroupComp(false);
    SetUsernames([]);
  }
  
  const HandleCreatePrivateChat = ()=>{
      
  }


  if(state && showGroupComp){
    return(
      <CreateGroup onSubmit={HandleSubmitGroup}></CreateGroup>
    )
  }
  if(state){
    return  (
      <div className="pick-friends-container">
        <div className="header-container">
          <h3 className="pick-friends-header">Create a room!</h3>
        </div>
        <div className="friends-list-container">
          <input
            className="pick-friends-search-input"
            type="text"
            placeholder="search..."
          />
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

