// services/vehicleImageService.ts
import type { VehicleImage } from '../types/vehicle-image.types';

class VehicleImageService {
    // Get all images for a vehicle from localStorage
    getVehicleImages(vehicleId: string): Promise<VehicleImage[]> {
        return new Promise((resolve) => {
            const storageKey = `vehicle_images_${vehicleId}`;
            const images = JSON.parse(localStorage.getItem(storageKey) || '[]');

            // Sort by display order
            const sortedImages = images.sort((a: VehicleImage, b: VehicleImage) =>
                a.display_order - b.display_order
            );

            console.log(`📸 Retrieved ${sortedImages.length} images for vehicle ${vehicleId}`);
            resolve(sortedImages);
        });
    }

    // Get only 360° images
    get360Images(vehicleId: string): Promise<VehicleImage[]> {
        return new Promise((resolve) => {
            const storageKey = `vehicle_images_${vehicleId}`;
            const images = JSON.parse(localStorage.getItem(storageKey) || '[]');

            const images360 = images.filter((img: VehicleImage) => img.is_360);
            console.log(`🔄 Retrieved ${images360.length} 360° images for vehicle ${vehicleId}`);
            resolve(images360);
        });
    }

    // Update image metadata
    updateImage(vehicleId: string, imageId: string, updates: Partial<VehicleImage>): Promise<VehicleImage> {
        return new Promise((resolve, reject) => {
            const storageKey = `vehicle_images_${vehicleId}`;
            const images = JSON.parse(localStorage.getItem(storageKey) || '[]');

            const imageIndex = images.findIndex((img: VehicleImage) => img.image_id === imageId);

            if (imageIndex === -1) {
                reject(new Error('Image not found'));
                return;
            }

            // Update the image
            images[imageIndex] = {
                ...images[imageIndex],
                ...updates,
                updated_at: new Date().toISOString()
            };

            localStorage.setItem(storageKey, JSON.stringify(images));
            console.log(`✏️ Updated image ${imageId} for vehicle ${vehicleId}`);
            resolve(images[imageIndex]);
        });
    }

    // Delete an image
    deleteImage(vehicleId: string, imageId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const storageKey = `vehicle_images_${vehicleId}`;
            const images = JSON.parse(localStorage.getItem(storageKey) || '[]');

            const imageIndex = images.findIndex((img: VehicleImage) => img.image_id === imageId);

            if (imageIndex === -1) {
                reject(new Error('Image not found'));
                return;
            }

            // Remove the image
            images.splice(imageIndex, 1);
            localStorage.setItem(storageKey, JSON.stringify(images));

            console.log(`🗑️ Deleted image ${imageId} for vehicle ${vehicleId}`);
            resolve();
        });
    }

    // Set primary image
    setPrimaryImage(vehicleId: string, imageId: string): Promise<VehicleImage> {
        return new Promise((resolve, reject) => {
            const storageKey = `vehicle_images_${vehicleId}`;
            const images = JSON.parse(localStorage.getItem(storageKey) || '[]');

            // Find the image to set as primary
            const imageIndex = images.findIndex((img: VehicleImage) => img.image_id === imageId);

            if (imageIndex === -1) {
                reject(new Error('Image not found'));
                return;
            }

            // Remove primary flag from all images
            images.forEach((img: VehicleImage) => {
                img.is_primary = false;
            });

            // Set the selected image as primary
            images[imageIndex].is_primary = true;
            images[imageIndex].updated_at = new Date().toISOString();

            localStorage.setItem(storageKey, JSON.stringify(images));
            console.log(`⭐ Set image ${imageId} as primary for vehicle ${vehicleId}`);
            resolve(images[imageIndex]);
        });
    }

    // Reorder images
    reorderImages(vehicleId: string, imageOrders: { image_id: string; display_order: number }[]): Promise<void> {
        return new Promise((resolve) => {
            const storageKey = `vehicle_images_${vehicleId}`;
            const images = JSON.parse(localStorage.getItem(storageKey) || '[]');

            // Update display orders
            imageOrders.forEach(order => {
                const imageIndex = images.findIndex((img: VehicleImage) => img.image_id === order.image_id);
                if (imageIndex !== -1) {
                    images[imageIndex].display_order = order.display_order;
                    images[imageIndex].updated_at = new Date().toISOString();
                }
            });

            localStorage.setItem(storageKey, JSON.stringify(images));
            console.log(`🔄 Reordered ${imageOrders.length} images for vehicle ${vehicleId}`);
            resolve();
        });
    }

    // Get primary image for a vehicle
    getPrimaryImage(vehicleId: string): Promise<VehicleImage | null> {
        return new Promise((resolve) => {
            const storageKey = `vehicle_images_${vehicleId}`;
            const images = JSON.parse(localStorage.getItem(storageKey) || '[]');

            const primaryImage = images.find((img: VehicleImage) => img.is_primary);
            resolve(primaryImage || null);
        });
    }

    // Clear all images for a vehicle (for testing)
    clearVehicleImages(vehicleId: string): Promise<void> {
        return new Promise((resolve) => {
            const storageKey = `vehicle_images_${vehicleId}`;
            localStorage.removeItem(storageKey);
            console.log(`🧹 Cleared all images for vehicle ${vehicleId}`);
            resolve();
        });
    }
}

export const vehicleImageService = new VehicleImageService();
