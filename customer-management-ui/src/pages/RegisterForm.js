import React, { useState } from "react";
import "../styles/common.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../utils/util";

const RegisterForm = ({ showAlert }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [alertMessage, setAlertMessage] = useState(false);

  const registerUser = (event) => {
    event.preventDefault();
    if (!validateEmail(formData.email) || !formData.password) {
      setAlertMessage(true);
      console.log("If block");
    } else {
      setAlertMessage(false);
      console.log("else block", validateEmail(formData.email), formData.password);
      axios
        .post(`http://localhost:8080/user/v1/register`, formData)
        .then((response) => {
          navigateTo("/");
          showAlert("User registered successfully!", "success");
        })
        .catch((err) => {
          showAlert("User already exists!", "danger");
        });
    }
  };
  const navigateTo = () => {
    navigate("/");
  };
  return (
    <>
      <div className="customer-form mt-5">
        <form onSubmit={registerUser}>
          <h4 className="form-header">Register User</h4>
          <input
            type="text"
            placeholder="Enter username"
            className="inp"
            name="email"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          ></input>
          <input
            type="password"
            placeholder="Enter password"
            name="password"
            className="inp"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          ></input>
          <input
            className="lbtn btn btn-success mx-3"
            type="submit"
            value="Register User"
          />
          {alertMessage && (
            <p className="red mx-4">Username and password cannot be empty</p>
          )}
          <span className="mx-4 mt-3 text-nowrap">Have account?</span>
          <span
            onClick={navigateTo}
            className="cursor-pointer mb-1 text-nowrap btn btn-link"
          >
            Sign In
          </span>
        </form>
      </div>
    </>
  );
};

export default RegisterForm;
