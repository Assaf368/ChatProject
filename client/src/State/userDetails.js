import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: null,
    id:null,
    status:null,
    img:null,
    friends:[],
    invitations:[]
}

export const userDetailsSlice = createSlice({
    name: 'userDetails',
    initialState,
    reducers:{
        SetUserDetails:(state, action) =>{
            state.id = action.payload.id;
            state.username =action.payload.username;
            state.status =action.payload.status;
            state.img =action.payload.img;
        },
        SetFriends:(state,action)=>{
            state.friends = action.payload;
        },
        SetInvitations:(state,action)=>{
            state.invitations = action.payload;
        },
        
    }
})

export const{SetUserDetails,SetFriends,SetInvitations} = userDetailsSlice.actions;

export default userDetailsSlice.reducer;