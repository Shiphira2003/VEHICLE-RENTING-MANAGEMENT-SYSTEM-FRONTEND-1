// components/VehicleImageGallery.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Eye, Edit, Trash2, Star, Image as ImageIcon, RotateCw } from 'lucide-react';
import { vehicleImageService } from '../services/vehicleImageService';
import type { VehicleImage } from '../types/vehicle-image.types';

interface VehicleImageGalleryProps {
    vehicleId: string;
    isEditable?: boolean;
    onImageUpdate?: (images: VehicleImage[]) => void;
}

export const VehicleImageGallery: React.FC<VehicleImageGalleryProps> = ({
    vehicleId,
    isEditable = false,
    onImageUpdate
}) => {
    const [images, setImages] = useState<VehicleImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<VehicleImage | null>(null);
    const [editingImage, setEditingImage] = useState<VehicleImage | null>(null);
    const [editForm, setEditForm] = useState({
        alt: '',
        caption: '',
        display_order: 1
    });

    const loadImages = useCallback(async () => {
        try {
            setLoading(true);
            const imageData = await vehicleImageService.getVehicleImages(vehicleId);
            setImages(imageData);
            onImageUpdate?.(imageData);
        } catch (error) {
            console.error('Error loading images:', error);
        } finally {
            setLoading(false);
        }
    }, [vehicleId, onImageUpdate]);

    useEffect(() => {
        loadImages();
    }, [loadImages]);

    const handleSetPrimary = async (imageId: string) => {
        try {
            await vehicleImageService.setPrimaryImage(vehicleId, imageId);
            await loadImages(); // Reload to reflect changes
        } catch (error) {
            console.error('Error setting primary image:', error);
        }
    };

    const handleDeleteImage = async (imageId: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            await vehicleImageService.deleteImage(vehicleId, imageId);
            await loadImages(); // Reload to reflect changes
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const handleEditImage = (image: VehicleImage) => {
        setEditingImage(image);
        setEditForm({
            alt: image.alt || '',
            caption: image.caption || '',
            display_order: image.display_order
        });
    };

    const handleSaveEdit = async () => {
        if (!editingImage) return;

        try {
            await vehicleImageService.updateImage(vehicleId, editingImage.image_id, editForm);
            setEditingImage(null);
            await loadImages(); // Reload to reflect changes
        } catch (error) {
            console.error('Error updating image:', error);
        }
    };

    const getImageUrl = (image: VehicleImage, size: 'thumbnail' | 'medium' | 'large' | 'original' = 'medium') => {
        return image.optimized_urls?.[size] || image.url;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading images...</p>
                </div>
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No images uploaded yet</h3>
                <p className="text-gray-600">Upload some images to showcase this vehicle.</p>
            </div>
        );
    }

    return (
        <div className="vehicle-image-gallery">
            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {images.map((image) => (
                    <div
                        key={image.image_id}
                        className="relative group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                        {/* Image */}
                        <div className="aspect-square relative">
                            <img
                                src={getImageUrl(image, 'medium')}
                                alt={image.alt || 'Vehicle image'}
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => setSelectedImage(image)}
                            />

                            {/* Overlay indicators */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />

                            {/* Image type badges */}
                            <div className="absolute top-2 left-2 flex flex-col space-y-1">
                                {image.is_primary && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        <Star className="w-3 h-3 mr-1" />
                                        Primary
                                    </span>
                                )}
                                {image.is_360 && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        <RotateCw className="w-3 h-3 mr-1" />
                                        360°
                                    </span>
                                )}
                            </div>

                            {/* Action buttons */}
                            {isEditable && (
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex flex-col space-y-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedImage(image);
                                            }}
                                            className="p-1 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-sm"
                                            title="View"
                                        >
                                            <Eye className="w-4 h-4 text-gray-600" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditImage(image);
                                            }}
                                            className="p-1 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-sm"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4 text-blue-600" />
                                        </button>
                                        {!image.is_primary && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSetPrimary(image.image_id);
                                                }}
                                                className="p-1 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-sm"
                                                title="Set as Primary"
                                            >
                                                <Star className="w-4 h-4 text-yellow-500" />
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteImage(image.image_id);
                                            }}
                                            className="p-1 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-sm"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Image info */}
                        <div className="p-3">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900">
                                    Order {image.display_order}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {image.file_size ? `${Math.round(image.file_size / 1024)}KB` : ''}
                                </span>
                            </div>
                            {image.caption && (
                                <p className="text-xs text-gray-600 truncate" title={image.caption}>
                                    {image.caption}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {selectedImage.is_360 ? '360° Image' : 'Vehicle Image'}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {selectedImage.alt || 'No description'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <img
                                src={getImageUrl(selectedImage, 'large')}
                                alt={selectedImage.alt || 'Vehicle image'}
                                className="w-full h-auto max-h-96 object-contain mx-auto"
                            />
                            {selectedImage.caption && (
                                <p className="text-sm text-gray-600 mt-4 text-center">
                                    {selectedImage.caption}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingImage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Edit Image</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Alt Text
                                </label>
                                <input
                                    type="text"
                                    value={editForm.alt}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, alt: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Caption
                                </label>
                                <textarea
                                    value={editForm.caption}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, caption: e.target.value }))}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    value={editForm.display_order}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, display_order: parseInt(e.target.value) || 1 }))}
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                onClick={() => setEditingImage(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-purple-600">{images.length}</div>
                        <div className="text-sm text-gray-600">Total Images</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-yellow-600">
                            {images.filter(img => img.is_primary).length}
                        </div>
                        <div className="text-sm text-gray-600">Primary</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-purple-600">
                            {images.filter(img => img.is_360).length}
                        </div>
                        <div className="text-sm text-gray-600">360° Images</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-600">
                            {images.filter(img => !img.is_360).length}
                        </div>
                        <div className="text-sm text-gray-600">Regular Images</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
