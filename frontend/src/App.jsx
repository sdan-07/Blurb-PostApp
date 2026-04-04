import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./components/pages/Login";
import CreatePost from "./components/pages/CreatePost";
import Feed from "./components/pages/Feed";
import Register from "./components/pages/Register";
import axios from "axios";
import {
  Avatar,
  Dropdown,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarToggle,
} from "flowbite-react";

// Configure axios to send credentials
axios.defaults.withCredentials = true;

const url = import.meta.env.VITE_BACKEND_URL;



const App = () => {

  const nav = useNavigate();

  const HandleLogout = async () => {
    try {
      await axios.post(`${url}/api/auth/logout`).then((res) => {
        console.log("logged out");
        nav("/");
      });
    } catch (err) {
      console.error(err);
      alert("Error while logging out");
    }
  };

  const NavbarComponent = ({ title }) => (
  <>
    {/* avatar navbar */}
    <Navbar fluid rounded className="bg-slate-950!">
      <div className="flex justify-between w-full p-4 md:order-2">
        <div className="w-full flex justify-center">
          {title && (
            <h1 className="text-center italic my-2 text-2xl! sm:text-4xl!">{title}</h1>
          )}
        </div>
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              className="cursor-pointer"
              alt="User settings"
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              rounded
            />
          }
        >

          <DropdownHeader>
            {/* <span className="block text-sm">Bonnie Green</span> */}
            <Link to="/create-post">
              <span className="block truncate text-sm font-medium mb-4">
                Create Post
              </span>
            </Link>

            <Link to="/feed">
              <span className="block truncate text-sm font-medium mb-4">
                Go to Feed
              </span>
            </Link>
          </DropdownHeader>
          <DropdownItem onClick={HandleLogout}>Log out</DropdownItem>
        </Dropdown>
        <NavbarToggle />
      </div>
    </Navbar>
  </>
);


  return (
    <>
      <div className="m-1">
        <Routes>
          <Route 
          path="/" 
          element={
              <Login url={url} />
            } 
          />

          <Route
            path="/create-post"
            element={
              <CreatePost
                url={url}
                navbar={
                  <NavbarComponent title="Create Post" />
                }
              />
            }
          />

          <Route 
            path="/register" 
            element={
                <Register url={url} />
              } 
            />

          <Route
            path="/feed"
            element={
              <Feed url={url} navbar={
                  <NavbarComponent title="Your Feed" />
                } 
              />
            }
          />
        </Routes>
      </div>
    </>
  );
};

export default App;
