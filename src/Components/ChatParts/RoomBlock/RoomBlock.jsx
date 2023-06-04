import { Line, Rows } from "UiKit/Layouts/Line/Line";
import "./RoomBlock.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetViewProfileDetails } from "State/viewProfile";
import { SetViewProfileState } from "State/toggle";

export const RoomBlock = ({
  onClick,
  roomId,
  name,
  imgUrl,
  lastMassage,
  unreadMassages,
  bio
}) => {
  const dispatch = useDispatch();

  const HandleViewProfile = (name, imgUrl,bio)=>{
    dispatch(SetViewProfileDetails({username:name,imgUrl:imgUrl, desc:bio}));
    dispatch(SetViewProfileState(true));
  }

       const unreadMassagesRef = useRef(unreadMassages);
       const [count, setCount] = useState(unreadMassages);
       const userId = useSelector((store)=> store.userDetails.id);

    useEffect(()=>{
        return ()=>{
            if(unreadMassagesRef.current !== 0 && unreadMassagesRef.current !== undefined){
                axios.post('/home/updateUnreadMassagesCounter',{roomId : roomId,userId:userId, count: unreadMassagesRef.current})
                .catch(err => console.log(err));
            }
        }
    },[])

    useEffect(()=>{
        unreadMassagesRef.current = unreadMassages;
    },[unreadMassages])

    const HandleResetUnreadMassagesOnDb = ()=>{
        if(unreadMassagesRef !== 0){
            axios.post('/home/resetUnreadMassagesCounter',{params :{roomId : roomId,userId:userId}})
            .catch(err => console.log(err));
            setCount(0);
            unreadMassagesRef.current = 0;
        }
    }

  return (
    <div
      onClick={() => {
        onClick(roomId,name);
        HandleResetUnreadMassagesOnDb();
      }}
      className="user-block-container"
    >
      <Line>
        <img onClick={ ()=> HandleViewProfile(name,imgUrl,bio)} src={imgUrl} alt="user" />
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
