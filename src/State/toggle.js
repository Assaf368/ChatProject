import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    addFriendState: false,
    pickFriendsState : false,
    chatState : false,
    viewProfileState:false
    
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
        SetViewProfileState:(state,action) =>{
            state.viewProfileState = action.payload;
        }
        
    }
})

export const{SwichAddFriendState,SwichPickFriendsState,SetChatState,SetViewProfileState} = toggleSlice.actions;
export default toggleSlice.reducer;