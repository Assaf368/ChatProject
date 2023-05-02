import { LogIn } from "Components/LogIn/LogIn"
import { SetChatState } from "State/toggle"
import Navbar from "UiKit/Layouts/Elements/Navbar/Navbar"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"


export const Login = () =>{
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(SetChatState(false));
    },[])

    return(
        <>
        <Navbar/>
        <LogIn/>
    </>
        

    )
}