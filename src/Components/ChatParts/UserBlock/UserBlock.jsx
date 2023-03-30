

import { Line, Rows } from 'UiKit/Layouts/Line/Line'
import './UserBlock.css'


export const UserBlock = ({name, imgUrl, lastMassage})=>{
    return(
        <div className='user-block-container'>
            <Line>
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