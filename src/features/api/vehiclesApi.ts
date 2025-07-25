import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Vehicle,
  VehicleSpec,
  CreateVehiclePayload,
  UpdateVehiclePayload
} from '../../types/vehicleDetails';

const BASE_URL = 'http://localhost:8000/api'; // Update with your API base URL

export const vehicleApi = createApi({
  reducerPath: 'vehiclesApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      // Add authorization header if needed
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Vehicle'],
  endpoints: (builder) => ({
    // Get all vehicles
    getAllVehicles: builder.query<Vehicle[], void>({
      query: () => '/vehicles',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ vehicleId }) => ({ type: 'Vehicle' as const, id: vehicleId })),
              { type: 'Vehicle', id: 'LIST' },
            ]
          : [{ type: 'Vehicle', id: 'LIST' }],
    }),

    // Get filtered vehicles
    getFilteredVehicles: builder.query<Vehicle[], {
      manufacturer?: string;
      maxDailyPrice?: number;
      sort?: 'dailyRateAsc' | 'dailyRateDesc';
    }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        if (params.manufacturer) {
          queryParams.append('manufacturer', params.manufacturer);
        }
        
        if (params.maxDailyPrice) {
          queryParams.append('maxDailyPrice', params.maxDailyPrice.toString());
        }
        
        if (params.sort) {
          queryParams.append('sort', params.sort);
        }
        
        return {
          url: `vehicles/filter?${queryParams.toString()}`,
          method: 'GET'
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ vehicleId }) => ({ type: 'Vehicle' as const, id: vehicleId })),
              { type: 'Vehicle', id: 'FILTERED_LIST' },
            ]
          : [{ type: 'Vehicle', id: 'FILTERED_LIST' }],
    }),

    // Get vehicle by ID
    getVehicleById: builder.query<Vehicle, number>({
      query: (id) => `/vehicles/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Vehicle', id }],
    }),

    // Create a new vehicle
    createVehicle: builder.mutation<Vehicle, CreateVehiclePayload>({
      query: (body) => ({
        url: '/vehicles',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Vehicle', id: 'LIST' }],
    }),

    // Update a vehicle
    updateVehicle: builder.mutation<Vehicle, { id: number; body: UpdateVehiclePayload }>({
      query: ({ id, body }) => ({
        url: `/vehicles/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Vehicle', id }],
    }),

    // Delete a vehicle
    deleteVehicle: builder.mutation<void, number>({
      query: (id) => ({
        url: `/vehicles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Vehicle', id }],
    }),

    // Get all vehicle specifications (for admin panel)
    getAllVehicleSpecs: builder.query<VehicleSpec[], void>({
      query: () => '/vehicle-specs',
    }),

    // Create a new vehicle specification
    createVehicleSpec: builder.mutation<VehicleSpec, Omit<VehicleSpec, 'vehicleSpecId'>>({
      query: (body) => ({
        url: '/vehicle-specs',
        method: 'POST',
        body,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetAllVehiclesQuery,
  useLazyGetFilteredVehiclesQuery,
  useGetVehicleByIdQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useGetAllVehicleSpecsQuery,
  useCreateVehicleSpecMutation,
} = vehicleApi;
export default vehicleApi