import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetVehicleByIdQuery } from '../features/api/vehiclesApi';
import { useCreateBookingMutation } from '../features/api/userApi';
import { useGetAllLocationsQuery } from '../features/api/locationApi';
import type { Vehicle } from '../types/vehicleDetails';
import type { CreateBookingPayload } from '../types/Types';
import type { LocationDetails } from '../types/locationDetails';
import { FaCar, FaChair, FaGasPump, FaCogs, FaDollarSign, FaArrowLeft, FaMapMarkerAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import type { RootState } from '../apps/store';
import { Toaster, toast } from 'sonner';




export const VDetails = () => {
    const { id } = useParams<{ id: string }>();
    const vehicleId = id ? parseInt(id) : undefined;
    const navigate = useNavigate();

    const { data: vehicle, error: vehicleError, isLoading: isVehicleLoading } = useGetVehicleByIdQuery(vehicleId!, {
        skip: vehicleId === undefined,
    });

    const { data: locations = [], isLoading: isLocationsLoading } = useGetAllLocationsQuery();
    const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();

    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const [pickupDateTime, setPickupDateTime] = useState('');
    const [dropoffDateTime, setDropoffDateTime] = useState('');
    const [locationId, setLocationId] = useState<number | null>(null);
    const [totalCost, setTotalCost] = useState(0);
    const [additionalRequests, setAdditionalRequests] = useState('');

    useEffect(() => {
        if (pickupDateTime && dropoffDateTime && vehicle?.rentalRate) {
            const pickUp = new Date(pickupDateTime);
            const dropOff = new Date(dropoffDateTime);

            if (dropOff > pickUp) {
                const diffTime = Math.abs(dropOff.getTime() - pickUp.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                setTotalCost(diffDays * parseFloat(vehicle.rentalRate as any));
            } else {
                setTotalCost(0);
            }
        } else {
            setTotalCost(0);
        }
    }, [pickupDateTime, dropoffDateTime, vehicle?.rentalRate]);

    useEffect(() => {
        if (locations.length > 0 && locationId === null) {
            setLocationId(locations[0].locationId);
        }
    }, [locations, locationId]);

    const validateForm = () => {
        if (!isAuthenticated || !user?.userId) {
            toast.error('Please log in to book a vehicle.');
            return false;
        }

        if (!pickupDateTime || !dropoffDateTime) {
            toast.error('Please select both pick-up and drop-off dates');
            return false;
        }

        const pickUp = new Date(pickupDateTime);
        const dropOff = new Date(dropoffDateTime);

        if (isNaN(pickUp.getTime()) || isNaN(dropOff.getTime()) || dropOff <= pickUp) {
            toast.error('Invalid date range');
            return false;
        }

        if (locationId === null) {
            toast.error('Please select a pickup location');
            return false;
        }

        if (!vehicleId) {
            toast.error('Vehicle information is missing');
            return false;
        }

        if (totalCost <= 0) {
            toast.error('Invalid booking duration');
            return false;
        }

        return true;
    };

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const pickUp = new Date(pickupDateTime);
        const dropOff = new Date(dropoffDateTime);

        const loadingToastId = toast.loading("Processing your booking...");
        try {
            const bookingPayload: CreateBookingPayload = {
                userId: user!.userId,
                vehicleId: vehicleId!,
                locationId: locationId!,
                bookingDate: pickUp.toISOString().slice(0, 10),
                returnDate: dropOff.toISOString().slice(0, 10),
                totalAmount: totalCost,
            };

            const res = await createBooking(bookingPayload).unwrap();
            toast.success('Booking successful! Proceed to payment...', { id: loadingToastId });

            setTimeout(() => navigate(`/payment/${res.bookingId}`), 2000);
        } catch (err: any) {
            console.error('Booking error:', err);
            toast.error(err.data?.error || err.data?.message || err.message || 'Failed to create booking', {
                id: loadingToastId,
            });
        }
    };

    if (isVehicleLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 w-full">
                <span className="loading loading-spinner loading-lg text-purple-600"></span>
                <p className="ml-4 text-lg text-purple-600">Loading vehicle details...</p>
            </div>
        );
    }

    if (vehicleError || !vehicle) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700 p-4 w-full">
                <p>{vehicleError ? 'Error loading vehicle details' : 'Vehicle not found.'}</p>
            </div>
        );
    }

    return (
       <div className="min-h-screen w-full bg-gradient-to-br from-gray-500 via-gray-500 to-gray-500 py-10 px-4 sm:px-90">
  <div className="w-full min-h-full bg-white rounded-3xl shadow-xl border border-gray-200 overflow-auto p-6 py-8">
        {/* <div className="min-h-screen w-full bg-gray-50 px-4 py-8"> */}
            <Toaster richColors position="top-right" />
 
            <button onClick={() => navigate(-1)} className="btn btn-ghost text-purple-600 mb-4">
                <FaArrowLeft className="mr-2" /> Back to Vehicles
            </button>

            <div className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row w-full">
                <div className="flex-1">
                    <img
                        src={vehicle.imageUrl}
                        alt={`${vehicle.vehicleSpec.manufacturer} ${vehicle.vehicleSpec.model}`}
                        className="w-full h-50 object-cover"
                    />
                </div>

                <div className="flex-1 p-8">
                    <h1 className="text-4xl font-extrabold text-purple-800 mb-2">
                        {vehicle.vehicleSpec.manufacturer} {vehicle.vehicleSpec.model}
                    </h1>
                    <p className="text-gray-700 text-lg mb-4">{vehicle.description}</p>

                    <div className="grid grid-cols-2 gap-y-3 text-gray-600 text-base mb-6">
                        <div className="flex items-center gap-2">
                            <FaCar className="text-purple-600" /> Manufacturer: {vehicle.vehicleSpec.manufacturer}
                        </div>
                        <div className="flex items-center gap-2">
                            <FaCar className="text-purple-600" /> Model: {vehicle.vehicleSpec.model}
                        </div>
                        <div className="flex items-center gap-2">
                            <FaChair className="text-purple-600" /> Seats: {vehicle.vehicleSpec.seatingCapacity}
                        </div>
                        <div className="flex items-center gap-2">
                            <FaGasPump className="text-purple-600" /> Fuel: {vehicle.vehicleSpec.fuelType}
                        </div>
                        <div className="flex items-center gap-2">
                            <FaCogs className="text-purple-600" /> Transmission: {vehicle.vehicleSpec.transmission}
                        </div>
                        <div className="flex items-center gap-2">
                            <FaDollarSign className="text-purple-600" /> Daily Rate:
                            <span className="text-2xl font-bold text-orange-600 ml-1">${vehicle.rentalRate}</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                            Color: {vehicle.color ?? 'Not specified'}
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                            <span className={`badge ${vehicle.availability ? 'badge-success' : 'badge-error'} text-white`}>
                                {vehicle.availability ? 'Available for Rent' : 'Currently Unavailable'}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleBookingSubmit} className="space-y-4 mt-6">
                        <h3 className="text-2xl font-bold text-purple-800 mb-4">Book This Vehicle</h3>

                        {locations.length > 0 ? (
                            <div>
                                <label htmlFor="location" className="block text-gray-700 text-sm font-semibold mb-2">
                                    <FaMapMarkerAlt className="inline mr-1" /> Pickup Location
                                </label>
                                <select
                                    id="location"
                                    className="select select-bordered w-full"
                                    value={locationId || ''}
                                    onChange={(e) => setLocationId(Number(e.target.value))}
                                    required
                                    disabled={isLocationsLoading}
                                >
                                    {isLocationsLoading ? (
                                        <option>Loading locations...</option>
                                    ) : (
                                        locations.map((location: LocationDetails) => (
                                            <option key={location.locationId} value={location.locationId}>
                                                {location.name} - {location.address}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                        ) : (
                            <div className="text-orange-600">
                                {isLocationsLoading ? 'Loading locations...' : 'No locations available'}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="pickupDateTime" className="block text-gray-700 text-sm font-semibold mb-2">
                                    Pick-up Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    id="pickupDateTime"
                                    className="input input-bordered w-full"
                                    value={pickupDateTime}
                                    onChange={(e) => setPickupDateTime(e.target.value)}
                                    min={new Date().toISOString().slice(0, 16)}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="dropoffDateTime" className="block text-gray-700 text-sm font-semibold mb-2">
                                    Drop-off Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    id="dropoffDateTime"
                                    className="input input-bordered w-full"
                                    value={dropoffDateTime}
                                    onChange={(e) => setDropoffDateTime(e.target.value)}
                                    min={pickupDateTime || new Date().toISOString().slice(0, 16)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="additionalRequests" className="block text-gray-700 text-sm font-semibold mb-2">
                                Additional Requests (Optional)
                            </label>
                            <textarea
                                id="additionalRequests"
                                className="textarea textarea-bordered w-full"
                                value={additionalRequests}
                                onChange={(e) => setAdditionalRequests(e.target.value)}
                                rows={3}
                                placeholder="Special instructions or requests..."
                            />
                        </div>

                        <div className="text-xl font-bold text-right text-purple-800">
                            Total Estimated Cost: <span className="text-orange-600">${totalCost.toFixed(2)}</span>
                        </div>

                        {vehicle.availability ? (
                            <button
                                type="submit"
                                className="btn bg-orange-500 hover:bg-orange-600 text-white w-full mt-4"
                                disabled={isBookingLoading || totalCost <= 0 || locationId === null}
                            >
                                {isBookingLoading ? <span className="loading loading-spinner" /> : 'Book Now'}
                            </button>
                        ) : (
                            <button className="btn btn-disabled w-full mt-4" disabled>
                                Currently Unavailable
                            </button>
                        )}

                        <button
                            type="button"
                            className="btn btn-outline w-full mt-4"
                            onClick={() => navigate(-1)}
                        >
                            Go Back
                        </button>

                        {!isAuthenticated ? (
                            <p className="text-sm text-gray-500 text-center mt-2">
                                You must be <Link to="/login" className="text-blue-500 hover:underline">logged in</Link> to book a vehicle.
                            </p>
                        ) : (
                            <div className="text-sm text-gray-500 text-center mt-2">
                                Booking as: {user?.email}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    </div>
    );
};

export default VDetails;
