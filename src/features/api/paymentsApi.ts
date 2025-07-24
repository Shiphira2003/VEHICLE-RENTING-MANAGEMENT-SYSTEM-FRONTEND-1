// src/features/api/paymentsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../apps/store';
import type { PaymentDetails, NewPayment, UpdatePayment } from '../../types/paymentDetails';

export const paymentsApi = createApi({
    reducerPath: 'paymentsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api/',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token; 
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Payments'],
    endpoints: (builder) => ({
        getAllPayments: builder.query<PaymentDetails[], void>({
            query: () => 'payments',
            providesTags: (result) =>
                result
                    ? [...result.map(({ paymentId }) => ({ type: 'Payments' as const, id: paymentId })), 'Payments']
                    : ['Payments'],
        }),
        getPaymentById: builder.query<PaymentDetails, number>({
            query: (id) => `payments/${id}`,
            providesTags: (result, error, id) => [{ type: 'Payments', id }],
        }),
        createPayment: builder.mutation<PaymentDetails, NewPayment>({ // FIX: Use NewPayment type
            query: (newPayment) => ({
                url: 'payments',
                method: 'POST',
                body: newPayment,
            }),
            invalidatesTags: ['Payments'],
        }),
        updatePayment: builder.mutation<PaymentDetails, { paymentId: number; status?: UpdatePayment['paymentStatus'] | string; amount?: UpdatePayment['amount']; paymentMethod?: UpdatePayment['paymentMethod']; transactionId?: UpdatePayment['transactionId'] }>({
            query: ({ paymentId, ...patch }) => ({
                url: `payments/${paymentId}`,
                method: 'PUT', // Or PATCH depending on your backend
                body: patch,
            }),
            invalidatesTags: (result, error, { paymentId }) => [{ type: 'Payments', id: paymentId }],
        }),
        deletePayment: builder.mutation<void, number>({
            query: (id) => ({
                url: `payments/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Payments', id }],
        }),
    }),
});

export const {
    useGetAllPaymentsQuery, // FIX: This hook needs to be exported
    useGetPaymentByIdQuery,
    useCreatePaymentMutation, // FIX: This hook needs to be exported
    useUpdatePaymentMutation,
    useDeletePaymentMutation,
} = paymentsApi;
