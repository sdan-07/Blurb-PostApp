import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Label, TextInput, HelperText } from "flowbite-react";
import axios from "axios";

const Login = ({ url }) => {
  const [passwordVal, setPasswordVal] = useState(``);
  const [touched, setTouched] = useState(false);
  const nav = useNavigate();

  const triggerUnmatchError = () => {
    return (
      <p
        className={
          touched
            ? "mt-2 px-2 py-2.5 text-red-500  font-medium text-sm"
            : "hidden"
        }
      >
        Invalid email or password
      </p>
    );
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      await axios.post(`${url}/api/auth/login`, data)
      .then((res) => {
        nav("/feed");
        e.target.reset();
      });
    } catch (err) {
      console.error(err);
      setTouched(true);
      triggerUnmatchError();
    }
  };

  return (
    <div>
      <div className="h-[90vh] flex flex-col items-center justify-center">
        <h1 className="text-center mb-12 sm:mb-20 italic text-3xl! sm:text-4xl!">Sign in</h1>
        <div>
          <form
            onSubmit={HandleSubmit}
            className="flex border rounded-3xl shadow-amber-400/50 p-8 w-sm md:w-md flex-col gap-4 scale-90 md:scale-110"
          >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email">Your Email Address</Label>
              </div>
              {/* email */}
              <TextInput
                id="email1"
                type="email"
                name="email"
                required
              />
            </div>
            <div>
              <div className="mt-6 block">
                <Label htmlFor="password1">Your password</Label>
              </div>
              {/* Password */}
              <TextInput
                id="password1"
                value={passwordVal}
                onChange={(e) => {
                  e.preventDefault();
                  setPasswordVal(e.target.value);
                }}
                onBlur={() => {
                  setTouched(true);
                }}
                type="password"
                name="password"
                required
              />

              {triggerUnmatchError()}

            </div>

            <HelperText className="mt-6 text-center">
              Don't have an account?
              
                <span 
                  className="ml-1  font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                  onClick={()=>{nav('/register')}}
                >
                  Create account
                </span>
                          
            </HelperText>

            <Button className="mt-1.5 cursor-pointer" type="submit">
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
