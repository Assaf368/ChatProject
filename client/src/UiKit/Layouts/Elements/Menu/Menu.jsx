import { useEffect, useRef, useState } from "react";
import "./Menu.css";
import { useDispatch, useSelector } from "react-redux";
import { SwichAddFriendState } from "State/toggle";
import { InviteConfirmation } from "Components/InviteConfirmation/InviteConfirmation";
import axios from "axios";

export const Menu = ({id}) => {
  const dispatch = useDispatch();
  const invitations = useSelector((store) => store.userDetails.invitations);
  const username = useSelector((store) => store.userDetails.username);
  const socket = useSelector((store)=> store.socket.socket);
  const [requests, SetRequests] = useState([]);

  const handleReceiveInvitation = (username) => {
    if(username){
      const updatedArray = [...requests]
      updatedArray.push(<InviteConfirmation handleAcception={HandleAcception} handleRejection={HandleRejection} username={username}/>)
      SetRequests(updatedArray);
    }
  };

  useEffect(()=>{
    if(invitations !== null){
      invitations.forEach((invitation)=>{
        handleReceiveInvitation(invitation.sender);
      })
    }
  },[invitations])

  socket.off('receive_invitation').on("receive_invitation", (data) => {
    handleReceiveInvitation(data)
  });

  const handleSwich = () => {
    dispatch(SwichAddFriendState());
  };

  const HandleAcception = (event) => {
    const inviteDiv = event.target.parentNode.parentNode;
    const usernameVal = inviteDiv.querySelector(
      ".username-container"
    ).textContent;
    axios
      .post("/home/accepted", {
        senderUsername: usernameVal,
        targetUsername: username,
      })
      .then(() => {
        SetRequests((requests) => requests.filter((request) => request.props.username !== usernameVal));
      }).catch((err)=>{
        console.log(err);
      })
  };

  const HandleRejection = (event) => {
    const inviteDiv = event.target.parentNode.parentNode;
    const usernameVal = inviteDiv.querySelector(
      ".username-container"
    ).textContent;
    axios
      .post("/home/rejected", {
        senderUsername: usernameVal,
        targetUsername: username,
      })
      .then(() => {
        SetRequests((requests) => requests.filter((request) => request.props.username !== usernameVal));
      }).catch((err)=>{
        console.log(err);
      })
  };

  return (
    <div id={id} className="menu-container">
      <div className="btns-container">
        <div className="header">Menu</div>
        <div className="btns">
          <button onClick={handleSwich} className="btn">
            Add friend
          </button>
        </div>
      </div>
      <div className="req-container">
        <div className="header">Requests box</div>
        <div className="requests">
          {requests? requests : null}
        </div>
      </div>
    </div>
  );
};
