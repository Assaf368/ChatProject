import { Line, Rows } from "UiKit/Layouts/Line/Line";
import "./RoomBlock.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export const RoomBlock = ({
  onClick,
  roomId,
  name,
  imgUrl,
  lastMassage,
  unreadMassages,
}) => {

    // const unreadMassagesRef = useRef(unreadMassages);
       const [count, setCount] = useState(unreadMassages);
       const userId = useSelector((store)=> store.userDetails.id);

    useEffect(()=>{
        return ()=>{
            if(count !== 0 && count !== undefined){
                axios.post('/home/updateUnreadMassagesCounter',{roomId : roomId,userId:userId, count: count})
                .catch(err => console.log(err));
            }
        }
    },[])

    // useEffect(()=>{
    //     unreadMassagesRef.current = unreadMassages;
    // },[unreadMassages])

    const HandleResetUnreadMassagesOnDb = ()=>{
        if(count !== 0){
            axios.post('/home/resetUnreadMassagesCounter',{params :{roomId : roomId,userId:userId}})
            .catch(err => console.log(err));
            setCount(0);
            // unreadMassagesRef.current = 0;
        }
    }

  return (
    <div
      onClick={() => {
        onClick(roomId);
        HandleResetUnreadMassagesOnDb();
      }}
      className="user-block-container"
    >
      <Line>
        <img src={imgUrl} alt="user" />
        <div className="details-container">
          <Rows>
            <div className="name-div">{name}</div>
            <div className="massage-div">{lastMassage}</div>
            </Rows>
            {unreadMassages !== 0 ?<div className="unread-massages-counter">{unreadMassages}</div> :null}
        </div>
      </Line>
    </div>
  );
};
