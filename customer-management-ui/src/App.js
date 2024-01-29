import CreateCustomer from "./pages/CreateCustomer";
import CustomerList from "./pages/CustomerList";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayOut from "./pages/RootLayOut";
import Login from "./pages/Login";
import RegisterForm from "./pages/RegisterForm";
import { verifyToken } from "./utils/util";
import Alert from "./components/Alert";
import { useState } from "react";

function App() {

  const [alert, setAlert] = useState({ message: "", type: "" });
  const showAlert = (message, type) => {
    setAlert({ message, type });
  };
  const hideAlert = () => {
    setAlert({ message: "", type: "" });
  };

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <RootLayOut />,
      children: [
        { path: "/", element: <Login /> },
        { path: "/register", element: <RegisterForm showAlert={showAlert} /> },
        {
          path: "/create",
          element: <CreateCustomer showAlert={showAlert} />,
          loader: verifyToken,
        },
        {
          path: "/update/:email",
          element: <CreateCustomer showAlert={showAlert} />,
          loader: verifyToken,
        },
        {
          path: "/customers",
          element: <CustomerList showAlert={showAlert} />,
          loader: verifyToken,
        },
      ],
    },
  ]);

  return (
    <>
      {alert.message && (
        <Alert message={alert.message} type={alert.type} onClose={hideAlert} />
      )}
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;
