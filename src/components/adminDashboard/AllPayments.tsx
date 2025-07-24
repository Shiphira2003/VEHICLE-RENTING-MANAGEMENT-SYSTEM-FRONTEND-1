import { AiFillDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import type { RootState } from "../../apps/store";
import { useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
import Swal from "sweetalert2";
import { paymentsApi } from "../../features/api/paymentsApi";
import type { PaymentDetails } from "../../types/paymentDetails";

// Helper function to get badge class based on payment status
const getPaymentStatusBadge = (status: PaymentDetails["paymentStatus"]) => {
  switch (status) {
    case "Completed":
      return "badge-success text-green-800 bg-green-200 border-green-300";
    case "Failed":
      return "badge-error text-red-800 bg-red-200 border-red-300";
    case "Pending":
      return "badge-warning text-yellow-800 bg-yellow-200 border-yellow-300";
    case "Refunded":
      return "badge-info text-blue-800 bg-blue-200 border-blue-300";
    default:
      return "badge-primary";
  }
};

export const AllPayments = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const {
    data: paymentsData = [],
    isLoading,
    error,
  } = paymentsApi.useGetAllPaymentsQuery(undefined, { skip: !isAuthenticated });
  const [updatePayment] = paymentsApi.useUpdatePaymentMutation();
  const [deletePayment] = paymentsApi.useDeletePaymentMutation();

  const handleUpdatePaymentStatus = async (
    paymentId: number,
    newStatus: PaymentDetails["paymentStatus"]
  ) => {
    Swal.fire({
      title: `Confirm ${newStatus} Payment?`,
      text: `You are about to change payment status to '${newStatus}'.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#f44336",
      confirmButtonText: `Yes, ${newStatus} it!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await updatePayment({ paymentId, status: newStatus }).unwrap();
          console.log(res);
          Swal.fire("Success!", `Payment status updated to ${newStatus}.`, "success");
        } catch (error) {
          console.error("Failed to update payment status:", error);
          Swal.fire("Something went wrong", "Please Try Again", "error");
        }
      }
    });
  };

  const handleDeletePayment = async (paymentId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this payment record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f44336",
      cancelButtonColor: "#2563eb",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePayment(paymentId).unwrap();
          Swal.fire("Deleted!", "The payment record has been deleted.", "success");
        } catch (error) {
          console.error("Failed to delete payment:", error);
          Swal.fire("Error!", "Something went wrong while deleting.", "error");
        }
      }
    });
  };

  return (
    <>
      <div className="text-2xl font-bold text-center mb-4 text-purple-900">
        All Payments
      </div>
      <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
        <table className="table w-full text-left">
          <thead>
            <tr>
              <th className="p-4 text-purple-600">Payment ID</th>
              <th className="p-4 text-purple-600">Booking ID</th>
              <th className="p-4 text-purple-600">Amount</th>
              <th className="p-4 text-purple-600">Method</th>
              <th className="p-4 text-purple-600">Transaction ID</th>
              <th className="p-4 text-purple-600">Date</th>
              <th className="p-4 text-purple-600">Status</th>
              <th className="p-4 text-purple-600">Booked By</th>
              <th className="p-4 text-purple-600">Vehicle</th>
              <th className="p-4 text-purple-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan={10} className="text-red-600 text-center py-4 text-lg">
                  Error fetching payments. Please try again.
                </td>
              </tr>
            ) : isLoading ? (
              <tr>
                <td colSpan={10} className="flex justify-center items-center py-8">
                  <PuffLoader color="#0aff13" size={60} />
                  <span className="ml-4 text-purple-700">Loading payments...</span>
                </td>
              </tr>
            ) : paymentsData.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center text-red-600 py-8 text-lg">
                  No payments available 😎
                </td>
              </tr>
            ) : (
              paymentsData.map((payment: PaymentDetails) => (
                <tr
                  key={payment.paymentId}
                  className="border-b border-gray-200 last:border-b-0 hover:bg-gray text-purple-50"
                >
                  <th className="p-4 text-gray-700">{payment.paymentId}</th>
                  <td className="p-4 text-gray-700 font-bold">
                    {payment.bookingId}
                  </td>
                  <td className="p-4 text-gray-700">Ksh {payment.amount}</td>
                  <td className="p-4 text-gray-700">{payment.paymentMethod}</td>
                  <td className="p-4 text-gray-700">{payment.transactionId}</td>
                  <td className="p-4 text-gray-700">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div
                      className={`badge text-xs font-semibold px-3 py-1 rounded-full ${getPaymentStatusBadge(
                        payment.paymentStatus
                      )} `}
                    >
                      {payment.paymentStatus}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-800">
                      {payment.booking.user.firstName} {payment.booking.user.lastName}
                    </div>
                    <div className="text-sm opacity-50 text-gray-600">
                      {payment.booking.user.email}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12 border-2 border-purple-400">
                          <img
                            src={
                              payment.booking.vehicle.vehicleSpec.imageUrl ||
                              "/default-car.png"
                            }
                            alt={`${payment.booking.vehicle.vehicleSpec.manufacturer} ${payment.booking.vehicle.vehicleSpec.model}`}
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-purple-700">
                          {payment.booking.vehicle.vehicleSpec.manufacturer}{" "}
                          {payment.booking.vehicle.vehicleSpec.model}
                        </div>
                        <div className="text-sm opacity-70 text-gray-600">
                          {payment.booking.vehicle.vehicleSpec.year} |{" "}
                          {payment.booking.vehicle.vehicleSpec.transmission}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {payment.paymentStatus === "Pending" && (
                      <button
                        className="text-blue-700 hover:text-blue-500 btn btn-sm btn-outline border-blue-500 transition-colors duration-200"
                        onClick={() =>
                          handleUpdatePaymentStatus(payment.paymentId, "Completed")
                        }
                        title="Mark as Completed"
                        aria-label="Mark as Completed"
                      >
                        <FiEdit /> Mark Completed
                      </button>
                    )}
                    <button
                      className="text-red-500 hover:text-red-600 btn btn-sm ml-2 btn-outline border-red-500 transition-colors duration-200"
                      onClick={() => handleDeletePayment(payment.paymentId)}
                      title="Delete Payment"
                      aria-label="Delete Payment"
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
