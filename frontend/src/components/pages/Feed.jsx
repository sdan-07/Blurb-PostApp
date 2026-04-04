import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Feed = ({ url, navbar }) => {
  const [posts, setPosts] = useState([]);
  const nav = useNavigate();

  const CreatePost = () => {
    return (
      <div className="mt-8 font-normal! italic text-2xl! text-center">
        Create your first post
      </div>
    );
  };

  const fetchData = async () => {
    await axios.get(`${url}/api/post/fetch`).then((res) => {
      setPosts(res.data.posts);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
    {navbar}
    
    <section className="feed flex flex-col justify-center items-center">
      <div className="rounded-2xl flex flex-col justify-center items-center h-screen w-md md:w-2xl scale-95 sm:scale-100">
        <div className="m-12">
          {posts.length === 0 ? CreatePost() : ""}

          {posts.reverse().map((post, idx) => {
            return (
              <>
              <div className="mx-4 flex justify-between">
                {/* date div*/}
                <p className="mt-13 text-gray-400">
                  {post.date}
                </p>
                {/* tool icons */}
                <div className="flex justify-end">
                      <button
                        className="mr-4 my-8 w-4xs relative inline-flex items-center justify-center p-0.5 overflow-hidden text-base font-medium text-heading rounded-base group bg-linear-to-br from-green-400 to-blue-600 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 cursor-pointer"
                        type="button"
                        onClick={async () => {
                          const val = prompt("Enter Caption");
                          if (val != null) {
                            await axios
                              .patch(`${url}/api/post/update-post/${post._id}`, {
                                caption: val,
                              })
                              .then((res) => {
                                //alert("Post has been edited");
                                fetchData();
                              })
                              .catch((err) => {
                                console.error(err);
                                alert("Post could not be edited");
                              });
                          }
                        }}
                      >
                        <span className="w-4xs relative p-2 transition-all ease-in duration-75 bg-slate-900 rounded-base group-hover:bg-transparent group-hover:dark:bg-transparent leading-5 text-white hover:text-white">
                          <svg
                            width="6px"
                            height="6px"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="white"
                            className="w-6 h-6 scale-75"
                          >
                            <g id="Complete">
                              <g id="edit">
                                <g>
                                  <path
                                    d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8"
                                    fill="none"
                                    stroke="white"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                  />
                                  <polygon
                                    fill="none"
                                    points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8"
                                    stroke="white"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                  />
                                </g>
                              </g>
                            </g>
                          </svg>
                        </span>
                      </button>

                      <button
                        className="my-8 w-4xs relative inline-flex items-center justify-center p-0.5 overflow-hidden text-base font-medium text-heading rounded-base group bg-linear-to-br from-green-400 to-blue-600 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 cursor-pointer"
                        type="button"
                        onClick={async () => {
                          const isConfirmed = window.confirm('Are you sure you want to delete this post?');
                          if (isConfirmed) {
                            await axios
                              .delete(`${url}/api/post/delete-post/${post._id}`)
                              .then((res) => {
                                nav(0);
                                //alert("Post has been deleted");
                              })
                              .catch((err) => {
                                console.error(err);
                                alert("Post could not be deleted");
                              });
                          }
                        }}
                      >
                        <span className="w-4xs relative p-2 transition-all ease-in duration-75 bg-slate-900 rounded-base group-hover:bg-transparent group-hover:dark:bg-transparent leading-5 text-white hover:text-white">
                          <svg
                            width="6px"
                            height="6px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 scale-75 text-black dark:text-white"
                          >
                            <path
                              d="M10 11V17"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M14 11V17"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M4 7H20"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </button>
                </div>
              </div>
              
              

              <div className="postcard mb-22 flex flex-col" key={post._id}>
                <img
                  className="w-full h-full object-fill rounded-4xl"
                  src={post.image}
                  alt={`Image ${idx + 1}`}
                />
                <div className="flex justify-between mx-6">
                  <p className="text-sm md:text-lg text-center mt-10">
                    {post.caption}
                  </p>

                  
                </div>
              </div>
            </>
            );
          })}
        </div>

        <div className="mt-32 flex items-center justify-center">
          <Link to="/create-post">
            <button
              className="mb-14 w-xs relative inline-flex items-center justify-center overflow-hidden text-base font-medium text-heading rounded-base group bg-linear-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 cursor-pointer"
              type="submit"
            >
              <span className="w-full relative px-3 py-4 transition-all ease-in duration-75 bg-gray-700 rounded-base group-hover:bg-transparent group-hover:dark:bg-transparent leading-5 text-lg text-white hover:text-white">
                Create post
              </span>
            </button>
          </Link>
        </div>
      </div>
    </section>
    </>
  );
};

export default Feed;
