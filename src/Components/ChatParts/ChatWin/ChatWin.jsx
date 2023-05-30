import { Between, Line } from "UiKit/Layouts/Line/Line";
import { Massage } from "../massage/Massage";
import "./ChatWin.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { MyMassage } from "../MyMassage/MyMassage";
import { ImageUpload } from "UiKit/Layouts/Elements/ImageUpload/ImageUpload";


export const WinChat = ({ id }) => {
  const selectedChatId = useSelector((store)=> store.onlineRooms.selectedChatId);
  const selectedChat = useSelector(store => store.onlineRooms.chats.find(chat=> chat._id === store.onlineRooms.selectedChatId));
  const socket = useSelector((store)=> store.socket.socket);
  const userDetails = useSelector((store)=> store.userDetails);


  const HandleSendMassage = ()=>{
    const inputText = document.querySelector('.text-massage-input');
    const text = inputText.value;
    inputText.value = '';
    if(text !== ''){
      socket.emit("send_massage", {
        text:text ,
        roomId:selectedChat._id,
        members: selectedChat.members,
        senderId: userDetails.id
      });
    }
  }

  const HandleKeyDown = (event)=>{
    if (event.key === 'Enter') {
      event.preventDefault();
      HandleSendMassage();
    }
  }

  useEffect(()=>{
    const massagesDiv = document.querySelector('.massages-card');
    if(massagesDiv){
      massagesDiv.scrollTop = massagesDiv.scrollHeight;
    }
  })

 
  
  if(selectedChat){
    return (
      <div id={id}>
        <div className="chat-info">
          <Between>
            <Line>
            <img src={selectedChat.name? selectedChat.img : selectedChat.members.find(member => member.username !== userDetails.username).img} alt="" />
              <span className="info-element">{selectedChat.name? selectedChat.name : selectedChat.members.find(member => member.username !== userDetails.username).username}</span>
            </Line>
            <div className="chat-icons">
              <img
                className="info-element img-icon"
                src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/7911292/camera-icon-md.png"
                alt="camera btn"
              />
              {/* <img className='info-element img-icon' onClick={HandleOptionsClick} src="https://icon-library.com/images/more-icon-png/more-icon-png-1.jpg" alt="options btn" /> */}
              {/* <select className='options-btn' name="chatNavbarOptions" id="">
              <option value="" disabled selected hidden></option>
                <option value="option1">Delete</option>
                <option value="option2">Change BGC</option>
                <option value="option3">Option 3</option>
              </select> */}
            </div>
          </Between>
        </div>
        <div className="massages-card">
          {selectedChat.massages? selectedChat.massages.map(massage =>{
            if(massage.name !== userDetails.username){
              return <Massage name={massage.name} date={massage.date} img={selectedChat.members.find(member => member.username === massage.name).img} text={massage.text}/>
            }else{
              return <MyMassage text={massage.text} date={massage.date} />
            }
          }): null }
        </div>
  
        <div className="input-bar-container">
          <div className="input-container">
            <input onKeyDown={HandleKeyDown} placeholder="type..." className="text-massage-input" type="text" />
          </div>
          <div className="send-btn-and-icons-container">
            {/* <img
              className="img-element"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Ic_attach_file_48px.svg/1200px-Ic_attach_file_48px.svg.png"
              alt=""
            />
            <img
              className="img-element"
              id="img-pic"
              src="data:image/png;base64,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"
              alt=""
            /> */}
            <button onClick={HandleSendMassage}  className="send-btn">Send</button>
          </div>
        </div>
      </div>
    );
  }
  else{
    return(
      <div className="non-selcted-room-view">
        <img className="chatWin-non-selected-room-bgc" src="space-g257c0171b_1280.png" alt="" />
      </div>
    )
  }
  
};
