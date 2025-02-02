import { getAPIResponseError } from "../../helpers/common.js";
import api from "../api.service.js";

const url = "/admin";

export const getListOfCreators = async (page, limit) => {
  try {
    let res = await api.get(`${url}/creators/?limit=${limit}&page=${page}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw getAPIResponseError(error);
  }
};

export const getCreatorById = async (id) => {
  try {
    let res = await api.get(`${url}/creators/${id}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw getAPIResponseError(error);
  }
};

export const uploadProfile = async (data) => {
  try {
    let res = await api.post("users/auth/upload", data);
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw getAPIResponseError(error);
  }
};
