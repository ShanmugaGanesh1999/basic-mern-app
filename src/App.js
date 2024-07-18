/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */

import { useEffect, useState } from "react";

const BASE_URL = "https://basic-mern-app-ptn6.onrender.com/user/"; //"http://localhost:8080/user/";

const statusColorMap = {
  under: "neutral",
  normal: "teal",
  over: "yellow",
  obese: "red",
};

function formatDate(date = new Date()) {
  let dt = new Date(date);
  return `${dt.getFullYear()}/${dt.getMonth()}/${dt.getDate()}`;
}

function NavBar({ count, setError, setShowModal, setAction }) {
  return (
    <div className="mx-5 border-b-2 border-gray-200">
      <nav className="-mb-0.5 flex space-x-6">
        <a
          className="py-4 px-1 inline-flex items-center gap-2 border-b-2 border-blue-500 text-sm font-medium whitespace-nowrap text-blue-600 focus:outline-none focus:text-blue-800"
          href="#"
          aria-current="page"
        >
          Record
          <span className="ms-1 py-0.5 px-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
            {count}
          </span>
        </a>
        <button
          onClick={() => {
            setShowModal(true);
            setAction("create");
            setError("");
          }}
          className="py-4 px-1 inline-flex items-center gap-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500"
          href="#"
        >
          <span className="ms-1 py-2.5 px-2.5 rounded-full text-xs font-medium bg-teal-300 text-teal-800 dark:bg-teal-500 dark:text-neutral-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="currentColor"
              className="bi bi-person-plus-fill"
              viewBox="0 0 16 16"
            >
              <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
              <path
                fillRule="evenodd"
                d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"
              />
            </svg>
          </span>
        </button>
      </nav>
    </div>
  );
}

function Modal({
  setShowModal,
  showModal,
  action,
  setAction,
  user,
  error,
  setError,
  setChanged,
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("male");
  const [dob, setDOB] = useState(formatDate());
  const genderList = ["male", "female", "others"];

  function resetState() {
    setEmail("");
    setName("");
    setDOB("");
    setGender("");
    setHeight("");
    setWeight("");
    setError("");
    setAction("");
  }

  const [isEdit, setIsEdit] = useState(true);

  if (isEdit && action === "edit" && Object.keys(user).length > 0) {
    setEmail(user.emailId);
    setName(user.name);
    setDOB(user.dob);
    setGender(user.gender);
    setHeight(user.height);
    setWeight(user.weight);
    setIsEdit(() => false);
  }

  function clientValidation() {
    if (name.length <= 3)
      return "Name must be more than or equal to 4 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Please enter a valid email";
    if (new Date(dob).getFullYear() > 2014)
      return "DOB can be made only for 2014 born or before";
    if (height < 55) return "Height must be at least 55 (cm)";
    if (weight < 35) return "Weight must be at least 35 (kg)";
    return "";
  }

  async function dbUser(e) {
    e.preventDefault();

    setError("");

    let clientValidationStr = clientValidation();
    if (clientValidationStr.length > 0) {
      setError(`CLIENT: ${clientValidationStr}`);
      return;
    }

    try {
      const res = await fetch(
        `${BASE_URL}${action === "edit" ? user._id : ""}`,
        {
          method: action === "create" ? "POST" : "PUT",
          body: JSON.stringify({
            name,
            gender,
            emailId: email,
            height,
            weight,
            dob: dob,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (data?.status === 200) {
        setShowModal(false);
        setChanged((c) => !c);
        resetState();
      } else {
        console.error(data?.message);
        setError(`SERVER: ${data.message}`);
      }
    } catch (error) {
      setError(`EXCEPTION: ${error.message}`);
      console.error(error.message);
    }
  }

  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-xl text-gray-700 font-semibold">
                    User Form
                  </h3>
                </div>
                <div className="relative p-6 flex-auto">
                  {error.length > 0 ? (
                    <div className="max-w-sm space-y-3 self-center mb-5">
                      <div className="space-y-3">
                        <div
                          className="max-w-xs bg-white border border-red-200 rounded-xl shadow-lg dark:bg-red-100 dark:border-red-700"
                          role="alert"
                        >
                          <div className="flex p-4">
                            <div className="flex-shrink-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                fill="currentColor"
                                class="bi bi-bug-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M4.978.855a.5.5 0 1 0-.956.29l.41 1.352A5 5 0 0 0 3 6h10a5 5 0 0 0-1.432-3.503l.41-1.352a.5.5 0 1 0-.956-.29l-.291.956A5 5 0 0 0 8 1a5 5 0 0 0-2.731.811l-.29-.956z" />
                                <path d="M13 6v1H8.5v8.975A5 5 0 0 0 13 11h.5a.5.5 0 0 1 .5.5v.5a.5.5 0 1 0 1 0v-.5a1.5 1.5 0 0 0-1.5-1.5H13V9h1.5a.5.5 0 0 0 0-1H13V7h.5A1.5 1.5 0 0 0 15 5.5V5a.5.5 0 0 0-1 0v.5a.5.5 0 0 1-.5.5zm-5.5 9.975V7H3V6h-.5a.5.5 0 0 1-.5-.5V5a.5.5 0 0 0-1 0v.5A1.5 1.5 0 0 0 2.5 7H3v1H1.5a.5.5 0 0 0 0 1H3v1h-.5A1.5 1.5 0 0 0 1 11.5v.5a.5.5 0 1 0 1 0v-.5a.5.5 0 0 1 .5-.5H3a5 5 0 0 0 4.5 4.975" />
                              </svg>
                            </div>
                            <div className="ms-3">
                              <p className="text-sm dark:text-gray-900">
                                {error} 🤯
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <form>
                    <div className="max-w-sm space-y-3">
                      <div className="relative">
                        <input
                          type="text"
                          className="peer text-gray-500 py-3 px-4 ps-11 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-100 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                          placeholder="Enter name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-person"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                          </svg>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="email"
                          className="peer text-gray-500 py-3 px-4 ps-11 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-100 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                          placeholder="Enter email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-at"
                            viewBox="0 0 16 16"
                          >
                            <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914" />
                          </svg>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="date"
                          className="peer text-gray-500 py-3 px-4 ps-11 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-100 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                          placeholder="Enter DOB"
                          value={dob}
                          onChange={(e) => setDOB(e.target.value)}
                          required
                        />
                        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-calendar-date"
                            viewBox="0 0 16 16"
                          >
                            <path d="M6.445 11.688V6.354h-.633A13 13 0 0 0 4.5 7.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23" />
                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                          </svg>
                        </div>
                      </div>
                      <div key={"sdsf"} className="flex gap-x-6">
                        <div key={1} className="relative flex my-3">
                          <span
                            key={"sdsdwdf"}
                            className="text-sm text-gray-700 ms-2 uppercase"
                          >
                            Gender
                          </span>
                          <div
                            key={2}
                            className="mr-3 inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none"
                          >
                            <svg
                              key={"wdcwwc"}
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-gender-ambiguous"
                              viewBox="0 0 16 16"
                            >
                              <path
                                key={"sdswdfwregvevf"}
                                fillRule="evenodd"
                                d="M11.5 1a.5.5 0 0 1 0-1h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-3.45 3.45A4 4 0 0 1 8.5 10.97V13H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V14H6a.5.5 0 0 1 0-1h1.5v-2.03a4 4 0 1 1 3.471-6.648L14.293 1zm-.997 4.346a3 3 0 1 0-5.006 3.309 3 3 0 0 0 5.006-3.31z"
                              />
                            </svg>
                          </div>
                          {genderList.map((g) => (
                            <>
                              <input
                                key={g}
                                type="radio"
                                name="group"
                                className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                id="hs-radio-group-1"
                                checked={gender === g}
                                value={g}
                                onChange={(e) => setGender(e.target.value)}
                              />
                              <label
                                key={`${g}ddafwdcc`}
                                htmlFor="group"
                                className="text-sm text-gray-500 ms-2 mr-3 uppercase"
                              >
                                {g}
                              </label>
                            </>
                          ))}
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          className="peer text-gray-500 py-3 px-4 ps-11 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-100 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                          placeholder="Enter height (cm)"
                          value={height}
                          onChange={(e) => setHeight(Number(e.target.value))}
                          required
                        />
                        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-arrow-down-up"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          className="peer text-gray-500 py-3 px-4 ps-11 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-100 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                          placeholder="Enter weight (kg)"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          required
                        />
                        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-arrows-expand-vertical"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5M.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
                  <button
                    type="button"
                    className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-white/10 dark:hover:bg-white/20 dark:text-neutral-400 dark:hover:text-neutral-300"
                    onClick={() => setShowModal(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-x-square"
                      viewBox="0 0 16 16"
                    >
                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={dbUser}
                    className={`py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-100 text-teal-500 hover:bg-teal-100 disabled:opacity-50 disabled:pointer-events-none dark:text-${
                      action === "create" ? "teal" : "blue"
                    }-500 dark:hover:text-teal-400`}
                  >
                    {action === "create" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        fill="currentColor"
                        className="bi bi-send-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855a.75.75 0 0 0-.124 1.329l4.995 3.178 1.531 2.406a.5.5 0 0 0 .844-.536L6.637 10.07l7.494-7.494-1.895 4.738a.5.5 0 1 0 .928.372zm-2.54 1.183L5.93 9.363 1.591 6.602z" />
                        <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-3.5-2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1a.5.5 0 0 0-.5-.5" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        fill="currentColor"
                        className="bi bi-scissors"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.5 3.5c-.614-.884-.074-1.962.858-2.5L8 7.226 11.642 1c.932.538 1.472 1.616.858 2.5L8.81 8.61l1.556 2.661a2.5 2.5 0 1 1-.794.637L8 9.73l-1.572 2.177a2.5 2.5 0 1 1-.794-.637L7.19 8.61zm2.5 10a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0m7 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

function Card({ children }) {
  return (
    <div className="m-5 flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl p-4 md:p-5 dark:bg-neutral-50 dark:border-neutral-300 dark:text-neutral-100">
      {children}
    </div>
  );
}

function Table({
  users,
  setUser,
  setError,
  setChanged,
  setAction,
  setShowModal,
}) {
  const cols = ["name", "email", "dob", "gender", "height", "weight", "action"];

  async function deletebUser(id) {
    try {
      const res = await fetch(`${BASE_URL}${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data?.status === 200) {
        setChanged((c) => !c);
      } else {
        console.error(data?.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {cols.map((col, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users?.length > 0
                  ? users.map((u) => (
                      <tr
                        className={`rounded-xl bg-${
                          statusColorMap[u.status]
                        }-100`}
                        key={u._id}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                          {u.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {u.emailId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {formatDate(u.dob)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {u.gender}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {u.height}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {u.weight}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                          <button
                            onClick={() => {
                              setShowModal(true);
                              setAction("edit");
                              setUser(u);
                              setError("");
                            }}
                            type="button"
                            className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400"
                          >
                            <span className="inline-flex justify-center items-center size-[46px] rounded-full text-yellow-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                fill="currentColor"
                                className="bi bi-pencil-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                              </svg>
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              deletebUser(u._id);
                            }}
                            type="button"
                            className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400"
                          >
                            <span className="inline-flex justify-center items-center size-[46px] rounded-full text-red-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                fill="currentColor"
                                className="bi bi-trash3-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                              </svg>
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyNote() {
  return (
    <div className="self-center space-y-3">
      <div
        className="max-w-xs text-gray-700 bg-white border border-neutral-200 rounded-xl shadow-lg dark:bg-yellow-100 dark:border-yellow-700"
        role="alert"
      >
        <div className="flex p-4">
          <div className="flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="currentColor"
              className="bi bi-database-fill-dash"
              viewBox="0 0 16 16"
            >
              <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M11 12h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1M8 1c-1.573 0-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4s.875 1.755 1.904 2.223C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777C13.125 5.755 14 5.007 14 4s-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1" />
              <path d="M2 7v-.839c.457.432 1.004.751 1.49.972C4.722 7.693 6.318 8 8 8s3.278-.307 4.51-.867c.486-.22 1.033-.54 1.49-.972V7c0 .424-.155.802-.411 1.133a4.51 4.51 0 0 0-4.815 1.843A12 12 0 0 1 8 10c-1.573 0-3.022-.289-4.096-.777C2.875 8.755 2 8.007 2 7m6.257 3.998L8 11c-1.682 0-3.278-.307-4.51-.867-.486-.22-1.033-.54-1.49-.972V10c0 1.007.875 1.755 1.904 2.223C4.978 12.711 6.427 13 8 13h.027a4.55 4.55 0 0 1 .23-2.002m-.002 3L8 14c-1.682 0-3.278-.307-4.51-.867-.486-.22-1.033-.54-1.49-.972V13c0 1.007.875 1.755 1.904 2.223C4.978 15.711 6.427 16 8 16c.536 0 1.058-.034 1.555-.097a4.5 4.5 0 0 1-1.3-1.905" />
            </svg>
          </div>
          <div className="ms-3 text-gray-700">
            <p className="text-sm text-gray-900 dark:text-neutral-700">
              There's no data in the database 😱
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState();
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState("");
  const [changed, setChanged] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      async function fetchUsers() {
        try {
          const res = await fetch(`${BASE_URL}`);
          const data = await res.json();
          setUsers(data?.data);
        } catch (err) {
          console.error(err.message);
        }
      }
      fetchUsers();
    },
    [changed]
  );
  return (
    <>
      <NavBar
        count={users.length}
        setShowModal={setShowModal}
        setAction={setAction}
        setError={setError}
      />
      <Card>
        {users.length > 0 ? (
          <Table
            users={users}
            showModal={showModal}
            setShowModal={setShowModal}
            setChanged={setChanged}
            action={action}
            setAction={setAction}
            user={user}
            setUser={setUser}
            error={error}
            setError={setError}
          />
        ) : (
          <EmptyNote />
        )}
      </Card>
      <Modal
        showModal={showModal}
        action={action}
        error={error}
        setError={setError}
        setAction={setAction}
        setShowModal={setShowModal}
        setChanged={setChanged}
        user={user}
        setUser={setUser}
      />
    </>
  );
}

export default App;
