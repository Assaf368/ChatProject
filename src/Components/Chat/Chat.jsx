

import { WinChat } from 'Components/ChatParts/ChatWin/ChatWin'
import { SideBar } from 'Components/ChatParts/SideBar/SideBar'
import './Chat.css'
import { Menu } from 'UiKit/Layouts/Elements/Menu/Menu'
import { useSelector } from 'react-redux'



export const Chat = ({userName,chatRooms})=>{

    return(
        <div className='chat-container'>
            <div className='chat-card'>
                <SideBar userName={userName} chatRooms={chatRooms} id={"side-bar"}></SideBar>
                <WinChat id={"chatwin"}></WinChat>
                <Menu id={"menu"}></Menu>
            </div>
        </div>
    )
}