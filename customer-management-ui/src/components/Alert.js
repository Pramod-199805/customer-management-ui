import React, { useEffect } from "react";

const Alert = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);
  return (
    <div className={`alert alert-${type} alert-width`} role="alert">
      {message}
    </div>
  );
};

export default Alert;
