import { useState, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import type { RootState } from "../../apps/store";
import { useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
import Swal from "sweetalert2";
import { bookingsApi } from "../../features/api/bookingsApi";
import { paymentsApi } from "../../features/api/paymentsApi";
import type { BookingDetails } from "../../types/BookingDetails";

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
    const [filterStatus, setFilterStatus] = useState<string>("All");

    const { data: bookingsData = [], isLoading, error, refetch } = bookingsApi.useGetAllBookingsQuery(
        undefined,
        { skip: !isAuthenticated }
    );
    const { data: paymentsData = [] } = paymentsApi.useGetAllPaymentsQuery(
        undefined,
        { skip: !isAuthenticated }
    );
    const [updateBooking] = bookingsApi.useUpdateBookingMutation();
    const [deleteBooking] = bookingsApi.useDeleteBookingMutation();

    // Auto-confirm bookings with paid payments
    useEffect(() => {
        const autoConfirmPaidBookings = async () => {
            const pendingBookings = bookingsData.filter(
                (booking: BookingDetails) => booking.bookingStatus === "Pending"
            );

            for (const booking of pendingBookings) {
                const payment = paymentsData.find(
                    (payment: any) => payment.bookingId === booking.bookingId && 
                    payment.paymentStatus === "Paid"
                );

                if (payment) {
                    try {
                        await updateBooking({ 
                            bookingId: booking.bookingId, 
                            bookingStatus: "Confirmed" 
                        }).unwrap();
                        console.log(`Booking ${booking.bookingId} auto-confirmed due to paid payment`);
                        refetch();
                    } catch (error) {
                        console.error(`Failed to auto-confirm booking ${booking.bookingId}:`, error);
                    }
                }
            }
        };

        if (bookingsData.length > 0 && paymentsData.length > 0) {
            autoConfirmPaidBookings();
        }
    }, [bookingsData, paymentsData, updateBooking, refetch]);

    const filteredBookings = bookingsData.filter((booking: BookingDetails) => {
        if (filterStatus === "All") return true;
        return booking.bookingStatus === filterStatus;
    });

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
                    await updateBooking({ 
                        bookingId: bookingId, 
                        bookingStatus: "Confirmed" 
                    }).unwrap();
                    Swal.fire("Confirmed!", "Booking has been confirmed.", "success");
                    refetch();
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
                    refetch();
                } catch (error) {
                    console.error("Failed to delete booking:", error);
                    Swal.fire("Error!", "Something went wrong while deleting.", "error");
                }
            }
        });
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div className="text-2xl font-bold text-purple-900">All Bookings</div>
                <div className="flex items-center gap-4">
                    <label htmlFor="status-filter" className="text-gray-700 font-medium">
                        Filter by Status:
                    </label>
                    <select
                        id="status-filter"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="p-2 text-purple-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                        <option value="All">All Bookings</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
                <table className="table w-full text-left">
                    <thead>
                        <tr>
                            <th className="p-4 text-black">Booking ID</th>
                            <th className="p-4 text-black">Vehicle</th>
                            <th className="p-4 text-black">Booked By</th>
                            <th className="p-4 text-black">Dates</th>
                            <th className="p-4 text-black">Amount</th>
                            <th className="p-4 text-black">Booking Status</th>
                            <th className="p-4 text-black">Payment Status</th>
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
                        ) : filteredBookings.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center text-gray-600 py-8 text-lg">
                                    No {filterStatus === "All" ? "" : filterStatus} bookings available
                                </td>
                            </tr>
                        ) : (
                            filteredBookings.map((booking: BookingDetails) => {
                                const payment = paymentsData.find(
                                    (p: any) => p.bookingId === booking.bookingId
                                );
                                
                                return (
                                    <tr key={booking.bookingId} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                                        <th className="p-4 text-gray-700">{booking.bookingId}</th>
                                        <td className="p-4 text-black">
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    {/* <div className="mask mask-squircle h-12 w-12">
                                                        <img
                                                            src={booking.vehicle.vehicleSpec.imageUrl || "/default-car.png"}
                                                            alt={`${booking.vehicle.vehicleSpec.manufacturer} ${booking.vehicle.vehicleSpec.model}`}
                                                        />
                                                    </div> */}
                                                </div>
                                                <div>
                                                    <div className="font-bold">
                                                        {booking.vehicle.vehicleSpec.manufacturer} {booking.vehicle.vehicleSpec.model}
                                                    </div>
                                                    <div className="text-sm opacity-70">
                                                        {booking.vehicle.vehicleSpec.year}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-black">
                                            <div className="font-bold">{booking.user.firstName}</div>
                                            <div className="text-sm opacity-50">{booking.user.email}</div>
                                        </td>
                                        <td className="p-4 text-black">
                                            {new Date(booking.bookingDate).toLocaleDateString()} -{" "}
                                            {new Date(booking.returnDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-black">Ksh {booking.totalAmount}</td>
                                        <td className="p-4">
                                            <div className={`badge ${getBookingStatusBadge(booking.bookingStatus)}`}>
                                                {booking.bookingStatus}
                                            </div>
                                        </td>
                                        <td className="p-4 text-black">
                                            {payment ? (
                                                <div className={`badge ${
                                                    payment.paymentStatus === "Completed" ? "badge-success" :
                                                    payment.paymentStatus === "Pending" ? "badge-warning" :
                                                    "badge-error"
                                                }`}>
                                                    {payment.paymentStatus}
                                                </div>
                                            ) : (
                                                <div className="badge badge-ghost">No Payment</div>
                                            )}
                                        </td>
                                        <td className="p-4 text-black">
                                            {booking.bookingStatus === "Pending" && (
                                                <button
                                                    className="btn btn-sm btn-outline btn-success mr-2"
                                                    onClick={() => handleConfirmBooking(booking.bookingId)}
                                                >
                                                    <FiEdit /> Confirm
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-sm btn-outline btn-error"
                                                onClick={() => handleDeleteBooking(booking.bookingId)}
                                            >
                                                <AiFillDelete /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};