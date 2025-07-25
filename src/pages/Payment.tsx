
import { useCreatePaymentMutation } from "../features/api/paymentsApi";

interface Props {
  amount: number;
  bookingId: number | null;
  userId: number | null;
}

export const PaymentPage = ({ amount, bookingId, userId }: Props) => {
  const [createPayment, { isLoading }] = useCreatePaymentMutation();

  const handleClick = async () => {
    if (!bookingId || !userId) {
      alert("Missing booking or user information");
      return;
    }

    try {
      const response = await createPayment({
        amount,
        bookingId,
        paymentStatus: "Pending",
        paymentMethod: "Stripe",
        paymentDate: new Date().toISOString(),
        transactionId: "", // optional; can be empty, Stripe webhook will update it
      }).unwrap();

      if ((response as any).url) {
        window.location.href = (response as any).url;
      } else {
        alert("Failed to start payment.");
      }
    } catch (error) {
      console.error("Payment session error:", error);
      alert("Error initiating payment.");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : "Pay Now"}
    </button>
  );
};
export default PaymentPage
