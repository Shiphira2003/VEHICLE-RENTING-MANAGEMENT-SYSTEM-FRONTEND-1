export interface AuthState {
    user: null | any;
    token: string | null;
    isAuthenticated: boolean;
    role: string | null;
}
// src/types/Types.ts

export interface CreateBookingPayload {
    userId: number;
    vehicleId: number;
    locationId: number;
    bookingDate: string; // ISO string format (e.g., new Date().toISOString())
    returnDate: string;  // ISO string format
    totalAmount: number; // Ensure this is a number as calculated in frontend
}

// You can also include other common types here if you wish,
// but for now, we'll keep it focused on CreateBookingPayload.

// If you want to export your provided BookingDetails interface from here for consistency:


