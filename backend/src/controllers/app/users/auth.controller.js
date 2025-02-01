const Joi = require("joi");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { handleControllerError } = require("../../../../utils/helpers");
const User = require("../../../models/user.model");
const uuid = require("uuid");
const env = require("../../../../config/env");

// validation schemas
const registrationSchema = Joi.object({
  name: Joi.string().required().label("Name"),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  country: Joi.string().required().label("Country"),
  confirm_password: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});



// Module Exports
module.exports = {
  register,
  verifyToken,
  login,
};

/**
 * @description add poll
 */
async function register(req) {
  try {
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      throw Error(error.details[0].message);
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      console.log("existingUser", existingUser);
      throw Error("User already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new poll creator
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the poll creator
    await user.save();

    // TODO: Send account creation notification

    return true;
  } catch (e) {
    throw handleControllerError(e);
  }
}

/**
 * @description verify token
 */
async function verifyToken(req) {
  try {
    const { token } = req.params;

    // Find the user with the verification token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      throw Error("Invalid verification token");
    }

    // Update poll user's verification status
    user.is_verified = true;
    user.verification_token = undefined;
    await user.save();

    return true;
  } catch (e) {
    throw handleControllerError(e);
  }
}

// Function to find the user by email or username
async function findUserByEmailOrUsername(emailOrUsername) {
  try {
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername }, // Search by email
        { username: emailOrUsername }, // Search by username
      ],
    });

    return user;
  } catch (error) {
    // Handle the error here
    console.error("Error finding user:", error.message);
    throw error;
  }
}

async function login(req) {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      throw Error(error.details[0].message);
    }

    const { email, password } = req.body;

    // Find the user by email or username
    let user = await User.findOne({ email }).select("+password");

    // If user not found or password is incorrect, return error
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw Error("Invalid email or password");
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name, role: "user" },
      env.JWT_SECRET
    );

    return { token };
  } catch (e) {
    throw handleControllerError(e);
  }
}

