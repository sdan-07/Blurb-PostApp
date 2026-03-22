import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, HelperText, Label, TextInput } from "flowbite-react";
import axios from "axios";

const Register = ({ url }) => {
  const [passwordVal, setPasswordVal] = useState(``);
  const [cnfPasswordVal, setCnfPasswordVal] = useState(``);
  const [touched, setTouched] = useState(false);
  const nav = useNavigate();

  const HandleSubmit = async (e) => {
    e.preventDefault();

    if (
      e.target.password.value !== e.target.cnfpassword.value ||
      e.target.password.value.length < 5
    )
      throw new Error("Password criteria not met");

    const data = {
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      await axios.post(`${url}/api/auth/register`, data).then((res) => {
        nav("/feed");
        e.target.reset();
      });
    } catch (err) {
      console.error(err);
      alert("Something wrong happened");
    }
  };

  return (
    <div className="h-[90vh] flex flex-col items-center justify-center">
      <h1 className="text-center mb-20 italic text-4xl!">Create your account</h1>

      <div>
        <form
          onSubmit={HandleSubmit}
          className="flex border rounded-3xl shadow-amber-400/50 p-8 w-sm md:w-md flex-col gap-4 scale-95 md:scale-110"
        >
          <div>
            <div className="mb-2 block">
              <Label htmlFor="username">Your Username</Label>
            </div>
            {/* username */}
            <TextInput id="username" type="text" name="username" required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email">Your Email Address</Label>
            </div>
            {/* email */}
            <TextInput
              id="email1"
              type="email"
              name="email"
              placeholder="johndoe@mail.com"
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password1">Your password</Label>
            </div>
            {/* Password */}
            <TextInput
              id="password1"
              value={passwordVal}
              onChange={(e) => {
                e.preventDefault();
                //console.log(e.target.value);

                setPasswordVal(e.target.value);
              }}
              type="password"
              name="password"
              required
            />
          </div>

          <p
            className={
              touched && passwordVal.length < 5
                ? "-mt-3.75 block px-2 py-2.5 text-red-500 font-medium text-sm"
                : "hidden"
            }
          >
            Password must be atleast 5 characters long
          </p>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="password1">Confirm password</Label>
            </div>
            {/* Confirm Password */}
            <TextInput
              id="password1"
              value={cnfPasswordVal}
              onChange={(e) => {
                e.preventDefault();
                //console.log(e.target.value);

                setCnfPasswordVal(e.target.value);
              }}
              onBlur={() => {
                setTouched(true);
              }}
              type="password"
              name="cnfpassword"
              required
            />

            <p
              className={
                touched && passwordVal !== cnfPasswordVal
                  ? "block px-2 py-2.5 text-red-500 font-medium text-sm"
                  : "hidden"
              }
            >
              Password does not match
            </p>
          </div>
          {/* <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember">Remember me</Label>
        </div> */}

          <HelperText className="mt-6 text-center">
            Already have an account?
            <span
              className="ml-2  font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
              onClick={() => {
                nav("/");
              }}
            >
              Sign in
            </span>
          </HelperText>

          <Button
            className={
              passwordVal !== cnfPasswordVal && passwordVal < 5
                ? "cursor-not-allowed"
                : "mt-1 cursor-pointer"
            }
            type="submit"
          >
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
