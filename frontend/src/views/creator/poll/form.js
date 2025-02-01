import React from "react";


const PollForm = ({
  formData,
  errors,
  onChangeFormData,
  onSubmit,
  booleanValue,
  onChangeBooleanValue,
  handleOptionChange,
  addOption,
  addOtherOption,
  removeOption,
  minPollEndDate,
  setMinPollEndDate,
  submitButtonText,
}) => {
  return (
    <form>
      <div className="mt-8">
        <>
          {" "}
          <div className="mb-4 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/3">
              <label htmlFor="question" className="mb-2.5 block text-black">
                Question
              </label>
              <input
                type="text"
                id="question"
                placeholder="Enter your question"
                className={`w-full text-black rounded border-[1.5px] bg-white py-3 px-5 outline-none 
                          transition focus:border-primary active:border-primary
                          ${
                            errors.question
                              ? "border-red-500"
                              : "border-gray-600"
                          }`}
                value={formData.question || ""}
                onChange={(e) => onChangeFormData("question", e.target.value)}
              />
              {errors.question && (
                <p className="text-red-500 text-sm mt-1 text-left italic">
                  {errors.question}
                </p>
              )}
            </div>
            <div className="w-full xl:w-1/3">
              <label className="mb-2.5 block text-black">Voting type</label>
              <div className="relative z-20 bg-transparent dark:bg-form-input">
                <select
                  className="relative text-black z-20 w-full appearance-none rounded border border-gray-600 
                          bg-white py-3 px-5 outline-none transition focus:border-primary active:border-primary "
                  value={formData.allow_multiple_selection}
                  onChange={(e) =>
                    onChangeFormData("allow_multiple_selection", e.target.value)
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
            <div className="w-full xl:w-1/3">
              <label className="mb-2.5 block text-black">Publish status</label>
              <div className="relative z-20 bg-transparent dark:bg-form-input">
                <select
                  className="relative text-black z-20 w-full appearance-none rounded border border-gray-600 
                          bg-white py-3 px-5 outline-none transition focus:border-primary active:border-primary "
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
              <label className="mb-2.5 block text-black">Description</label>
              <textarea
                placeholder="Enter your description"
                className="w-full text-black rounded border-[1.5px] border-gray-600 bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                value={formData.description || ""}
                onChange={(e) =>
                  onChangeFormData("description", e.target.value)
                }
              />
              <span
                className="text-red-500 text-sm cursor-pointer"
                onClick={() => onChangeBooleanValue("showDescription", false)}
              >
                Remove description
              </span>
            </div>
          )}
          <div className="mb-4 mt-4">
            <label className="mb-2.5 block text-black">Answer options</label>
            {formData.options.map((option, index) => (
              <div className="mb-6" key={index}>
                <div
                  className={`my-2 flex items-center rounded border-[1.5px] border-gray-600 ${
                    errors[`option${index}`]
                      ? "border-red-500"
                      : "border-gray-600"
                  }`}
                >
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    className={`w-full text-black  bg-transparent py-3 px-5 outline-none transition 
                            focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter`}
                    value={option.text}
                    onChange={(event) =>
                      handleOptionChange(index, event.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="mr-2 text-red-500 hover:text-red-700 focus:outline-none"
                    onClick={() => removeOption(index)}
                    aria-label={`Remove Option ${index + 1}`}
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                {errors[`option${index}`] && (
                  <p className="text-red-500 text-sm text-left italic">
                    {errors[`option${index}`]}
                  </p>
                )}
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
                Add "Others"
              </button>
            )}
          </div>{" "}
        </>

        <>
          {" "}
          <div className="mb-4 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black" htmlFor="start_date">
                Start poll date
              </label>
              <input
                type="datetime-local"
                id="start_date"
                className="w-full text-black rounded border-[1.5px] border-gray-600 bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                min={new Date().toISOString().slice(0, 16)}
                value={formData.start_date || ""}
                onChange={(e) => {
                  onChangeFormData("start_date", e.target.value || null);
                  setMinPollEndDate(e.target.value);
                }}
              />
            </div>
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black" htmlFor="end_date">
                End poll date
              </label>
              <input
                type="datetime-local"
                id="end_date"
                className="w-full text-black rounded border-[1.5px] border-gray-600 bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                min={minPollEndDate}
                value={formData.end_date || ""}
                onChange={(e) =>
                  onChangeFormData("end_date", e.target.value || null)
                }
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              className="mb-2.5 block text-black"
              htmlFor="result_visibility"
            >
              Result visibility
            </label>
            <div className="relative z-20 bg-transparent dark:bg-form-input">
              <select
                id="result_visibility"
                className="relative text-black z-20 w-full appearance-none rounded border border-gray-600 
                              bg-white py-3 px-5 outline-none transition focus:border-primary active:border-primary 
                              dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                value={formData.result_visibility}
                onChange={(e) =>
                  onChangeFormData("result_visibility", e.target.value)
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
          {formData.is_email_send && (
            <div className="mb-4">
              <label
                className="mb-2.5 block text-black"
                htmlFor="result_visibility"
              >
                Result visibility
              </label>
              <div className="relative z-20 bg-transparent dark:bg-form-input">
                <select
                  id="result_visibility"
                  className="relative text-black z-20 w-full appearance-none rounded border border-gray-600 
                              bg-white py-3 px-5 outline-none transition focus:border-primary active:border-primary 
                              dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.result_visibility}
                  onChange={(e) =>
                    onChangeFormData("result_visibility", e.target.value)
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
          )}
          <div className="mb-4">
            <label htmlFor="allow_comments" className="flex cursor-pointer">
              <div className="relative pt-0.5">
                <input
                  type="checkbox"
                  id="allow_comments"
                  className=""
                  checked={formData.allow_comments}
                  onChange={(event) =>
                    onChangeFormData("allow_comments", event.target.checked)
                  }
                />
              </div>
              <p className="ml-2 text-black">Allow comments</p>
            </label>
          </div>
          <div className="mb-4">
            <label htmlFor="require_name" className="flex cursor-pointer">
              <div className="relative pt-0.5">
                <input
                  type="checkbox"
                  id="require_name"
                  className=""
                  checked={formData.require_name}
                  onChange={(event) =>
                    onChangeFormData("require_name", event.target.checked)
                  }
                />
              </div>
              <p className="ml-2 text-black">Require participants' names</p>
            </label>
          </div>
        </>

        <div className="mb-4 flex flex-col gap-6 xl:flex-row border-t pt-8 mt-10">
          <button
            onClick={onSubmit}
            className="flex cursor-pointer w-full justify-center rounded bg-blue-500  hover:bg-blue-400 p-3 font-medium text-white"
          >
            {submitButtonText}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PollForm;
