import React, { useState } from "react";
import "../styles/common.css";
// import { Link } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isInvalidCreds, setIsInvalidCreds] = useState(false);
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");

  const handleLoginForm = (event) => {
    event.preventDefault();
    axios
      .post(`http://localhost:8080/user/v1/signin`, formData)
      .then((response) => {
        sessionStorage.setItem("token", response.data.data.token);
        sessionStorage.setItem("isLoggedIn", true);
        navigate("/customers");
      })
      .catch((err) => {
       if (err.response.status === 403 || err.response.status === 400)
         setIsInvalidCreds(true)
          else setIsInvalidCreds(false);
      });
  };

  const navigateTo = () => {
    navigate("/register");
  };
  return (
    <>
      <div className="customer-form mt-5">
        {isLoggedIn && (
          <div className="alert alert-danger alert" role="alert">
            You session has been expired. Please login again!
          </div>
        )}
        <form onSubmit={handleLoginForm}>
          <h4 className="form-header">Sign In</h4>
          <input
            type="text"
            placeholder="Enter username"
            className="inp"
            name="email"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            autoComplete="true"
          ></input>
          <input
            type="password"
            placeholder="Enter password"
            name="password"
            className="inp"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            autoComplete="true"
          ></input>
          {isInvalidCreds && (
            <p className="red mx-5">Invalid Email or Password!</p>
          )}
          <input
            className="lbtn btn btn-success mx-3"
            type="submit"
            value="Sign In"
          />
        </form>
        <div className="d-flex g-2">
          <p className="mx-3 mt-2 text-nowrap">Do Not have account?</p>
          <span
            onClick={navigateTo}
            className="cursor-pointer text-nowrap btn btn-link"
          >
            Register Account
          </span>
        </div>
      </div>
    </>
  );
};

export default Login;
