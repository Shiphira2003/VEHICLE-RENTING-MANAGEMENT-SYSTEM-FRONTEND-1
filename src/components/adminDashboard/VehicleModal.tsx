import React, { useState, useEffect } from 'react';
import { X, Car, DollarSign, Fuel, Users, Cog, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Vehicle, CreateVehiclePayload, UpdateVehiclePayload } from '../../types/vehicleDetails';
import { useCreateVehicleMutation, useUpdateVehicleMutation } from '../../features/api/vehiclesApi';
import { useGetAllVehicleSpecsQuery } from '../../features/api/vehicleSpecsApi';
import Footer from '../Footer';
import { Navbar } from '../Navbar';

// Vehicle Specification interface - now using from API
// Remove this interface as we're importing from API
// interface VehicleSpec {
//   vehicleSpecId: number;
//   manufacturer: string;
//   model: string;
//   year: number;
//   fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid";
//   engineCapacity: string;
//   transmission: "Manual" | "Automatic";
//   seatingCapacity: number;
//   color: string;
//   features: string;
// }

// Form data interface based on your schema
interface VehicleFormData {
    vehicleSpecId: number | '';
    rentalRate: number;
    availability: boolean;
    imageUrl: string;
    description?: string;
    color?: string;
}

interface VehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicle?: Vehicle;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({
    isOpen,
    onClose,
    vehicle
}) => {
    const [formData, setFormData] = useState<VehicleFormData>({
        vehicleSpecId: vehicle?.vehicleSpec?.vehicleSpecId || '',
        rentalRate: Number(vehicle?.rentalRate) || 0,
        availability: vehicle?.availability ?? true,
        imageUrl: vehicle?.imageUrl || '',
        description: vehicle?.description || '',
        color: vehicle?.color || ''
    });

    const [errors, setErrors] = useState<Partial<Record<keyof VehicleFormData, string>>>({});

    const [createVehicle, { isLoading: isCreating }] = useCreateVehicleMutation();
    const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation();
    const { data: vehicleSpecs = [] } = useGetAllVehicleSpecsQuery();

    const isLoading = isCreating || isUpdating;
    const isEditing = !!vehicle;

    // Remove mock data and use the real API data
    const availableSpecs = vehicleSpecs;

    // Reset form when modal opens/closes or vehicle changes
    useEffect(() => {
        if (isOpen) {
            setFormData({
                vehicleSpecId: vehicle?.vehicleSpec?.vehicleSpecId || '',
                rentalRate: Number(vehicle?.rentalRate) || 0,
                availability: vehicle?.availability ?? true,
                imageUrl: vehicle?.imageUrl || '',
                description: vehicle?.description || '',
                color: vehicle?.color || ''
            });
            setErrors({});
        }
    }, [isOpen, vehicle]);

    // Validation
    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof VehicleFormData, string>> = {};

        if (!formData.vehicleSpecId) {
            newErrors.vehicleSpecId = 'Vehicle specification is required';
        }
        if (formData.rentalRate <= 0) {
            newErrors.rentalRate = 'Rental rate must be greater than 0';
        }
        if (!formData.imageUrl.trim()) {
            newErrors.imageUrl = 'Image URL is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle input changes
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox'
                ? (e.target as HTMLInputElement).checked
                : type === 'number'
                    ? parseFloat(value) || 0
                    : value
        }));

        // Clear error when user starts typing
        if (errors[name as keyof VehicleFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors below');
            return;
        }

        try {
            const payload = {
                vehicleSpecId: Number(formData.vehicleSpecId),
                rentalRate: formData.rentalRate,
                availability: formData.availability,
                imageUrl: formData.imageUrl,
                description: formData.description,
                color: formData.color
            };

            if (isEditing) {
                await updateVehicle({
                    id: vehicle.vehicleId,
                    data: payload as UpdateVehiclePayload
                }).unwrap();
                toast.success('Vehicle updated successfully');
            } else {
                await createVehicle(payload as CreateVehiclePayload).unwrap();
                toast.success('Vehicle created successfully');
            }

            onClose();
        } catch (error: unknown) {
            console.error('Error saving vehicle:', error);
            toast.error('Failed to save vehicle');
        }
    };

    const selectedSpec = availableSpecs.find(spec => spec.vehicleSpecId === Number(formData.vehicleSpecId));

    if (!isOpen) return null;

    return (
         <>
              <Navbar />
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <Car className="h-6 w-6 text-purple-600" />
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Vehicle Specification */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Car className="h-5 w-5 text-purple-600" />
                            Vehicle Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Vehicle Specification Dropdown */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Vehicle Specification *
                                </label>
                                <select
                                    name="vehicleSpecId"
                                    value={formData.vehicleSpecId}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2  text-black border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.vehicleSpecId ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Select a vehicle specification</option>
                                    {availableSpecs.map(spec => (
                                        <option key={spec.vehicleSpecId} value={spec.vehicleSpecId}>
                                            {spec.manufacturer} {spec.model} ({spec.year}) - {spec.fuelType} - {spec.transmission}
                                        </option>
                                    ))}
                                </select>
                                {errors.vehicleSpecId && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.vehicleSpecId}
                                    </p>
                                )}

                                {/* Vehicle Spec Details */}
                                {selectedSpec && (
                                    <div className="mt-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                                        <h4 className="font-medium text-purple-900 mb-2">Specification Details:</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Car className="h-4 w-4 text-purple-600" />
                                                <span className='text-black'><strong>Model:</strong> {selectedSpec.model}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4 text-purple-600" />
                                                <span className='text-black'><strong>Year:</strong> {selectedSpec.year}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Fuel className="h-4 w-4 text-purple-600" />
                                                <span className='text-black' > <strong>Fuel:</strong> {selectedSpec.fuelType}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Cog className="h-4 w-4 text-purple-600" />
                                                <span className='text-black'>  <strong>Transmission:</strong> {selectedSpec.transmission}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4 text-purple-600" />
                                                <span className='text-black'><strong>Passengers:</strong> {selectedSpec.seatingCapacity}</span> <span> text-black <strong>Seats:</strong> {selectedSpec.seatingCapacity}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className='text-black'> <strong>Engine:</strong> {selectedSpec.engineCapacity}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className='text-black'> <strong>Color:</strong> {selectedSpec.color}</span>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                           <span className='text-black'> <strong className='text-black'>Features:</strong> {selectedSpec.features}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Rental Rate */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <DollarSign className="inline h-4 w-4 mr-1 className=' text-black'" />
                                    Rental Rate (per day) *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 className='text-black'">$</span>
                                    <input
                                        type="number"
                                        name="rentalRate"
                                        value={formData.rentalRate}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                        className={`w-full pl-8 pr-3 py-2  text-black border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.rentalRate ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.rentalRate && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.rentalRate}
                                    </p>
                                )}
                            </div>

                            {/* Availability */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Availability Status
                                </label>
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="availability"
                                            checked={formData.availability === true}
                                            onChange={() => setFormData(prev => ({ ...prev, availability: true }))}
                                            className="mr-2 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="text-green-600 font-medium">Available</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="availability"
                                            checked={formData.availability === false}
                                            onChange={() => setFormData(prev => ({ ...prev, availability: false }))}
                                            className="mr-2 text-red-600 focus:ring-red-500"
                                        />
                                        <span className="text-red-600 font-medium">Not Available</span>
                                    </label>
                                </div>
                            </div>

                            {/* Image URL */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Image URL *
                                </label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.imageUrl ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="https://example.com/vehicle-image.jpg"
                                />
                                {errors.imageUrl && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.imageUrl}
                                    </p>
                                )}
                                {/* Image Preview */}
                                {formData.imageUrl && (
                                    <div className="mt-3">
                                        <img
                                            src={formData.imageUrl}
                                            alt="Vehicle preview"
                                            className="w-32 h-24 object-cover rounded-lg border border-gray-300"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Color Override */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Color Override (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="e.g., Midnight Blue"
                                />
                                <p className="text-xs text-gray-500 mt-1">Override the default color from specification</p>
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Additional description about this specific vehicle..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading && (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            )}
                            {isLoading
                                ? (isEditing ? 'Updating...' : 'Creating...')
                                : (isEditing ? 'Update Vehicle' : 'Create Vehicle')
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <Footer/>
        </>
    );
};

export default VehicleModal;
