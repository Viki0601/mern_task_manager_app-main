/* eslint-disable react/prop-types */
import Button from "./Button";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

const OAuth = ({ title }) => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      // Step 1: Google sign-in popup
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const user = resultsFromGoogle?.user;

      if (!user) {
        toast.error("Google authentication failed");
        return;
      }

      // Step 2: Send user info to your backend
      const res = await fetch(`${baseUrl}/api/v1/user/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ cookies for session
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          googlePhotoUrl: user.photoURL,
        }),
      });

      let data;
      const text = await res.text(); // <-- avoid direct .json()
      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        console.error("❌ Invalid JSON from backend:", err);
        toast.error("Server error: Invalid response format");
        return;
      }

      if (!res.ok) {
        toast.error(data?.message || "Google login failed");
        return;
      }

      // Step 3: Update Redux & redirect
      dispatch(setCredentials(data));
      toast.success("Login successful");
      navigate("/");

    } catch (error) {
      console.error("❌ OAuth error:", error);
      toast.error("Google login failed. Please try again.");
    }
  };

  return (
    <Button
      type="button"
      className="bg-blue-600 text-white mx-auto block rounded-md p-2 m-4 justify-center"
      onClick={handleGoogleClick}
    >
      {title}
    </Button>
  );
};

export default OAuth;
