const mongoose = require("mongoose");

const customSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdPolls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poll" }],
    totalPollsCreated: { type: Number, default: 0 },
    isCreator: { type: Boolean, default: false },
    isVoted: { type: Boolean, default: false },
    profilePicture: {
      type: String,
      required: false,
      default: null,
    },

    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordTokenExpiration: { type: Date },
    createdThemes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Theme" }],
    createdTemplates: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Emailtemplate" },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("creator", customSchema);
