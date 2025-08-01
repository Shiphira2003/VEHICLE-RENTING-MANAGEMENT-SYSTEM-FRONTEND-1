import { SquareUserRound, LogOut, TrendingUpIcon, Home, Car, Users, Ticket, ListTodo } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCredentials } from "../features/auth/authSlice"; // Update path to match your project structure

export const AdminSideNav = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear authentication credentials
        dispatch(clearCredentials());
        // Redirect to home page
        navigate("/");
    };

    return (
        <ul className="menu fixed top-0 left-0 pt-16 h-screen w-52 bg-gray-150 text-dark-300 shadow-lg gap-2 text-base-content p-4 z-40">
            {/* Analytics */}
            <li>
                <Link to="/admindashboard/analytics" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-400">
                    <TrendingUpIcon className="text-orange-600 w-5 h-5" />
                    <span className="text-gray-800 text-base">Analytics</span>
                </Link>
            </li>

            {/* All bookings */}
            <li>
                <Link to="/admindashboard/allbookings" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-400">
                    <ListTodo className="text-orange-600 w-5 h-5" />
                    <span className="text-gray-800 text-base">All bookings</span>
                </Link>
            </li>

            <li>
                <Link to="/admindashboard/allpayments" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-400">
                    <Users className="text-orange-600 w-5 h-5" />
                    <span className="text-gray-800 text-base">All Payments</span>
                </Link>
            </li>

            {/* All vehicles */}
            <li>
                <Link to="/admindashboard/allvehicles" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-400">
                    <Car className="text-orange-600 w-5 h-5" />
                    <span className="text-gray-800 text-base">All vehicles</span>
                </Link>
            </li>

            {/* All users */}
            <li>
                <Link to="/admindashboard/allusers" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-400">
                    <Users className="text-orange-600 w-5 h-5" />
                    <span className="text-gray-800 text-base">All users</span>
                </Link>
            </li>

            {/* All tickets */}
            <li>
                <Link to="alltickets" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-400">
                    <Ticket className="text-orange-600 w-5 h-5" />
                    <span className="text-gray-800 text-base">All tickets</span>
                </Link>
            </li>

            {/* My profile */}
            <li>
                <Link to="/admindashboard/adminprofile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-400">
                    <SquareUserRound className="text-orange-600 w-5 h-5" />
                    <span className="text-gray-800 text-base">My profile</span>
                </Link>
            </li>

            <div className="my-4 border-t border-gray-400"></div>

            {/* Logout */}
            <li>
               <button 
  onClick={handleLogout}
  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white hover:bg-gray-100 w-full text-left border border-gray-200"
>
  <LogOut className="text-red-600 w-5 h-5" />
  <span className="text-purple-800 text-base">Logout</span>
</button>
            </li>

            {/* Home */}
            <li>
                <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-400">
                    <Home className="text-green-500 w-5 h-5" />
                    <span className="text-gray-800 text-base">Home</span>
                </Link>
            </li>
        </ul>
    );
};