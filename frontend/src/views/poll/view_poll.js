import React, { Fragment, useEffect, useState } from "react";
import { submitPollValidation } from "../../validations/poll.js";
import {
  checkPasswordProtection,
  getPoll,
  submitPoll,
} from "../../services/poll.service";
import { errorToast, successToast } from "../../utils/toaster";
import Loader from "../../components/_loader.js";
import { Link } from "react-router-dom";
import Comment from "../../components/comment.js";
import { formattedDateFromNow, shuffleArray } from "../../helpers/common.js";
import CountdownTimer from "../../components/countdown..js";
import moment from "moment";
import {
  isAuthenticated,
  setLocalStorage,
} from "../../helpers/localstorage.js";
import Header from "../../components/header.js";

const ViewPoll = () => {
  const [authUser, setAuthUser] = useState(isAuthenticated());
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

  const initialState = {
    optionId: "",
    ip: "",
    optionIds: [],
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [pollId, setPollId] = useState(null);
  const [poll, setPoll] = useState(null);
  const [pollUrl, setPollUrl] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    console.log(authUser);
    if (!authUser) {
      setLocalStorage("poll_url", window.location.href);
    }
    loadData();
  }, []);

  const loadData = async (pId) => {
    try {
      const id = window.location.pathname.split("/")[2];
      setPollId(id);
      let response = await checkPasswordProtection(id);
      console.log(response);
      if (response.data && response.data.password_protected) {
        setPasswordProtected(true);
      } else {
        let res = await getPoll(id);
        console.log(res.data);
        res.data.options = shuffleArray(res.data.options);
        console.log(res.data.options);
        setPoll(res.data);
      }

      setPollUrl(window.location.href);
      await loadUserIp();
    } catch (error) {
      console.log(error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const loadPoll = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const res = await getPoll(pollId, password);
      setPoll(res.data);
      setPasswordProtected(false);
    } catch (error) {
      errorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUserIp = async () => {
    try {
      let res = await fetch("https://ipv4.jsonip.com/");
      res = await res.json();
      let geoLocation = await fetch(`http://ip-api.com/json/${res.ip}`);
      geoLocation = await geoLocation.json();
      setFormData({
        ...formData,
        ip: res.ip,
        geo_location: geoLocation,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onChangeFormData = (key, value, index = null) => {
    if (!key) return;

    if (key === "options") {
      let options = [...formData.options];
      options[index].text = value;
      setFormData({ ...formData, options });
      return;
    }

    setFormData({ ...formData, [key]: value });
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();

      const { isValid, errors } = submitPollValidation(
        formData,
        poll.require_name
      );
      if (!isValid) {
        setErrors(errors);
        return;
      }

      setErrors({});
      let res = await submitPoll(pollId, formData);
      if (res) {
        successToast("Poll submitted successfully.");
      } else {
        console.log(res);
      }
    } catch (error) {
      errorToast(error.message);
    }
  };

  const handleOptionChange = (event) => {
    onChangeFormData("optionId", event.target.value);
  };

  const handleMultiSelectOptionChange = (e) => {
    const optionId = e.target.value;
    const isChecked = e.target.checked;

    setFormData((prevFormData) => {
      if (isChecked) {
        return {
          ...prevFormData,
          optionIds: [...prevFormData.optionIds, optionId],
        };
      } else {
        return {
          ...prevFormData,
          optionIds: prevFormData.optionIds.filter((id) => id !== optionId),
        };
      }
    });
  };

  if (poll && poll.poll_start && moment(poll.poll_start).isAfter(moment())) {
    return (
      <div className="min-h-screen bg-gray-900 p-0 p-12">
        <div className="mx-auto max-w-md px-6 py-12 bg-gray-800 border-0 shadow-lg rounded-xl">
          <div className="mt-4 text-center text-gray-100">
            <h2 className="text-xl font-bold mb-2">Poll starts in:</h2>
            <CountdownTimer pollStart={poll.poll_start} />
            <p className="text-gray-400">
              This poll will start on{" "}
              {moment(poll.poll_start).format("MMMM Do, YYYY [at] h:mm A")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (poll && poll.poll_expired) {
    return (
      <div className="min-h-screen bg-gray-900 p-0 p-12">
        <div className="mx-auto max-w-md px-6 py-12 bg-gray-800 border-0 shadow-lg rounded-xl">
          <div className="mt-4 text-center text-gray-100">
            <p className="text-gray-400">This poll has already expired.</p>
          </div>
        </div>
      </div>
    );
  }

  const ManageTheme = ({ colors }) => {
    if (colors) {
      document.body.style.backgroundColor = colors.pollContainerBackgroundColor;
      document.getElementById("poll-container").style.backgroundColor =
        colors.pollContainerBackgroundColor;
    }
  };

  return (
    <Fragment>
      <Header />
      <div className="min-h-screen bg-gray-900 p-0 p-12" id="poll-container">
        {loading && <Loader />}
        {!loading && poll && (
          <>
            {poll.selected_theme && (
              <ManageTheme colors={poll.selected_theme.colors} />
            )}
            {poll.logo && (
              <div className="flex justify-center mb-4">
                <img src={poll.logo} alt="Custom Logo" className="h-16" />
              </div>
            )}
            <div
              className="mx-auto max-w-md px-6 py-12 bg-gray-800 border-0 shadow-lg rounded-xl"
              id="poll-box"
              style={{
                backgroundColor:
                  poll.selected_theme?.colors?.pollBoxBackgroundColor ||
                  "#1F2937", // Fallback color
              }}
            >
              <h1
                className="text-2xl font-bold mb-4 text-gray-100"
                id="poll-question"
                style={{
                  color:
                    poll.selected_theme?.colors?.pollQuestionColor || "#FFFFFF", // Fallback color
                }}
              >
                {poll.question}
              </h1>
              <p className="text-gray-400 mb-4">
                Poll created {formattedDateFromNow(poll.createdAt)}
              </p>

              <form onSubmit={onSubmit}>
                {!poll.allow_multiple_selection && (
                  <fieldset className="relative z-0 w-full p-px mb-2">
                    <div className="block pt-3 pb-2">
                      {poll.options.map((option, index) => (
                        <div className="mb-4" key={index}>
                          <label
                            className="cursor-pointer"
                            style={{
                              color:
                                poll.selected_theme?.colors
                                  ?.pollOptionsLabelColor || "#FFFFFF", // Fallback color
                            }}
                          >
                            <input
                              type="radio"
                              name="radio"
                              value={option._id}
                              className="mr-2 border-2 border-gray-300 focus:border-gray-300 focus:ring-black"
                              checked={formData.optionId === option._id}
                              onChange={handleOptionChange}
                              style={{
                                color:
                                  poll.selected_theme?.colors
                                    ?.pollOptionsInputColor || "#FFFFFF", // Fallback color
                                borderColor:
                                  poll.selected_theme?.colors
                                    ?.pollOptionsInputColor || "#FFFFFF", // Fallback color
                                backgroundColor:
                                  poll.selected_theme?.colors
                                    ?.pollOptionsCheckedColor || "#FFFFFF", // Fallback color
                              }}
                            />
                            {option.text}
                          </label>
                        </div>
                      ))}
                      {errors.optionId && (
                        <p className="text-red-500 text-sm mt-1 text-left italic">
                          {errors.optionId}
                        </p>
                      )}
                    </div>
                  </fieldset>
                )}

                {poll.allow_multiple_selection && (
                  <fieldset className="relative z-0 w-full p-px mb-2">
                    {poll.options.map((option, index) => (
                      <div className="mb-4" key={index}>
                        <label
                          className="text-gray-100"
                          style={{
                            color:
                              poll.selected_theme?.colors
                                ?.pollOptionsLabelColor || "#FFFFFF", // Fallback color
                          }}
                        >
                          <input
                            type="checkbox"
                            name="checkbox"
                            value={option._id}
                            className="mr-2 text-gray-100 border-2 border-gray-300 focus:border-gray-300 focus:ring-black"
                            checked={formData.optionIds.includes(option._id)}
                            onChange={handleMultiSelectOptionChange}
                            style={{
                              color:
                                poll.selected_theme?.colors
                                  ?.pollOptionsInputColor || "#FFFFFF", // Fallback color
                              borderColor:
                                poll.selected_theme?.colors
                                  ?.pollOptionsInputColor || "#FFFFFF", // Fallback color
                              backgroundColor:
                                poll.selected_theme?.colors
                                  ?.pollOptionsCheckedColor || "#FFFFFF", // Fallback color
                            }}
                          />
                          {option.text}
                        </label>
                      </div>
                    ))}
                    {errors.optionId && (
                      <p className="text-red-500 text-sm mt-1 text-left italic">
                        {errors.optionId}
                      </p>
                    )}
                  </fieldset>
                )}

                {poll.require_name && (
                  <div className="mb-4">
                    <label
                      className="mb-2.5 block text-black dark:text-white"
                      style={{
                        color:
                          poll.selected_theme?.colors?.formLabelColor ||
                          "#FFFFFF", // Fallback color
                      }}
                    >
                      Require participant's name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className={`w-full rounded border-[1.5px] text-gray-100 bg-transparent py-3 px-5 font-medium 
                      outline-none transition focus:border-primary active:border-primary disabled:cursor-default 
                      disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary
                      input-field
                      ${errors.name ? "border-red-500" : "border-gray-600"}`}
                      value={formData.name || ""}
                      onChange={(e) => onChangeFormData("name", e.target.value)}
                      style={{
                        color:
                          poll.selected_theme?.colors?.pollOptionsInputColor ||
                          "#FFFFFF", // Fallback color
                      }}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1 text-left italic">
                        {errors.name}
                      </p>
                    )}
                  </div>
                )}

                <input
                  style={{
                    backgroundColor:
                      poll.selected_theme?.colors?.voteButtonBackgroundColor ||
                      "#EC4899", // Fallback color
                  }}
                  id="vote-button"
                  type="submit"
                  value={"Vote"}
                  className="w-full px-6 py-3 mt-3 text-lg text-white cursor-pointer transition-all duration-150 ease-linear rounded-lg shadow outline-none bg-pink-500 hover:bg-pink-600 hover:shadow-lg focus:outline-none"
                />

                <div className="block mt-5">
                  <div className="sm:flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Link
                        to={`/results/${pollId}`}
                        className="w-full sm:w-40 flex bg-gray-300 px-5 py-2 rounded items-center"
                      >
                        <svg
                          className="h-5 w-5 -ml-1 mr-2 "
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          stroke=""
                        >
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
                        </svg>

                        <span>Show results</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          
            {poll.allow_comments && <Comment pollId={pollId} />}
          </>
        )}
        {!loading && passwordProtected && (
          <>
            <div className="mx-auto max-w-md px-6 py-12 bg-gray-800 border-0 shadow-lg rounded-xl">
              <h1 className="text-2xl text-center font-bold mb-4 text-gray-100">
                Poll is password protected
              </h1>
              <div className="mb-4">
                <label className="mb-2.5 block text-black dark:text-white">
                  Enter given password
                </label>
                <input
                  type="text"
                  placeholder="Enter given password"
                  className="w-full rounded text-gray-400 border-[1.5px] border-gray-600 bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                onClick={loadPoll}
                className="w-full justify-center text-gray-100 flex bg-gray-900 border border-gray-600 px-5 py-2 rounded items-center hover:bg-gray-900"
              >
                <span>Submit</span>
              </button>
            </div>
          </>
        )}
        {!loading && notFound && (
          <>
            <div className="mx-auto max-w-md px-6 py-12 bg-gray-800 border-0 shadow-lg rounded-xl">
              <h1 className="text-2xl text-center font-bold mb-4 text-gray-100">
                Poll not found
              </h1>
              <p className="text-center font-bold text-gray-100 text-9xl my-5">
                404
              </p>
              <p className="text-center text-red-400">
                The poll you are looking for either deleted or never existed.
              </p>
              <div className="flex justify-center items-center mt-5 text-gray-100">
                <Link
                  to="/"
                  className="w-full sm:w-40 flex bg-transparent border border-gray-600 px-5 py-2 rounded items-center hover:bg-gray-900"
                >
                  <span>Go to home</span>
                </Link>

                <Link
                  to="/create-poll"
                  className="w-full sm:w-40 sm:ml-4 bg-gray-900 border border-gray-600 px-5 py-2 rounded text-white flex items-center hover:bg-gray-800"
                >
                  <span>Create a poll</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </Fragment>
  );
};

export default ViewPoll;
