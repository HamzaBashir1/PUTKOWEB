import User from "../models/UserSchema.js";
// import host from "../models/hostSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15h",
  });
};

export const register = async (req, res) => {
  const { email, password, name, role, phosto, gender } = req.body;

  try {
    let user = null;

    if (role === "guest") {
      user = await User.findOne({ email });
    } else if (role === "host") {
      user = await host.findOne({ email });
    }

    //check if user exist
    if (user) {
      return res.status(400).json({ message: "User already exist" });
    }

    //hash password
    const Salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, Salt);

    if (role === "guest") {
      user = new User({
        name,
        email,
        password: hashPassword,
        // phosto,
        // gender,
        // role,
      });
    }

    if (role === "host") {
      user = Host({
        name,
        email,
        password: hashPassword,
        phosto,
        gender,
        role,
      });
    }

    await user.save();

    res.status(200).json({ success: true, message: "User successfully created" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email } = req.body;
  try {
    let user = null;

    const guest = await User.findOne({ email });
    const host = await host.findOne({ email });

    if (guest) {
      user = guest;
    }
    if (host) {
      user = host;
    }

    //check if user exist or not
    if (!user) {
      return res.Status(404).json({ message: "User not found" });
    }

    //compare password
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ status: false, message: "Invalid credential" });
    }

    //get token
    const token = generateToken(user);

    const { password, role, appointments, ...rest } = user._doc;

    res.status(200).json({ status: true, message: "Successfully login", token, data: { ...rest }, role });
  } catch (err) {
    res.status(400).json({ status: false, message: "Failed to login" });
  }
};