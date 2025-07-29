// src/pages/PaymentPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import { useGetBookingByIdQuery } from '../features/api/userApi'; // Assuming getBookingById is in userApi
import { useCreatePaymentMutation } from '../features/api/paymentsApi'; // Use the paymentsApi you provided
import type { NewPayment } from '../types/paymentDetails'; // Import from your provided PaymentDetails types

const PaymentPage = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const bookingIdNum = bookingId ? parseInt(bookingId) : undefined;
    const navigate = useNavigate();

    // Fetch booking details to confirm amount and other info
    const { data: booking, error: bookingError, isLoading: isBookingLoading } = useGetBookingByIdQuery(bookingIdNum!, {
        skip: bookingIdNum === undefined, // Skip if bookingId is not a valid number
    });

    const [createPayment, { isLoading: isCreatingPayment }] = useCreatePaymentMutation();

    const [paymentMethod, setPaymentMethod] = useState<string>(''); // Using string as it comes from select input
    const [transactionId, setTransactionId] = useState(''); // Will be filled by actual payment gateway or dummy
    const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState(''); // For M-Pesa STK Push

    useEffect(() => {
        if (bookingError) {
            toast.error("Could not load booking details for payment.");
            console.error("Booking fetch error on payment page:", bookingError);
            navigate('/dashboard/bookings'); // Redirect if booking not found or error
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

        // Basic validation for M-Pesa
        if (paymentMethod === 'M-Pesa' && !mpesaPhoneNumber) {
            toast.error("Please enter your M-Pesa phone number.");
            return;
        }
        // Add more specific validation for other payment methods if needed

        const paymentLoadingToastId = toast.loading("Processing your payment...");
        try {
            // In a real application, you'd integrate with a payment gateway here.
            // For M-Pesa: You'd typically make an API call to your backend to initiate an STK Push.
            // Your backend would then interact with the Daraja API.
            // The `transactionId` (M-Pesa code) often comes back via a callback URL to your backend.
            // For now, we'll simulate a transactionId.

            let finalTransactionId: string = transactionId;
            if (!finalTransactionId) {
                // Generate a dummy transaction ID if not provided (e.g., for M-Pesa where it comes later)
                finalTransactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            }

            const paymentPayload: NewPayment = {
                bookingId: bookingIdNum,
                amount: parseFloat(booking.totalAmount), // Ensure amount is number
                paymentDate: new Date().toISOString(), // Current date/time
                paymentMethod: paymentMethod,
                transactionId: finalTransactionId,
                paymentStatus: "Completed", // Assume 'Completed' if the frontend is proceeding
                                           // In a real app, this might be 'Pending' and backend updates it after gateway confirmation
            };

            const result = await createPayment(paymentPayload).unwrap();
            
            toast.success('Payment successful and recorded!', { id: paymentLoadingToastId });
            console.log('Payment response:', result);

            // Redirect to a confirmation page or user's bookings
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
                    <p className="text-gray-700 text-lg">Total Amount: <span className="text-orange-600 font-bold text-2xl">${parseFloat(booking.totalAmount).toFixed(2)}</span></p>
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
                            {/* Add other options as needed, matching your backend's paymentMethodEnum */}
                        </select>
                    </div>

                    {paymentMethod === 'Credit Card' && (
                        <>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Card Number</span>
                                </label>
                                {/* In a real app, use a secure Stripe CardElement or similar */}
                                <input
                                    type="text"
                                    id="cardNumber"
                                    placeholder="**** **** **** ****"
                                    className="input input-bordered"
                                    value={transactionId} // Using transactionId as a mock for card input
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
                            <p className="text-xs text-gray-500 mt-2">
                                For security, use a payment gateway's client-side SDK for actual card input.
                            </p>
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
                                An STK Push will be sent to this number. Please approve the transaction on your phone.
                            </p>
                            {/* In a real M-Pesa integration, the transactionId comes from a backend callback */}
                            {/* <label className="label mt-4">
                                <span className="label-text">M-Pesa Transaction ID (Optional, after confirmation)</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., MPESA01234567"
                                className="input input-bordered"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                            /> */}
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
                            `Pay $${parseFloat(booking.totalAmount).toFixed(2)}`
                        )}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-4">Your payment is secured.</p>
            </div>
        </div>
    );
};

export default PaymentPage;

