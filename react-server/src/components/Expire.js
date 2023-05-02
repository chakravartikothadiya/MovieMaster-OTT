import { colors } from "@mui/material";
import { useState } from "react";
import { Navigate } from "react-router-dom";

const Expire = () => {
  return (
    <div>
      <h1 style={{ color: "white" }}>
        Your session has expired. Please logout and login again!
      </h1>
    </div>
  );
};

export default Expire;
