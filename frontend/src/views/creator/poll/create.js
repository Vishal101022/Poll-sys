import React, { Fragment, useEffect, useState } from "react";
import { createPollValidation } from "../../../validations/poll";
import { createPoll } from "../../../services/creator/poll.service";
import {
  dismissToast,
  errorToast,
  loadingToast,
  successToast,
} from "../../../utils/toaster";

import { useNavigate } from "react-router-dom";
import Form from "./form";


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
    options: [{ text: "" }, { text: "" }],
    publish_status: "published",
    start_date: null,
    end_date: null,
    result_visibility: "public",
    password: null,
  };
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
 

  const [minPollEndDate, setMinPollEndDate] = useState(
    new Date().toISOString().slice(0, 16)
  );

  const [errors, setErrors] = useState({});

  const [setRegisterSuccess] = useState(false);

  const [booleanValue, setBooleanValue] = useState({
    showDescription: false,
    showPassword: true,
    showAdvancedSettings: false,
  });

  const [isFormDirty, setIsFormDirty] = useState(false);

  const [step, setStep] = useState(1);

  
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

    console.log(key, value)
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

      console.log("form data", formData)

      const { isValid, errors } = createPollValidation(formData);
      console.log(errors);
      if (!isValid) {
        setErrors(errors);
        setLoading(false);
        return;
      }

      setErrors({});

      loadingToast("Creating poll...");

      let payload = {
        ...formData,
      };


      // write api call here
      let res = await createPoll(payload);

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
     
      <h1 className="text-slate-800 font-bold text-3xl">Add Poll</h1>
      <div className="w-full overflow-hidden rounded-lg shadow-xs">
        <div className="">
          <div className="flex flex-col gap-9">
            <div className="shadow-default dark:border-strokedark dark:bg-boxdark">
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
             
               
               
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePoll;
