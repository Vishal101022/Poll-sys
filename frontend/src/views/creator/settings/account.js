import React, { useState, useEffect } from "react";
import CreatorPageTitle from "../../../components/creator/page_title";
import { getCreatorById } from "../../../services/admin/user.service.js";
import { getUserDetails } from "../../../helpers/localstorage.js";
import { uploadProfile } from "../../../services/admin/user.service.js";
import { successToast, errorToast } from "../../../utils/toaster.js";
import { setLocalStorage } from "../../../helpers/localstorage.js";

const Account = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    profilePicture: "https://randomuser.me/api/portraits/lego/4.jpg",
    totalPollsCreated: 0,
  });
  const [selectedFile, setSelectedFile] = useState(null);

useEffect(() => {
  const userId = getUserDetails().id;
  getCreatorById(userId).then((response) => {
    const profilePicture = response.data[0].profilePicture;
   
    const convertedValue = profilePicture === "null" ? null : profilePicture;

    const profilePictureUrl = convertedValue
      ? `http://localhost:5000/${profilePicture}`
      : "https://randomuser.me/api/portraits/lego/4.jpg"; 

    setUser({
      name: response.data[0].name,
      email: response.data[0].email,
      profilePicture: profilePictureUrl, 
      totalPollsCreated: response.data[0].totalPollsCreated,
    });

    
    if (profilePicture) {
      setLocalStorage("imgURL", profilePicture);
    }
  });
}, [user]);
  console.log("uerProfile", user.profilePicture);

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profile_picture", selectedFile);
    formData.append("profile_picture", getUserDetails().id);

    try {
      await uploadProfile(formData);
      successToast("Profile picture uploaded successfully");
      window.location.reload();
    } catch (error) {
      errorToast(error?.message || error);
    }
  };

  return (
    <>
      <div className="mt-4 mx-4">
        <CreatorPageTitle title={"Account Settings"} />
        <div className="flex-grow bg-slate-800 mb-12">
          <div className="p-6">
            <h2 className="text-slate-800 dark:text-slate-100 font-bold text-2xl mb-5">
              My Account
            </h2>

            {/* <!-- Picture --> */}
            <section className="mt-6">
              <div className="flex items-center">
                <form>
                  <div className="mr-4">
                    <img
                      className="rounded-full w-20 h-20 object-cover border-2 border-sky-500 mb-3"
                      src={user.profilePicture}
                      width="80"
                      height="80"
                      alt="User img"
                    />
                  </div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="profilePictureUpload"
                  />
                  <label
                    htmlFor="profilePictureUpload"
                    className="bg-[#6366f1] px-2 py-1 rounded cursor-pointer"
                  >
                    Change
                  </label>
                  <button
                    onClick={handleFileUpload}
                    className="bg-[#6366f1] px-2 py-1 rounded ml-2 cursor-pointer"
                  >
                    Upload
                  </button>
                </form>
              </div>
            </section>
            {/* <!-- Username --> */}
            <section className="mt-6">
              <h3 className="text-slate-800 dark:text-slate-100 font-bold text-2xl">
                Name
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {user.name}
              </p>
            </section>
            {/* <!-- Email --> */}
            <section className="mt-6">
              <h3 className="text-slate-800 dark:text-slate-100 font-bold text-2xl">
                Email
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {user.email}
              </p>
            </section>
            {/* <!-- total poll created --> */}
            <section className="mt-6">
              <h3 className="text-slate-800 dark:text-slate-100 font-bold text-2xl">
                Total Polls Created
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {user.totalPollsCreated}
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
