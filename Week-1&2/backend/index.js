import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import blogRoutes from "./routes/blog.js";
import userRoutes from "./routes/user.js";
import  fileUpload from "express-fileupload";
import swaggerUi from "swagger-ui-express"; 
import swaggerFile from "./config/swagger-output.json" with { type: "json" };
import requestLogger from "./middleware/requestlogger.js";

dotenv.config();

const app = express();
app.use(fileUpload({
  useTempFiles:true,
  tempFileDir:"/tmp/"
}));
app.use(express.json());

const PORT = process.env.PORT || 8000;
const MONGO_URI =
  process.env.MONGO_URI

app.use(
  cors({
    origin: "*",
  })
);
app.use(requestLogger);

app.use("/api/user",userRoutes);
app.use("/api/blog",blogRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));


mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });