// src/features/api/vehicleSpecsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../apps/store';

export interface VehicleSpecification {
    vehicleSpecId: number;
    manufacturer: string;
    model: string;
    year: number;
    fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid";
    engineCapacity: string;
    transmission: "Manual" | "Automatic";
    seatingCapacity: number;
    color: string;
    features: string;
}

export interface CreateVehicleSpecPayload {
    manufacturer: string;
    model: string;
    year: number;
    fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid";
    engineCapacity: string;
    transmission: "Manual" | "Automatic";
    seatingCapacity: number;
    color: string;
    features: string;
}

export interface UpdateVehicleSpecPayload {
    manufacturer?: string;
    model?: string;
    year?: number;
    fuelType?: "Petrol" | "Diesel" | "Electric" | "Hybrid";
    engineCapacity?: string;
    transmission?: "Manual" | "Automatic";
    seatingCapacity?: number;
    color?: string;
    features?: string;
}

export const vehicleSpecsApi = createApi({
    reducerPath: 'vehicleSpecsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api/',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['VehicleSpec'],
    endpoints: (builder) => ({

        getAllVehicleSpecs: builder.query<VehicleSpecification[], void>({
            query: () => 'vehicle-specifications',
            providesTags: (result) =>
                result
                    ? [...result.map(({ vehicleSpecId }) => ({ type: 'VehicleSpec' as const, id: vehicleSpecId })), 'VehicleSpec']
                    : ['VehicleSpec'],
        }),

        getVehicleSpecById: builder.query<VehicleSpecification, number>({
            query: (id) => `vehicle-specifications/${id}`,
            providesTags: (_, __, id) => [{ type: 'VehicleSpec', id }],
        }),

        createVehicleSpec: builder.mutation<string, CreateVehicleSpecPayload>({
            query: (newSpec) => ({
                url: 'vehicle-specifications',
                method: 'POST',
                body: newSpec,
            }),
            invalidatesTags: ['VehicleSpec'],
        }),

        updateVehicleSpec: builder.mutation<string, { id: number; data: UpdateVehicleSpecPayload }>({
            query: ({ id, data }) => ({
                url: `vehicle-specifications/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_, __, { id }) => [{ type: 'VehicleSpec', id }],
        }),

        deleteVehicleSpec: builder.mutation<string, number>({
            query: (id) => ({
                url: `vehicle-specifications/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['VehicleSpec'],
        }),

    }),
});

// Export hooks for usage in components
export const {
    useGetAllVehicleSpecsQuery,
    useGetVehicleSpecByIdQuery,
    useCreateVehicleSpecMutation,
    useUpdateVehicleSpecMutation,
    useDeleteVehicleSpecMutation,
} = vehicleSpecsApi;
