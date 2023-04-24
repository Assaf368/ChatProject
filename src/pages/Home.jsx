import { Chat } from "Components/Chat/Chat";
import Navbar from "UiKit/Layouts/Elements/Navbar/Navbar";
import { Login } from "./Login";
import { useEffect, useState } from "react";
import axios from "axios";
import { Menu } from "UiKit/Layouts/Elements/Menu/Menu";
import { AddFriend } from "Components/AddFriend/AddFriend";
import { useDispatch, useSelector } from "react-redux";
import { SetUserId, SetUserName } from "State/userDetails";
import { EmitLogin, SetSocketConnection } from "State/socket";
import { PickFriends } from "Components/PickFriends/PickFriends";
import { SetChatState } from "State/toggle";

export const Home = () => {
  const toggle = useSelector((store) => store.toggle);
  const userDetails = useSelector((store)=> store.userDetails);
  const socket = useSelector((store)=> store.socket);
  const dispatch = useDispatch();
  const [auth, setAuth] = useState(false);
  const [token] = useState(sessionStorage.getItem("token"));
  useEffect(() => {
    console.log("trying api");
    axios
      .get("/home", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.success === true) {
          setAuth(true);
          dispatch(SetSocketConnection());
          dispatch(SetChatState(true));
          dispatch(SetUserName(res.data.username));
          dispatch(SetUserId(res.data.id));
          dispatch(EmitLogin({username: res.data.username}));
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
      </>
    );
  } else {
    return <Login></Login>;
  }
};
