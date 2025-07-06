import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const NonAuthenticatedUser = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  if (userInfo) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default NonAuthenticatedUser;
