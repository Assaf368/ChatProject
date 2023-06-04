import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: null,
    imgUrl:null,
    desc:null
}

export const viewProfileSlice = createSlice({
    name: 'viewProfile',
    initialState,
    reducers:{
        SetViewProfileDetails:(state, action) =>{
            state.username = action.payload.username;
            state.imgUrl = action.payload.imgUrl;
            state.desc = action.payload.desc;
        }
    }
})

export const{SetViewProfileDetails} = viewProfileSlice.actions;
export default viewProfileSlice.reducer;