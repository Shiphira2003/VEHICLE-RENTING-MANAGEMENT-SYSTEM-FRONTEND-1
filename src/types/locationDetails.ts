
export interface LocationDetails {
    locationId: number;
    name: string;
    address: string;
    contact: string | null; 
    createdAt: string; 
    updatedAt: string; 
}


export interface CreateLocationPayload {
    name: string;
    address: string;
    contact?: string | null; 
}


export interface UpdateLocationPayload {
    name?: string;
    address?: string;
    contact?: string | null;
}
