import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { setUser } from "../../redux/userSlice";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = Boolean(user);

  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "Blogs", path: "/exploreblogs" },
  ];

  const protectedLinks = [
    { name: "Create Blog", path: "/create" },
    { name: "Profile", path: "/profile" },
  ];

  const navLinks = isLoggedIn ? [...publicLinks, ...protectedLinks] : publicLinks;

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-blue-600 transition-colors font-medium";

  const handleLogout = async () => {
    try {
      const res = await api.post("/auth/logout");

      dispatch(setUser(null));
      toast.success(res.data.message || "Logged out successfully");
      setIsMenuOpen(false);
      navigate("/auth");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong during logout");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            Blogify
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.name} to={link.path} className={linkClass}>
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Login
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            className="md:hidden text-gray-700 hover:text-blue-600 transition"
            aria-label="Toggle menu"
          >
            <span className="text-3xl leading-none">{isMenuOpen ? "×" : "☰"}</span>
          </button>

          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-md p-4 space-y-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={linkClass}
                >
                  <span className="block">{link.name}</span>
                </NavLink>
              ))}

              <div className="pt-3 border-t border-gray-100">
                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-block px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
