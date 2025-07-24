// api/locationApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../apps/store'; 
import type { LocationDetails, CreateLocationPayload, UpdateLocationPayload } from '../../types/locationDetails'; // Adjust path if necessary

export const locationsApi = createApi({
    reducerPath: 'locationsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api/',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token; 
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
        }
    }),
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
    tagTypes: ['Locations', 'Location'], 

    endpoints: (builder) => ({
        // ✅ Create a new location
        createLocation: builder.mutation<LocationDetails, CreateLocationPayload>({
            query: (createLocationPayload) => ({
                url: 'locations',
                method: 'POST',
                body: createLocationPayload,
            }),
            invalidatesTags: ['Locations'],
        }),

        // ✅ Update an existing location
        updateLocation: builder.mutation<
            LocationDetails,
            { locationId: number; payload: UpdateLocationPayload }
        >({
            query: ({ locationId, payload }) => ({
                url: `locations/${locationId}`,
                method: 'PUT',
                body: payload,
            }),
            invalidatesTags: (result, error, arg) => [
                'Locations', // Invalidate the list
                { type: 'Location', id: arg.locationId }, 
            ],
        }),

        // ✅ Get all locations
        getAllLocations: builder.query<LocationDetails[], void>({
            query: () => 'locations',
            providesTags: ['Locations'], // Provide 'Locations' tag for the list
        }),

        // ✅ Get location by ID
        getLocationById: builder.query<LocationDetails, number>({
            query: (locationId) => `locations/${locationId}`,
            providesTags: (result, error, id) => [{ type: 'Location', id }], // Provide tag for specific location
        }),

        // ✅ Delete a location
        deleteLocation: builder.mutation<void, number>({
            query: (locationId) => ({
                url: `locations/${locationId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Locations'], // Invalidate the list of locations after deletion
        }),
    }),
});

// Export the auto-generated hooks for use in your components
export const {
    useCreateLocationMutation,
    useUpdateLocationMutation,
    useGetAllLocationsQuery,
    useGetLocationByIdQuery,
    useDeleteLocationMutation,
} = locationsApi;
