import { useState } from "react";
import { Between, Rows } from "UiKit/Layouts/Line/Line";
import { useNavigate } from "react-router-dom";

import "./LogIn.css";
import axios from "axios";
import { Input } from "UiKit/Layouts/Elements/Input/Input";

export const LogIn = () => {
  const [usernameVal, setUsernameVal] = useState("");
  const [passwordVal, setPasswordVal] = useState("");
  const [error, setError] = useState(false);

  let navigate = useNavigate();

  function clearFormFields() {
    const inputs = document.querySelectorAll(".element");
    inputs.forEach((input) => {
      input.value = "";
    });
  }

  function handleLogin(event) {
    event.preventDefault();
    setError(false);
    clearFormFields();

    navigate('/login');
    axios.post("/login", { username: usernameVal, password: passwordVal })
      .then((res) => {
        if (res.data.auth === true) {
          sessionStorage.setItem("token", res.data.accessToken);
          navigate('/home');
        } else {
          setError(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    
      <div className="login-container">
          <div className="header-container">
            <h3>Login</h3>
          </div>
          <form onSubmit={handleLogin} className="body-of-login">
            <div className="Login-username-and-password-inputs">
            <Input 
              title="Username"
                placeholder="Type your username"
                onInput={(e) => {
                  setUsernameVal(e.target.value);
                }}
                type="text"
                minLength={3}
                maxLength={20}
                >
              </Input>
              <Input
              title="Password"
                onInput={(e) => {
                  setPasswordVal(e.target.value);
                }}
                placeholder="Type your password"
                className="element"
                type="password"
                minLength={8}
                maxLength={30}
                required
              />
            </div>
              
            <div className="login-btn-container">
              <input id="login-btn" type="submit" value={"Login"} />
            </div>
            <div className="login-error-massages">
              {error && <label>UserName or password are invalid!</label>}
            </div>
          </form>
      </div>
  );
};
