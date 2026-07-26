import { CiMenuBurger } from "react-icons/ci";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import store from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AUTH_API_END_POINT } from "../../Constants";
import toast from "react-hot-toast";
import { clearUser, getUser } from "../../redux/userSlice";
import { IoIosCloseCircleOutline } from "react-icons/io";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutFunction = async () => {
    try {
      const res = await axios.post(`${AUTH_API_END_POINT}/logout`, {}, {
        headers: {
          'Content-Type': "application/json"
        },
        withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(clearUser());
        navigate("/auth");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
      console.log(error);
    }
  }
  return (
    <>
      <div className="fixed top-0 left-0 z-50 px-3 py-4 flex justify-center items-center w-screen">
        <div className="bg-blue-100 w-[90%] px-3 py-4 rounded-2xl shadow-2xl flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-900 px-2">
            Blogify
          </Link>
          <div className="links hidden md:flex">
            <Link to="/" className="text-lg font-semibold text-gray-700 px-4 py-3 rounded-2xl hover:bg-white">
              Home
            </Link>
            <Link to="/blogs" className="text-lg font-semibold text-gray-700 px-4 py-3 rounded-2xl hover:bg-white">
              Blogs
            </Link>
            {user &&
              <>
                <Link to="/create-blog" className="text-lg font-semibold text-gray-700 px-4 py-3 rounded-2xl hover:bg-white">
                  Create Blog
                </Link>
                <Link to="/profile" className="text-lg font-semibold text-gray-700 px-4 py-3 rounded-2xl hover:bg-white">
                  Profile
                </Link>
              </>
            }
          </div>
          <div className="login hidden md:flex">
            {user ?
              <div onClick={logoutFunction} className="cursor-pointer text-xl font-semibold text-gray-200 hover:text-gray-700 px-4 py-3 rounded-2xl bg-blue-500 hover:bg-blue-300">
                LogOut
              </div>
              :
              <Link to="/auth" className="text-xl font-semibold text-gray-200 hover:text-gray-700 px-4 py-3 rounded-2xl bg-blue-500 hover:bg-blue-300">
                Login
              </Link>
            }
          </div>
          <div className="burgerMenu md:hidden" onClick={() => { setMobileOpen(!mobileOpen) }}>
            <div className="text-xl font-semibold text-gray-200 hover:text-gray-700 px-4 py-3 rounded-2xl bg-blue-500 hover:bg-blue-300">
              {mobileOpen ? <><IoIosCloseCircleOutline /></> : <><CiMenuBurger /></>}
            </div>
          </div>
        </div>
      </div>
      {mobileOpen &&
        <div className=" fixed w-screen top-23 z-100 px-3 py-1 flex justify-center items-center">
          <div className="bg-blue-100 w-[90%] px-3 py-4 rounded-2xl shadow-2xl">
            <div className="links">
              <Link to="/" className=" my-1 block text-lg font-semibold text-gray-700 px-4 py-1 rounded-2xl hover:bg-white">
                Home
              </Link>
              <Link to="/blogs" className=" my-1 block text-lg font-semibold text-gray-700 px-4 py-1 rounded-2xl hover:bg-white">
                Blogs
              </Link>
              {user &&
                <>
                  <Link to="/create-blog" className=" my-1 block text-lg font-semibold text-gray-700 px-4 py-1 rounded-2xl hover:bg-white">
                    Create Blog
                  </Link>
                  <Link to="/profile" className=" my-1 block text-lg font-semibold text-gray-700 px-4 py-1 rounded-2xl hover:bg-white">
                    Profile
                  </Link>
                </>
              }
            </div>
            <div className="login">
              {user ?
                <div onClick={logoutFunction} className="cursor-pointer block text-xl font-semibold text-gray-200 hover:text-gray-700 px-4 py-3 rounded-2xl bg-blue-500 hover:bg-blue-300 text-center">
                  LogOut
                </div>
                :
                <Link to="/auth" className="block text-xl font-semibold text-gray-200 hover:text-gray-700 px-4 py-3 rounded-2xl bg-blue-500 hover:bg-blue-300 text-center">
                  Login
                </Link>

              }
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Navbar;