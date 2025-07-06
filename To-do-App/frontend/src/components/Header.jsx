import axios from "axios";
import Button from "./Button";
import { BiTask } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../redux/features/auth/authSlice";

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

const logoutUser = async () => {
  const { data } = await axios.post(`${baseURL}/api/v1/user/logout`);
  return data;
};

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userinfo = useSelector((state) => state.auth.userInfo);

  const isLoginPage = window.location.pathname === "/login";
  const isSignupPage = window.location.pathname === "/signup";

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      toast.success("Logout successful");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during logout"
      );
    }
  };

  return (
    <div className="bg-blue-600">
      <div className="flex justify-between items-center text-white p-4">
        <div className="flex items-center">
          <Link to={"/"}>
            <BiTask className="text-3xl mr-4" />
          </Link>
          <span className="text-xl font-semibold">Task Manager</span>
        </div>

        <div className="flex gap-2">
          {!userinfo?.email ? (
            <>
              <Link to={"/login"}>
                <Button
                  className={`hover:bg-white hover:text-blue-600 rounded-md ${
                    isLoginPage ? "bg-white text-blue-600" : "text-white"
                  }`}
                >
                  Login
                </Button>
              </Link>
              <Link to={"/signup"}>
                <Button
                  className={`hover:bg-white hover:text-blue-600 rounded-md ${
                    isSignupPage ? "bg-white text-blue-600" : "text-white"
                  }`}
                >
                  Signup
                </Button>
              </Link>
            </>
          ) : (
            <Button
              onClick={handleLogout}
              className="bg-red-500 text-white rounded-md"
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
