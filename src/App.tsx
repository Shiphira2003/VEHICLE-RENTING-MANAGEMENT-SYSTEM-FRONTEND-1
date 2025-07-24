import { createBrowserRouter, RouterProvider } from "react-router"
import { Register } from "./pages/Register"
import Error from "./pages/Error"
import "./App.css"
import { Login } from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import UserProfile from "./components/dashboard/UserProfile"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminDashboard from "./pages/AdminDashboard"


import AdminUserProfile from "./components/adminDashboard/AdminUserProfile"

import Home from "./pages/Home"
import Contact from "./pages/Contact"
import Services from "./pages/Services"

import { AllUsers } from "./components/adminDashboard/AllUsers"
import { AllBookings } from "./components/adminDashboard/AllBookings"
import { AllTickets } from "./components/adminDashboard/AllTickets"
import UserBookings from "./components/dashboard/Bookings"
import UserPayments from "./components/dashboard/Payments"
import UserTickets from "./components/dashboard/Tickets"
import Analytics from "./components/adminDashboard/Analytics"
import PaymentPage from "./pages/Payment"
import PaymentSuccessPage from "./pages/PaymentSuccess"
import { Bookings } from "./pages/Bookings"
import { VDetails } from "./pages/VDetails"
import { AllVehicles } from "./components/adminDashboard/AllVehicles"
import { AllPayments } from "./components/adminDashboard/AllPayments"
import ImageUploadPage from "./pages/ImageUploadPage"
import TestImageUpload from "./pages/TestImageUpload"

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
      errorElement: <Error />,
    },
    {
      path: 'register',
      element: <Register />,
      errorElement: <Error />,
    },
    {
      path: 'services',
      element: <Services />,
      errorElement: <Error />,
    },
    {
      path: 'login',
      element: <Login />,
      errorElement: <Error />,
    },
    {
      path: 'contact',
      element: <Contact />,
      errorElement: <Error />,
    },
    {
      path: 'vehicles/:id',
      element: <VDetails />,
      errorElement: <Error />,
    },
    //   {
    //   path: 'bookings',
    //   element: <UserBookings />,
    //   errorElement: <Error />,
    // },

    {
      path: 'payment/:bookingId',
      element: <PaymentPage />,
      errorElement: <Error />,
    },
    {
      path: 'payment-success/:paymentId',
      element: <PaymentSuccessPage />,
      errorElement: <Error />,
    },

    {
      path: 'userDashboard',
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
      errorElement: <Error />,
      children: [
        {
          path: "my-profile",
          element: <UserProfile />,
        },
        {
          path: "bookings",
          element: <UserBookings />,
        },
        {
          path: "bookings",
          element: <Bookings />
        },
        {
          path: "payments",
          element: <UserPayments />,
        },
        {
          path: "tickets",
          element: <UserTickets />,
        },
      ]
    },
    {
      path: 'admindashboard',
      element: (
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      ),
      errorElement: <Error />,
      children: [
        {
          path: "analytics",
          element: <Analytics />,
        },
        {
          path: "allbookings",
          element: <AllBookings />,
        },
        {
          path: "allpayments",
          element: <AllPayments />,
        },
        {
          path: "alltickets",
          element: <AllTickets />,
        },
        {
          path: "allvehicles",
          element: <AllVehicles />,
        },
        {
          path: "allusers",
          element: <AllUsers />,
        },
        {
          path: "adminprofile",
          element: <AdminUserProfile />,
        },
        {
          path: "vehicles/:vehicleId/images",
          element: <ImageUploadPage />,
        },
        {
          path: "test-upload",
          element: <TestImageUpload />,
        },
      ]
    },
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App