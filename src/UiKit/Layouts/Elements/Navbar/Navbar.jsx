import {Line} from 'UiKit/Layouts/Line/Line'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Navbar = () => {
  const toggle = useSelector((store)=> store.toggle);
  const socket = useSelector((store)=> store.socket.socket);

  const HandleLogOut = ()=>{
    socket.disconnect();
    sessionStorage.clear();
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