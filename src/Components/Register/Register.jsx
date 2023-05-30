import { Input } from "UiKit/Layouts/Elements/Input/Input";
import "./Register.css";
import axios from "axios";

import { useRef, useState } from "react";

const Register = () => {
  function clearFormFields() {
    const inputs = [usernameEl,passwordEl,confirmEl]
    inputs.forEach((input) => {
      input.current.value = "";
    });
  }

  const IsClientElementVallid = (inputRef, isVallid) => {
    if (isVallid) {
      inputRef.style.backgroundColor = "green";
      return;
    }
    if (isVallid === undefined) {
      inputRef.style.backgroundColor = "white";
      return;
    }
    inputRef.style.backgroundColor = "pink";
  };

  const CheckUsernameValidationServer = async () => {
    ClearMassages();
    if (usernameVal !== "") {
      axios
        .get("/home/checkusername", { params: { username: usernameVal } })
        .then((res) => {
          if (res.data === false) {
            setTakenUsername(false);
            IsClientElementVallid(usernameEl.current, true);
            return false;
          }
          if (res.data === true) {
            IsClientElementVallid(usernameEl.current, false);
            setTakenUsername(true);
            return true;
          } else {
            IsClientElementVallid(usernameEl.current, false);
          }
        });
    } else {
      IsClientElementVallid(usernameEl.current, undefined);
      setTakenUsername(false);
    }
  };

  const CheckPasswordVallidation = () => {
    if (passwordVal !== "") {
      const regex = /^(?=.*[A-Z])(?=.*[a-z]).{8,30}$/;
      if (regex.test(passwordVal)) {
        IsClientElementVallid(passwordEl.current, true);
      } else {
        IsClientElementVallid(passwordEl.current, false);
      }
    } else {
      IsClientElementVallid(passwordEl.current, undefined);
    }
  };

  const ClearMassages = () => {
    setInvallidError(false);
    setSuccessMassage(false);
    setUnidenticalError(false);
    setTakenUsername(false);

  };

  const CheckConfirmPassword = () => {
    setUnidenticalError(false);
    if (confirmPasswordVal === "") {
      IsClientElementVallid(confirmEl.current, undefined);
      return;
    }
    if (passwordVal !== confirmPasswordVal) {
      setUnidenticalError(true);
      IsClientElementVallid(confirmEl.current, false);
      return;
    }
    IsClientElementVallid(confirmEl.current, true);
  };

  const ResetInputsColors = () => {
    const inputs = [usernameEl,passwordEl,confirmEl]
    inputs.forEach((input) => {
      input.current.style.backgroundColor = "white";
    });
  };

  const [usernameVal, setUsernameVal] = useState("");
  const [passwordVal, setPasswordVal] = useState("");
  const [confirmPasswordVal, setConfirmPasswordVal] = useState("");
  const [successMassage, setSuccessMassage] = useState(false);
  const [invallidError, setInvallidError] = useState(false);
  const [unidenticalError, setUnidenticalError] = useState(false);
  const [takenUsername, setTakenUsername] = useState(false);


  const usernameEl = useRef(null);
  const passwordEl = useRef(null);
  const confirmEl = useRef(null);


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

      <div className="Register-container">
          <div className="Register-header">
            <h3>Register</h3>
          </div>

          <form onSubmit={handleRegistration} className="bodyOfReg">
              <Input
                ref={usernameEl}
                title="Username"
                onInput={(e) => setUsernameVal(e.target.value)}
                onBlur={CheckUsernameValidationServer}
                minLength={3}
                maxLength={20}
                required
                placeholder="Choose your username"
                className="element input username-input"
                type="text"
              />
               {takenUsername && (
                <div className="taken-username-error">
                  This username is already taken!
                </div>
              )}
              <Input ref={passwordEl}
                title="Password"
                onInput={(e) => setPasswordVal(e.target.value)}
                onBlur={CheckPasswordVallidation}
                placeholder="8-30, one capital
                , one regular"
                type="password"
                pattern="^(?=.*[A-Z])(?=.*[a-z]).{8,30}$"
              />
      
              <Input
              ref={confirmEl}
              title="Confirm"
                onInput={(e) => setConfirmPasswordVal(e.target.value)}
                onBlur={CheckConfirmPassword}
                placeholder="Confirm password"
                required
                className="element input confirm-input"
                type="password"
              />
              {unidenticalError && (
                <label className="unidentical-error">Please confirm the password correctly!</label>
              )}
            <div className="reg-error-massages">
              {invallidError && (
                <label>userName or Password are invallid! try again!</label>
              )}
              {successMassage && (
                <label className="successful-massage">
                  registration successfuly submited!
                </label>
              )}
            </div>

            <div className="Register-btn-container">
              <input id="Register-btn" type="submit" value={"Submit"} />
            </div>
          </form>
      </div>
  );
};

export default Register;
