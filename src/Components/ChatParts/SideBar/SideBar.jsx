import axios from "axios";
import { useEffect, useRef, useState} from "react";
import { Between } from "UiKit/Layouts/Line/Line";
import { RoomBlock } from "../RoomBlock/RoomBlock";
import "./SideBar.css";
import { useDispatch, useSelector } from "react-redux";
import { SetFriends, SetInvitations } from "State/userDetails";
import { SetEditProfileState, SwichPickFriendsState } from "State/toggle";
import {  AddChatToRedux, AddMassageToChat, SetSelectedChatId } from "State/onlineRooms";

export const SideBar = ({ id, userName }) => {
  const dispatch = useDispatch();
  const [clientRooms, SetClientRooms] = useState([]);
  const[unreadCounts, SetUnreadCounts] = useState([]);
  let previewChatsRef = useRef([]);
  let selectedId = useRef(null);
  const socket = useSelector((store) => store.socket.socket);
  const userDetails = useSelector((store)=> store.userDetails);

  const HandleSwichPickFriendsState = () => {
    dispatch(SwichPickFriendsState());
  };

  const HandleRoomClick = (roomId) => {

    SetUserUnreadMassagesCounter(roomId,0);
    let selected = null;
    axios
      .get("/home/getfullchat", { params: { roomId: roomId } })
      .then((res) => {
        selected = res.data.chat;
        dispatch(AddChatToRedux(selected));
        dispatch(SetSelectedChatId(selected._id));
        selectedId.current = selected._id;
      });
  };
  useEffect(() => {
    axios
      .get('/home/friendsdata',{
        params: {
          username: userName,
        }})
      .then((res) => {
        const {friends,roomsForShow,invitations} = res.data;
        dispatch(SetInvitations(invitations));
        dispatch(SetFriends(friends));
        if (roomsForShow) {
          previewChatsRef.current = roomsForShow;
          let counts = roomsForShow.map((room) => {
            return { roomId: room._id, unreadMassages: room.unreadMassagesCounter };
          });
          SetUnreadCounts(counts);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(()=>{
    let roomComponents = previewChatsRef.current.map((chat) => {
      return (
        <RoomBlock
          key={chat._id}
          unreadMassages={unreadCounts.find(count => count.roomId === chat._id).unreadMassages}
          roomId={chat._id}
          onClick={HandleRoomClick}
          name={chat.name}
          imgUrl={chat.img}
        />
      );
    });
    SetClientRooms(roomComponents);
  },[unreadCounts])



  const SetUserUnreadMassagesCounter = (roomId,newCount)=>{
    if( selectedId.current === null ||selectedId.current !== roomId){
      const index = unreadCounts.findIndex((count) => count.roomId === roomId);
      const updatedCounts = [...unreadCounts];
      if(newCount !== 0){
        updatedCounts[index].unreadMassages += newCount;
      } else{
        updatedCounts[index].unreadMassages  = 0;
      }
      SetUnreadCounts(updatedCounts);
    }
  }

  socket.off("receive_message").on("receive_message", (data) => {
    const { roomId,text,senderId,username } = data;
    SetUserUnreadMassagesCounter(roomId,1);
    dispatch(AddMassageToChat({text: text, senderId: senderId, roomId:roomId, username:username}));
  });

  return (
    <div id={id} className="sidebar-container">
      <div className="navbar">
        <Between>
          <div className="logo-container">
            <h4>W.o.C</h4>
            <img
              onClick={HandleSwichPickFriendsState}
              className="plus-img-btn"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiCueRC7FnT8HXDjBgnpiRreipmS9FOGKVLw&usqp=CAU"
              alt="Create room botton"
            />
          </div>
          <div className="user-details-container">
            <img onClick={() =>dispatch(SetEditProfileState(true))}
              id="img"
              src={userDetails.img}
              alt="user"
            />
            <div className="name-container">{userName}</div>
          </div>
        </Between>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="search for a chat..." />
        <button id="search-btn">
          {" "}
          <img
            id="search-img"
            src="https://www.freeiconspng.com/thumbs/search-icon-png/search-icon-png-5.png"
            alt=""
          />
        </button>
      </div>
      <div className="friends-container">
        <div className="friends">
          {clientRooms.length !== 0 ? (
            clientRooms
          ) : (
            <RoomBlock name={"World Of Chat"}></RoomBlock>
          )}
        </div>
      </div>
    </div>
  );
};
