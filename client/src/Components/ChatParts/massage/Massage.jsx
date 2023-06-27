

import { Line, Rows } from 'UiKit/Layouts/Line/Line'
import './Massage.css'


export const Massage = ({text, name, img,date})=>{
    return(
        
          <div className='massage-card'>
            <div className='img-and-name-container'>
                    <img className='img' src={img} alt="" />
                    <span className='name'>hjhjrtrhtyt</span>
              </div>
              <div className='text-container'>
                <div className='massage-text'>{text}</div>
                <div className='date-container'>{date}</div>
              </div>
              
          </div>
    )
}