

export interface BookingDetails {
    bookingId: number;
    userId: number;
    vehicleId: number;
    locationId: number;
    bookingDate: string; 
    returnDate: string; 
    totalAmount: string; 
    bookingStatus: "Pending" | "Confirmed" | "Completed" | "Cancelled";
    createdAt: string;
    updatedAt: string;
    // Nested user details
    user: {
        firstName: string;
        email: string;
    };
    // Nested vehicle details
    vehicle: {
        vehicleId: number;
        rentalRate: string;
        imageUrl: string;
         // Numeric from DB
        availability: boolean;
        // Nested vehicle specification details
        vehicleSpec: {
            vehicleSpecId: number;
            manufacturer: string;
            model: string;
            year: number;
            fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid";
            engineCapacity: string;
            transmission: "Manual" | "Automatic";
            seatingCapacity: number;
            color: string;
            features: string;
        };
    };
    // Nested location details 
    location: {
        locationId: number;
        name: string;
        address: string;
    };
}
