import axios from "axios";
import "./AddFriend.css";
import { Invitation } from "Components/Invitation/Invitation";
import ReactDOM from 'react-dom';
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { EmitSendInvitation } from "State/socket";



export const AddFriend = () => {
  const userDetails = useSelector((store)=> store.userDetails);
  const dispatch = useDispatch();
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
        },
      })
      .then((res) => {
        const foundedUsername = res.data.username;
        if (foundedUsername) {
          ReactDOM.render(
            <Invitation onClick={HandleSendInvitation}  userName={foundedUsername} />,
            resDiv
          );
        } else {
          const textDiv = React.createElement('div', {}, 'No results!');
          ReactDOM.render(textDiv, resDiv);
          ReactDOM.render(textDiv,resDiv);
        }
      })
      .catch((err) => console.log(err));
  };
  const HandleSendInvitation = async () =>{
    const targetName = document.querySelector('.text').textContent;
    dispatch(EmitSendInvitation({senderUsername: userDetails.username, targetUsername:targetName}));
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
