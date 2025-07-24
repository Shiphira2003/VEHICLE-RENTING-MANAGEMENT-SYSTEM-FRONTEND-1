

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import  type { CreateBookingPayload } from '../../types/Types';
import type { BookingDetails } from '../../types/BookingDetails'; // Import BookingDetails too
import type { RootState } from '../../apps/store'; // Assuming you have this for token access

export const userApi = createApi({
    reducerPath: 'userApi',
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
    tagTypes: ['users', 'user', 'bookings'],
    endpoints: (builder) => ({
        loginUser: builder.mutation({
            query: (credentials: { email: string; password: string }) => ({
                url: 'auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        registerUser: builder.mutation({
            query: (user: {
                firstName: string;
                lastName: string;
                profileUrl?: string;
                email: string;
                password: string;
                role?: 'user' | 'admin' | 'disabled';
            }) => ({
                url: 'auth/register',
                method: 'POST',
                body: user,
            }),
        }),
        getUserById: builder.query({
            query: (userId: number) => `users/${userId}`,
            providesTags: ["user"]
        }),
        getAllUsersProfiles: builder.query({
            query: () => 'users',
            providesTags: ["users"]
        }),
        updateUserProfile: builder.mutation({
            query: ({ userId, ...patch }) => ({
                url: `users/${userId}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: ["user", "users"]
        }),
        updateUserProfileImage: builder.mutation({
            query: ({ userId, profileUrl }: { userId: number; profileUrl: string }) => ({
                url: `users/${userId}`,
                method: 'PUT',
                body: { profileUrl },
            }),
            invalidatesTags: ["user", "users"]
        }),
        deleteUserProfile: builder.mutation({
            query: (userId: number) => ({
                url: `users/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["user", "users"]
        }),
        createBooking: builder.mutation<BookingDetails, CreateBookingPayload>({ // Expecting BookingDetails back
            query: (bookingDetails) => ({
                url: 'bookings',
                method: 'POST',
                body: bookingDetails,
            }),
            invalidatesTags: ['bookings'],
        }),
        // NEW: Add getBookingById query here, or in a separate bookingsApi.ts if preferred
        getBookingById: builder.query<BookingDetails, number>({
            query: (bookingId) => `bookings/${bookingId}`, // Assuming /api/bookings/:id endpoint
            providesTags: (result, error, id) => [{ type: 'bookings', id }],
        }),
    }),
});

export const {
    useLoginUserMutation,
    useRegisterUserMutation,
    useGetUserByIdQuery,
    useGetAllUsersProfilesQuery,
    useUpdateUserProfileMutation,
    useUpdateUserProfileImageMutation,
    useDeleteUserProfileMutation,
    useCreateBookingMutation,
    useGetBookingByIdQuery, // NEW: Export the hook
} = userApi;