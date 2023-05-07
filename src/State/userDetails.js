import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: null,
    id:null,
    friends:null,
    invitations:null
}

export const userDetailsSlice = createSlice({
    name: 'userDetails',
    initialState,
    reducers:{
        SetUserId:(state, action) =>{
            state.id = action.payload;
        },
        SetUserName:(state,action)=>{
            state.username = action.payload;
        },
        SetFriends:(state,action)=>{
            state.friends = action.payload;
        },
        SetInvitations:(state,action)=>{
            state.invitations = action.payload;
        },
        
    }
})

export const{SetUserId,SetFriends,SetInvitations} = userDetailsSlice.actions;
export const{SetUserName} = userDetailsSlice.actions;

export default userDetailsSlice.reducer;