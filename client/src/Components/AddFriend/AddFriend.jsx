import axios from "axios";
import "./AddFriend.css";
import { Invitation } from "Components/Invitation/Invitation";
import ReactDOM from 'react-dom';
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetViewProfileState, SwichAddFriendState } from "State/toggle";
import { SetViewProfileDetails } from "State/viewProfile";
import { Input } from "UiKit/Layouts/Elements/Input/Input";



export const AddFriend = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector((store)=> store.userDetails);
  const socket = useSelector((store)=> store.socket.socket);
  const toggle = useSelector((store => store.toggle));
  const state = toggle.addFriendState;
  const addFriendInputEl = useRef(null);
  

  const handleSearch = () => {
    const resDiv = document.querySelector('.results-of-search');
    const inputVal = addFriendInputEl.current.value;
    clearField();
    removeAllChildNodes(resDiv);
    axios
      .get("/findOne", {
        params: {
          username: inputVal,
          senderId: userDetails.id
        },
      })
      .then((res) => {
        const {username, massage,imgUrl,desc} = res.data;
        if(massage === 'already friends!' || username === userDetails.username){
          ReactDOM.render(
            <Invitation onClick={() =>HandleViewProfile(username,imgUrl,desc)}  status={'View profile'} userName={username} />,
            resDiv
          );
          return
        }
        if ( massage === 'success!') {
          ReactDOM.render(
            <Invitation status={'Send!'} onClick={HandleSendInvitation}  userName={username} />,
            resDiv
          );
          return

        } if(massage === 'couldnt find one!') {
          const textDiv = React.createElement('div', {}, 'No results!');
          ReactDOM.render(textDiv, resDiv);
          ReactDOM.render(textDiv,resDiv);
          return
        }if(massage === 'still waiting'){
          ReactDOM.render(
            <Invitation status={'Pending...'}   userName={username} />,
            resDiv
          );
          return
        }
      })
      .catch((err) => console.log(err));
  };
  const HandleSendInvitation = async () =>{
    const targetName = document.querySelector('.text').textContent;
    socket.emit("send_invitation", {
      senderUsername: userDetails.username,
      targetUsername: targetName,
    });
    const invitationBtn = document.querySelector('#invitation-btn')
    invitationBtn.textContent = 'Invitation sent!'
  }
  const HandleViewProfile = (username, imgUrl,desc)=>{
    dispatch(SetViewProfileDetails({username:username,imgUrl:imgUrl, desc:desc}));
    dispatch(SetViewProfileState(true));
  }
  const clearField = () => {
    addFriendInputEl.current.value = "";
  };
  function removeAllChildNodes(parent) {
    if (parent && parent.props && parent.props.children){
    React.Children.forEach(parent.props.children, (child) => {
      ReactDOM.unmountComponentAtNode(child);
    });
  }
  }

  return state ? (
    <div className="add-friend-container">
      <div className="add-friend-exit-btn-container">
        <img onClick={()=> dispatch(SwichAddFriendState())} className="edit-profile-exit-btn" src="/chat-exitBtn.png" alt="" />
      </div>
      <div className="add-friend-header">Add new friend</div>
      <div className="inputs-container">
        <Input
        id={"add-friend-serach-input"}
        title="Enter a username"
          ref={addFriendInputEl}
          type="text"
          placeholder="Your next friend is..."
        />
        <div className="Add-friend-btn-container">
          <button onClick={handleSearch} className="search-btn-of-addFriend">
            Search
          </button>
        </div>
 
      </div>
      <div className="results-of-search"></div>
    </div>
  ) : null;
};
