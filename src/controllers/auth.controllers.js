import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { GenerateToken } from "../utils/getjwt.util.js";
import cloudinary from "../utils/cloudinary.util.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, profilePic } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      profilePic,
    });

    if (newUser) {
      const token = GenerateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json(
        {
          message: "Signup successful",
          userId: newUser._id,
          fullname: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        },
        token
      );
    } else {
      res.status(400).json({ message: "failed to signup" });
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled " });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = GenerateToken(existingUser._id, res);
    res.status(200).json({
      message: "Login successful",
      user: {
        id: existingUser._id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        profilePic: existingUser.profilePic,
      },
      token,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: false, // Only if you're using HTTPS
    sameSite: "Strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

export const updateDP = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userID = req.user._id;
    if (!profilePic)
      return res.status(400).json({ message: "all fields are required" });
    const uploadResponst = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { profilePic: uploadResponst.secure_url },
      { new: true }
    );
    res.status(200).json({ updatedUser });
  } catch (error) {
    // console.log("error in updateDP" + error);
    return res.status(500).json({ message: "error is updating the profile" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    // console.log("error in checkAuth" + error);

    res.status(500).json(error);
  }
};
