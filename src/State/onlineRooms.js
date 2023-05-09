import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chats : [],
    selectedChatId: null

}

export const onlineRoomsSlice = createSlice({
    name: 'onlineRooms',
    initialState,
    reducers:{
        AddChatToRedux :(state, action)=>{
            state.chats.push(action.payload);
        },
        SetSelectedChatId:(state,action) =>{
                state.selectedChatId = action.payload;
        },
        AddMassageToChat:(state,action) =>{
            console.log(state.chats);
            const chat = state.chats.find(chat=> chat._id === action.payload.roomId);
            const {senderId,text,roomId,username} = action.payload;
            const now = new Date();
            const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
            const massage = {
                text: text,
                name: username,
                sender: senderId,
                date:time,
                target: roomId
            }
            chat.massages.push(massage);
    },
    }
})

export const{SetSelectedChatId,AddChatToRedux,AddMassageToChat} = onlineRoomsSlice.actions;

export default onlineRoomsSlice.reducer;