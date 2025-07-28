import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaCar, FaSignOutAlt, FaUserCircle, FaRegListAlt } from "react-icons/fa";
import { BiHome, BiPhone, BiLogIn, BiUserPlus } from "react-icons/bi";
import { MdMiscellaneousServices } from "react-icons/md";
import { clearCredentials } from "../features/auth/authSlice";
import type { RootState } from "../apps/store";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate("/");
  };

  return (
    <div className="navbar bg-gradient-to-r from-purple-300/80 to-purple-400/80 shadow-md sticky top-0 z-50 border-b border-purple-300 transition-all duration-300">
      {/* Start */}
      <div className="navbar-start">
        {/* Mobile toggle */}
        <div className="dropdown">
          <button
            onClick={toggleMenu}
            className="btn btn-ghost lg:hidden hover:bg-purple-600/80 p-3"
          >
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>

          {isMenuOpen && (
            <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-white rounded-box w-64 border border-purple-200">
              <li><Link to="/" onClick={closeMenu}><BiHome className="text-white bg-purple-600 rounded p-1" /> Home</Link></li>
              <li><Link to="/services" onClick={closeMenu}><MdMiscellaneousServices className="text-white bg-purple-600 rounded p-1" /> Services</Link></li>
              <li><Link to="/contact" onClick={closeMenu}><BiPhone className="text-white bg-purple-600 rounded p-1" /> Contact</Link></li>
              <div className="divider my-1"></div>

              {!isAuthenticated ? (
                <>
                  <li>
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="text-white bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded flex items-center gap-2"
                    >
                      <BiLogIn className="text-white transition-transform duration-300 group-hover:scale-110" />
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      onClick={closeMenu}
                      className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <BiUserPlus className="mr-1 text-white" /> Sign Up
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to={user?.role === "admin" ? "/admindashboard/analytics" : "/userDashboard/my-profile"}
                      onClick={closeMenu}
                    >
                      <FaRegListAlt /> {user?.role === "admin" ? "Admin Dashboard" : "User Dashboard"}
                    </Link>
                  </li>
                  <li>
                    <button onClick={() => { handleLogout(); closeMenu(); }}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          )}
        </div>

        {/* Brand logo */}
        <Link to="/" className="btn btn-ghost hover:bg-purple-600/80 px-2">
          <div className="flex items-center gap-2">
            <FaCar className="text-3xl text-white" />
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent animate-fade-in-up tracking-wide transition-transform duration-700 ease-in-out transform hover:scale-105">
              SHIWAMA DRIVE
            </span>
          </div>
        </Link>
      </div>

      {/* Center - Desktop Nav */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-lg font-medium">
          <li><Link to="/" className="text-white hover:bg-purple-600/70 px-4 py-2 rounded"><BiHome className="text-white" /> Home</Link></li>
          <li><Link to="/services" className="text-white hover:bg-purple-600/70 px-4 py-2 rounded"><MdMiscellaneousServices className="text-white" /> Services</Link></li>
          <li><Link to="/contact" className="text-white hover:bg-purple-600/70 px-4 py-2 rounded"><BiPhone className="text-white" /> Contact</Link></li>
        </ul>
      </div>

      {/* End - Desktop Auth Buttons */}
      <div className="navbar-end hidden lg:flex gap-3">
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className="btn btn-ghost text-white hover:bg-purple-600/80 flex items-center gap-2"
            >
              <BiLogIn className="text-white transition-transform duration-300 group-hover:scale-110" />
              Login
            </Link>
            <Link
              to="/register"
              className="btn bg-purple-600 hover:bg-purple-700 text-white shadow flex items-center gap-2"
            >
              <BiUserPlus className="text-white" />
              Sign Up
            </Link>
          </>
        ) : (
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost hover:bg-purple-600/80 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-lg">Hi, {user?.firstName}</span>
                <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white font-bold">
                  {user?.firstName?.charAt(0)}
                </div>
              </div>
            </button>
            <ul tabIndex={0} className="dropdown-content mt-3 z-[1] w-52 bg-white shadow-xl rounded-box p-2">
              <li>
                <Link
                  to={user?.role === "admin" ? "/admindashboard/analytics" : "/userDashboard/my-profile"}
                  className="px-4 py-2 hover:bg-purple-50 hover:text-purple-600"
                >
                  <FaUserCircle className="inline mr-2" />
                  {user?.role === "admin" ? "Admin Dashboard" : "User Dashboard"}
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-purple-50 hover:text-purple-600"
                >
                  <FaSignOutAlt className="inline mr-2" /> Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Login Shortcut */}
      {!isAuthenticated && (
        <div className="navbar-end lg:hidden">
          <Link to="/login" className="btn btn-ghost text-white hover:bg-purple-600/80">
            <BiLogIn className="text-white" /> Login
          </Link>
        </div>
      )}
    </div>
  );
};
