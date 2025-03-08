import express from "express";
import {
  loginuser,
  registeruser,
  getUserProfile,
  updateUserProfile,
  updateUserRoles,
  deleteUserAccount,
  requestPasswordReset,
  resetPassword,
  changePassword,
  verifyEmail,
  logoutUser
} from "../controllers/userController.js";

const userroute = express.Router();

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     description: Allows a new user to sign up.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
userroute.post("/register", registeruser);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
userroute.post("/login", loginuser);

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves user details.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 */
userroute.get("/profile", getUserProfile);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update user profile
 *     description: Updates user profile information.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile updated
 */
userroute.put("/profile", updateUserProfile);

/**
 * @swagger
 * /api/user/update-roles:
 *   put:
 *     summary: Update user roles
 *     description: Allows updating user roles.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Roles updated successfully
 */
userroute.put("/update-roles", updateUserRoles);

/**
 * @swagger
 * /api/user/delete:
 *   delete:
 *     summary: Delete user account
 *     description: Permanently deletes a user account.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
userroute.delete("/delete", deleteUserAccount);

/**
 * @swagger
 * /api/user/request-password-reset:
 *   post:
 *     summary: Request password reset
 *     description: Sends a password reset link to the user's email.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Reset link sent
 */
userroute.post("/request-password-reset", requestPasswordReset);

/**
 * @swagger
 * /api/user/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Allows users to reset their password using a token.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Password reset successful
 */
userroute.post("/reset-password", resetPassword);

/**
 * @swagger
 * /api/user/change-password:
 *   put:
 *     summary: Change password
 *     description: Allows authenticated users to change their password.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
userroute.put("/change-password", changePassword);

/**
 * @swagger
 * /api/user/verify-email:
 *   post:
 *     summary: Verify email
 *     description: Verifies a user's email address.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Email verified successfully
 */
userroute.post("/verify-email", verifyEmail);

/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     summary: Logout user
 *     description: Logs out a user by invalidating their session.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
userroute.post("/logout", logoutUser);

export default userroute;
