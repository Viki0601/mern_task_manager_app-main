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
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const user = resultsFromGoogle?.user;

      if (!user) {
        toast.error("Google authentication failed");
        return;
      }

      // 🔁 Send user info to your backend
      const res = await fetch(`${baseUrl}/api/v1/user/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Important for secure cookies
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          googlePhotoUrl: user.photoURL,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text(); // fallback to text if JSON fails
        console.error("Backend error:", errorText);
        toast.error("Google login failed: " + errorText);
        return;
      }

      const data = await res.json();

      // ✅ Save to Redux and localStorage
      dispatch(setCredentials(data));
      toast.success("Login successful");
      navigate("/");

    } catch (error) {
      console.error("OAuth error:", error);
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
