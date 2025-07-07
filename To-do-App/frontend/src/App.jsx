import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setCredentials } from "./redux/features/auth/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // ✅ Listen for messages from the OAuth popup
    const handleOAuthMessage = (event) => {
      const allowedOrigin = import.meta.env.VITE_FRONTEND_BASE_URL;

      if (event.origin !== allowedOrigin) return;

      const { user } = event.data || {};
      if (user) {
        dispatch(setCredentials(user));
        toast.success("Google login successful (via postMessage)");
      }
    };

    window.addEventListener("message", handleOAuthMessage);

    return () => window.removeEventListener("message", handleOAuthMessage);
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer />
      <Header />

      {/* Child routes render here */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
