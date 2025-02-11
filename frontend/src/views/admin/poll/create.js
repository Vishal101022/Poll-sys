import React, { Fragment, useEffect, useState } from "react";
import { createPollValidation } from "../../../validations/poll";
import { createPoll } from "../../../services/creator/poll.service";
import { getAllThemesForForm } from "../../../services/creator/theme.service";
import {
  dismissToast,
  errorToast,
  loadingToast,
  successToast,
} from "../../../utils/toaster";

import { useNavigate } from "react-router-dom";
import Form from "./form";
import StepProgressBar from "../../../components/stepper";

const checkmarkSvg = `<svg
className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5"
aria-hidden="true"
xmlns="http://www.w3.org/2000/svg"
fill="currentColor"
viewBox="0 0 20 20"
>
<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
</svg>`;

const CreatePoll = () => {
  const navigate = useNavigate();
  const initialState = {
    question: null,
    allow_multiple_selection: false,
    description: null,
    options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
    publish_status: "published",
    start_date: null,
    end_date: null,
    result_visibility: "public",
    password: null,
    theme: "dark",
  };
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const [minPollEndDate, setMinPollEndDate] = useState(
    new Date().toISOString().slice(0, 16)
  );

  const [errors, setErrors] = useState({});

  const [registerSuccess, setRegisterSuccess] = useState(false);

  const [booleanValue, setBooleanValue] = useState({
    showDescription: false,
    showPassword: true,
  });

  const [isFormDirty, setIsFormDirty] = useState(false);

  const [step, setStep] = useState(1);

  // load themes from api
  const [themes, setThemes] = useState([]);
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        let res = await getAllThemesForForm();
        let themes = separateThemesByDarkness(res.data); // separate themes by darkness
        console.log(themes);
        setThemes(themes);
      } catch (error) {
        errorToast(error.message);
      }
    };
    fetchThemes();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isFormDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isFormDirty]);

  const separateThemesByDarkness = (themes) => {
    const dark_themes = [];
    const light_themes = [];

    themes.forEach((theme) => {
      if (theme.is_dark_theme) {
        dark_themes.push(theme);
      } else {
        light_themes.push(theme);
      }
    });

    return {
      dark_themes,
      light_themes,
    };
  };

  // write on change booleanValue
  const onChangeBooleanValue = (key, value) => {
    if (!key) return;
    setBooleanValue({ ...booleanValue, [key]: value });
  };

  // write on change function
  const onChangeFormData = (key, value, index = null) => {
    if (!key) return;

    if (key === "options") {
      let options = [...formData.options];
      options[index].text = value;
      setFormData({ ...formData, options });
      return;
    }

    if (key === "password") {
      value = !value ? null : value;
    }

    setFormData({ ...formData, [key]: value });
    setIsFormDirty(true);
  };

  const handleOptionChange = (index, value) => {
    setFormData((prevState) => {
      const updatedOptions = [...prevState.options];
      updatedOptions[index].text = value;
      return {
        ...prevState,
        options: updatedOptions,
      };
    });
  };

  const addOption = (e) => {
    e.preventDefault();
    setFormData((prevState) => {
      return {
        ...prevState,
        options: [...prevState.options, { text: "" }],
      };
    });
  };

  const addOtherOption = (e) => {
    e.preventDefault();
    addOption(e);
    handleOptionChange(formData.options.length, "Other");
  };

  const removeOption = (index) => {
    setFormData((prevState) => {
      const updatedOptions = [...prevState.options];
      updatedOptions.splice(index, 1);
      return {
        ...prevState,
        options: updatedOptions,
      };
    });
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const { isValid, errors } = createPollValidation(formData);
      console.log(errors);
      if (!isValid) {
        setErrors(errors);
        setLoading(false);
        return;
      }

      setErrors({});

      loadingToast("Creating poll...");

      // write api call here
      let res = await createPoll(formData);

      if (res) {
        setFormData(initialState);
        setRegisterSuccess(true);
        setLoading(false);
        dismissToast();
        successToast("Poll created successfully.");
        navigate("/creator/polls");
      }

      return;
    } catch (error) {
      dismissToast();
      errorToast(error.message);
      setLoading(false);
    }
  };

  const handleStepChange = (e, step) => {
    e.preventDefault();
    // check if any validation errors
    if (step === 2) {
      const { isValid, errors } = createPollValidation(formData);
      console.log(errors);
      if (!isValid) {
        setErrors(errors);
        return;
      } else {
        setErrors({});
      }
    }
    setStep(step);
  };
  return (
    <>
      <h1 className="text-slate-800 dark:text-slate-100 font-bold text-3xl">
        Add Poll
      </h1>
      <div className="w-full overflow-hidden rounded-lg shadow-xs">
        <div className="">
          <div className="flex flex-col gap-9">
            <div className="shadow-default dark:border-strokedark dark:bg-boxdark">
              <ol className="flex items-center w-full pl-0 my-7 text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
                <li className="flex md:w-full items-center text-blue-600 dark:text-blue-500 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
                  <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                    {step === 1 && (
                      <span
                        dangerouslySetInnerHTML={{ __html: checkmarkSvg }}
                      />
                    )}
                    {step !== 1 && <span className="mr-2">1</span>}
                    Basic{" "}
                    <span className="hidden sm:inline-flex sm:ml-2">Details</span>
                  </span>
                </li>
                <li className="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
                  <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                    {step === 2 && (
                      <span
                        dangerouslySetInnerHTML={{ __html: checkmarkSvg }}
                      />
                    )}
                    {step !== 2 && <span className="mr-2">2</span>}
                    Advanced{" "}
                    <span className="hidden sm:inline-flex sm:ml-2">Details</span>
                  </span>
                </li>
                <li className="flex items-center">
                  {step === 3 && (
                    <span dangerouslySetInnerHTML={{ __html: checkmarkSvg }} />
                  )}
                  {step !== 3 && <span className="mr-2">3</span>}
                  Theme
                </li>
              </ol>

              <Form
                formData={formData}
                errors={errors}
                onChangeFormData={onChangeFormData}
                onSubmit={onSubmit}
                booleanValue={booleanValue}
                onChangeBooleanValue={onChangeBooleanValue}
                handleOptionChange={handleOptionChange}
                addOption={addOption}
                addOtherOption={addOtherOption}
                removeOption={removeOption}
                minPollEndDate={minPollEndDate}
                setMinPollEndDate={setMinPollEndDate}
                submitButtonText={"Create poll"}
                step={step}
                setStep={setStep}
                totalSteps={3}
                handleStepChange={handleStepChange}
                themes={themes}
              />
              {/* <form onSubmit={onSubmit}>
                  <div className="p-6">
                    <div className="mb-4 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <label
                          htmlFor="question"
                          className="mb-2.5 block text-black dark:text-white"
                        >
                          Question
                        </label>
                        <input
                          type="text"
                          id="question"
                          placeholder="Enter your question"
                          className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none 
                          transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter 
                          dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary
                          ${
                            errors.question
                              ? "border-red-500"
                              : "border-gray-600"
                          }`}
                          value={formData.question || ""}
                          onChange={(e) =>
                            onChangeFormData("question", e.target.value)
                          }
                        />
                        {errors.question && (
                          <p className="text-red-500 text-sm mt-1 text-left italic">
                            {errors.question}
                          </p>
                        )}
                      </div>
                      <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Voting type
                        </label>
                        <div className="relative z-20 bg-transparent dark:bg-form-input">
                          <select
                            className="relative z-20 w-full appearance-none rounded border border-gray-600 
                          bg-gray-800 py-3 px-5 outline-none transition focus:border-primary active:border-primary 
                          dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            value={formData.allow_multiple_selection}
                            onChange={(e) =>
                              onChangeFormData(
                                "allow_multiple_selection",
                                e.target.value
                              )
                            }
                          >
                            <option value={false}>Single</option>
                            <option value={true}>Multiple</option>
                          </select>
                          <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                            <svg
                              className="fill-current"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g opacity="0.8">
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                  fill=""
                                ></path>
                              </g>
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                    {!booleanValue.showDescription && (
                      <span
                        className="text-gray-500 cursor-pointer mb-5"
                        onClick={(e) =>
                          onChangeBooleanValue(
                            "showDescription",
                            !booleanValue.showDescription
                          )
                        }
                      >
                        + Add description
                      </span>
                    )}
                    {booleanValue.showDescription && (
                      <div className="mb-4">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Description
                        </label>
                        <textarea
                          placeholder="Enter your description"
                          className="w-full rounded border-[1.5px] border-gray-600 bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                          value={formData.description || ""}
                          onChange={(e) =>
                            onChangeFormData("description", e.target.value)
                          }
                        />
                        <span
                          className="text-red-500 text-sm cursor-pointer"
                          onClick={() =>
                            onChangeBooleanValue("showDescription", false)
                          }
                        >
                          Remove description
                        </span>
                      </div>
                    )}
                    <div className="mb-4 mt-4">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Answer options
                      </label>
                      {formData.options.map((option, index) => (
                        <div className="my-2" key={index}>
                          <input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            className={`w-full rounded border-[1.5px] border-gray-600 bg-transparent py-3 px-5 font-medium outline-none transition 
                            focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark 
                            dark:bg-form-input dark:focus:border-primary
                            ${
                              errors[`option${index}`]
                                ? "border-red-500"
                                : "border-gray-600"
                            }`}
                            value={option.text}
                            onChange={(event) =>
                              handleOptionChange(index, event.target.value)
                            }
                          />
                          <div className="sm:flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {errors[`option${index}`] && (
                                <p className="text-red-500 text-sm mt-1 text-left italic">
                                  {errors[`option${index}`]}
                                </p>
                              )}
                              <span
                                className="text-red-500 text-sm cursor-pointer"
                                onClick={() => removeOption(index)}
                              >
                                Remove {`Option ${index + 1}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        className="text-gray-200 font-bold bg-gray-600 px-4 py-2 rounded"
                        onClick={addOption}
                      >
                        Add option
                      </button>
                      {!formData.options.some(
                        (option) => option.text.toLowerCase() === "other"
                      ) && (
                        <button
                          className="text-purple-400 font-bold ml-4"
                          onClick={addOtherOption}
                        >
                          Add "Other"
                        </button>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Publish status
                      </label>
                      <div className="relative z-20 bg-transparent dark:bg-form-input">
                        <select
                          className="relative z-20 w-full appearance-none rounded border border-gray-600 
                          bg-gray-800 py-3 px-5 outline-none transition focus:border-primary active:border-primary 
                          dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                          value={formData.publish_status}
                          onChange={(e) =>
                            onChangeFormData("publish_status", e.target.value)
                          }
                        >
                          <option value={"draft"}>Draft</option>
                          <option value={"published"}>Published</option>
                          <option value={"archived"}>Archived</option>
                        </select>
                        <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                          <svg
                            className="fill-current"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                fill=""
                              ></path>
                            </g>
                          </svg>
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span
                        className={`block px-2 py-2 text-purple-400 cursor-pointer border border-gray-600 w-full
                        ${additionalFeatures ? "bg-gray-900" : "bg-gray-800"}
                        `}
                        onClick={() =>
                          setAdditionalFeatures(!additionalFeatures)
                        }
                      >
                        {">"} Additional features
                      </span>
                      {additionalFeatures && (
                        <div className="accordion-content pt-4 pt-0 overflow-hidden border border-t-0 border-gray-600 px-2">
                          <div className="mb-4">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Start poll date
                            </label>
                            <input
                              type="datetime-local"
                              placeholder="Enter your question"
                              className="w-full rounded border-[1.5px] border-gray-600 bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              min={new Date().toISOString().slice(0, 16)}
                              value={formData.start_date || ""}
                              onChange={(e) => {
                                onChangeFormData("start_date", e.target.value);
                                setMinPollEndDate(e.target.value);
                              }}
                            />
                          </div>
                          <div className="mb-4">
                            <label className="mb-2.5 block text-black dark:text-white">
                              End poll date
                            </label>
                            <input
                              type="datetime-local"
                              placeholder="Enter your question"
                              className="w-full rounded border-[1.5px] border-gray-600 bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              min={minPollEndDate}
                              value={formData.end_date || ""}
                              onChange={(e) =>
                                onChangeFormData("end_date", e.target.value)
                              }
                            />
                          </div>
                          <div className="mb-4">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Result visibility
                            </label>
                            <div className="relative z-20 bg-transparent dark:bg-form-input">
                              <select
                                className="relative z-20 w-full appearance-none rounded border border-gray-600 
                              bg-gray-800 py-3 px-5 outline-none transition focus:border-primary active:border-primary 
                              dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                value={formData.result_visibility}
                                onChange={(e) =>
                                  onChangeFormData(
                                    "result_visibility",
                                    e.target.value
                                  )
                                }
                              >
                                <option value={"public"}>Public</option>
                                <option value={"private"}>Private</option>
                              </select>
                              <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                <svg
                                  className="fill-current"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g opacity="0.8">
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                      fill=""
                                    ></path>
                                  </g>
                                </svg>
                              </span>
                            </div>
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="formCheckbox"
                              className="flex cursor-pointer"
                            >
                              <div className="relative pt-0.5">
                                <input
                                  type="checkbox"
                                  id="formCheckbox"
                                  className=""
                                  checked={formData.require_name}
                                  onChange={(event) =>
                                    onChangeFormData("require_name", event.target.checked)
                                  }
                                />
                              </div>
                              <p className="ml-2">Require participants' names</p>
                            </label>
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="formCheckbox"
                              className="flex cursor-pointer"
                            >
                              <div className="relative pt-0.5">
                                <input
                                  type="checkbox"
                                  id="formCheckbox"
                                  className=""
                                  checked={booleanValue.showPassword}
                                  onChange={() =>
                                    onChangeBooleanValue(
                                      "showPassword",
                                      !booleanValue.showPassword
                                    )
                                  }
                                />
                              </div>
                              <p className="ml-2">Password protection</p>
                            </label>
                          </div>
                          {booleanValue.showPassword && (
                            <div className="mb-4">
                              <label className="mb-2.5 block text-black dark:text-white">
                                Password
                              </label>
                              <input
                                type="text"
                                placeholder="Enter your password"
                                className="w-full rounded border-[1.5px] border-gray-600 bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                value={formData.password || ""}
                                onChange={(e) =>
                                  onChangeFormData("password", e.target.value)
                                }
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mb-4 flex flex-col gap-6 xl:flex-row">
                      <input
                        type="submit"
                        value={"Create poll"}
                        className="flex cursor-pointer w-full justify-center rounded bg-gray-900 border border-gray-600 hover:bg-gray-900 p-3 font-medium text-gray"
                      />
                    </div>
                  </div>
                </form> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePoll;
