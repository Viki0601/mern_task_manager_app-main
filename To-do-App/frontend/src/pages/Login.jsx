import { useForm } from "react-hook-form";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { setCredentials } from "../redux/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth"; // ✅ Google login component added
import { useState } from "react";

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password should be at least 8 characters"),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [backendError, setBackendError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const login = async (formData) => {
    setBackendError("");
    try {
      const { data } = await axios.post(`${baseURL}/api/v1/user/login`, formData, {
        withCredentials: true,
      });
      console.log("Backend login response:", data);
      // Validate user object
      if (data && (data.email || data._id || data.id)) {
        dispatch(setCredentials(data));
        toast.success("Login successful");
        navigate("/");
      } else {
        setBackendError("Login failed: Invalid user data returned from server.");
        toast.error("Login failed: Invalid user data returned from server.");
      }
    } catch (error) {
      console.error("Login error:", error, error.response);
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "An error occurred during login";
      setBackendError(message);
      toast.error(message);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="mx-auto w-full max-w-lg rounded-xl p-10">
        <h2 className="text-2xl font-bold m-2 text-blue-600">Login</h2>
        <div className="border border-blue-600 rounded-md">
          <form onSubmit={handleSubmit(login)}>
            <div className="space-y-4 p-4">
              <div>
                <Input
                  placeholder="Email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
                <p className="text-right text-sm text-blue-600 hover:underline mt-1">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </p>
              </div>
              <Button
                textColor="text-white"
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
              {backendError && (
                <p className="text-red-500 text-center my-2">{backendError}</p>
              )}
            </div>

            <OAuth title="Login with Google" />

            <p className="text-center text-black my-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
