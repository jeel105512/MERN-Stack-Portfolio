import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";

import User from "../models/user.model.js";
import dotenv from "dotenv";

// Configure environmental variables
dotenv.config();

// Configure Passport with a local strategy for authentication
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email", // Field name for the username (email in this case)
      passwordField: "password", // Field name for the password
    },
    /**
     * Verify the user's credentials.
     *
     * This function is called by Passport when a user attempts to log in with their credentials.
     * It:
     * 1. Searches for a user with the provided email.
     * 2. If no user is found, it returns an error message indicating the email is incorrect.
     * 3. If a user is found, it verifies the provided password.
     * 4. If the password is incorrect, it returns an error message indicating the password is incorrect.
     * 5. If the email and password are correct, it returns the user object.
     * 6. Passes any errors to the `done` callback.
     *
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @param {Function} done - The callback to call with the authentication result.
     */
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }
        const isMatch = await user.verifyPassword(password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Configure Passport with a Google strategy for authentication
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    /**
     * Verify the user's credentials using Google.
     *
     * This function is called by Passport when a user attempts to log in with their Google account.
     * It:
     * 1. Searches for a user with the provided Google ID.
     * 2. If no user is found, it creates a new user with information from the Google profile.
     * 3. Returns the user object.
     * 4. Passes any errors to the `done` callback.
     *
     * @param {string} accessToken - The access token provided by Google.
     * @param {string} refreshToken - The refresh token provided by Google.
     * @param {Object} profile - The user's profile information from Google.
     * @param {Function} done - The callback to call with the authentication result.
     */
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          // Generate a random password
          const randomPassword = User.prototype.generateRandomPassword();
          user = await User.create({
            googleId: profile.id,
            name: profile._json.name,
            email: profile._json.email,
            password: randomPassword, // Set the generated password
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Configure Passport with a GitHub strategy for authentication
passport.use(
  "github",
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/auth/github/callback",
    },
    /**
     * Verify the user's credentials using GitHub.
     *
     * This function is called by Passport when a user attempts to log in with their GitHub account.
     * It:
     * 1. Searches for a user with the provided GitHub ID.
     * 2. If no user is found, it creates a new user with information from the GitHub profile.
     * 3. Returns the user object.
     * 4. Passes any errors to the `done` callback.
     *
     * @param {string} accessToken - The access token provided by GitHub.
     * @param {string} refreshToken - The refresh token provided by GitHub.
     * @param {Object} profile - The user's profile information from GitHub.
     * @param {Function} done - The callback to call with the authentication result.
     */
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
          // Generate a random password
          const randomPassword = User.prototype.generateRandomPassword();
          user = await User.create({
            githubId: profile.id,
            name: profile.displayName,
            email: profile._json.email || "unknown@example.com", // temporary fix
            password: randomPassword, // Set the generated password
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

/**
 * Serialize the user for the session.
 *
 * This function is called when a user is authenticated. It:
 * 1. Takes the user object and stores the user ID in the session.
 * 2. This ID is used to identify the user in subsequent requests.
 *
 * @param {Object} user - The authenticated user object.
 * @param {Function} done - The callback to call with the serialized user ID.
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
 * Deserialize the user from the session.
 *
 * This function is called on each request to retrieve the user object based on the user ID stored in the session. It:
 * 1. Finds the user by their ID.
 * 2. Passes the user object to the `done` callback.
 * 3. Passes any errors to the `done` callback if the user cannot be found.
 *
 * @param {string} id - The user ID stored in the session.
 * @param {Function} done - The callback to call with the user object or an error.
 */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
