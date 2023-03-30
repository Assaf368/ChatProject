import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Home from "./Home";

export const Auth = ()=>{

let navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    axios.get('/home')
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false));
  }, []);

  if (!authenticated) {
    // Redirect to login page if user is not authenticated
    return navigate('/login');
  }
  else{
    return <Home></Home>
  }

}