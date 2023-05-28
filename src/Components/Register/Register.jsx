import "./Register.css";
import { Rows } from "UiKit/Layouts/Line/Line";
import { Between } from "UiKit/Layouts/Line/Line";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  function clearFormFields() {
    const inputs = document.querySelectorAll(".element");
    inputs.forEach((input) => {
      input.value = "";
    });
  }

  const IsClientElementVallid = (inputRef, isVallid) => {
    if (isVallid) {
      inputRef.style.backgroundColor = "green";
      return;
    }
    if (isVallid === undefined) {
      inputRef.style.backgroundColor = "rgb(44, 51, 113)";
      return;
    }
    inputRef.style.backgroundColor = "pink";
  };

  const CheckUsernameValidationServer = async () => {
    ClearMassages();
    const usernameInput = document.querySelector(".username-input");
    if (usernameVal !== "") {
      axios
        .get("/home/checkusername", { params: { username: usernameVal } })
        .then((res) => {
          if (res.data === false) {
            setTakenUsername(false);
            IsClientElementVallid(usernameInput, true);
            return false;
          }
          if (res.data === true) {
            IsClientElementVallid(usernameInput, false);
            setTakenUsername(true);
            return true;
          } else {
            IsClientElementVallid(usernameInput, false);
            setInVallidUsername(true);
          }
        });
    } else {
      IsClientElementVallid(usernameInput, undefined);
      setTakenUsername(false);
    }
  };

  const CheckPasswordVallidation = () => {
    setInvallidPassword(false);
    const passwordInput = document.querySelector(".password-input");
    if (passwordVal !== "") {
      const regex = /^(?=.*[A-Z])(?=.*[a-z]).{8,30}$/;
      if (regex.test(passwordVal)) {
        IsClientElementVallid(passwordInput, true);
      } else {
        IsClientElementVallid(passwordInput, false);
        setInvallidPassword(true);
      }
    } else {
      IsClientElementVallid(passwordInput, undefined);
    }
  };

  const ClearMassages = () => {
    setInvallidError(false);
    setSuccessMassage(false);
    setUnidenticalError(false);
    setTakenUsername(false);
    setInVallidUsername(false);
    setInvallidPassword(false);
  };

  const CheckConfirmPassword = () => {
    setUnidenticalError(false);
    const confirmInput = document.querySelector(".confirm-input");
    if (confirmPasswordVal === "") {
      IsClientElementVallid(confirmInput, undefined);
      return;
    }
    if (passwordVal !== confirmPasswordVal) {
      setUnidenticalError(true);
      IsClientElementVallid(confirmInput, false);
      return;
    }
    IsClientElementVallid(confirmInput, true);
  };

  const ResetInputsColors = () => {
    const inputs = document.querySelectorAll('.input')
    inputs.forEach((input) => {
      input.style.backgroundColor = "rgb(44, 51, 113)";
    });
  };

  const [usernameVal, setUsernameVal] = useState("");
  const [passwordVal, setPasswordVal] = useState("");
  const [confirmPasswordVal, setConfirmPasswordVal] = useState("");
  const [successMassage, setSuccessMassage] = useState(false);
  const [invallidError, setInvallidError] = useState(false);
  const [unidenticalError, setUnidenticalError] = useState(false);
  const [takenUsername, setTakenUsername] = useState(false);
  const [invallidUsername, setInVallidUsername] = useState(false);
  const [invallidPassword, setInvallidPassword] = useState(false);
  const navigate = useNavigate();

  async function handleRegistration(event) {
    event.preventDefault();
    clearFormFields();
    ClearMassages();
    navigate('/');
    axios
      .post("/register", {
        username: usernameVal,
        password: passwordVal,
        confirm: confirmPasswordVal,
      })
      .then((res) => {
        if (res.data.success === true) {
          setSuccessMassage(true);
        } else {
          setInvallidError(true);
        }
        ResetInputsColors();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="RegisterContainer">
      <div className="RgistrationCard">
        <Rows>
          <div className="header">
            <h3>Registration</h3>
          </div>

          <form onSubmit={handleRegistration} className="bodyOfReg">
            <Between>
              <label className="element" htmlFor="UserName">
                UserName:
              </label>
              <input
                onInput={(e) => setUsernameVal(e.target.value)}
                onBlur={CheckUsernameValidationServer}
                minLength={3}
                maxLength={20}
                required
                placeholder="username"
                className="element input username-input"
                type="text"
              />
            </Between>
            <Between>
              <label className="element" htmlFor="Password">
                Password:
              </label>
              <input
                onInput={(e) => setPasswordVal(e.target.value)}
                onBlur={CheckPasswordVallidation}
                required
                placeholder="password"
                className="element input password-input"
                type="password"
                pattern="^(?=.*[A-Z])(?=.*[a-z]).{8,30}$"
              />
            </Between>
            <Between>
              <label className="element" htmlFor="Confirm">
                Confirm password:
              </label>
              <input
                onInput={(e) => setConfirmPasswordVal(e.target.value)}
                onBlur={CheckConfirmPassword}
                placeholder="confirm"
                required
                className="element input confirm-input"
                type="password"
              />
            </Between>
            <div className="reg-error-massages">
              {invallidError && (
                <label>userName or Password are invallid! try again!</label>
              )}
              {successMassage && (
                <label className="successful-massage">
                  registration successfuly submited!
                </label>
              )}
              {unidenticalError && (
                <label>Please confirm the password correctly!</label>
              )}
              {takenUsername && (
                <label>
                  This username is already taken!, try something else!
                </label>
              )}
              {invallidUsername && (
                <label>Username has to be more than 2 chatacters!</label>
              )}
              {invallidPassword && (
                <label>
                  Password has to be min 8 chatecters,at least one capital
                  letter, and at least one regular letter.
                </label>
              )}
            </div>
            <div className="btn-container">
              <input id="btn" type="submit" value={"Submit"} />
            </div>
          </form>
        </Rows>
      </div>
    </div>
  );
};

export default Register;
