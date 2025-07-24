import { SquareUserRound, LogOut, Home, Car, DollarSign, Ticket } from "lucide-react"
import { Link } from "react-router-dom"

export const SideNav = () => {
    return (
        <ul className="menu bg-gray-150 text-dark-300 shadow-lg min-w-full gap-2 text-base-content min-h-full p-4"> 
            {/* My Profile */}
            <li>
                <Link to="/userDashboard/my-profile" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-400">
                    <SquareUserRound className="text-orange-600 w-5 h-5"/> 
                    <span className="text-gray-800 text-lg">My Profile</span> 
                </Link>
            </li>
            {/* Booking */}
            <li>
                <Link to="/userDashboard/bookings" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-400">
                    <Car className="text-orange-600 w-5 h-5"/> 
                    <span className="text-gray-800 text-lg">Bookings</span>
                </Link>
            </li>
            {/* Payments */}
            <li>
                <Link to="/userDashboard/payments" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-400">
                    <DollarSign className="text-orange-600 w-5 h-5"/>
                    <span className="text-gray-800 text-lg">Payments</span>
                </Link>
            </li>
            {/* Tickets */}
            <li>
                <Link to="/userDashboard/tickets" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-400">
                    <Ticket className="text-orange-600 w-5 h-5"/>
                    <span className="text-gray-800 text-lg">Tickets</span>
                </Link>
            </li>
            {/* Spacing for Logout and Home */}
            <div className="my-4 border-t border-gray-400"></div>

            {/* Logout */}
            <li>
                <Link to="#" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-400">
                    <LogOut className="text-red-600 w-5 h-5"/>
                    <span className="text-gray-800 text-lg">Logout</span>
                </Link>
            </li>
            {/* Home */}
            <li>
                <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-400">
                    <Home className="text-green-500 w-5 h-5"/>
                    <span className="text-gray-800 text-lg">Home</span>
                </Link>
            </li>
        </ul>
    )
}