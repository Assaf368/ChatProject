

import { WinChat } from 'Components/ChatParts/ChatWin/ChatWin'
import { SideBar } from 'Components/ChatParts/SideBar/SideBar'
import './Chat.css'
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'


export const Chat = ({userName,chatRooms})=>{

    const chatWinEl = useRef(null);
    const sideBarEl = useRef(null);

    const CheckIfMobile = ()=>{
        if(window.innerWidth <= 500)
          return true
        return false
    }
    const firstIsMobile = CheckIfMobile();
    const[isMobile, SetIsMobile] = useState(firstIsMobile)
    const[mobileRoomView,SetMobileRoomView] = useState(false);
    
    useEffect(()=>{
        const handleResize = () => {
            if (window.innerWidth <= 500) {
             SetIsMobile(true);
            }else{
             SetIsMobile(false);
             SetMobileRoomView(false)
            }
          };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            SetIsMobile(false)
            SetMobileRoomView(false)
          };
    },[])

    useEffect(()=>{
        if(isMobile){
            if(mobileRoomView){
                sideBarEl.current.style.display  = "none"
                chatWinEl.current.style.display = "flex"

            }else{
                sideBarEl.current.style.display = "flex"
                chatWinEl.current.style.display = "none"
            }
        }else{
            sideBarEl.current.style.display = "flex"
            chatWinEl.current.style.display = "flex"

        }
    },[isMobile,mobileRoomView])

        return(
            <div className='chat-container'>
                    <SideBar ref={sideBarEl}  SetMobileRoomView={SetMobileRoomView} userName={userName} chatRooms={chatRooms} id={"side-bar"}></SideBar>
                    <WinChat ref={chatWinEl} SetMobileRoomView={SetMobileRoomView}  isMobile={isMobile} id={"chatwin"}></WinChat>
            </div>
        )
}