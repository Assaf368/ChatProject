import {Line} from 'UiKit/Layouts/Line/Line'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Dropdown } from '../Dropdown/Dropdown'
import { SwichAddFriendState } from 'State/toggle'
import { useEffect, useState } from 'react'
import { InviteConfirmation } from 'Components/InviteConfirmation/InviteConfirmation'
import axios from 'axios'

const Navbar = () => {
  const toggle = useSelector((store)=> store.toggle);
  const socket = useSelector((store)=> store.socket.socket);
  const invitations = useSelector((store) => store.userDetails.invitations);
  const username = useSelector((store) => store.userDetails.username);
  const [requests, SetRequests] = useState([]);
  const dispatch = useDispatch();

  const HandleLogOut = ()=>{
    socket.disconnect();
    sessionStorage.clear();
  }

  const HandleAddFriendSwichState = () => {
    dispatch(SwichAddFriendState());
  };


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

  useEffect(()=>{
    if(socket !== null){
      socket.off('receive_invitation').on("receive_invitation", (data) => {
        handleReceiveInvitation(data)
      });
    }
  },[socket])
 


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


  if(!toggle.chatState)
  {
  return (
    <nav id="navbar">
        <Line addClass={"navbar-line"} >
            <h2>World Of Chat</h2>
            <div className='disconnected-links'>
                <Link className="link login-btn" to='/login'>Log In</Link>
                <Link className="link register-btn" to='/'>Register</Link>
            </div>
        </Line>
    </nav>
  )
  }
  else{
    return (
      <nav id="navbar">
          <Line addClass={"navbar-line"} >
              <div className='navbar-logo'>World Of Chat</div>
              <div className='dropdowns-container'>
                <Dropdown id={"menu-dropdown"} header={'Menu'}><button className='menu-toggle-btns' onClick={HandleAddFriendSwichState}>Add Friend</button></Dropdown>
                <Dropdown indicator={ invitations.length === 0 ? false : true} id={"requests-dropdown"} header={'Reqests'}>{requests? requests : 'gfrhger'}</Dropdown>
              </div>
              <div className='connected-links'>
                  <Link  onClick={HandleLogOut} className="link logout-btn" to='/login'>Log Out</Link>
              </div>
          </Line>
      </nav>
    )
  }
}

export default Navbar