import mongoose from "mongoose";

/**
 * Connects to MongoDB using Mongoose.
 * 
 * This function:
 * 1. Uses Mongoose to connect to the MongoDB database specified by the `MONGODB` environment variable.
 * 2. Logs a success message to the console if the connection is successful.
 * 3. Logs any errors that occur during the connection attempt.
 * 
 * This setup is essential for enabling communication between the application and the MongoDB database.
 */
export default () => {
  mongoose
    .connect(process.env.MONGODB)
    .then(() => {
      console.log("Connected to MongoDB!");
    })
    .catch((error) => {
      console.log(error);
    });
};
