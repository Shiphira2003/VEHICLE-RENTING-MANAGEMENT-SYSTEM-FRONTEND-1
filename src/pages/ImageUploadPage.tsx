// pages/ImageUploadPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Upload, Eye, Star, RotateCw, Car } from 'lucide-react';
import { VehicleImageUpload } from '../components/VehicleImageUpload';
import { VehicleImageGallery } from '../components/VehicleImageGallery';
import type { VehicleImage } from '../types/vehicle-image.types';
import Swal from 'sweetalert2';

const ImageUploadPage: React.FC = () => {
    const { vehicleId } = useParams<{ vehicleId: string }>();
    const navigate = useNavigate();
    const [images, setImages] = useState<VehicleImage[]>([]);
    const [loading] = useState(false);

    // Mock vehicle data (in real app, this would come from your vehicle API)
    const [mockVehicle] = useState({
        vehicleId: vehicleId || '1',
        make: 'Toyota',
        model: 'Camry',
        year: 2024,
        licensePlate: 'ABC-123'
    });

    useEffect(() => {
        if (!vehicleId) {
            Swal.fire({
                title: 'Error',
                text: 'Vehicle ID is required',
                icon: 'error'
            }).then(() => {
                navigate('/admindashboard/allvehicles');
            });
        }
    }, [vehicleId, navigate]);

    const handleUploadComplete = (newImage: VehicleImage) => {
        setImages(prev => [...prev, newImage]);
        Swal.fire({
            title: 'Success!',
            text: 'Image uploaded successfully to Cloudinary!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
    };

    const handleUploadError = (error: Error) => {
        Swal.fire({
            title: 'Upload Failed',
            text: error.message,
            icon: 'error'
        });
    };

    const handleImagesUpdate = (updatedImages: VehicleImage[]) => {
        setImages(updatedImages);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading vehicle images...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/admindashboard/allvehicles')}
                                className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Back to Vehicles
                            </button>
                            <div className="h-6 w-px bg-gray-300" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Vehicle Image Management</h1>
                                <p className="text-gray-600 mt-1 flex items-center">
                                    <Car className="w-4 h-4 mr-2 text-purple-600" />
                                    {mockVehicle.make} {mockVehicle.model} ({mockVehicle.year}) - {mockVehicle.licensePlate}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <span className="text-2xl font-bold text-purple-600">{images.length}</span>
                                <p className="text-sm text-gray-500">Total Images</p>
                            </div>
                            <Camera className="h-8 w-8 text-purple-400" />
                        </div>
                    </div>
                </div>

                {/* Upload Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-xl">
                        <h2 className="text-xl font-semibold text-white flex items-center">
                            <Upload className="h-6 w-6 mr-3" />
                            Upload New Images
                        </h2>
                        <p className="text-purple-100 mt-1">
                            Upload regular images or 360° panoramic images for this vehicle
                        </p>
                    </div>
                    <div className="px-6 py-8">
                        {vehicleId && (
                            <VehicleImageUpload
                                vehicleId={vehicleId}
                                onUploadComplete={handleUploadComplete}
                                onUploadError={handleUploadError}
                            />
                        )}
                    </div>
                </div>

                {/* Gallery Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-xl">
                        <h2 className="text-xl font-semibold text-white flex items-center">
                            <Eye className="h-6 w-6 mr-3" />
                            Current Images
                        </h2>
                        <p className="text-purple-100 mt-1">
                            Manage existing vehicle images, set primary image, and reorder
                        </p>
                    </div>
                    <div className="px-6 py-8">
                        {vehicleId && (
                            <VehicleImageGallery
                                vehicleId={vehicleId}
                                isEditable={true}
                                onImageUpdate={handleImagesUpdate}
                            />
                        )}
                    </div>
                </div>

                {/* Tips Section */}
                <div className="mt-8 bg-gradient-to-r from-purple-50 to-white rounded-xl p-6 border border-purple-200">
                    <h3 className="text-xl font-semibold text-purple-900 mb-4 flex items-center">
                        <Star className="h-5 w-5 mr-2" />
                        Image Upload Tips
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-800">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <Star className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                                <p className="font-medium mb-1">Regular Images</p>
                                <p className="text-purple-700">Upload multiple angles of the vehicle exterior and interior for the best showcase</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <RotateCw className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                                <p className="font-medium mb-1">360° Images</p>
                                <p className="text-purple-700">Use panoramic images for immersive vehicle tours and interior views</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <Upload className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                                <p className="font-medium mb-1">Supported Formats</p>
                                <p className="text-purple-700">PNG, JPG, JPEG, GIF, WebP up to 10MB each with automatic optimization</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <Eye className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                                <p className="font-medium mb-1">Primary Image</p>
                                <p className="text-purple-700">Set the main image that appears in vehicle listings and search results</p>
                            </div>
                        </div>
                    </div>

                    {/* Cloudinary Info */}
                    <div className="mt-6 p-4 bg-white rounded-lg border border-purple-200">
                        <h4 className="text-sm font-medium text-purple-900 mb-2">Cloudinary Integration Status</h4>
                        <div className="grid grid-cols-2 gap-4 text-xs text-purple-700">
                            <div>
                                <span className="font-medium">Cloud Name:</span> {import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'Not configured'}
                            </div>
                            <div>
                                <span className="font-medium">Upload Preset:</span> {import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'Not configured'}
                            </div>
                            <div>
                                <span className="font-medium">Vehicle ID:</span> {vehicleId}
                            </div>
                            <div>
                                <span className="font-medium">Storage:</span> LocalStorage + Cloudinary
                            </div>
                        </div>
                        {(!import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || !import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET) && (
                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                                ⚠️ Cloudinary environment variables are not properly configured
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageUploadPage;
