import Register from "Components/Register/Register"
import Navbar from "UiKit/Layouts/Elements/Navbar/Navbar"
import './Reg.css'


export const Reg = () =>{
    return(
        <div className="Reg-container">
            <div className="navbar-container">
              <Navbar/>
            </div>
            <div className="Register-component-container">
              <Register/>
            </div>
        </div>
    )
}