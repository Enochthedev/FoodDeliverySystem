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
  logoutUser,
  createCourier,
  removeCourier,
  getAllUsers,
  getAllCouriers,
  toggleUserStatus,
  toggleCourierStatus
} from "../controllers/userController.js";
import authmiddleware from "../middleware/auth.js";

const userroute = express.Router();

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     description: Allows a new user to sign up.
 *     tags: [User]
 */
userroute.post("/register", registeruser);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token.
 *     tags: [User]
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
 */
userroute.get("/profile", authmiddleware, getUserProfile);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update user profile
 *     description: Updates user profile information.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 */
userroute.put("/profile", authmiddleware, updateUserProfile);

/**
 * @swagger
 * /api/user/update-roles:
 *   put:
 *     summary: Update user roles
 *     description: Allows updating user roles.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 */
userroute.put("/update-roles", authmiddleware, updateUserRoles);

/**
 * @swagger
 * /api/user/delete:
 *   delete:
 *     summary: Delete user account
 *     description: Permanently deletes a user account.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 */
userroute.delete("/delete", authmiddleware, deleteUserAccount);

/**
 * @swagger
 * /api/user/request-password-reset:
 *   post:
 *     summary: Request password reset
 *     description: Sends a password reset link to the user's email.
 *     tags: [User]
 */
userroute.post("/request-password-reset", requestPasswordReset);

/**
 * @swagger
 * /api/user/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Allows users to reset their password using a token.
 *     tags: [User]
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
 */
userroute.put("/change-password", authmiddleware, changePassword);

/**
 * @swagger
 * /api/user/verify-email:
 *   post:
 *     summary: Verify email
 *     description: Verifies a user's email address.
 *     tags: [User]
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
 */
userroute.post("/logout", authmiddleware, logoutUser);

/**
 * @swagger
 * /api/admin/create-courier:
 *   post:
 *     summary: Create a new courier (Admin)
 *     description: Allows admins to create a new courier account.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 */
userroute.post("/admin/create-courier", authmiddleware, createCourier);

/**
 * @swagger
 * /api/admin/remove-courier:
 *   delete:
 *     summary: Remove a courier (Admin)
 *     description: Allows admins to remove a courier from the system.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 */
userroute.delete("/admin/remove-courier", authmiddleware, removeCourier);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin)
 *     description: Fetch all registered users.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 */
userroute.get("/admin/users", authmiddleware, getAllUsers);

/**
 * @swagger
 * /api/admin/couriers:
 *   get:
 *     summary: Get all couriers (Admin)
 *     description: Fetch all registered couriers.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 */
userroute.get("/admin/couriers", authmiddleware, getAllCouriers);

/**
 * @swagger
 * /api/admin/toggle-user-status:
 *   put:
 *     summary: Activate or deactivate any user (Admin)
 *     description: Allows admins to update a user's status.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "65f2b1e9e2d2a4f1d89a23a1"
 *               status:
 *                 type: string
 *                 enum: ["active", "inactive"]
 *     responses:
 *       200:
 *         description: User status updated successfully
 */
userroute.put("/api/admin/toggle-user-status", authmiddleware, toggleUserStatus);

/**
 * @swagger
 * /api/courier/toggle-status:
 *   put:
 *     summary: Activate or deactivate courier status
 *     description: Allows couriers to update their own status.
 *     tags: [Courier]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["active", "inactive"]
 *     responses:
 *       200:
 *         description: Courier status updated successfully
 */
userroute.put("/api/courier/toggle-status", authmiddleware, toggleCourierStatus);

export default userroute;
