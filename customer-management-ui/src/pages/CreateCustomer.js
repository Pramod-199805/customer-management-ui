import React, { useEffect, useState } from "react";
import "../styles/common.css";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import * as Yup from "yup";
import { handleError } from "../utils/util";

const CreateCustomer = ({showAlert}) => {
  const navigate = useNavigate();
  const { email } = useParams();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    phoneNumber: "",
  });

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone Number is required"),
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (email) {
      axiosInstance
        .get(`customer/v1/get/${email}`)
        .then((response) => {
          const { customerId, ...formDataWithoutCustomerId } =
            response.data.data; // Destructure the customerId and form data without customerId
          setFormData((prevFormData) => ({
            ...prevFormData,
            ...formDataWithoutCustomerId,
          }));
        })
        .catch((err) => {
        });
    }
  }, [email]);

  const handleForm = (event) => {
    event.preventDefault();
    validationSchema
      .validate(formData, { abortEarly: false })
      .then(() => {
        if (email) {
          console.log("Edit");
          editCustomer();
        } else {
          createCustomer();
        }
      })
      .catch((validationErrors) => {
        if (validationErrors && validationErrors.inner) {
          const newErrors = {};
          validationErrors.inner.forEach((error) => {
            newErrors[error.path] = error.message;
            setErrors(newErrors);
          });
          
        } 
      });
  };

  const createCustomer = (event) => {
    axiosInstance
      .post(`customer/v1/create`, formData)
      .then((response) => {
        navigate("/customers");
        showAlert("User created Successfully!", "success");
      })
      .catch((err) => {
        showAlert("User cannot be added. User already exists!", "danger");
      });
  };

  const editCustomer = (event) => {
    console.log("Edit");
    axiosInstance
      .put(`customer/v1/edit/${email}`, formData)
      .then((response) => {
        showAlert("User updated Successfully!", "success");
        navigate("/customers");
        
      })
      .catch((err) => {
        handleError(err);
        showAlert("User cannot be updated. User email already exists!", "danger");
      });
  };
  const navigateToHome = () => {
    navigate("/customers");
  };

  const resetForm = () =>{
    setFormData({});
  }
  return (
    <>
      <div className="customer-form mt-5">
        <div className="d-flex justify-content-between">
          <h4 className="form-header">
            {!email ? "Add Customer" : "Edit Customer"}
          </h4>
          <div>
            <i
              className="cursor-pointer bi bi-x-circle x-lg"
              onClick={navigateToHome}
            ></i>
          </div>
        </div>
        <form onSubmit={handleForm}>
          <input
            type="text"
            placeholder="Enter First Name"
            className="inp"
            name="firstName"
            value={formData.firstName}
            onChange={(e) => {
              setFormData({ ...formData, firstName: e.target.value });
              setErrors((prevErrors) => ({ ...prevErrors, firstName: "" }));
            }}
          ></input>
          {errors.firstName && (
            <p className="red mx-3 alert-msg">{errors.firstName}</p>
          )}
          <input
            type="text"
            placeholder="Enter Last Name"
            name="lastName"
            className="inp"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          ></input>
          <input
            type="text"
            placeholder="Enter Email "
            name="email"
            className="inp"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
            }}
          ></input>
          {errors.email && <p className="red mx-3 alert-msg">{errors.email}</p>}
          <input
            type="text"
            placeholder="Enter Street"
            className="inp"
            name="street"
            value={formData.street}
            onChange={(e) => {
              setFormData({ ...formData, street: e.target.value });
              setErrors((prevErrors) => ({ ...prevErrors, street: "" }));
            }}
          ></input>
          {errors.street && (
            <p className="red mx-3 alert-msg">{errors.street}</p>
          )}
          <input
            type="text"
            placeholder="Enter City"
            className="inp"
            name="city"
            value={formData.city}
            onChange={(e) => {
              setFormData({ ...formData, city: e.target.value });
              setErrors((prevErrors) => ({ ...prevErrors, city: "" }));
            }}
          ></input>
          {errors.city && <p className="red mx-3 alert-msg">{errors.city}</p>}
          <input
            type="text"
            placeholder="Enter State"
            className="inp"
            name="state"
            value={formData.state}
            onChange={(e) => {
              setFormData({ ...formData, state: e.target.value });
              setErrors((prevErrors) => ({ ...prevErrors, state: "" }));
            }}
          ></input>
          {errors.state && <p className="red mx-3 alert-msg">{errors.state}</p>}
          <input
            type="text"
            placeholder="Enter Mobile Number"
            className="inp"
            name="mobileNumber"
            value={formData.phoneNumber}
            onChange={(e) => {
              setFormData({ ...formData, phoneNumber: e.target.value });
              setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: "" }));
            }}
          ></input>
          {errors.phoneNumber && (
            <p className="red mx-3 alert-msg">{errors.phoneNumber}</p>
          )}
          <div className="d-flex">
            <input
              className="sbtn btn btn-success mx-3"
              type="submit"
              value={!email ? "Save" : "Edit"}
            />
            <input
              className="sbtn btn btn-primary mx-3"
              type="reset"
              value="Reset"
              onClick={resetForm}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateCustomer;
