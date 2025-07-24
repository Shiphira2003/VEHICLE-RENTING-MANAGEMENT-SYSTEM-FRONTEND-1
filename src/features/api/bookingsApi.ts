import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../apps/store';
import type { BookingDetails } from '../../types/BookingDetails';
import type { CreateBookingPayload } from '../../types/Types';

export const bookingsApi = createApi({
    reducerPath: 'bookingsApi',
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
    tagTypes: ['Bookings', 'Booking'],

    endpoints: (builder) => ({
        // ✅ Create a new booking
        createBooking: builder.mutation<BookingDetails, CreateBookingPayload>({
            query: (createBookingPayload) => ({
                url: 'bookings',
                method: 'POST',
                body: createBookingPayload,
            }),
            invalidatesTags: ['Bookings'],
        }),

        // ✅ Update booking
        updateBooking: builder.mutation<
            BookingDetails,
            { bookingId: number; bookingStatus?: "Pending" | "Confirmed" | "Completed" | "Cancelled"; [key: string]: any }
        >({
            query: ({ bookingId, ...bookingUpdatePayload }) => ({
                url: `bookings/${bookingId}`,
                method: 'PUT',
                body: bookingUpdatePayload,
            }),
            invalidatesTags: (result, error, arg) => [
                'Bookings',
                { type: 'Booking', id: arg.bookingId },
            ],
        }),

        // ✅ Get all bookings
        getAllBookings: builder.query<BookingDetails[], void>({
            query: () => 'bookings',
            providesTags: ['Bookings'],
        }),

        // ✅ Get booking by ID
        getBookingById: builder.query<BookingDetails, number>({
            query: (bookingId) => `bookings/${bookingId}`,
            providesTags: (result, error, id) => [{ type: 'Booking', id }],
        }),

        // ✅ Get bookings by user ID
        getBookingsByUserId: builder.query<BookingDetails[], number>({
            query: (userId) => `bookings/user/${userId}`,
            providesTags: ['Bookings'],
        }),

        // ✅ Delete a booking
        deleteBooking: builder.mutation<void, number>({
            query: (bookingId) => ({
                url: `bookings/${bookingId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Bookings'],
        }),
    }),
});

export const {
    useCreateBookingMutation,
    useUpdateBookingMutation,
    useGetAllBookingsQuery,
    useGetBookingByIdQuery,
    useGetBookingsByUserIdQuery,    
    useDeleteBookingMutation,
} = bookingsApi;
