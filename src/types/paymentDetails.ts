export interface NewPayment {
  bookingId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
  paymentStatus: "Pending" | "Completed" | "Failed" | "Refunded";
}

export interface UpdatePayment {
  paymentId: number;
  amount?: number;
  paymentDate?: string;
  paymentMethod?: string;
  transactionId?: string;
  paymentStatus?: "Pending" | "Completed" | "Failed" | "Refunded";
}

export interface PaymentDetails {
  userId: number;
  paymentId: number;
  bookingId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
  paymentStatus: "Pending" | "Completed" | "Failed" | "Refunded";
  booking: {
    bookingId: number;
    bookingDate: string;
    returnDate: string;
    totalAmount: number;
    bookingStatus: "Pending" | "Confirmed" | "Cancelled" | "Completed";
    vehicle: {
      vehicleId: number;
      rentalRate: number;
      vehicleSpec: {
        manufacturer: string;
        model: string;
        year: number;
        fuelType: string;
        engineCapacity: string;
        transmission: string;
        seatingCapacity: number;
        color: string;
        features: string;
        imageUrl?: string;
      };
    };
    user: {
      userId: number;
      firstName: string;
      lastName: string;
      email: string;
      contactNo: string;
      address: string;
      role: "user" | "admin";
    };
  };
}