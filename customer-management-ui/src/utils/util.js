import { redirect } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
export function verifyToken() {
  const token = sessionStorage.getItem("token");
  let statusCode;
  axiosInstance.get("validate-token").then((response)=>{
  }).catch((err) =>{
    statusCode = err.response.status;
    return redirect("/");
  })
  if (!token) {
    return redirect("/");
  }
  return null;
}

export function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}$/;
  return emailRegex.test(email);
}

// Validate password with specific criteria
export function validatePassword(password) {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  return passwordRegex.test(password);
}

export function handleError(err) {
  console.log(err.response.status);
  if (err.response.status === 401) {
    console.log("Expired");
    sessionStorage.removeItem("token");
    return redirect("/");
  }
  return false;
}


