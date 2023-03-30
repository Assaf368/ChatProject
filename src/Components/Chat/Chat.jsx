

import { WinChat } from 'Components/ChatParts/ChatWin/ChatWin'
import { SideBar } from 'Components/ChatParts/SideBar/SideBar'
import './Chat.css'


export const Chat = ()=>{
    return(
        <div className='chat-container'>
            <div className='chat-card'>
                <SideBar id={"side-bar"}></SideBar>
                <WinChat id={"chatwin"}></WinChat>
            </div>
        </div>
    )
}