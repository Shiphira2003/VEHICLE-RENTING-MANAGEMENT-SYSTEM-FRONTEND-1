// hooks/useCloudinaryUpload.ts
import { useState, useCallback } from 'react';
import type { VehicleImage, CloudinaryUploadResult, UploadMetadata } from '../types/vehicle-image.types';

interface UseCloudinaryUploadOptions {
    onSuccess?: (image: VehicleImage) => void;
    onError?: (error: Error) => void;
    onProgress?: (progress: number) => void;
}

export const useCloudinaryUpload = (options?: UseCloudinaryUploadOptions) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const uploadImage = useCallback(async (
        file: File,
        vehicleId: string,
        metadata: UploadMetadata = {}
    ): Promise<VehicleImage> => {
        setIsUploading(true);
        setUploadProgress(0);
        setError(null);

        try {
            // Validate file
            if (!file.type.startsWith('image/')) {
                throw new Error('Please select an image file');
            }

            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                throw new Error('File size must be less than 10MB');
            }

            // Get Cloudinary configuration from environment
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

            if (!cloudName || !uploadPreset) {
                throw new Error('Cloudinary configuration missing. Please check environment variables.');
            }

            console.log('🔄 Starting Cloudinary upload...', {
                cloudName,
                uploadPreset,
                fileName: file.name,
                fileSize: file.size,
                vehicleId,
                metadata
            });

            // Create form data for Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);
            formData.append('folder', 'vehicles');

            // Add metadata as context
            const context = `vehicle_id=${vehicleId}|is_primary=${metadata.is_primary || false}|is_360=${metadata.is_360 || false}`;
            formData.append('context', context);

            // Add tags
            const tags = ['vehicle'];
            if (metadata.is_360) tags.push('360');
            if (metadata.is_primary) tags.push('primary');
            formData.append('tags', tags.join(','));

            // Simulate progress updates
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    const newProgress = Math.min(prev + Math.random() * 30, 95);
                    options?.onProgress?.(newProgress);
                    return newProgress;
                });
            }, 500);

            // Upload to Cloudinary
            const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
            const uploadResponse = await fetch(uploadUrl, {
                method: 'POST',
                body: formData
            });

            clearInterval(progressInterval);

            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json().catch(() => ({}));
                throw new Error(errorData.error?.message || 'Failed to upload to Cloudinary');
            }

            const uploadResult: CloudinaryUploadResult = await uploadResponse.json();
            setUploadProgress(100);

            console.log('✅ Cloudinary upload successful:', uploadResult);

            // Create VehicleImage object (simulating backend response)
            const vehicleImage: VehicleImage = {
                image_id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                vehicle_id: vehicleId,
                url: uploadResult.secure_url,
                cloudinary_public_id: uploadResult.public_id,
                alt: metadata.alt || `Vehicle image for ${vehicleId}`,
                caption: metadata.caption || '',
                is_primary: metadata.is_primary || false,
                is_360: metadata.is_360 || false,
                display_order: metadata.display_order || 1,
                file_size: uploadResult.bytes,
                mime_type: `image/${uploadResult.format}`,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                optimized_urls: {
                    thumbnail: uploadResult.secure_url.replace('/upload/', '/upload/c_fill,w_200,h_150/'),
                    medium: uploadResult.secure_url.replace('/upload/', '/upload/c_fill,w_600,h_450/'),
                    large: uploadResult.secure_url.replace('/upload/', '/upload/c_fill,w_1200,h_900/'),
                    original: uploadResult.secure_url
                }
            };

            // Store in localStorage for persistence (simulating backend storage)
            const storageKey = `vehicle_images_${vehicleId}`;
            const existingImages = JSON.parse(localStorage.getItem(storageKey) || '[]');
            const updatedImages = [...existingImages, vehicleImage];
            localStorage.setItem(storageKey, JSON.stringify(updatedImages));

            options?.onSuccess?.(vehicleImage);
            return vehicleImage;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Upload failed';
            setError(errorMessage);
            options?.onError?.(error instanceof Error ? error : new Error(errorMessage));
            throw error;
        } finally {
            setIsUploading(false);
            setTimeout(() => setUploadProgress(0), 1000);
        }
    }, [options]);

    const resetError = useCallback(() => {
        setError(null);
    }, []);

    return {
        uploadImage,
        isUploading,
        uploadProgress,
        error,
        resetError
    };
};
