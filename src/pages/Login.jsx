import { LogIn } from "Components/LogIn/LogIn"
import { EmitLogout } from "State/socket"
import { SetChatState } from "State/toggle"
import Navbar from "UiKit/Layouts/Elements/Navbar/Navbar"
import { useEffect } from "react"
import { useDispatch } from "react-redux"


export const Login = () =>{

    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(EmitLogout());
        dispatch(SetChatState(false));
    },[])

    return(
        <>
        <Navbar/>
        <LogIn/>
    </>
        

    )
}