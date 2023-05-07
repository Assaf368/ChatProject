import axios from "axios";
import "./AddFriend.css";
import { Invitation } from "Components/Invitation/Invitation";
import ReactDOM from 'react-dom';
import React from "react";
import { useSelector } from "react-redux";



export const AddFriend = () => {
  const userDetails = useSelector((store)=> store.userDetails);
  const socket = useSelector((store)=> store.socket.socket);
  const toggle = useSelector((store => store.toggle));
  const state = toggle.addFriendState;
  

  const handleSearch = () => {
    const resDiv = document.querySelector('.results-of-search');
    const inputVal = document.querySelector(".input-of-addFreind").value;
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
        const {username, massage} = res.data;
        if(massage === 'already friends!' || username === userDetails.username){
          ReactDOM.render(
            <Invitation status={'View profile'} userName={username} />,
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
  const HandleViewProfile = ()=>{
    
  }
  const clearField = () => {
    document.querySelector(".input-of-addFreind").value = "";
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
      <h3>Add new friend</h3>
      <div className="inputs-container">
        <input
          className="input-of-addFreind"
          type="text"
          placeholder="UserName"
        />
        <button onClick={handleSearch} className="search-btn-of-addFriend">
          Search
        </button>
        <div className="results-of-search"></div>
      </div>
    </div>
  ) : null;
};
