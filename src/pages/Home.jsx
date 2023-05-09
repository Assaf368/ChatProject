import { Chat } from "Components/Chat/Chat";
import Navbar from "UiKit/Layouts/Elements/Navbar/Navbar";
import { Login } from "./Login";
import { useEffect, useState } from "react";
import axios from "axios";
import { Menu } from "UiKit/Layouts/Elements/Menu/Menu";
import { AddFriend } from "Components/AddFriend/AddFriend";
import { useDispatch, useSelector } from "react-redux";
import { SetUserDetails, SetUserId, SetUserName } from "State/userDetails";
import { PickFriends } from "Components/PickFriends/PickFriends";
import { SetChatState } from "State/toggle";
import { SetSocketConnection } from "State/socket";
import io from "socket.io-client";
import { ViewProfile } from "Components/ViewProfile/ViewProfile";
import { EditProfile } from "Components/EditProfile/EditProfile";


export const Home = () => {
  const toggle = useSelector((store) => store.toggle);
  const userDetails = useSelector((store) => store.userDetails);
  const dispatch = useDispatch();
  const [auth, setAuth] = useState(false);
  const [token] = useState(sessionStorage.getItem("token"));
  
  useEffect(() => {
    axios
      .get("/home", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.success === true) {
          const socket = io("http://localhost:5000");
          dispatch(SetSocketConnection(socket));
          setAuth(true);
          dispatch(SetChatState(true));
          dispatch(SetUserDetails(res.data));
          socket.emit("login", { username: res.data.username });
        }
      });
  }, [token]);

  if (auth === true) {
    return (
      <>
        <Navbar />
        <Chat userName={userDetails.username} />
        <Menu></Menu>
        <AddFriend state={toggle.addFriendState}></AddFriend>
        {toggle.pickFriendsState && <PickFriends></PickFriends>}
        <ViewProfile state={toggle.viewProfileState}/>
        <EditProfile state={toggle.editProfileState}/>
      </>
    );
  } else {
    return <Login></Login>;
  }
};
