// src/pages/PaymentPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import { useGetBookingByIdQuery } from '../features/api/userApi';
import { useCreatePaymentMutation } from '../features/api/paymentsApi';
import type { NewPayment } from '../types/paymentDetails';

const PaymentPage = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const bookingIdNum = bookingId ? parseInt(bookingId) : undefined;
    const navigate = useNavigate();

    // Fetch booking details
    const { data: booking, error: bookingError, isLoading: isBookingLoading } = useGetBookingByIdQuery(bookingIdNum!, {
        skip: bookingIdNum === undefined,
    });

    const [createPayment, { isLoading: isCreatingPayment }] = useCreatePaymentMutation();
    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [transactionId, setTransactionId] = useState('');
    const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState('');

    // Safely parse amount with fallback to 0
    const amount = booking ? Number(booking.totalAmount) || 0 : 0;
    const formattedAmount = amount.toFixed(2); // Now guaranteed safe

    useEffect(() => {
        if (bookingError) {
            toast.error("Could not load booking details for payment.");
            navigate('/dashboard/bookings');
        }
    }, [bookingError, navigate]);

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!bookingIdNum || !booking) {
            toast.error("Booking details missing for payment.");
            return;
        }

        if (!paymentMethod) {
            toast.error("Please select a payment method.");
            return;
        }

        if (paymentMethod === 'M-Pesa' && !mpesaPhoneNumber) {
            toast.error("Please enter your M-Pesa phone number.");
            return;
        }

        const paymentLoadingToastId = toast.loading("Processing your payment...");
        try {
            let finalTransactionId = transactionId || `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

            const paymentPayload: NewPayment = {
                bookingId: bookingIdNum,
                amount: amount, // Using our safely parsed amount
                paymentDate: new Date().toISOString(),
                paymentMethod: paymentMethod,
                transactionId: finalTransactionId,
                paymentStatus: "Completed",
            };

            const result = await createPayment(paymentPayload).unwrap();
            toast.success('Payment successful and recorded!', { id: paymentLoadingToastId });
            navigate('/dashboard/bookings');

        } catch (paymentError: any) {
            const errorMessage = paymentError.data?.message || paymentError.error || 'Unknown payment error';
            toast.error('Payment failed: ' + errorMessage, { id: paymentLoadingToastId });
            console.error("Payment Error:", paymentError);
        } finally {
            toast.dismiss(paymentLoadingToastId);
        }
    };

    if (isBookingLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <span className="loading loading-spinner loading-lg text-purple-600"></span>
                <p className="ml-4 text-lg text-purple-600">Loading booking details...</p>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700 p-4">
                <p>Booking not found or an error occurred. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8">
            <Toaster richColors position="top-right" />
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto">
                <h2 className="text-3xl font-bold text-purple-800 mb-6 text-center">Complete Your Payment</h2>
                <div className="mb-4 text-center">
                    <p className="text-gray-700 text-lg">Booking for: <span className="font-semibold">{booking.vehicle.vehicleSpec.manufacturer} {booking.vehicle.vehicleSpec.model}</span></p>
                    <p className="text-gray-700 text-lg">Total Amount: <span className="text-orange-600 font-bold text-2xl">${formattedAmount}</span></p>
                    <p className="text-gray-500 text-sm mt-2">Booking ID: {booking.bookingId}</p>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="paymentMethod" className="block text-gray-700 text-sm font-semibold mb-2">Select Payment Method</label>
                        <select
                            id="paymentMethod"
                            className="select select-bordered w-full"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            required
                        >
                            <option value="">-- Select --</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="M-Pesa">M-Pesa (Kenya)</option>
                        </select>
                    </div>

                    {paymentMethod === 'Credit Card' && (
                        <>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Card Number</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="**** **** **** ****"
                                    className="input input-bordered"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Expiry (MM/YY)</span>
                                    </label>
                                    <input type="text" placeholder="MM/YY" className="input input-bordered" required />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">CVC</span>
                                    </label>
                                    <input type="text" placeholder="CVC" className="input input-bordered" required />
                                </div>
                            </div>
                        </>
                    )}

                    {paymentMethod === 'M-Pesa' && (
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">M-Pesa Phone Number</span>
                            </label>
                            <input
                                type="tel"
                                placeholder="e.g., 254712345678"
                                className="input input-bordered"
                                value={mpesaPhoneNumber}
                                onChange={(e) => setMpesaPhoneNumber(e.target.value)}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                An STK Push will be sent to this number.
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn bg-orange-500 hover:bg-orange-600 text-white w-full mt-6"
                        disabled={isCreatingPayment || !paymentMethod || (paymentMethod === 'M-Pesa' && !mpesaPhoneNumber)}
                    >
                        {isCreatingPayment ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            `Pay $${formattedAmount}`
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentPage;