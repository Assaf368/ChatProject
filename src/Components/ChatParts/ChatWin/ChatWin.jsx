

import { Between, Line, Rows } from 'UiKit/Layouts/Line/Line'
import { Massage } from '../massage/Massage'
import './ChatWin.css'

export const WinChat = ({id})=>{
    return(
        <div id={id}>
            <div className='chat-info'>
                <Between>
                  <span className='info-element'>July</span>
                  <div className='chat-icons'>
                      <img className='info-element img-icon' src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-camera-512.png" alt="" />
                      <img className='info-element img-icon' src="https://icon-library.com/images/more-icon-png/more-icon-png-1.jpg" alt="" />
                  </div>
                </Between>
            </div>
            <div className='massages-card'>
                 <Massage img={"https://static-hotsites.edufindme.com/tsw-events/46af4ebddab82f4e20774fac3bf892b98408bc82/static/img/hub/img/img-student-2.png"} name={"July"} text={"hello fjhgjfgf ergjnfgu  ghkgjfg sgkjs gesg fgfeovif j bgisg skh"}/>
                 <Massage img={"https://static-hotsites.edufindme.com/tsw-events/46af4ebddab82f4e20774fac3bf892b98408bc82/static/img/hub/img/img-student-2.png"} name={"July"} text={"hello"}/>
                 <Massage img={"https://static-hotsites.edufindme.com/tsw-events/46af4ebddab82f4e20774fac3bf892b98408bc82/static/img/hub/img/img-student-2.png"} name={"July"} text={"hello gfgdhthdgfdgtgegfgthv"}/>
                 <Massage img={"https://static-hotsites.edufindme.com/tsw-events/46af4ebddab82f4e20774fac3bf892b98408bc82/static/img/hub/img/img-student-2.png"} name={"July"} text={"hello"}/>
                
            </div>

            <div className='input-bar-container'>
                <div className='input-container'>
                  <input placeholder='type...' className='input-element' type="text" />
                </div>
                <div className='send-btn-and-icons-container'>
                    <img className='img-element' src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Ic_attach_file_48px.svg/1200px-Ic_attach_file_48px.svg.png" alt="" />
                    <img className='img-element' id='img-pic' src="https://icons.veryicon.com/png/o/miscellaneous/simple-linear-icon/icon-img.png" alt="" />
                    <button className='send-btn'>Send</button>
                </div>
            </div>
        </div>
    )
}