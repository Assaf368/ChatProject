

import { Line, Rows } from 'UiKit/Layouts/Line/Line'
import './RoomBlock.css'


export const RoomBlock = ({onClick,roomId ,name, imgUrl, lastMassage,desc ,members})=>{
    return(
        <div onClick={()=>onClick(roomId)} className='user-block-container'>
            <Line >
                  <img  src={imgUrl} alt="user" />
                <div className='details-container'>
                    <Rows>
                        <div className='name-div'>{name}</div>
                        <div className='massage-div'>{lastMassage}</div>
                    </Rows>
                </div>
            </Line>
        </div>
    )
}