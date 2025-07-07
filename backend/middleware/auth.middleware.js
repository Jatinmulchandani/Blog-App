import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = async (req, res, next) => {

  console.log("hello")
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  console.log("Received token:", token);
  console.log("JWT_SECRET in middleware:", process.env.JWT_SECRET);
  

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // 🧪 Add this
  
    req.user = await User.findById(decoded._id).select("-password");
  
    if (!req.user) {
      console.log("User not found for decoded._id:", decoded._id); // Debug
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    console.log("Authenticated user:", req.user.name);
    next();
    
  } catch (error) {
    console.error("JWT error:", error.message); // See reason
    return res.status(401).json({ message: "Invalid token" });
  }
};

