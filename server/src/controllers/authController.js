import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (user) => {
  const payload = { id: user._id, email: user.email, username: user.username };
  const expiresIn = process.env.JWT_EXPIRES_IN || "1h";
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

export const register = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, username, email, passwordHash });
    const token = signToken(user);

    return res.status(201).json({ token, user: { id: user._id, email: user.email, username: user.username } });
  } catch (err) {
    return res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifier and password are required" });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);
    return res.json({ token, user: { id: user._id, email: user.email, username: user.username } });
  } catch (err) {
    return res.status(500).json({ message: "Login failed" });
  }
};

export const logout = async (req, res) => {
  return res.json({ message: "Logged out" });
};
