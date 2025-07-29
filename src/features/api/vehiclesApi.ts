// src/features/api/vehicleApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Vehicle, CreateVehiclePayload, UpdateVehiclePayload } from '../../types/vehicleDetails';
import { apiDomain } from '../../proxxy';

export const vehicleApi = createApi({
  reducerPath: 'vehicleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiDomain,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token; 
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Vehicle'], 
  endpoints: (builder) => ({
    // Get all vehicles
    getAllVehicles: builder.query<Vehicle[], void>({
      query: () => 'vehicles', 
      providesTags: (result) =>
        result
          ? [...result.map(({ vehicleId }) => ({ type: 'Vehicle' as const, id: vehicleId })), 'Vehicle']
          : ['Vehicle'],
    }),

    // Get filtered vehicles (new endpoint)
    getFilteredVehicles: builder.query<Vehicle[], { 
      manufacturer?: string;
      maxDailyPrice?: number;
      sort?: 'dailyRateAsc' | 'dailyRateDesc' | 'yearAsc' | 'yearDesc';
    }>({
      query: (params) => ({
        url: 'vehicles/filter',
        params: {
          ...(params.manufacturer && { manufacturer: params.manufacturer }),
          ...(params.maxDailyPrice && { maxDailyPrice: params.maxDailyPrice }),
          ...(params.sort && { sort: params.sort }),
        },
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ vehicleId }) => ({ type: 'Vehicle' as const, id: vehicleId })), 'Vehicle']
          : ['Vehicle'],
    }),

    // Get single vehicle by ID
    getVehicleById: builder.query<Vehicle, number>({
      query: (id) => `vehicles/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Vehicle', id }],
    }),

    // Create new vehicle
    createVehicle: builder.mutation<string, CreateVehiclePayload>({ 
      query: (newVehicle) => ({
        url: 'vehicles',
        method: 'POST', 
        body: newVehicle,
      }),
      invalidatesTags: ['Vehicle'], 
    }),

    // Update existing vehicle
    updateVehicle: builder.mutation<string, { id: number; data: UpdateVehiclePayload }>({ 
      query: ({ id, data }) => ({
        url: `vehicles/${id}`,
        method: 'PUT', 
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Vehicle', id }], 
    }),

    // Delete vehicle
    deleteVehicle: builder.mutation<string, number>({
      query: (id) => ({
        url: `vehicles/${id}`,
        method: 'DELETE', 
      }),
      invalidatesTags: ['Vehicle'], // Fixed typo (was 'invalidatesTags')
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetAllVehiclesQuery,
  useLazyGetFilteredVehiclesQuery, // Added this export
  useGetVehicleByIdQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} = vehicleApi;