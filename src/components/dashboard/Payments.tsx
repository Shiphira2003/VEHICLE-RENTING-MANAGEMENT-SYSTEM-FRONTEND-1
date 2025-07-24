// src/components/dashboard/UserPayments.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../apps/store';
import { useGetAllPaymentsQuery } from '../../features/api/paymentsApi';
import type { PaymentDetails } from '../../types/paymentDetails';
import Swal from 'sweetalert2';

export const UserPayments = () => {
    const userId = useSelector((state: RootState) => state.auth.user?.userId);

    const { data: allPayments, isLoading, isError, error } = useGetAllPaymentsQuery();

    const userPayments = React.useMemo(() => {
        if (!allPayments || !userId) return [];
        // FIX: Ensure payment.booking exists and then check userId
        return allPayments.filter((payment: PaymentDetails) => payment.booking && payment.booking.user && payment.booking.user.userId === userId);
    }, [allPayments, userId]);

    if (!userId) {
        return <div className="text-center py-10 text-white">Please log in to view your payments.</div>;
    }

    if (isLoading) return <div className="text-center py-10 text-white">Loading your payments...</div>;
    if (isError) {
        let errorMessage = "Failed to fetch payments.";
        if (error) {
            // Improved error message extraction from RTK Query error object
            if ('data' in error && error.data && typeof error.data === 'object' && 'error' in error.data) {
                errorMessage = (error.data as any).error || (error.data as any).message || 'Unknown backend error';
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
            title: 'Payment Error',
            text: errorMessage,
        });
        return <div className="text-center py-10 text-red-500">Error loading payments.</div>;
    }
    if (!userPayments || userPayments.length === 0) return <div className="text-center py-10 text-purple-400">You have no payments yet.</div>;

    return (
        <div className="min-h-screen bg-darkGray text-white p-6">
            <h2 className="text-3xl font-bold text-center mb-8 text-accentPink">My Payments</h2>
            <div className="overflow-x-auto">
                <table className="table w-full bg-lightGray rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-300 text-white">
                            <th className="p-4 text-left">Payment ID</th>
                            <th className="p-4 text-left">Booking ID</th>
                            <th className="p-4 text-left">Amount</th>
                            <th className="p-4 text-left">Method</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userPayments.map((payment: PaymentDetails) => (
                            <tr key={payment.paymentId} className="border-b border-gray-600 hover:bg-gray-700 transition-colors duration-150">
                                <td className="p-4">{payment.paymentId}</td>
                                <td className="p-4">{payment.bookingId}</td>
                                <td className="p-4">${payment.amount.toFixed(2)}</td>
                                <td className="p-4">{payment.paymentMethod}</td>
                                <td className="p-4">{payment.paymentStatus}</td>
                                <td className="p-4">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserPayments;
