import express, { urlencoded } from "express";
import dotenv from "dotenv";
import RouutesSetup from "./lib/RoutesSetup.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));

RouutesSetup(app);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500; // Default to 500 if no status code is set
  const message = error.message || "Internal server error"; // Default message if none is provided
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on: http://localhost:${PORT}`);
})