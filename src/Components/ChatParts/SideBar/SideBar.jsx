
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Between } from 'UiKit/Layouts/Line/Line'
import { RoomBlock } from '../RoomBlock/RoomBlock'
import './SideBar.css'
import { useDispatch, useSelector} from 'react-redux'
import { SetFriends } from 'State/userDetails'
import { SwichPickFriendsState } from 'State/toggle'
import { OnCreateRoomClient } from 'State/socket'
import { AddChatToRedux, SetSelectedChat } from 'State/onlineRooms'

export const SideBar = ({id,userName})=>{
  const dispatch = useDispatch();
  const[clientRooms,SetClientRooms] = useState([]);
  const HandleSwichPickFriendsState = () =>{
    dispatch(SwichPickFriendsState());
  }

  const HandleRoomClick = (roomId)=>{
    const selectedChatId = roomId;
    let selectedChat = null;
    axios.get('/home/getfullchat',{params:{roomId: selectedChatId}}).then((res)=>{
      selectedChat = res.data.chat;
      dispatch(SetSelectedChat({selectedChat: selectedChat}));
    })
  }
  useEffect(()=>{
    axios.get('/home/friendsdata',{ params: {
      username: userName
    }, }).then((res)=>{
        const friend = res.data.friends;
        const roomsForShow = res.data.roomsForShow;
        dispatch(SetFriends(friend));
        if(roomsForShow){
          let roomComponents = roomsForShow.map((room) =>{
            return <RoomBlock key={room._id} roomId={room._id}  onClick={HandleRoomClick} name={room.name}  imgUrl={room.img} />
          })
          SetClientRooms(roomComponents);
        }
    }).catch((err)=>{
      console.log(err);
    })
  },[])

  const HandleAddRoom = (data)=>{
    const{ roomName,img,roomId} =data;
    clientRooms.push(<RoomBlock key={roomId} roomId={roomId}  name={roomName}  imgUrl={img}/>);
    SetClientRooms(clientRooms);
    dispatch(AddChatToRedux(data));
  }

  useEffect(() => {
    dispatch(OnCreateRoomClient(HandleAddRoom));
  }, [dispatch]);


  

    return(
        <div id={id} className='sidebar-container'>
            <div className='navbar'>
                <Between>
                  <div className='logo-container'>
                    <h4>W.o.C</h4>
                    <img onClick={HandleSwichPickFriendsState} className='plus-img-btn' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiCueRC7FnT8HXDjBgnpiRreipmS9FOGKVLw&usqp=CAU" alt="Create room botton" />
                  </div>
                  <div className='user-details-container'>
                    <img id='img' src="https://static-hotsites.edufindme.com/tsw-events/46af4ebddab82f4e20774fac3bf892b98408bc82/static/img/hub/img/img-student-2.png" alt="user" />
                    <div  className='name-container'>{userName}</div>
                  </div>
                </Between>  
            </div>
            <div className='search-bar'>
                <input type="text" placeholder='search for a friend...' />
                <button id='search-btn'> <img id='search-img' src="https://www.freeiconspng.com/thumbs/search-icon-png/search-icon-png-5.png" alt="" /></button>
            </div>
            <div className='friends-container'>
              <div className='friends'>
                  {clientRooms.length !== 0 ? clientRooms : <RoomBlock name={"World Of Chat"}></RoomBlock>}
              </div>
            </div>
            
        </div>

    )
}