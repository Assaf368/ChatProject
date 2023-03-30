import {Line} from 'UiKit/Layouts/Line/Line'
import './Navbar.css'

import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
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

export default Navbar