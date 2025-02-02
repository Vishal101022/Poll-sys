const express = require("express");
const asyncHandler = require("express-async-handler");
const creatorCtrl = require("../../controllers/admin/creator.controller.js");
const router = express.Router();
const { createResponse, createError } = require("../../../utils/helpers.js");
const { resMsg, resStatusCode } = require("../../../config/constant.js");
module.exports = router;

/**
 * @route GET /api/v1/admin/creators/
 * @description get all creators
 * @returns JSON
 * @access private
 */
router.get("/", asyncHandler(getAllCreators));

/**
 * @route GET /api/v1/admin/creators/:id
 * @description get creator by id
 * @returns JSON
 * @access private
 */
router.get("/:id", asyncHandler(getCreatorById));
 
async function getAllCreators(req, res, next) {
  try {
    let response = await creatorCtrl.getAllCreators(req);
    if (response)
      return createResponse(
        res,
        resStatusCode.SUCCESS_FETCH,
        resMsg.SUCCESS_FETCH,
        response
      );
    else
      return createError(res, resStatusCode.UNABLE_FETCH, {
        message: resMsg.UNABLE_FETCH,
      });
  } catch (e) {
    return createError(res, resStatusCode.BAD_REQUEST, e);
  }
}

async function getCreatorById(req, res, next) {
  try {
    let response = await creatorCtrl.getCreatorById(req);
    if (response)
      return createResponse(
        res,
        resStatusCode.SUCCESS_FETCH,
        resMsg.SUCCESS_FETCH,
        response
      );
    else
      return createError(res, resStatusCode.UNABLE_FETCH, {
        message: resMsg.UNABLE_FETCH,
      });
  } catch (e) {
    return createError(res, resStatusCode.BAD_REQUEST, e);
  }
}