import { clearToken, saveToken } from "../helpers/auth_token.js";
import { getAPIResponseError } from "../helpers/common.js";
import { deleteAllLocalData, saveUserDetails } from "../helpers/localstorage.js";
import { successToast } from "../utils/toaster.js";
import api from "./api.service.js";
import jwt_decode from "jwt-decode";

const creatorRegister = async (userData) => {
  try {
    let res = await api.post("/creators/auth/register", userData);
    return res.data;
  } catch (error) {
    throw getAPIResponseError(error);
  }
};

const verifyToken = async (token) => {
  try {
    let res = await api.post(`/creators/auth/verify/${token}`);
    return res.data;
  } catch (error) {
    throw getAPIResponseError(error);
  }
};

const creatorLogin = async (userData) => {
  try {
    let res = await api.post("/creators/auth/login", userData);
    console.log(res.data);
    setLoginToken(res.data.data);
    return res.data;
  } catch (error) {
    throw getAPIResponseError(error);
  }
};



const deleteUser = (userId) => api.delete(`/users/${userId}`);

const setLoginToken = (data) => {
  // save auth deteils and set token in header for request
  console.log(data.token);
  saveToken(data.token);
  // Decode token to get user data
  const decoded = jwt_decode(data.token);
  // Set current user in localstorage and redux
  saveUserDetails(decoded);
};

const logout = () => {
  clearToken();
  deleteAllLocalData();
};

export {
  creatorRegister,
  verifyToken,
  creatorLogin,
  logout,
};
