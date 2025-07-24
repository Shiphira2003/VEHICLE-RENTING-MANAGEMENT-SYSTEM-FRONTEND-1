import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccessPage = () => {
  const { paymentId } = useParams<{ paymentId: string }>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white px-4 py-12">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <FaCheckCircle className="text-green-500 text-5xl mb-4 mx-auto" />
        <h2 className="text-3xl font-bold text-purple-800 mb-2">Payment Successful</h2>
        <p className="text-gray-700 mb-4">
          Thank you for your payment. Your transaction has been completed successfully.
        </p>
        {paymentId && (
          <p className="text-sm text-gray-500 mb-4">
            Payment Reference: <span className="font-semibold text-black">{paymentId}</span>
          </p>
        )}
        <div className="space-y-2">
          <Link to="/dashboard/bookings" className="btn w-full bg-purple-600 text-white hover:bg-purple-700">
            View My Bookings
          </Link>
          <Link to="/vehicles" className="btn w-full btn-outline text-purple-600 hover:bg-purple-100">
            Rent Another Vehicle
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
