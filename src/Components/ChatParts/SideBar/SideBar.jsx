
import axios from 'axios'
import { useEffect } from 'react'
import { Between } from 'UiKit/Layouts/Line/Line'
import { UserBlock } from '../UserBlock/UserBlock'
import './SideBar.css'

export const SideBar = ({id})=>{
  

  useEffect(()=>{
    axios.get('/home',{
      headers:{
        "accessToken" : localStorage.getItem("token"),
      },
    }).then((res)=>{
        console.log("ayze yofi!")
    })

  },[])


    return(
        <div id={id} className='sidebar-container'>
            <div className='navbar'>
                <Between>
                  <div className='logo-container'><h4>W.o.C</h4></div>
                  <div className='user-details-container'>
                    <img id='img' src="https://static-hotsites.edufindme.com/tsw-events/46af4ebddab82f4e20774fac3bf892b98408bc82/static/img/hub/img/img-student-2.png" alt="user" />
                    <div  className='name-container'>July Gray</div>
                    <button id='logout-btn'>LogOut</button>
                  </div>
                </Between>  
            </div>
            <div className='search-bar'>
                <input type="text" placeholder='search for a friend...' />
                <button id='search-btn'> <img id='search-img' src="https://www.freeiconspng.com/thumbs/search-icon-png/search-icon-png-5.png" alt="" /></button>
            </div>
            <div className='friends-container'>
              <div className='friends'>
                  <UserBlock lastMassage={"hello there!"} name={"jane"} imgUrl="https://www.shutterstock.com/image-photo/portrait-smiling-young-college-student-260nw-1192615495.jpg"/>
                  <UserBlock/>
                  <UserBlock/>
                  <UserBlock/>
                  <UserBlock/>
                  <UserBlock/>
                  <UserBlock/>
                  <UserBlock/>
                  <UserBlock/>
              </div>
            </div>
            
        </div>

    )
}