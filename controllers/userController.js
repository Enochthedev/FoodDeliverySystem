import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import usermodel from "../models/userModel.js";

// Create JWT Token
const create_jwt_token = (id, roles) => {
  return jwt.sign({ id, roles }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// login user for all roles
const loginuser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Not Found!" });
    }
    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const token = create_jwt_token(user._id, user.roles);
    res.json({ success: true, token, roles: user.roles });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error!" });
  }
};

// Forgot Password - Request Reset Token
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // TODO: Send resetToken via email using a mailer service

    res.json({ success: true, message: "Password reset link sent to email" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error processing request" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await usermodel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.json({ success: false, message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error resetting password" });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await usermodel.findById(req.user.id);
    
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect old password" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error changing password" });
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  try {
    const { email, token } = req.body;
    const user = await usermodel.findOne({ email, emailVerificationToken: token });

    if (!user) {
      return res.json({ success: false, message: "Invalid token or email" });
    }

    user.isVerified = true;
    user.emailVerificationToken = null;
    await user.save();

    res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error verifying email" });
  }
};

// Logout User (Implementation depends on token management)
const logoutUser = async (req, res) => {
  try {
    // If using a token blacklist system, store token in a blacklist
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error logging out" });
  }
};

// register user with roles
const registeruser = async (req, res) => {
  try {
    const { firstName, lastName, course, matricNumber, password, email, sex, roles } = req.body;
    const exists = await usermodel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please Enter a Valid Email!" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Please Enter a Strong Password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const newuser = new usermodel({
      name: firstName,
      lastName: lastName,
      course: course,
      matricNumber: matricNumber,
      sex: sex,
      email: email,
      password: hashedpassword,
      roles: roles || ["user"],
    });
    const user = await newuser.save();
    const token = create_jwt_token(user._id, user.roles);
    res.json({ success: true, token, roles: user.roles });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await usermodel.findById(req.user.id).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching user profile" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, course, matricNumber, sex, email } = req.body;
    const userId = req.user.id;

    const user = await usermodel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Ensure email is unique if changed
    if (email && email !== user.email) {
      const emailExists = await usermodel.findOne({ email });
      if (emailExists) {
        return res.json({ success: false, message: "Email already in use" });
      }
    }

    // Update fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (course) user.course = course;
    if (matricNumber) user.matricNumber = matricNumber;
    if (sex) user.sex = sex;
    if (email) user.email = email;

    await user.save();
    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating profile" });
  }
};

// Update user roles
const updateUserRoles = async (req, res) => {
  try {
    const { userId, roles } = req.body;

    const user = await usermodel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    user.roles = roles;
    await user.save();

    res.json({ success: true, message: "User roles updated successfully", roles: user.roles });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating user roles" });
  }
};

// Delete user account
const deleteUserAccount = async (req, res) => {
  try {
    const user = await usermodel.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User account deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error deleting user account" });
  }
};

export {
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
};
