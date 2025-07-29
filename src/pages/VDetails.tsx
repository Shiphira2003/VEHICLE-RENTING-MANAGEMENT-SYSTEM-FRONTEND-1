import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetVehicleByIdQuery } from '../features/api/vehiclesApi';
import { useCreateBookingMutation } from '../features/api/userApi';
import { useGetAllLocationsQuery } from '../features/api/locationApi';
import type { CreateBookingPayload } from '../types/Types';
import type { LocationDetails } from '../types/locationDetails';
import { FaCar, FaChair, FaGasPump, FaCogs, FaDollarSign, FaArrowLeft, FaMapMarkerAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import type { RootState } from '../apps/store';
import { Toaster, toast } from 'sonner';
import Footer from '../components/Footer';
import { Navbar } from '../components/Navbar';

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

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newBookingId, setNewBookingId] = useState<number | null>(null);

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
      console.log(res);
      toast.success('Booking successful! Proceed to payment...', { id: loadingToastId });

      setNewBookingId(res.bookingId);
      setShowPaymentModal(true);
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
     <>
            <Navbar />
    <div className="min-h-screen w-full bg-gray-100 py-4 sm:py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <Toaster richColors position="top-right" />
        
        {/* Back Button */}
        <div className="px-4 sm:px-6 pt-4">
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-ghost text-purple-600 hover:text-purple-800 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> 
            <span className="text-sm sm:text-base">Back to Vehicles</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row">
          {/* Vehicle Image */}
          <div className="lg:w-1/2 p-4 sm:p-6">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
              <img
                src={vehicle.imageUrl}
                alt={`${vehicle.vehicleSpec.manufacturer} ${vehicle.vehicleSpec.model}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="lg:w-1/2 p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {vehicle.vehicleSpec.manufacturer} {vehicle.vehicleSpec.model}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mb-4">{vehicle.description}</p>

            {/* Vehicle Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 mb-6">
              <div className="flex items-center gap-2">
                <FaCar className="text-purple-600" />
                <span className="text-sm sm:text-base">Manufacturer: {vehicle.vehicleSpec.manufacturer}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCar className="text-purple-600" />
                <span className="text-sm sm:text-base">Model: {vehicle.vehicleSpec.model}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaChair className="text-purple-600" />
                <span className="text-sm sm:text-base">Seats: {vehicle.vehicleSpec.seatingCapacity}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaGasPump className="text-purple-600" />
                <span className="text-sm sm:text-base">Fuel: {vehicle.vehicleSpec.fuelType}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCogs className="text-purple-600" />
                <span className="text-sm sm:text-base">Transmission: {vehicle.vehicleSpec.transmission}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaDollarSign className="text-purple-600" />
                <span className="text-sm sm:text-base">Daily Rate: </span>
                <span className="text-lg sm:text-xl font-bold text-orange-600">${vehicle.rentalRate}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <span className="text-sm sm:text-base">Color: {vehicle.color ?? 'Not specified'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className={`badge ${vehicle.availability ? 'badge-success' : 'badge-error'} text-white text-sm sm:text-base`}>
                  {vehicle.availability ? 'Available for Rent' : 'Currently Unavailable'}
                </span>
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Book This Vehicle</h3>

              {/* Location Select */}
              <div className="form-control">
                <label htmlFor="location" className="label">
                  <span className="label-text flex items-center gap-1">
                    <FaMapMarkerAlt className="text-purple-600" /> Pickup Location
                  </span>
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

              {/* Date Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label htmlFor="pickupDateTime" className="label">
                    <span className="label-text">Pick-up Date & Time</span>
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

                <div className="form-control">
                  <label htmlFor="dropoffDateTime" className="label">
                    <span className="label-text">Drop-off Date & Time</span>
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

              {/* Additional Notes */}
              <div className="form-control">
                <label htmlFor="additionalRequests" className="label">
                  <span className="label-text">Additional Requests (Optional)</span>
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

              {/* Total */}
              <div className="text-lg sm:text-xl font-bold text-right text-gray-800">
                Total Estimated Cost: <span className="text-orange-600">${totalCost.toFixed(2)}</span>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                {vehicle.availability ? (
                  <button
                    type="submit"
                    className="btn bg-orange-500 hover:bg-orange-600 text-white flex-1"
                    disabled={isBookingLoading || totalCost <= 0 || locationId === null}
                  >
                    {isBookingLoading ? (
                      <span className="loading loading-spinner" />
                    ) : (
                      'Book Now'
                    )}
                  </button>
                ) : (
                  <button className="btn btn-disabled flex-1" disabled>
                    Currently Unavailable
                  </button>
                )}
                <button 
                  type="button" 
                  className="btn btn-outline flex-1" 
                  onClick={() => navigate(-1)}
                >
                  Go Back
                </button>
              </div>

              {/* Auth Status */}
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

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-lg">Proceed to Payment</h3>
            <div className="py-4 space-y-2">
              <p>Booking ID: {newBookingId}</p>
              <p className="text-lg font-semibold text-purple-600">
                Total: ${totalCost.toFixed(2)}
              </p>
            </div>
            <div className="modal-action">
              <button
                className="btn bg-orange-500 hover:bg-orange-600 text-white"
                onClick={async () => {
                  try {
                    const res = await fetch("http://localhost:8000/api/payments/checkout-session", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        amount: Math.round(totalCost * 100),
                        bookingId: newBookingId,
                        userId: user?.userId,
                      }),
                    });

                    const data = await res.json();
                    if (data?.url) {
                      window.location.href = data.url;
                    } else {
                      toast.error("Failed to create payment session");
                    }
                  } catch (err: any) {
                    toast.error("Error: " + err.message);
                  }
                }}
              >
                Pay Now
              </button>
              <button 
                className="btn btn-ghost" 
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default VDetails;