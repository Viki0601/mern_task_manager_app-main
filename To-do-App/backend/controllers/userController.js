import userModel from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const domain =
  process.env.NODE_ENV === "production"
    ? "taskmanger-server-qg2o.onrender.com"
    : "localhost";

// ========== Signup ==========
const signupUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  const existUser = await userModel.findOne({ email });
  if (existUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new userModel({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    generateToken(res, newUser._id);
    return res.status(201).json({
      _id: newUser._id,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
    });
  } catch (error) {
    return res.status(400).json({ message: "Invalid user data" });
  }
});

// ========== Login ==========
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (isPasswordValid) {
      generateToken(res, existingUser._id);
      return res.status(200).json({
        _id: existingUser._id,
        firstname: existingUser.firstname,
        lastname: existingUser.lastname,
        email: existingUser.email,
      });
    } else {
      return res.status(401).json({ message: "Invalid Password" });
    }
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

// ========== Logout ==========
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return res.status(200).json({ message: "Logged out successfully" });
});

// ========== Google OAuth ==========
const google = asyncHandler(async (req, res) => {
  const { name, email, googlePhotoUrl } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Missing name or email" });
  }

  try {
    let user = await userModel.findOne({ email });

    if (!user) {
      const randomPassword = `${Math.random().toString(36).slice(-8)}${Math.random().toString(36).slice(-8)}`;
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await userModel.create({
        firstname: name,
        lastname: name,
        email,
        profilePicture: googlePhotoUrl,
        password: hashedPassword,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password, ...userData } = user._doc;

    return res
      .status(200)
      .cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 24 * 60 * 60 * 1000,
        signed: true,
      })
      .json(userData);
  } catch (error) {
    console.error("Google login error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// ========== Forgot Password ==========
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Please provide an email address" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:5173/reset-password?email=${email}`;

    const mailOptions = {
      from: `"To-Do App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your password",
      html: `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Reset link sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({ message: "Failed to send the link" });
  }
});

// ========== Reset Password ==========
const resetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();

  return res.status(200).json({ message: "Password updated successfully" });
});

// ========== Exports ==========
export {
  signupUser,
  loginUser,
  logoutUser,
  google,
  forgotPassword,
  resetPassword,
};

