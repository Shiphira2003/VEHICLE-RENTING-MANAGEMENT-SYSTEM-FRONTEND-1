// src/pages/UserBookings.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../apps/store';import type { BookingDetails } from '../../types/BookingDetails';
import Swal from 'sweetalert2';
import { useGetBookingsByUserIdQuery } from '../../features/api/bookingsApi';

const UserBookings = () => {
    const userId = useSelector((state: RootState) => state.auth.user?.userId);

    const { data: bookings, isLoading, isError, error } =  useGetBookingsByUserIdQuery(userId!, {
        skip: !userId, 
    });

    if (!userId) {
        return <div className="text-center py-10 text-blue">Please log in to view your bookings.</div>;
    }

    if (isLoading) return <div className="text-center py-10 text-purple-500">Loading your bookings...</div>;

    if (isError) {
        let errorMessage = "Failed to fetch bookings.";
        if (error) {
            //  message extraction from RTK Query error object
            if ('data' in error && error.data && typeof error.data === 'object' && 'error' in error.data) {
                errorMessage = (error.data as any).error; // Backend message, e.g., "Invalid ID format"
            } else if ('error' in error && typeof error.error === 'string') {
                errorMessage = error.error; // RTK Query error string, e.g., "Fetch failed"
            } else if ('message' in error && typeof error.message === 'string') {
                errorMessage = error.message; // Generic JavaScript Error message
            } else if (typeof error === 'string') {
                errorMessage = error; // Direct string error
            }
        }

        Swal.fire({
            icon: 'error',
            title: 'Booking Error',
            text: errorMessage, // To show the specific error from the backend
        });
        return <div className="text-center py-10 text-red-500">Error loading bookings.</div>;
    }
    if (!bookings || bookings.length === 0) return <div className="text-center py-10 text-red-500">You have no bookings yet.</div>;

    return (
        <div className="min-h-screen bg-darkGray text-white p-6">
            <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">My Bookings</h2>
            <div className="overflow-x-auto">
                <table className="table w-full bg-lightGray rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-700 text-white">
                            <th className="p-4 text-purple-500 text-left">Booking ID</th>
                            <th className="p-4 text-purple-500 text-left">Vehicle</th>
                            <th className="p-4 text-purple-500 text-left">Booking Date</th>
                            <th className="p-4 text-purple-500 text-left">Return Date</th>
                            <th className="p-4 text-purple-500 text-left">Total Amount</th>
                            <th className="p-4 text-purple-500 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking: BookingDetails) => (
                            <tr key={booking.bookingId} className="border-b border-gray-600 hover:bg-gray-700 transition-colors duration-150">
                                <td className="p-4 text-black">{booking.bookingId}</td>
                                <td className="p-4 text-black">
                                    {booking.vehicle && (
                                        <div className="flex items-center gap-2">
                                            {/* Uncomment and ensure imageUrl exists if you want to display it */}
                                            {/* <img
                                                src={booking.vehicle.imageUrl || '/default-car.png'}
                                                alt={`${booking.vehicle.vehicleSpec?.manufacturer} ${booking.vehicle.vehicleSpec?.model}`}
                                                className="w-16 h-12 object-cover rounded-md"
                                            /> */}
                                            <span>{booking.vehicle.vehicleSpec?.manufacturer} {booking.vehicle.vehicleSpec?.model}</span>
                                        </div>
                                    )}
                                </td>
                                <td className="p-4 text-black">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                                <td className="p-4 text-black">{new Date(booking.returnDate).toLocaleDateString()}</td>
                                <td className="p-4 text-black">${booking.totalAmount}</td>
                                <td className="p-4 text-black">{booking.bookingStatus}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserBookings;
