import { useForm } from "react-hook-form";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { setCredentials } from "../redux/features/auth/authSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useState } from "react";

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

const signupSchema = z
  .object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password should be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password should be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [backendError, setBackendError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(signupSchema),
  });

  const signup = async (formData) => {
    setBackendError("");
    try {
      const { data } = await axios.post(`${baseURL}/api/v1/user/signup`, formData, {
        withCredentials: true, // ✅ needed for sending cookies in deployment
      });

      dispatch(setCredentials(data));
      toast.success("Signup successful");
      navigate("/"); // ✅ redirect after signup
    } catch (error) {
      console.error("Signup error:", error, error.response);
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "An error occurred during signup";
      setBackendError(message);
      toast.error(message);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="mx-auto w-full max-w-lg rounded-xl p-10">
        <h2 className="text-2xl font-bold m-2 text-blue-600">Signup</h2>
        <div className="border border-blue-600 rounded-md">
          <form onSubmit={handleSubmit(signup)}>
            <div className="p-4 space-y-4">
              <div>
                <Input placeholder="First Name" {...register("firstname")} />
                {errors.firstname && (
                  <p className="text-red-500">{errors.firstname.message}</p>
                )}
              </div>
              <div>
                <Input placeholder="Last Name" {...register("lastname")} />
                {errors.lastname && (
                  <p className="text-red-500">{errors.lastname.message}</p>
                )}
              </div>
              <div>
                <Input placeholder="Email" type="email" autoComplete="email" {...register("email")} />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              {backendError && (
                <p className="text-red-500 text-center my-2">{backendError}</p>
              )}
              <Button
                textColor="text-white"
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing up..." : "Signup"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
