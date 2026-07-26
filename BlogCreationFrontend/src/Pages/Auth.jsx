import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AUTH_API_END_POINT } from "../Constants";
import { useDispatch, useSelector } from "react-redux";
import store from "../redux/store";
import { getUser } from "../redux/userSlice";

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || "/";

  useEffect(()=>{
    if (user) {
      navigate(redirectPath, { replace: true });
    }
  },[])

  const authorization = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isLoggingIn) {
        //Login
        if (!email) {
          return toast.error("Enter Your Email");
        }
        if (!password) {
          return toast.error("Enter Password");
        }
        const res = await axios.post(`${AUTH_API_END_POINT}/login`, { email, password }, {
          headers: {
            'Content-Type': "application/json"
          },
          withCredentials: true
        });
        if (res.data.success) {
          toast.success(res.data.message);
          dispatch(getUser(res.data.user));
          navigate(redirectPath, { replace: true });
        }
      } else {
        //Register
        if (!name) {
          return toast.error("Enter Your Name");
        }
        if (!email) {
          return toast.error("Enter Your Email");
        }
        if (!password) {
          return toast.error("Enter Password");
        }
        const res = await axios.post(`${AUTH_API_END_POINT}/register`, { name, email, password }, {
          headers: {
            'Content-Type': "application/json"
          },
          withCredentials: true
        });
        if (res.data.success) {
          toast.success(res.data.message);
          dispatch(getUser(res.data.user));
          navigate(redirectPath, { replace: true });
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <div className="bg-[radial-gradient(circle_at_center,_white_0%,_#60a5fa_100%)] h-screen w-screen flex justify-center items-center">
        <div className=" border-2 max-w-[600px] w-[90%] bg-blue-300 rounded-2xl md:px-6 py-4">
          <div className="">
            <div className="logo flex justify-center items-center">
              <Link to="/" className="text-2xl font-bold text-gray-900 px-2">
                Blogify
              </Link>
            </div>
            <div className="inputs text-left px-4">
              {/* Name */}
              {!isLoggingIn &&
                <label className="block py-2">
                  <span className="mb-2 block text-sm font-medium text-gray-800">
                    Name
                  </span>
                  <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" placeholder="Enter your name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white" />
                </label>
              }
              {/* Email */}
              <label className="block py-2">
                <span className="mb-2 block text-sm font-medium text-gray-800">
                  Email
                </span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" placeholder="Email abc@xvz.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white" />
              </label>
              {/* Password */}
              <label className="block py-2">
                <span className="mb-2 block text-sm font-medium text-gray-800">
                  Password
                </span>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" placeholder="xxxxxx"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white" />
              </label>
              {!loading ?
                <div onClick={authorization} className="block text-xl font-semibold text-gray-200 hover:text-gray-700 px-4 py-3 rounded-2xl bg-blue-500 hover:bg-blue-400 text-center cursor-pointer">
                  {isLoggingIn ? <>Login</> : <>Register</>}
                </div>
                :
                <div className="disabled block text-xl font-semibold text-gray-200 hover:text-gray-700 px-4 py-3 rounded-2xl bg-blue-500 hover:bg-blue-400 text-center cursor-pointer">
                  Loading ...
                </div>
              }
              <span onClick={() => { setIsLoggingIn(!isLoggingIn) }} className="text-center my-2 block text-sm font-medium text-gray-800 cursor-pointer">

                {!isLoggingIn ? <>Already have an account? &nbsp;</> : <>Create your account: &nbsp;</>}
                {!isLoggingIn ? <>Login</> : <>Register</>}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;