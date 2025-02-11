const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { handleControllerError } = require("../../utils/helpers");
const PollCreator = require("../models/creator.model");
const User = require("../models/creator.model");
const uuid = require("uuid");

const env = require("../../config/env");

// validation schemas
const registrationSchema = Joi.object({
  name: Joi.string().required().label("Name"),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
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
  uploadProfilePicture,
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
    const existingUser = await PollCreator.findOne({ email });
    if (existingUser) {
      throw Error("User already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = uuid.v4();

    // Create a new poll creator
    const pollCreator = new PollCreator({
      name,
      email,
      password: hashedPassword,
      verificationToken,
    });

    // Save the poll creator
    await pollCreator.save();

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

    // Find the poll creator with the verification token
    const pollCreator = await PollCreator.findOne({ verificationToken: token });

    if (!pollCreator) {
      throw Error("Invalid verification token");
    }

    // Update poll creator's verification status
    pollCreator.isVerified = true;
    pollCreator.verificationToken = undefined;
    await pollCreator.save();

    return true;
  } catch (e) {
    throw handleControllerError(e);
  }
}

async function login(req) {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      throw Error(error.details[0].message);
    }

    const { email, password } = req.body;

    // Find the poll creator by email
    const pollCreator = await PollCreator.findOne({ email });

    // If poll creator not found or password is incorrect, return error
    if (
      !pollCreator ||
      !(await bcrypt.compare(password, pollCreator.password))
      // || !pollCreator.isVerified
    ) {
      throw Error("Invalid email or password");
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: pollCreator._id, name: pollCreator.name, role: "creator" },
      env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { token };
  } catch (e) {
    throw handleControllerError(e);
  }
}

// Route to handle profile picture upload
async function uploadProfilePicture(req, res) {
  try {
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      throw new Error("User not found");
    }

    user.profilePicture = req.file.path;
    await user.save();

    return { profilePicture: req.file.path }; 
  } catch (e) {
    console.error("Error uploading profile picture:", e);
    throw e; 
  }
}

