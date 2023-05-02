import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import toggleReducer from './toggle'
import socketReducer from './socket'
import userDetailsReducer from './userDetails'
import onlineRoomsReducer from './onlineRooms'
import { Provider } from "react-redux";

const customizedMiddleware = getDefaultMiddleware({
    serializableCheck: false,immutableCheck: false,
  });

 


const store = configureStore({
    reducer:{
        toggle: toggleReducer,
        socket: socketReducer,
        userDetails: userDetailsReducer,
        onlineRooms: onlineRoomsReducer
    },
    middleware: customizedMiddleware
    
})


export const ReduxProvider = ({children}) => {
    return(
        <Provider store={store}>
            {children}
        </Provider>
    )
}