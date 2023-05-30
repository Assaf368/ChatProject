import axios from "axios";
import { useEffect, useRef, useState} from "react";
import { Between } from "UiKit/Layouts/Line/Line";
import { RoomBlock } from "../RoomBlock/RoomBlock";
import "./SideBar.css";
import { useDispatch, useSelector } from "react-redux";
import { SetFriends, SetInvitations } from "State/userDetails";
import { SetEditProfileState, SwichPickFriendsState } from "State/toggle";
import {  AddChatToRedux, AddMassageToChat, SetRoomsForShowRedux, SetSelectedChatId } from "State/onlineRooms";
import { enableMapSet } from "immer";

export const SideBar = ({ id, userName }) => {
  const dispatch = useDispatch();
  const [clientRooms, SetClientRooms] = useState([]);
  const[unreadCounts, SetUnreadCounts] = useState([]);
  let previewChatsRef = useRef([]);
  let selectedId = useRef(null);
  const socket = useSelector((store) => store.socket.socket);
  const userDetails = useSelector((store)=> store.userDetails);
  const chatsOnRedux = useSelector((store)=> store.onlineRooms.chats);
  const roomsForShowRedux = useSelector((store)=> store.onlineRooms.roomsForShow);

  const HandleSwichPickFriendsState = () => {
    dispatch(SwichPickFriendsState());
  };

  const HandleSearch = (value)=>{
    const chars = value.split('');
    let updatedClientRooms = []
    if(value === ''){
      SetClientRooms(roomsForShowRedux);

    }else{
      if(clientRooms!== null){
         updatedClientRooms = clientRooms.map((room)=>{
          if(room !== null && room !== undefined){
            let passesTest = true;
            for (let index = 0; index < chars.length; index++) {
              if(room.props.name.includes(chars[index].toString())||room.props.name.includes(chars[index].toLowerCase())){
                passesTest = true
              }else{
                passesTest = false;
              }
            }
            if(passesTest){
              return room
            }else{
              return null
            }
          }
        })
      }
          SetClientRooms(updatedClientRooms);
      }
    }

  const HandleRoomClick = (roomId,target) => {
    SetUserUnreadMassagesCounter(roomId,0);
    let selected = null;
    const reduxChat = chatsOnRedux.find(chat => chat._id === roomId);
    if(reduxChat === undefined){
      axios
      .get("/home/getfullchat", { params: { roomId: roomId, target: target } })
      .then((res) => {
        selected = res.data.chat;
        dispatch(AddChatToRedux(selected));
        dispatch(SetSelectedChatId(selected._id));
        selectedId.current = selected._id;
      });
    }else{
      selected = reduxChat;
      dispatch(SetSelectedChatId(selected._id));
      selectedId.current = selected._id;
    }
    let searchInput = document.querySelector('.side-bar-serach-input');
    searchInput.value = '';
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

      return () => {
        dispatch(SetSelectedChatId(null));
      };
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
    dispatch(SetRoomsForShowRedux(roomComponents));
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
              src="Chat-plusBtn.png"
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
        <input className="side-bar-serach-input" onInput={(e) => {
                  HandleSearch(e.target.value);
                }} 
                type="text" placeholder="search for a chat..." />
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
