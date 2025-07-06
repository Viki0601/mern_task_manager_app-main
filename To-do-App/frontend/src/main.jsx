import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

import store from "./redux/store.js";
import { Provider } from "react-redux";

import axios from "axios";

import PrivateRoute from "./redux/features/auth/PrivateRoute.jsx";
import NonAuthenticatedUser from "./redux/features/auth/NonAuthenticatedUser.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from './pages/ResetPassword';
axios.defaults.withCredentials = true;

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* 👇 Public (non-auth) routes */}
      <Route element={<NonAuthenticatedUser />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />


      </Route>

      {/* 👇 Private (auth-required) routes */}
      <Route element={<PrivateRoute />}>
        <Route index element={<Home />} />
        {/* add more protected routes here */}

      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
