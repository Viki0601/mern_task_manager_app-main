import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const email = params.get("email");

  const [password, setPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/v1/user/reset-password", {
        email,
        password,
      });
      alert("Password reset successful!");
    } catch (err) {
      console.error(err);
      alert("Error resetting password");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl font-semibold mb-4">Reset Password for {email}</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          className="w-full mb-4 p-2 border rounded"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
