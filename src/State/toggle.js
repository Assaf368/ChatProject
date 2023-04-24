import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    addFriendState: false,
    pickFriendsState : false,
    chatState : false,
    
}

export const toggleSlice = createSlice({
    name: 'toggle',
    initialState,
    reducers:{
            SwichAddFriendState:(state) =>{
            state.addFriendState = !state.addFriendState;
        },
        SwichPickFriendsState:(state) =>{
            state.pickFriendsState = !state.pickFriendsState;
        },
        SetChatState:(state,action) =>{
            state.chatState = action.payload;
        },
        
    }
})

export const{SwichAddFriendState,SwichPickFriendsState,SetChatState} = toggleSlice.actions;
export default toggleSlice.reducer;