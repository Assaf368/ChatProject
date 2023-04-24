import { useState } from "react";
import { Between, Rows } from "UiKit/Layouts/Line/Line";
import { useNavigate } from "react-router-dom";

import "./LogIn.css";
import axios from "axios";

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

    axios.post("/login", { username: usernameVal, password: passwordVal })
      .then((res) => {
        if (res.data.auth === true) {
          console.log(res);
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
      <div className="login-card">
        <Rows>
          <div className="header">
            <h3>Login</h3>
          </div>

          <form onSubmit={handleLogin} className="body-of-login">
            <Between>
              <label className="element" htmlFor="UserName">
                UserName:
              </label>
              <input
                onInput={(e) => {
                  setUsernameVal(e.target.value);
                }}
                placeholder="username"
                className="element"
                type="text"
              />
            </Between>
            <Between>
              <label className="element" htmlFor="Password">
                Password:
              </label>
              <input
                onInput={(e) => {
                  setPasswordVal(e.target.value);
                }}
                placeholder="password"
                className="element"
                type="password"
              />
            </Between>
            <div className="btn-container">
              <input id="btn" type="submit" value={"Login"} />
            </div>
            {error && <label>UserName or password are invalid!</label>}
          </form>
        </Rows>
      </div>
    </div>
  );
};
