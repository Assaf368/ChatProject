import axios from "axios";
import { useEffect, useRef, useState} from "react";
import { Between } from "UiKit/Layouts/Line/Line";
import { RoomBlock } from "../RoomBlock/RoomBlock";
import "./SideBar.css";
import { useDispatch, useSelector } from "react-redux";
import { SetFriends } from "State/userDetails";
import { SwichPickFriendsState } from "State/toggle";
import {  SetSelectedChat } from "State/onlineRooms";

export const SideBar = ({ id, userName }) => {
  const dispatch = useDispatch();
  const [clientRooms, SetClientRooms] = useState([]);
  const[unreadCounts, SetUnreadCounts] = useState([]);
  const selectedChat = useSelector((store)=> store.onlineRooms.selectedChat);
  let previewChatsRef = useRef([]);

  const socket = useSelector((store) => store.socket.socket);

  const HandleSwichPickFriendsState = () => {
    dispatch(SwichPickFriendsState());
  };

  const HandleRoomClick = (roomId) => {
    const selectedChatId = roomId;
    SetUserBlockUnreadMassagesCounter(roomId,0);
    let selected = null;
    axios
      .get("/home/getfullchat", { params: { roomId: selectedChatId } })
      .then((res) => {
        selected = res.data.chat;
        dispatch(SetSelectedChat({ selectedChat: selected }));
      });
  };
  useEffect(() => {
    axios
      .get('/home/friendsdata',{
        params: {
          username: userName,
        }})
      .then((res) => {
        const friend = res.data.friends;
        const roomsForShow = res.data.roomsForShow;
        dispatch(SetFriends(friend));
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



  const SetUserBlockUnreadMassagesCounter = (roomId,newCount)=>{
    if( selectedChat === null ||selectedChat._id !== roomId){
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
    const { roomId } = data;
    SetUserBlockUnreadMassagesCounter(roomId,1);
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
            <img
              id="img"
              src="https://static-hotsites.edufindme.com/tsw-events/46af4ebddab82f4e20774fac3bf892b98408bc82/static/img/hub/img/img-student-2.png"
              alt="user"
            />
            <div className="name-container">{userName}</div>
          </div>
        </Between>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="search for a friend..." />
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
