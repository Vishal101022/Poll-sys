const os = require("os");
const User = require('../../models/user.model');
const Poll = require('../../models/poll.model');
const Creator = require('../../models/creator.model');
const { handleControllerError } = require("../../../utils/helpers");

// Module Exports
module.exports = {
 getApplicationStats
};


async function getApplicationStats(req) {
  try {
    // calculate number of polls
    const total_polls = await Poll.countDocuments();

    // calculate number of creators
    const total_creators = await Creator.countDocuments();

    // calculate number of users
    const total_users = await User.countDocuments();

    return {
      total_polls,
      total_creators,
      total_users,
    }
  } catch (e) {
    throw handleControllerError(e);
  }
}