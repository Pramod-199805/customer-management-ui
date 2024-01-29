import React, { useEffect, useRef, useState } from "react";
import "../styles/common.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { handleError } from "../utils/util";
import axiosInstance from "../utils/axiosInstance";

const CustomerList = ({ showAlert }) => {
  const [customerData, setCustomerData] = useState([]);
  const [data, setData] = useState({
    isDeleted: false,
    isLoader: true,
  });
  const pageNumber = useRef(1);
  const [totalPage, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const navigateTo = () => {
    navigate("/create");
  };
  useEffect(() => {
    axiosInstance
      .get("customer/v1/?pageNumber=1&pageSize=10&sortDirection&sortBy")
      .then((response) => {
        setCustomerData(response.data.data.dataList);
        setData((prev) => ({ ...prev, isLoader: false }));
        setTotalPages(response.data.data.totalPages);
        console.log(totalPage, "Page");
      })
      .catch((err) => {
        if (handleError(err)) {
          navigate("/");
        }
      })
      .finally(setData((prev) => ({ ...prev, isLoader: false })));
  }, [navigate, data.isDeleted, totalPage]);

  const editCustomer = (email) => {
    navigate(`/update/${email}`);
  };

  const deleteCustomer = (email) => {
    axiosInstance
      .delete(`customer/v1/delete/${email}`)
      .then((response) => {
        setData((prev) => ({ ...prev, isDeleted: !prev.isDeleted }));
        setData((prev) => ({ ...prev, isLoader: !prev.isLoader }));
        showAlert("User deleted Successfully!", "success");
      })
      .catch((err) => {
        handleError(err);
        showAlert("Something went wrong!", "danger");
      })
      .finally(setData((prev) => ({ ...prev, isLoader: !prev.isLoader })));
  };

  const searchCustomers = (event) => {
    setData({ ...data, isLoader: true });
    const value = event.target.value;
    axiosInstance
      .get(`http://localhost:8080/customer/v1/all-customer?searchBy=${value}`)
      .then((response) => {
        setCustomerData(response.data.data.dataList);
        setData({ ...data, isLoader: false });
      })
      .catch((err) => {
        setData((prev) => ({ ...prev, isLoader: false }));
      })
      .finally(setData((prev) => ({ ...prev, isLoader: false })));
  };

  const sortBy = (value, pageNumber) => {
    console.log(pageNumber, "pno");
    setData({ ...data, isLoader: true });
    axios
      .get(
        `http://localhost:8080/customer/v1/?pageNumber=${pageNumber}&pageSize&sortDirection&sortBy=${value}`
      )
      .then((response) => {
        setCustomerData(response.data.data.dataList);
        setData((prev) => ({ ...prev, isLoader: false }));
        pageNumber.current = pageNumber;
      })
      .catch((err) => {
        setData((prev) => ({ ...prev, isLoader: false }));
      })
      .finally(setData((prev) => ({ ...prev, isLoader: false })));
  };

  const previousPage = () => {
    console.log(pageNumber.current);
    let pageNo = pageNumber.current === 1 ? 1 : pageNumber.current - 1;
    sortBy("", pageNo);
    pageNumber.current = pageNo;
  };
  const showNext =() =>{
    console.log(pageNumber.current ,"Next");
    let pageNo = pageNumber.current + 1;
    sortBy("", pageNo);
    pageNumber.current = pageNo;
  }

  const logOut = () => {
    window.sessionStorage.clear();
    navigate("/");
  };
  return (
    <>
      {data.isLoader && <div className="overlay"></div>}
      <div className="d-flex justify-content-end me-5 mt-3">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={logOut}
        >
          Logout
        </button>
      </div>

      <div className="container d-flex gap-3">
        <div className="mt-3">
          <button
            type="button"
            className="btn btn-success"
            onClick={navigateTo}
          >
            Add Customer
          </button>
        </div>

        <div className="">
          <div className="dropdown mt-3">
            <button
              className="btn btn-success dropdown-toggle"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Sort By
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li>
                <span
                  className="cursor-pointer dropdown-item pe-auto"
                  onClick={() => {
                    sortBy("firstName", 1);
                  }}
                >
                  First Name
                </span>
              </li>
              <li>
                <span
                  className="cursor-pointer dropdown-item pe-auto"
                  onClick={() => {
                    sortBy("email", 1);
                  }}
                >
                  Email
                </span>
              </li>
              <li>
                <span
                  className="cursor-pointer dropdown-item pe-auto"
                  onClick={() => {
                    sortBy("city", 1);
                  }}
                >
                  City
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="">
          <input
            type="search"
            placeholder="Search"
            className="inp-search"
            onChange={searchCustomers}
          ></input>
        </div>
      </div>
      <table className="table container mt-3">
        <thead>
          <tr>
            <th scope="col">SI NO</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Email</th>
            <th scope="col">Street</th>
            <th scope="col">City</th>
            <th scope="col">State</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {customerData.map((customer, index) => (
            <tr key={index}>
              <td>{++index}</td>
              <td>{customer.firstName}</td>
              <td>{customer.lastName}</td>
              <td>{customer.email}</td>
              <td>{customer.street}</td>
              <td>{customer.city}</td>
              <td>{customer.state}</td>
              <td>
                <i
                  className="bi bi-pencil-square cursor-pointer color-edit"
                  onClick={() => editCustomer(customer.email)}
                ></i>
                <i
                  className="bi bi-archive-fill px-2 cursor-pointer color-delete"
                  onClick={() => deleteCustomer(customer.email)}
                ></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.isLoader && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {customerData.length <= 0 && (
        <p className="text-center">No Records Found</p>
      )}
      <nav aria-label="Page navigation example">
        <ul className="container pagination justify-content-end ">
          <li className="page-item">
            <a
              className="page-link cursor-pointer"
              tabIndex="-1"
              onClick={previousPage}
            >
              Previous
            </a>
          </li>
          {(() => {
            const pages = [];
            for (let i = 1; i <= 3; i++) {
              pages.push(
                <li key={i} className="page-item">
                  <a
                    className="page-link cursor-pointer"
                    onClick={() => {
                      sortBy("", i);
                    }}
                  >
                    {i}
                  </a>
                </li>
              );
            }
            return pages;
          })()}
          {totalPage !== 0 && (
            <li className="page-item cursor-pointer">
              <a className="page-link" onClick={showNext}>
                Next
              </a>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default CustomerList;
