import React, { useState, useEffect } from 'react';
import {
  X, Car} from 'lucide-react';
import { toast } from 'sonner';
import type {
  Vehicle, CreateVehiclePayload, UpdateVehiclePayload
} from '../../types/vehicleDetails';
import {
  useCreateVehicleMutation,
  useUpdateVehicleMutation
} from '../../features/api/vehiclesApi';
import { useGetAllVehicleSpecsQuery } from '../../features/api/vehicleSpecsApi';

interface VehicleFormData {
  vehicleSpecId: number | '';
  rentalRate: number | ''; // ⬅ Accepts string during input, cast when needed
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
    rentalRate: vehicle?.rentalRate ?? '',
    availability: vehicle?.availability ?? true,
    imageUrl: vehicle?.imageUrl || '',
    description: vehicle?.description || '',
    color: vehicle?.color || ''
  });

  const [, setErrors] = useState<Partial<Record<keyof VehicleFormData, string>>>({});

  const [createVehicle, { isLoading: isCreating }] = useCreateVehicleMutation();
  const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation();
  useGetAllVehicleSpecsQuery();

  const isLoading = isCreating || isUpdating;
  const isEditing = !!vehicle;

  useEffect(() => {
    if (isOpen) {
      setFormData({
        vehicleSpecId: vehicle?.vehicleSpec?.vehicleSpecId || '',
        rentalRate: vehicle?.rentalRate ?? '',
        availability: vehicle?.availability ?? true,
        imageUrl: vehicle?.imageUrl || '',
        description: vehicle?.description || '',
        color: vehicle?.color || ''
      });
      setErrors({});
    }
  }, [isOpen, vehicle]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof VehicleFormData, string>> = {};

    if (!formData.vehicleSpecId) {
      newErrors.vehicleSpecId = 'Vehicle specification is required';
    }
    if (formData.rentalRate === '' || Number(formData.rentalRate) <= 0) {
      newErrors.rentalRate = 'Rental rate must be greater than 0';
    }
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    const payload = {
      vehicleSpecId: Number(formData.vehicleSpecId),
      rentalRate: Number(formData.rentalRate),
      availability: formData.availability,
      imageUrl: formData.imageUrl,
      description: formData.description,
      color: formData.color,
    };

    try {
      if (isEditing) {
        await updateVehicle({
          id: vehicle.vehicleId,
          body: payload as UpdateVehiclePayload
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


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-purple-300 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
          {/* Fields: spec, rentalRate, image, availability etc — already working fine */}

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="bg-white px-6 py-2 text-sm font-medium text-purple-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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
                : (isEditing ? 'Update Vehicle' : 'Create Vehicle')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;
