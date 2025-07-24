// src/features/api/vehicleApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Vehicle, CreateVehiclePayload, UpdateVehiclePayload } from '../../types/vehicleDetails';

export const vehicleApi = createApi({
  reducerPath: 'vehicleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api/',
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

    getAllVehicles: builder.query<Vehicle[], void>({
      query: () => 'vehicles', 
      providesTags: (result) =>
        result
          ? [...result.map(({ vehicleId }) => ({ type: 'Vehicle' as const, id: vehicleId })), 'Vehicle']
          : ['Vehicle'],
    }),

    getVehicleById: builder.query<Vehicle, number>({
      query: (id) => `vehicles/${id}`,
      providesTags: (result, error, id) => [{ type: 'Vehicle', id }],
    }),

    createVehicle: builder.mutation<string, CreateVehiclePayload>({ 
      query: (newVehicle) => ({
        url: 'vehicles',
        method: 'POST', 
        body: newVehicle,
      }),
      invalidatesTags: ['Vehicle'], 
    }),

    updateVehicle: builder.mutation<string, { id: number; data: UpdateVehiclePayload }>({ 
      query: ({ id, data }) => ({
        url: `vehicles/${id}`,
        method: 'PUT', 
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Vehicle', id }], 
    }),

    deleteVehicle: builder.mutation<string, number>({
      query: (id) => ({
        url: `vehicles/${id}`,
        method: 'DELETE', 
      }),
      invalidatesTags: ['Vehicle'], 
    }),

   
  }),
});

// Export hooks for usage in components
export const {
  useGetAllVehiclesQuery,
  useGetVehicleByIdQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} = vehicleApi;