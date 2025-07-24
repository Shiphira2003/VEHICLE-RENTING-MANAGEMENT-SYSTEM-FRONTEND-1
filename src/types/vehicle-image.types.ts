// types/vehicle-image.types.ts
export interface VehicleImage {
    image_id: string;
    vehicle_id: string;
    url: string;
    cloudinary_public_id?: string;
    alt?: string;
    caption?: string;
    is_primary: boolean;
    is_360: boolean;
    display_order: number;
    file_size?: number;
    mime_type?: string;
    created_at: string;
    updated_at: string;
    optimized_urls?: {
        thumbnail: string;
        medium: string;
        large: string;
        original: string;
    };
}

export interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
    resource_type: string;
    created_at: string;
    version: number;
    url: string;
}

export interface VehicleImageUploadData {
    vehicleId: string;
    cloudinary_public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
    is_primary?: boolean;
    is_360?: boolean;
    alt?: string;
    caption?: string;
    display_order?: number;
}

export interface UploadMetadata {
    is_primary?: boolean;
    is_360?: boolean;
    alt?: string;
    caption?: string;
    display_order?: number;
}
