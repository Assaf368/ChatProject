

import { Line, Rows } from 'UiKit/Layouts/Line/Line'
import './Massage.css'


export const Massage = ({text, name, img})=>{
    return(
        
          <div className='massage-card'>
              <div className='text-container'>
                <div className='massage-text'>{text}</div>
              </div>
              <div className='img-and-name-container'>
                    <img className='img' src={img} alt="" />
                    <span className='name'>{name}</span>
              </div>
          </div>
    )
}