import User from "../model/user.js";
import bcrypt from "bcryptjs";
import { generateJWTToken } from "../utils/generateJWTToken.js";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Please fill in all fields." });
      }
      const userExits = await User.findOne({ email });
      if (userExits) {
        return res.status(400).json({ message: "Email already in use." });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email,
        password: hashedPassword,
      });
  
      await user.save();
  
      generateJWTToken(res, user._id);
  
      res.status(201).json({
        success: true,
        message: "User successfully created",
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
  export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid Credentials",
        });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Invalid Credentials",
        });
      }
  
      generateJWTToken(res, user._id);
  
      res.status(200).json({
        success: true,
        message: "User successfully logged in",
      });
    } catch (error) {
      console.log("error logging in", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
  export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  };
  export const checkAuth = async (req, res) => {
    try {
      const user = await User.findById(req.userId);
  
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }
  
      res.status(200).json({
        success: true,
        user: { ...user._doc, password: undefined },
      });
    } catch (error) {
      console.log(error);
      res.status(401).json({
        success: false,
        message: "Error checking authentication",
      });
    }
  };