import { useState } from "react";
import { useGetAllVehiclesQuery, useDeleteVehicleMutation } from "../../features/api/vehiclesApi";
import type { Vehicle } from "../../types/vehicleDetails";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Car,
  Fuel,
  Users,
  Gauge,
  Camera,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import VehicleModal from "./VehicleModal";
import { Toaster } from "sonner";

export const AllVehicles = () => {
  const {
    data: vehicles = [],
    error,
    isLoading,
  } = useGetAllVehiclesQuery();

  const [deleteVehicle, { isLoading: isDeleting }] = useDeleteVehicleMutation();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>(undefined);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  // Handle opening modal for creating new vehicle
  const handleAddVehicle = () => {
    setEditingVehicle(undefined);
    setIsModalOpen(true);
  };

  // Handle opening modal for editing vehicle
  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(undefined);
  };

  // Handle delete vehicle
  const handleDeleteVehicle = async (vehicleId: number) => {
    try {
      await deleteVehicle(vehicleId).unwrap();
      toast.success('Vehicle deleted successfully');
      setShowDeleteConfirm(null);
    } catch (error: unknown) {
      console.error('Error deleting vehicle:', error);
      toast.error('Failed to delete vehicle');
    }
  };

  // Confirm delete
  const confirmDelete = (vehicleId: number) => {
    setShowDeleteConfirm(vehicleId);
  };

  return (
    <div className="relative">
      <Toaster richColors position="top-right" />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-purple-900">All Vehicles</h1>

        {/* Add Vehicle Button */}
        <button
          onClick={handleAddVehicle}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Vehicle
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Error occurred while loading vehicles
          </p>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-purple-600 font-semibold">Loading vehicles...</span>
        </div>
      )}

      {!isLoading && !error && vehicles.length === 0 && (
        <div className="text-center py-12">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold text-lg">No vehicles found</p>
          <p className="text-gray-500 mt-2">Click "Add Vehicle" to create your first vehicle</p>
        </div>
      )}

      {!isLoading && !error && vehicles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {vehicles.map((car: Vehicle) => (
            <div
              key={car.vehicleId}
              className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={car.imageUrl || "/placeholder.jpg"}
                  alt={`${car.vehicleSpec.manufacturer} ${car.vehicleSpec.model}`}
                  className="w-full h-48 object-cover"
                />
                {/* Action Buttons Overlay */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleEditVehicle(car)}
                    className="p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
                    title="Edit Vehicle"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => confirmDelete(car.vehicleId)}
                    className="p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
                    title="Delete Vehicle"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                {/* Availability Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${car.availability
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                    {car.availability ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-purple-800 font-bold text-xl mb-1">
                  {car.vehicleSpec.manufacturer}
                  <span className="text-gray-600 font-medium ml-1">
                    {car.vehicleSpec.model}
                  </span>
                </h3>

                <div className="flex flex-wrap gap-3 text-sm text-gray-700 mt-3">
                  <div className="flex items-center gap-1 text-purple-600">
                    <Car size={16} />
                    {car.vehicleSpec.year}
                  </div>
                  <div className="flex items-center gap-1 text-purple-600">
                    <Users size={16} />
                    {car.vehicleSpec.seatingCapacity} Seats
                  </div>
                  <div className="flex items-center gap-1 text-purple-600">
                    <Fuel size={16} />
                    {car.vehicleSpec.fuelType}
                  </div>
                  <div className="flex items-center gap-1 text-purple-600">
                    <Gauge size={16} />
                    {car.vehicleSpec.transmission}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-orange-600 text-2xl font-bold">
                    ${car.rentalRate}
                    <span className="text-gray-500 text-sm font-medium">/day</span>
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                  <Link
                    to={`/admindashboard/vehicles/${car.vehicleId}/images`}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Images
                  </Link>
                  <button
                    onClick={() => handleEditVehicle(car)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Vehicle</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this vehicle? All associated data will be permanently removed.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteVehicle(showDeleteConfirm)}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDeleting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {isDeleting ? 'Deleting...' : 'Delete Vehicle'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Modal */}
      <VehicleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        vehicle={editingVehicle}
      />
    </div>
  );
};
