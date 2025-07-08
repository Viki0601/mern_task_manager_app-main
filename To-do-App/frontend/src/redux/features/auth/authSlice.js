import { createSlice } from "@reduxjs/toolkit";

const getValidUserInfo = () => {
  try {
    const stored = localStorage.getItem("userInfo");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    // Check for a valid user object (adjust key as needed)
    if (parsed && (parsed.email || parsed._id || parsed.id)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

const initialState = {
  userInfo: getValidUserInfo(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      // Only store valid user info
      const user = action.payload;
      if (user && (user.email || user._id || user.id)) {
        state.userInfo = user;
        localStorage.setItem("userInfo", JSON.stringify(user));
        const expirationTime = Date.now() + 30 * 24 * 60 * 60 * 1000;
        localStorage.setItem("expirationTime", expirationTime);
      } else {
        state.userInfo = null;
        localStorage.removeItem("userInfo");
        localStorage.removeItem("expirationTime");
      }
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
