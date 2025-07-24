// components/VehicleImageUpload.tsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Image as ImageIcon, Camera, Loader2, Upload, CheckCircle } from 'lucide-react';
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload';
import type { VehicleImage } from '../types/vehicle-image.types';

interface VehicleImageUploadProps {
    vehicleId: string;
    onUploadComplete: (image: VehicleImage) => void;
    onUploadError?: (error: Error) => void;
    maxFiles?: number;
    accept?: Record<string, string[]>;
}

export const VehicleImageUpload: React.FC<VehicleImageUploadProps> = ({
    vehicleId,
    onUploadComplete,
    onUploadError,
    accept = {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    }
}) => {
    const [is360, setIs360] = useState(false);
    const [isPrimary, setIsPrimary] = useState(false);
    const [alt, setAlt] = useState('');
    const [caption, setCaption] = useState('');
    const [displayOrder, setDisplayOrder] = useState(1);
    const [uploadComplete, setUploadComplete] = useState(false);

    const { uploadImage, isUploading, uploadProgress, error, resetError } = useCloudinaryUpload({
        onSuccess: (image: VehicleImage) => {
            console.log('✅ Upload completed:', image);
            setUploadComplete(true);
            onUploadComplete(image);

            // Reset form after 2 seconds
            setTimeout(() => {
                setAlt('');
                setCaption('');
                setIsPrimary(false);
                setDisplayOrder(1);
                setUploadComplete(false);
            }, 2000);
        },
        onError: (error: Error) => {
            console.error('❌ Upload error:', error);
            onUploadError?.(error);
        }
    });

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];

        console.log('🔄 Starting upload for file:', file.name, 'Vehicle ID:', vehicleId);

        // Clear any previous errors
        resetError();

        try {
            await uploadImage(file, vehicleId, {
                is_primary: isPrimary,
                is_360: is360,
                alt: alt || undefined,
                caption: caption || undefined,
                display_order: displayOrder
            });
        } catch (error) {
            console.error('❌ Upload failed:', error);
        }
    }, [uploadImage, vehicleId, is360, isPrimary, alt, caption, displayOrder, resetError]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxFiles: 1,
        disabled: isUploading
    });

    return (
        <div className="vehicle-image-upload">
            {/* Upload Options */}
            <div className="upload-options mb-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="is360"
                            checked={is360}
                            onChange={(e) => setIs360(e.target.checked)}
                            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                        />
                        <label htmlFor="is360" className="text-sm font-medium text-gray-700 flex items-center">
                            <Camera className="w-4 h-4 mr-1 text-purple-600" />
                            360° Image
                        </label>
                    </div>
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="isPrimary"
                            checked={isPrimary}
                            onChange={(e) => setIsPrimary(e.target.checked)}
                            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                        />
                        <label htmlFor="isPrimary" className="text-sm font-medium text-gray-700 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1 text-purple-600" />
                            Primary Image
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Alt Text
                        </label>
                        <input
                            type="text"
                            value={alt}
                            onChange={(e) => setAlt(e.target.value)}
                            placeholder="Describe the image..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Display Order
                        </label>
                        <input
                            type="number"
                            value={displayOrder}
                            onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Caption
                    </label>
                    <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Image caption..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>
            </div>

            {/* Upload Area */}
            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
                    ${isDragActive
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                    }
                    ${isUploading ? 'cursor-not-allowed opacity-75' : ''}
                    ${uploadComplete ? 'border-green-500 bg-green-50' : ''}
                `}
            >
                <input {...getInputProps()} />

                {uploadComplete ? (
                    <div className="flex flex-col items-center space-y-2">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                        <p className="text-lg font-medium text-green-700">
                            Upload Successful!
                        </p>
                        <p className="text-sm text-green-600">
                            Image has been uploaded to Cloudinary
                        </p>
                    </div>
                ) : isUploading ? (
                    <div className="flex flex-col items-center space-y-3">
                        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
                        <p className="text-lg font-medium text-purple-700">
                            Uploading... {Math.round(uploadProgress)}%
                        </p>
                        <div className="w-full max-w-xs bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-600">
                            Please wait while we upload your image...
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-3">
                        {is360 ? (
                            <Camera className="w-12 h-12 text-gray-400" />
                        ) : (
                            <ImageIcon className="w-12 h-12 text-gray-400" />
                        )}
                        <div>
                            <p className="text-lg font-medium text-gray-700">
                                {isDragActive ? (
                                    "Drop the image here..."
                                ) : (
                                    `Drag & drop ${is360 ? '360°' : 'an'} image here, or click to select`
                                )}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                PNG, JPG, GIF, WebP up to 10MB
                            </p>
                        </div>
                        <div className="flex items-center space-x-2 text-purple-600">
                            <Upload className="w-4 h-4" />
                            <span className="text-sm font-medium">Upload to Cloudinary</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-start justify-between">
                        <div className="flex">
                            <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Upload Error</h3>
                                <p className="text-sm text-red-700 mt-1">{error}</p>
                            </div>
                        </div>
                        <button
                            onClick={resetError}
                            className="text-red-500 hover:text-red-700 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Configuration Info */}
            <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-md">
                <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <h4 className="text-sm font-medium text-purple-800">Upload Information</h4>
                        <div className="text-xs text-purple-700 mt-1 space-y-1">
                            <p>• Images are uploaded directly to Cloudinary</p>
                            <p>• Cloud Name: {import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'Not configured'}</p>
                            <p>• Upload Preset: {import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'Not configured'}</p>
                            <p>• Vehicle ID: {vehicleId}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
