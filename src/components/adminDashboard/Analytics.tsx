import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, PieChart, Pie, Cell
} from "recharts";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { RootState } from "../../apps/store";
import { bookingsApi } from "../../features/api/bookingsApi";
import { paymentsApi } from "../../features/api/paymentsApi";
import { ticketsApi } from "../../features/api/ticketsApi";
import { userApi } from "../../features/api/userApi";
import { useGetAllVehiclesQuery } from '../../features/api/vehiclesApi';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BE9"];

type User = { role: string };

// Icon Components
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const CarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
  </svg>
);

const TicketIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
  </svg>
);

const CashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const ArrowUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);


const Analytics = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data: bookingsData = [], isLoading: bookingsLoading } = bookingsApi.useGetAllBookingsQuery(undefined, { skip: !isAuthenticated });
  const { data: paymentsData = [], isLoading: paymentsLoading } = paymentsApi.useGetAllPaymentsQuery(undefined, { skip: !isAuthenticated });
  const { data: ticketsData = [], isLoading: ticketsLoading } = ticketsApi.useGetAllTicketsQuery(undefined, { skip: !isAuthenticated });
  const { data: usersData = [], isLoading: usersLoading } = userApi.useGetAllUsersProfilesQuery(undefined, { skip: !isAuthenticated });
  const { data: vehiclesData = [], isLoading: vehiclesLoading } = useGetAllVehiclesQuery(undefined, { skip: !isAuthenticated });
  
  const [filterStatus] = useState("All");

  const totalBookings = bookingsData.length;
  const filteredBookings = filterStatus === "All" ? bookingsData : bookingsData.filter(b => b.bookingStatus === filterStatus);
  const pendingBookings = filteredBookings.filter(b => b.bookingStatus === "Pending").length;
  const confirmedBookings = filteredBookings.filter(b => b.bookingStatus === "Confirmed").length;

  const totalPayments = paymentsData.length;
  const completedPayments = paymentsData.filter(p => p.paymentStatus === "Completed").length;
  const pendingPayments = paymentsData.filter(p => p.paymentStatus === "Pending").length;

  const totalRevenue = paymentsData.reduce((sum, p) => {
    const amount = typeof p.amount === 'string' ? parseFloat(p.amount) : p.amount;
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  const totalTickets = ticketsData.length;
  const openTickets = ticketsData.filter(t => t.status === "Open" || t.status === "Pending").length;
  const closedTickets = ticketsData.filter(t => t.status === "Closed").length;

  const totalUsers = usersData.length;
  const users = usersData.filter((u: User) => u.role === "user").length;
  const adminUsers = usersData.filter((u: User) => u.role === "admin").length;
  const disabledUsers = usersData.filter((u: User) => u.role === "disabled").length;

  const totalVehicles = vehiclesData.length;
  const availableVehicles = vehiclesData.filter(v => v.availability).length;
  const bookedVehicles = vehiclesData.filter(v => !v.availability).length;

  // New calculations for metrics
  const bookingPercentage = totalBookings > 0 ? Math.round((confirmedBookings / totalBookings) * 100) : 0;
  const vehiclePercentage = totalVehicles > 0 ? Math.round((availableVehicles / totalVehicles) * 100) : 0;
  const ticketPercentage = totalTickets > 0 ? Math.round((closedTickets / totalTickets) * 100) : 0;
  const revenueChange = "+12%"; // Replace with actual calculation if available

  const anyLoading = bookingsLoading || paymentsLoading || ticketsLoading || usersLoading || vehiclesLoading;

  if (anyLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <PuffLoader color="#0aff13" size={80} />
        <span className="ml-4 text-blue-700 text-xl">Loading dashboard data...</span>
      </div>
    );
  }

  const chartData = [
    { name: 'Bookings', Pending: pendingBookings, Confirmed: confirmedBookings },
    { name: 'Payments', Pending: pendingPayments, Completed: completedPayments },
    { name: 'Tickets', Open: openTickets, Closed: closedTickets },
    { name: 'Users', Admin: adminUsers, User: users, Disabled: disabledUsers },
    { name: 'Vehicles', Available: availableVehicles, Booked: bookedVehicles },
  ];

  const pieData = [
    { name: "Confirmed", value: confirmedBookings },
    { name: "Pending", value: pendingBookings }
  ];

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Analytics Dashboard Summary", 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [["Metric", "Value"]],
      body: [
        ["Total Bookings", totalBookings],
        ["Confirmed Bookings", confirmedBookings],
        ["Pending Bookings", pendingBookings],
        ["Total Payments", totalPayments],
        ["Completed Payments", completedPayments],
        ["Pending Payments", pendingPayments],
        ["Total Revenue", `Ksh ${totalRevenue.toFixed(2)}`],
        ["Open Tickets", openTickets],
        ["Closed Tickets", closedTickets],
        ["Total Users", totalUsers],
        ["Admins", adminUsers],
        ["Users", users],
        ["Disabled Users", disabledUsers],
        ["Available Vehicles", availableVehicles],
        ["Booked Vehicles", bookedVehicles],
      ],
    });
    doc.save("dashboard_summary.pdf");
  };

  const handlePrint = () => window.print();

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-purple-900">Admin Dashboard Overview</h1>

      {/* Filters & Export */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
        <div className="flex gap-2">
          <button onClick={exportToPDF} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Export PDF</button>
          <button onClick={handlePrint} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Print</button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        {/* Bookings Card */}
        <div className="relative group bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-white overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-purple-200 opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Bookings</p>
              <p className="text-3xl font-bold mt-2 text-gray-800">{totalBookings}</p>
              <span className="inline-flex items-center mt-1 text-sm font-medium text-green-600">
                {bookingPercentage}% <ArrowUpIcon className="ml-1 h-4 w-4" />
              </span>
            </div>
            <div className="p-3 rounded-lg bg-white text-purple-600 shadow-xs">
              <CalendarIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Confirmed</span>
              <span>{bookingPercentage}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 to-blue-500 rounded-full"
                style={{ width: `${bookingPercentage}%` }}
              ></div>
            </div>
          </div>
          <Link to="/adminDashboard/AllBookings" className="absolute inset-0 z-10"></Link>
        </div>

        {/* Revenue Card */}
        <div className="relative group bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-white overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-teal-200 opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-3xl font-bold mt-2 text-gray-800">Ksh {totalRevenue.toFixed(2)}</p>
              <span className="inline-flex items-center mt-1 text-sm font-medium text-green-600">
                {revenueChange} <ArrowUpIcon className="ml-1 h-4 w-4" />
              </span>
            </div>
            <div className="p-3 rounded-lg bg-white text-teal-600 shadow-xs">
              <CashIcon className="h-6 w-6" />
            </div>
          </div>
          <Link to="/adminDashboard/AllPayments" className="absolute inset-0 z-10"></Link>
        </div>

        {/* Users Card */}
        <div className="relative group bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-white overflow-hidden">
          <div className="absolute -left-4 -top-4 w-20 h-20 rounded-full bg-pink-200 opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-3xl font-bold mt-2 text-gray-800">{totalUsers}</p>
              <span className="inline-flex items-center mt-1 text-sm font-medium text-green-600">
                +{users > 0 ? Math.round((users / totalUsers) * 100) : 0}% <ArrowUpIcon className="ml-1 h-4 w-4" />
              </span>
            </div>
            <div className="p-3 rounded-lg bg-white text-pink-600 shadow-xs">
              <UserIcon className="h-6 w-6" />
            </div>
          </div>
          <Link to="/adminDashboard/AllUsers" className="absolute inset-0 z-10"></Link>
        </div>

        {/* Vehicles Card */}
        <div className="relative group bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-white overflow-hidden">
          <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-amber-200 opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Vehicles</p>
              <p className="text-3xl font-bold mt-2 text-gray-800">{totalVehicles}</p>
              <span className="inline-flex items-center mt-1 text-sm font-medium text-green-600">
                {vehiclePercentage}% available
              </span>
            </div>
            <div className="p-3 rounded-lg bg-white text-amber-600 shadow-xs">
              <CarIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Available</span>
              <span>{vehiclePercentage}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                style={{ width: `${vehiclePercentage}%` }}
              ></div>
            </div>
          </div>
          <Link to="/adminDashboard/AllVehicles" className="absolute inset-0 z-10"></Link>
        </div>

        {/* Tickets Card */}
        <div className="relative group bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-white overflow-hidden">
          <div className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full bg-indigo-200 opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Tickets</p>
              <p className="text-3xl font-bold mt-2 text-gray-800">{totalTickets}</p>
              <span className="inline-flex items-center mt-1 text-sm font-medium text-green-600">
                {ticketPercentage}% resolved
              </span>
            </div>
            <div className="p-3 rounded-lg bg-white text-indigo-600 shadow-xs">
              <TicketIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Resolved</span>
              <span>{ticketPercentage}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-400 to-violet-500 rounded-full"
                style={{ width: `${ticketPercentage}%` }}
              ></div>
            </div>
          </div>
          <Link to="/adminDashboard/AllTickets" className="absolute inset-0 z-10"></Link>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Stacked Bar Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(chartData[0]).filter(key => key !== "name").map((key, index) => (
                <Bar key={key} dataKey={key} stackId="a" fill={COLORS[index % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Booking Status Pie</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Enhanced Summary Table */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-2xl font-bold mb-6 text-purple-800">Key Metrics Dashboard</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Bookings Row */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Bookings</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="mr-2 font-semibold">{confirmedBookings} confirmed</span>
                  <span className="text-gray-500">of {totalBookings}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${(confirmedBookings/totalBookings)*100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 mt-1">{Math.round((confirmedBookings/totalBookings)*100)}% completion</span>
              </td>
            </tr>
            
            {/* Payments Row */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Payments</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="mr-2 font-semibold">{completedPayments} completed</span>
                  <span className="text-gray-500">of {totalPayments}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${(completedPayments/totalPayments)*100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 mt-1">{Math.round((completedPayments/totalPayments)*100)}% processed</span>
              </td>
            </tr>
            
            {/* Revenue Row */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Revenue</td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-purple-600">Ksh {totalRevenue.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  +12% from last month
                </span>
              </td>
            </tr>
            
            {/* Tickets Row */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Tickets</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="mr-2 font-semibold">{closedTickets} closed</span>
                  <span className="text-gray-500">of {totalTickets}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-yellow-500 h-2.5 rounded-full" 
                    style={{ width: `${(closedTickets/totalTickets)*100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 mt-1">{Math.round((closedTickets/totalTickets)*100)}% resolved</span>
              </td>
            </tr>
            
            {/* Users Row */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Users</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="mr-2 font-semibold">{users} regular</span>
                  <span className="text-gray-500">of {totalUsers}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {adminUsers} admin
                  </span>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {disabledUsers} disabled
                  </span>
                </div>
              </td>
            </tr>

            {/* Vehicles Row */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Vehicles</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="mr-2 font-semibold">{availableVehicles} available</span>
                  <span className="text-gray-500">of {totalVehicles}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-orange-500 h-2.5 rounded-full" 
                    style={{ width: `${(availableVehicles/totalVehicles)*100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 mt-1">{Math.round((availableVehicles/totalVehicles)*100)}% availability</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;