import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePost = ({ url, navbar }) => {
  const nav = useNavigate();

  const handleSubmit = async(e)=>{
    e.preventDefault();

    const formData = new FormData(e.target)
    await axios.post(`${url}/api/post/create-post`, formData)
    .then((res)=>{
      console.log("post added");
      nav('/feed')
      e.target.reset();
    })
    .catch((err)=>{
      alert('Error creating post')
      console.error(err);
    })
  }

  return (
    <>
      {navbar}

      <section className="create-post-form flex flex-col items-center justify-center h-[85vh] lg:scale-110">
        <div className="h-[70vh] border-2 w-sm rounded-2xl">
          <div className="form-content flex flex-col">
            <form className="p-5" onSubmit={handleSubmit}>
              <div className="inputbox flex items-center justify-center w-full">
                <label
                  for="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 bg-slate-800 hover:bg-slate-700 border border-dashed border-default-strong rounded-base cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-white">
                    <svg
                      className="w-8 h-8 mb-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm ">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs ">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input id="dropzone-file" type="file" name="image" accept="image/*" className="hidden" required/>
                </label>
              </div>
              {/* <input type='file' name='image' accept='image/*' required/> */}

              {/* <input className="w-full" type="text" name="caption" required /> */}
              <div className="my-14">
                <label
                  for="visitors"
                  className="block mb-2.5 text-sm font-medium text-white"
                >
                  Your caption
                </label>
                <input
                  type="text"
                  name="caption"
                  id="visitors"
                  className=" text-white bg-slate-800 border border-default-medium text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                  placeholder=""
                  required
                />
              </div>

              <button
                className="my-8 w-full relative inline-flex items-center justify-center p-0.5 overflow-hidden text-base font-medium text-heading rounded-base group bg-linear-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 cursor-pointer"
                type="submit"
              >
                <span className="w-full relative px-5 py-3.5 transition-all ease-in duration-75 bg-slate-900 rounded-base group-hover:bg-transparent group-hover:dark:bg-transparent leading-5 text-white hover:text-white">
                  Post
                </span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default CreatePost;
