import { LogIn } from "Components/LogIn/LogIn"
import { SetChatState } from "State/toggle"
import Navbar from "UiKit/Layouts/Elements/Navbar/Navbar"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import './Login.css'


export const Login = () =>{
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(SetChatState(false));
    },[])

    return(
        <div className="Login-container">
            <div className="navbar-container">
              <Navbar/>
            </div>
            <div className="Login-Component-container">
              <LogIn/>
            </div>
        </div>
        

    )
}