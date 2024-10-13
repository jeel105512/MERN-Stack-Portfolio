import authRoutes from "../routes/auth.routes.js";
import userRoutes from "../routes/user.routes.js";

/**
 * Sets up the application's authentication routes.
 * 
 * This function:
 * 1. Takes an Express app instance as an argument.
 * 2. Registers the authentication routes under the `/api/auth` path.
 * 
 * This setup allows the application to handle authentication-related requests, such as registration, login, and logout, through the specified routes.
 * 
 * @param {Object} app - The Express application instance to configure.
 */
export default (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);
};