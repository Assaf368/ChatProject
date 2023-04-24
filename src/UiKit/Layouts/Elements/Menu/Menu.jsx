import { useEffect, useState } from "react";
import "./Menu.css";
import { useDispatch, useSelector } from "react-redux";
import { OnReceiveInvitation } from "State/socket";
import { SwichAddFriendState } from "State/toggle";
import { InviteConfirmation } from "Components/InviteConfirmation/InviteConfirmation";
import produce from "immer";
import axios from "axios";

export const Menu = () => {
  const dispatch = useDispatch();
  const [requests, SetRequests] = useState([]);
  const userDetails = useSelector((store) => store.userDetails);

  const handleReceiveInvitation = (username) => {
    SetRequests((requests) =>
      produce(requests, (draft) => {
        draft.push(
          <InviteConfirmation
            handleRejection={HandleRejection}
            handleAcception={HandleAcception}
            username={username}
          />
        );
      })
    );
  };

  useEffect(() => {
    dispatch(OnReceiveInvitation(handleReceiveInvitation));
  }, [dispatch]);

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
        targetUsername: userDetails.username,
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
        targetUsername: userDetails.username,
      })
      .then(() => {
        SetRequests((requests) => requests.filter((request) => request.props.username !== usernameVal));
      }).catch((err)=>{
        console.log(err);
      })
  };

  return (
    <div className="menu-container">
      <div className="btns-container">
        <h4 className="header">Menu</h4>
        <div className="btns">
          <button onClick={handleSwich} className="btn">
            Add friend
          </button>
          <button className="btn">Requests</button>
        </div>
      </div>
      <div className="req-container">
        <h4 className="header">Requests box</h4>
        <div className="requests">
          {requests.map((request) => (
            <div key={request.props.username}>{request}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
