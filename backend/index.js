import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const Port = process.env.Port || 8000;

app.get("/", (req, res) => {
  res.send("Api is working");
});

//database connection
mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
    });
    console.log("Mongodb is connected");
  } catch (err) {
    console.log("Mongodb is connected failed");
  }
};

//middleware
app.use(express.json());
app.use(cookieParser());

app.listen(Port, () => {
  connectDB();
  console.log("server is running on port" + Port);
});