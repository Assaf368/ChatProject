import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";
import io from "socket.io-client";

const initialState = {
  socket: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    SetSocketConnection: (state) => {
      state.socket = io("http://localhost:5000");
      state.socket.on("connect", () => {
        console.log("Connected to server!");
      });
    },
    EmitLogin: (state, action) => {
      if (!state.socket) {
        state.socket = io("http://localhost:5000");
      }
      state.socket.emit("login", { username: action.payload.username });
    },
    EmitLogout: (state) => {
      if (!state.socket) {
        state.socket = io("http://localhost:5000");
      }
      state.socket.disconnect();
    },
    EmitSendInvitation: (state, action) => {
      if (!state.socket) {
        state.socket = io("http://localhost:5000");
      }
      state.socket.emit("send_invitation", {
        senderUsername: action.payload.senderUsername,
        targetUsername: action.payload.targetUsername,
      });
    },
    OnReceiveInvitation: (state, action) => {
      if (!state.socket) {
        state.socket = io("http://localhost:5000");
      }
      state.socket.on("receive_invitation", (data) => {
        action.payload(data);
      });
    },
    EmitCreateRoom: (state, action) => {
      if (!state.socket) {
        state.socket = io("http://localhost:5000");
      }
      state.socket.emit("create_room", {
        usernames: action.payload.usernames,
        roomName: action.payload.roomName,
        desc: action.payload.desc,
        img: action.payload.img,
      });
    },
    OnCreateRoomClient: (state, action) => {
      if (!state.socket) {
        state.socket = io("http://localhost:5000");
      }
      state.socket.on("create_room_client", (data) => {
        action.payload(data);
      });
    },
  },
});
export const { SetSocketConnection, OnCreateRoomClient } = socketSlice.actions;
export const { EmitSendInvitation, EmitCreateRoom } = socketSlice.actions;
export const { EmitLogin,EmitLogout } = socketSlice.actions;
export const { OnReceiveInvitation } = socketSlice.actions;
export default socketSlice.reducer;
