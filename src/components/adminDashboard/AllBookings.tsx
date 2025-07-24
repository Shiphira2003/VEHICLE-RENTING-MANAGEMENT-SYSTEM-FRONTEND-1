// src/components/AllBookings.tsx

import { AiFillDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import type { RootState } from "../../apps/store";
import { useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
import Swal from "sweetalert2";
import { bookingsApi } from "../../features/api/bookingsApi";
import type { BookingDetails } from "../../types/BookingDetails";

// Helper function to get badge class based on booking status
const getBookingStatusBadge = (status: BookingDetails["bookingStatus"]) => {
    switch (status) {
        case "Confirmed": return "badge-success text-green-800 bg-green-200 border-green-300";
        case "Cancelled": return "badge-error text-red-800 bg-red-200 border-red-300";
        case "Pending": return "badge-warning text-yellow-800 bg-yellow-200 border-yellow-300";
        case "Completed": return "badge-info text-blue-800 bg-blue-200 border-blue-300";
        default: return "badge-primary";
    }
};

export const AllBookings = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const { data: bookingsData = [], isLoading, error } = bookingsApi.useGetAllBookingsQuery(
        undefined,
        { skip: !isAuthenticated }
    );
    const [updateBooking] = bookingsApi.useUpdateBookingMutation();
    const [deleteBooking] = bookingsApi.useDeleteBookingMutation();

    const handleConfirmBooking = async (bookingId: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to confirm this booking?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#f44336",
            confirmButtonText: "Yes, Confirm it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await updateBooking({ bookingId: bookingId, bookingStatus: "Confirmed" }).unwrap();
                    console.log(res);
                    Swal.fire("Confirmed!", "Booking has been confirmed.", "success");
                } catch (error) {
                    console.error("Failed to confirm booking:", error);
                    Swal.fire("Something went wrong", "Please Try Again", "error");
                }
            }
        });
    };

    const handleDeleteBooking = async (bookingId: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this booking?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f44336",
            cancelButtonColor: "#2563eb",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteBooking(bookingId).unwrap();
                    Swal.fire("Deleted!", "The booking has been deleted.", "success");
                } catch (error) {
                    console.error("Failed to delete booking:", error);
                    Swal.fire("Error!", "Something went wrong while deleting.", "error");
                }
            }
        });
    };

    return (
        <>
            <div className="text-2xl font-bold text-center mb-4 text-purple-900">All Bookings</div>
            <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
                <table className="table w-full text-left">
                    <thead>
                        <tr>
                            <th className="p-4 text-black">Booking ID</th>
                            <th className="p-4 text-black">Vehicle</th>
                            <th className="p-4 text-black">Rental Rate</th>
                            <th className="p-4 text-black">Booked By</th>
                            <th className="p-4 text-black">Booking Dates</th>
                            <th className="p-4 text-black">Total Amount</th>
                            <th className="p-4 text-black">Status</th>
                            <th className="p-4 text-black">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {error ? (
                            <tr>
                                <td colSpan={8} className="text-red-600 text-center py-4 text-lg">
                                    Error fetching bookings. Please try again.
                                </td>
                            </tr>
                        ) : isLoading ? (
                            <tr>
                                <td colSpan={8} className="flex justify-center items-center py-8">
                                    <PuffLoader color="#0aff13" size={60} />
                                    <span className="ml-4 text-gray-700">Loading bookings...</span>
                                </td>
                            </tr>
                        ) : bookingsData.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center text-gray-600 py-8 text-lg">
                                    No bookings available 😎
                                </td>
                            </tr>
                        ) : (
                            bookingsData.map((booking: BookingDetails) => (
                                <tr key={booking.bookingId} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                                    <th className="p-4 text-gray-700">{booking.bookingId}</th>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-12 w-12 border-2 border-purple-400">
                                                    <img
                                                        // FIX: Always use the default placeholder image, as imageUrl is not available
                                                        src={"/default-car.png"}
                                                        alt={`${booking.vehicle.vehicleSpec.manufacturer} ${booking.vehicle.vehicleSpec.model}`}
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-purple-700">
                                                    {booking.vehicle.vehicleSpec.manufacturer} {booking.vehicle.vehicleSpec.model}
                                                </div>
                                                <div className="text-sm opacity-70 text-gray-600">
                                                    {booking.vehicle.vehicleSpec.year} | {booking.vehicle.vehicleSpec.transmission}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-700">Ksh {booking.vehicle.rentalRate}</td>
                                    <td className="p-4">
                                        <div className="font-bold text-gray-800">{booking.user.firstName}</div>
                                        <div className="text-sm opacity-50 text-gray-600">{booking.user.email}</div>
                                    </td>
                                    <td className="p-4 text-gray-700">
                                        {new Date(booking.bookingDate).toLocaleDateString()} -{" "}
                                        {new Date(booking.returnDate).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-gray-700">Ksh {booking.totalAmount}</td>
                                    <td className="p-4">
                                        <div className={`badge text-xs font-semibold px-3 py-1 rounded-full ${getBookingStatusBadge(booking.bookingStatus)} `}>
                                            {booking.bookingStatus}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {booking.bookingStatus === "Pending" && (
                                            <button
                                                className="text-blue-700 hover:text-blue-500 btn btn-sm btn-outline border-blue-500 transition-colors duration-200"
                                                onClick={() => handleConfirmBooking(booking.bookingId)}
                                                title="Confirm Booking"
                                                aria-label="Confirm Booking"
                                            >
                                                <FiEdit /> Confirm
                                            </button>
                                        )}
                                        <button
                                            className="text-red-500 hover:text-red-600 btn btn-sm ml-2 btn-outline border-red-500 transition-colors duration-200"
                                            onClick={() => handleDeleteBooking(booking.bookingId)}
                                            title="Delete Booking"
                                            aria-label="Delete Booking"
                                        >
                                            <AiFillDelete /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};