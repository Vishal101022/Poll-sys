import React, { Fragment, useEffect, useState } from "react";

import { getPollResult } from "../../services/poll.service";

import Loader from "../../components/_loader.js";
import { Link } from "react-router-dom";

const PollResult = () => {
  const initialState = {
    optionId: "",
    ip: "",
    country: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  // const [registerSuccess, setRegisterSuccess] = useState(false);
  const [pollId, setPollId] = useState(null);
  const [poll, setPoll] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (pId) => {
    try {
      // load the poll
      const id = window.location.pathname.split("/")[2];
      setPollId(id);
      let res = await getPollResult(id);
      console.log(res);
      setPoll(res.data);
      await loadUserIp();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const loadUserIp = async () => {
    try {
      // load the poll
      let res = await fetch("https://ipv4.jsonip.com/");
      res = await res.json();
      setFormData({ ...formData, ip: res.ip, country: res.country });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Fragment>
      <div className="min-h-screen bg-gray-900 p-0 p-8">
        {/* loading... text center horizontally and vertically */}
        {loading && <Loader />}
        {!loading && (
          <>
            <div className="h-full mb-10">
              <div className="text-center mt-5">
                <h1 className="text-2xl text-white mb-2">
                  {poll.poll.question}
                </h1>
                <span className="text-gray-100 ">Poll Result</span>
              </div>
              <div className="p-4">
                {/* <!-- Social Traffic --> */}
                <div className="relative lg:w-1/2 m-auto flex flex-col min-w-0 mb-4 lg:mb-0 break-words  bg-gray-800 border-0 shadow-lg rounded-xl">
                  <div className="rounded-t mb-0 px-0 border-0">
                    <div className="flex flex-wrap items-center px-4 py-2">
                      <div className="relative w-full max-w-full flex-grow flex-1">
                        <h3 className="font-semibold text-base text-gray-100 dark:text-gray-100">
                          Votes
                        </h3>
                      </div>
                      <div className="relative w-full max-w-full flex-grow flex-1 text-right">
                        <Link
                          to={`/poll/${pollId}`}
                          className="bg-blue-500 dark:bg-green-100 text-white cursor-pointer dark:text-gray-800 dark:active:text-gray-700 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                        >
                          Back to Polls
                        </Link>
                      </div>
                    </div>
                    <div className="block w-full overflow-x-auto">
                      <table className="items-center w-full bg-transparent border-collapse">
                        <thead>
                          <tr>
                            <th className="px-4 bg-gray-800 dark:bg-gray-800 text-gray-100 dark:text-gray-100 align-middle border border-solid border-gray-200 dark:border-gray-500 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                              Options
                            </th>
                            <th className="px-4 bg-gray-800 dark:bg-gray-800 text-gray-100 dark:text-gray-100 align-middle border border-solid border-gray-200 dark:border-gray-500 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                              Votes
                            </th>
                            <th className="px-4 bg-gray-800 dark:bg-gray-800 text-gray-100 dark:text-gray-100 align-middle border border-solid border-gray-200 dark:border-gray-500 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {poll.poll.options.map((option, index) => (
                            <tr
                              className="text-gray-100 dark:text-gray-100"
                              key={index}
                            >
                              <th className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                                {option.text}
                              </th>
                              <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {option.votes}
                              </td>
                              <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                <div className="flex items-center">
                                  <span className="mr-2">
                                    {(Number(option.votes) /
                                      Number(poll.totalVotes)) *
                                      100}
                                    %
                                  </span>
                                  <div className="relative w-full">
                                    <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                                      <div
                                        style={{
                                          width: `${
                                            (Number(option.votes) /
                                              Number(poll.totalVotes)) *
                                            100
                                          }%`,
                                        }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Fragment>
  );
};

export default PollResult;
