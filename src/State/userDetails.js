import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: null,
    id:null,
    friends:null,
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
        
    }
})

export const{SetUserId,SetFriends} = userDetailsSlice.actions;
export const{SetUserName} = userDetailsSlice.actions;

export default userDetailsSlice.reducer;