import './Register.css'
import {Rows} from 'UiKit/Layouts/Line/Line'
import {Between} from 'UiKit/Layouts/Line/Line'
import axios from 'axios'
import { useState } from 'react'

const Register = ()=>{

  function clearFormFields() {
    const inputs = document.querySelectorAll('.element');
    inputs.forEach(input => {
      input.value = '';
    });
  }

  const [usernameVal, setUsernameVal] = useState('');
  const [passwordVal, setPasswordVal] = useState('');
  const [massage, setMassage] = useState(false);
  const [error, setError] = useState(false);


  function handleRegistration(event){
     event.preventDefault()
     setError(false);
     setMassage(false);
     clearFormFields();
     axios.post('/register', { username: usernameVal , password: passwordVal }).then(res =>{
        if(res.data.success === true)
        {
          setMassage(true);
        }
        else{
          setError(true);
        }
    })
    .catch(err =>{
      console.log(err)
    })
  }

    return(
        <div className='RegisterContainer'>
            <div className='RgistrationCard'>
            <Rows>
              <div className='header'><h3>Registration</h3></div>

              <form onSubmit={handleRegistration} className='bodyOfReg'>
                <Between >
                  <label className='element' htmlFor="UserName">UserName:</label>
                  <input onInput={e=> setUsernameVal(e.target.value)} placeholder='username' className='element' type="text" />
                </Between>
                <Between>
                  <label className='element' htmlFor="Password">Password:</label>
                  <input onInput={e=> setPasswordVal(e.target.value)} placeholder='password' className='element' type="password" />
                </Between>
                <Between>
                  <label className='element' htmlFor="Confirm">Confirm password:</label>
                  <input placeholder='confirm' className='element' type="password" />
                </Between>
                <div className="btn-container">
                  <input id="btn" type="submit" value={"Submit"} />
                </div>
                {error && <label>userName or Password are invallid! try again!</label>}
                {massage && <label>registration successfuly submited!</label>}
                
              </form>
            </Rows>
            </div>
        </div>
    )
}

export default Register