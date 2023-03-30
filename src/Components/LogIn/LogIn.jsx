
import { useEffect, useState } from 'react';
import { Between, Rows } from 'UiKit/Layouts/Line/Line'
import {useNavigate} from 'react-router-dom'

import './LogIn.css'

export const LogIn = ()=>{
  const [usernameVal, setUsernameVal] = useState('');
  const [passwordVal, setPasswordVal] = useState('');
  const [error, setError] = useState(false);

  let navigate = useNavigate();

  useEffect(()=>{
    if(1)
    {
      setError(true)
    }
    else{
      setError(false);
    }
  },[])


  
  function clearFormFields() {
    const inputs = document.querySelectorAll('.element');
    inputs.forEach(input => {
      input.value = '';
    });
  }
  const handleNavigation = (param1, param2) => {
    // Navigate to "/other-component" with params
    // param1 and param2 passed as query params
    const queryParams = `?param1=${param1}&param2=${param2}`;
    const url = `/other-component${queryParams}`;
    window.location.href = url;
  }

  function handleLogin(event){
    event.preventDefault()
    clearFormFields();
    handleNavigation(usernameVal,passwordVal);
 }


    return(
        <div className='login-container'>
            <div className='login-card'>
              <Rows>
                <div className='header'><h3>Login</h3></div>
              
                <form onSubmit={handleLogin} className='body-of-login'>
                  <Between >
                    <label className='element' htmlFor="UserName">UserName:</label>
                    <input onInput={e => {setUsernameVal(e.target.value)}} placeholder='username' className='element' type="text" />
                  </Between>
                  <Between>
                    <label className='element' htmlFor="Password">Password:</label>
                    <input onInput={e => {setPasswordVal(e.target.value)}} placeholder='password'  className='element' type="password" />
                  </Between>
                  <div className="btn-container">
                    <input id="btn" type="submit" value={"Login"} />
                  </div>
                  {error && <label>UserName or password are invalid!</label>}
                </form>
              </Rows>
            </div>
        </div>
    )
}