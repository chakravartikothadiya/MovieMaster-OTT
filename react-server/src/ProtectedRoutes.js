import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  let session_data_auth = localStorage.getItem("session_auth");
  if (session_data_auth === "false") session_data_auth = false;
  let session_data_emailID = localStorage.getItem("session_email");

  return session_data_auth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
