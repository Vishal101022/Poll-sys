const Joi = require("joi");
const mongoose = require("mongoose");
const { resMsg, defaultLen } = require("../../../config/constant");
const {
  handleControllerError,
  generateString,
} = require("../../../utils/helpers");
const Poll = require("../../models/poll.model");
const PollCreator = require("../../models/creator.model");
const PollResponse = require("../../models/poll_response.model");
const {
  createPollValidation, updatePollValidation,
} = require("../../../validations/creators/poll.validations");

// Module Exports
module.exports = {
  addPoll,
  getAllPolls,
  getPollById,
  updatePollById,
  submitPoll,
  pollResult,
  deletePoll,
};

/**
 * @description add poll
 */
async function addPoll(req) {
  try {
    const { error } = createPollValidation.validate(req.body);
    if (error) {
      throw Error(error.details[0].message);
    }

    const { body } = req;

    body.pollId = generateString(6);

    console.log("poll_controller line 35", req);

    const poll = await new Poll(body).save();

    // Update PollCreator inside the transaction
    const pollCreatorUpdateResult = await PollCreator.findByIdAndUpdate(
      req.user._id,
      {
        $push: { createdPolls: poll._id },
        $inc: { totalPollsCreated: 1 },
      }
    );

    // Check if the PollCreator update was successful
    if (!pollCreatorUpdateResult) {
      throw new Error("Failed to update poll creator with " + req.user._id);
    }

    return poll;
  } catch (e) {
    throw handleControllerError(e);
  }
}

async function getAllPolls(req) {
  try {
    const userId = req.user._id;

    const polls = await PollCreator.aggregate([
      {
        $match: { _id: userId },
      },
      {
        $lookup: {
          from: "polls",
          localField: "createdPolls",
          foreignField: "_id",
          as: "createdPolls",
        },
      },
      {
        $unwind: "$createdPolls",
      },
      {
        $sort: { "createdPolls.createdAt": -1 }, // Sort by creation date descending
      },
      {
        $group: {
          _id: "$_id",
          createdPolls: { $push: "$createdPolls" },
        },
      },
    ]);

    // Default values for pagination
    let currentPage = Number(req.query.page) || 1;
    let perPage = Number(req.query.limit) || 10;

    if (polls.length > 0) {
      const createdPolls = polls[0].createdPolls;

      // Pagination calculations
      const totalPolls = createdPolls.length;
      const totalPages = Math.ceil(totalPolls / perPage);
      const skipCount = (currentPage - 1) * perPage;

      // Slice polls for current page
      const paginatedPolls = createdPolls.slice(skipCount, skipCount + perPage);

      return {
        itemCount: totalPolls,
        docs: paginatedPolls,
        perPage,
        currentPage,
        next: currentPage < totalPages ? currentPage + 1 : null,
        prev: currentPage > 1 ? currentPage - 1 : null,
        pageCount: totalPages,
        slNo: skipCount + 1,
      };
    }

    return {
      itemCount: 0,
      docs: [],
      perPage,
      currentPage,
      next: null,
      prev: null,
      pageCount: 0,
      slNo: 0,
    };
  } catch (e) {
    throw handleControllerError(e);
  }
}

async function getPollById(req) {
  try {
    const pollId = req.params.pollId;

    // Check if pollId is provided
    if (!pollId) {
      throw new Error("Poll ID is required");
    }

    // Retrieve the poll from the database
    const poll = await Poll.findOne({ _id: pollId });

    if (!poll) {
      throw new Error("No record found");
    }

    return poll;
  } catch (e) {
    throw handleControllerError(e);
  }
}


async function updatePollById(req) {
  try {
    const pollId = req.params.pollId;

    //check pollId is exist or not
    if (!pollId) {
      throw Error("poll id is required");
    }

    const { error } = updatePollValidation.validate(req.body);
    if (error) {
      throw Error(error.details[0].message);
    }

    // Retrieve the poll from the database
    let poll = await Poll.findOne({ pollId });

    if (!poll) {
      throw Error(resMsg.NO_RECORD_FOUND);
    }

    // Update the poll
    let updatePoll = await Poll.findOneAndUpdate(
      { pollId },
      {
        $set: req.body,
      },
      { new: true }
    );

    return updatePoll;
  } catch (e) {
    throw handleControllerError(e);
  }
}

async function submitPoll(req) {
  try {
    // check req.body.optionId is exist or not
    if (!req.body.optionId) {
      throw Error("option id is required");
    }
    const pollId = req.params.pollId;
    const { optionId } = req.body;

    // Retrieve the poll from the database
    const poll = await Poll.findOne({ pollId });

    if (!poll) {
      throw Error(resMsg.NO_RECORD_FOUND);
    }

    // check user is already voted or not
    const pollResponse = await PollResponse.findOne({
      poll: poll._id,
      ipAddress: req.body.ip,
    });

    if (pollResponse) {
      throw Error("You have already voted");
    }

    // find the index of option by optionId
    const optionIndex = poll.options.findIndex(
      (option) => option._id == optionId
    );

    poll.options[optionIndex].votes += 1;

    // save the poll
    await poll.save();

    // save the poll response
    await new PollResponse({
      poll: poll._id,
      ipAddress: req.body.ip,
      optionId: optionId,
      country: req.body.country,
    }).save();

    return poll;
  } catch (e) {
    throw handleControllerError(e);
  }
}

async function pollResult(req) {
  try {
    const pollId = req.params.pollId;

    // Retrieve the poll from the database
    const poll = await Poll.findOne({ pollId });

    if (!poll) {
      throw Error(resMsg.NO_RECORD_FOUND);
    }

    // Find the poll responses for the poll
    const pollResponses = await PollResponse.find({ poll: poll._id });

    // Calculate total votes
    const totalVotes = poll.options.reduce(
      (total, option) => total + option.votes,
      0
    );

    // Prepare the response object
    const pollResults = {
      poll,
      totalVotes,
      pollResponses,
    };

    return pollResults;
  } catch (e) {
    throw handleControllerError(e);
  }
}

async function deletePoll(req) {
  try {
    const pollId = req.params.pollId;

    // Retrieve the poll from the database
    const poll = await Poll.findOne({ pollId });

    if (!poll) {
      throw Error(resMsg.NO_RECORD_FOUND);
    }

    // Delete the poll
    await Poll.findByIdAndDelete(poll._id);

    // delete poll responses for the poll
    await PollResponse.deleteMany({ poll: poll._id });

    // Update PollCreator createdPolls
    await PollCreator.findByIdAndUpdate(req.user._id, {
      $pull: { createdPolls: poll._id },
      $inc: { totalPollsCreated: -1 },
    });

    return true;
  } catch (e) {
    throw handleControllerError(e);
  }
}
