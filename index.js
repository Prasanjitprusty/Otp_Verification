import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectToMongo from "./config/db.js";
import userRoutes from "./routes/user.js";

const app = express();
const port = process.env.PORT || 8000;

// Connect to MongoDB
connectToMongo();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/v1", userRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
