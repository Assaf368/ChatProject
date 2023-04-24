import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    chats : [],
    selectedChat: null

}

export const onlineRoomsSlice = createSlice({
    name: 'onlineRooms',
    initialState,
    reducers:{
        // SetChats:(state,action)=>{
        //     state.chats = action.payload;
        // },
        AddChatToRedux :(state, action)=>{
            state.chats.push(action.payload);
        },
        SetSelectedChat:(state,action) =>{
            axios.get('/home/getfullchat',{roomId : action.payload}).then(res=>{
                
            })
        }
        
    }
})

export const{SetSelectedChat,AddChatToRedux} = onlineRoomsSlice.actions;

export default onlineRoomsSlice.reducer;