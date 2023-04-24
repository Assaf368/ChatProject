import {Line} from 'UiKit/Layouts/Line/Line'
import './Navbar.css'

import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { EmitLogout } from 'State/socket'

const Navbar = () => {
  const dispatch = useDispatch();
  const toggle = useSelector((store)=> store.toggle);

  const HandleLogOut = ()=>{
    dispatch(EmitLogout());
  }
  if(!toggle.chatState)
  {
  return (
    <nav id="navbar">
        <Line addClass={"navbar-line"} >
            <h2>World Of Chat</h2>
            <div className='links'>
                <Link className="link" to='/login'>Log In</Link>
                <Link className="link" to='/'>Register</Link>
            </div>
        </Line>
    </nav>
  )
  }
  else{
    return (
      <nav id="navbar">
          <Line addClass={"navbar-line"} >
              <h2>World Of Chat</h2>
              <div className='links'>
                  <Link onClick={HandleLogOut} className="link" to='/login'>Log Out</Link>
              </div>
          </Line>
      </nav>
    )
  }
}

export default Navbar