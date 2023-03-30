import axios from 'axios';
import { Chat } from 'Components/Chat/Chat'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from 'UiKit/Layouts/Elements/Navbar/Navbar'

export const Home = () => {
  let navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axios.post('/login', { username: username , password: password }).then(res =>{
      if(res.data.auth === true)
      {
        console.log(res);
        localStorage.setItem("token", res.data.accessToken)
        setAuthenticated(true);
      }
      else
      { 
        setAuthenticated(false);
      }
  })
  .catch(err =>{
    console.log(err)
  })
  }, []);


  if (!authenticated) {
    return navigate('/login',"authenticaion failed!");
  }
  else{
    return (
      <>
      <Navbar/>
      <Chat/>
      </>
    )
  }  
}

