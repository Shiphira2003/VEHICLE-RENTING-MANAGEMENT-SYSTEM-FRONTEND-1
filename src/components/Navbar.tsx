import { useState } from "react";
import { BiHome, BiPhone } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../apps/store";
import { FaSignOutAlt, FaCar, FaServicestack } from "react-icons/fa";
import { GrDashboard } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { clearCredentials } from "../features/auth/authSlice";

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
        <div className="navbar bg-gradient-to-r bg-purple-400 shadow-lg sticky top-0 z-50 border-b border-purple-200">
            {/* Navbar Start */}
            <div className="navbar-start">
                {/* Mobile Dropdown */}
                <div className="dropdown">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost lg:hidden hover:bg-purple-700"
                        onClick={toggleMenu}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                            />
                        </svg>
                    </div>
                    {isMenuOpen && (
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-white rounded-box w-52 border border-purple-100"
                        >
                            <li>
                                <Link to="/" className="text-gray-700 hover:text-purple-600 hover:bg-purple-50" onClick={closeMenu}>
                                    <BiHome className="text-lg text-purple-600" />
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/services" className="text-gray-700 hover:text-purple-600 hover:bg-purple-50" onClick={closeMenu}>
                                    <FaServicestack className="text-lg text-purple-600" />
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-700 hover:text-purple-600 hover:bg-purple-50" onClick={closeMenu}>
                                    <BiPhone className="text-lg text-purple-600" />
                                    Contact
                                </Link>
                            </li>

                            <div className="divider my-2"></div>
                            {!isAuthenticated ? (
                                <>
                                    <li>
                                        <Link to="/login" className="text-gray-700 hover:text-purple-600" onClick={closeMenu}>
                                            Login
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/register" className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white border-none" onClick={closeMenu}>
                                            Sign Up
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-700 hover:text-purple-600 w-full text-left"
                                    >
                                        Logout
                                    </button>
                                </li>
                            )}
                        </ul>
                    )}
                </div>

                {/* Logo */}
                <Link to="/" className="btn btn-ghost text-xl hover:bg-purple-700 px-2">
                    <FaCar className="text-2xl text-white" />
                    <span className="font-bold text-white">
                        SHIWAMA DRIVE
                    </span>
                </Link>
            </div>

            {/* Navbar Center - Desktop Menu */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-2">
                    <li>
                        <Link to="/" className="text-white hover:text-purple-200 hover:bg-purple-700 transition-all duration-200">
                            <BiHome className="text-lg text-white" />
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/services" className="text-white hover:text-purple-200 hover:bg-purple-700 transition-all duration-200">
                            <FaServicestack className="text-lg text-white" />
                            Services
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact" className="text-white hover:text-purple-200 hover:bg-purple-700 transition-all duration-200">
                            <BiPhone className="text-lg text-white" />
                            Contact
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Navbar End - Auth Buttons */}
            {!isAuthenticated ? (
                <div className="navbar-end hidden lg:flex gap-2">
                    <Link to="/login" className="btn btn-ghost text-white hover:text-purple-200 hover:bg-purple-700">
                        Login
                    </Link>
                    <Link to="/register" className="btn bg-purple-600 hover:bg-purple-700 text-white border-none shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                        Sign Up
                    </Link>
                </div>
            ) : (
                <div className="navbar-end hidden lg:flex gap-2">
                    <div className="dropdown dropdown-end bg-purple-700 rounded-lg">
                        <button tabIndex={0} role="button" className="btn btn-ghost flex items-center text-white hover:bg-purple-600">
                            <div className="flex items-center">
                                <span className="text-white">Hello, {user?.firstName}</span>
                                <svg
                                    className="w-6 h-6 text-purple-200 ml-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </button>
                        <ul tabIndex={0} className="dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            {user?.role === 'admin' ? (
                                <li>
                                    <Link
                                        to="/admindashboard/analytics"
                                        className="flex items-center text-slate-950 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
                                    >
                                        <GrDashboard className="mr-3 text-purple-600" />
                                        Admin Dashboard
                                    </Link>
                                </li>
                            ) : (
                                <li>
                                    <Link
                                        to="/userDashboard/my-profile"
                                        className="flex items-center text-slate-950 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
                                    >
                                        <GrDashboard className="mr-3 text-purple-600" />
                                        User Dashboard
                                    </Link>
                                </li>
                            )}
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full text-slate-950 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
                                >
                                    <FaSignOutAlt className="text-xl text-purple-600 mr-3" />
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};