import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../components/Input";
import Button from "../components/Button";
import axios from "axios";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "" },
    resolver: zodResolver(schema),
  });

  const sendResetLink = async (formData) => {
    try {
      const res = await axios.post(`${baseURL}/api/v1/user/forgot-password`, formData);
      toast.success(res.data.message || "Reset link sent to your email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send the link");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit(sendResetLink)}
        className="w-full max-w-md border border-blue-600 p-6 rounded-md shadow"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Forgot Password</h2>
        <Input
          type="email"
          placeholder="Enter your email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
        <Button
          type="submit"
          className="mt-4 w-full"
          textColor="text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </div>
  );
}

export default ForgotPassword;
