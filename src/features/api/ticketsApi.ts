
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { TicketDetails, NewTicket, UpdateTicket } from '../../types/ticketDetails';
import { apiDomain } from '../../proxxy';

export const ticketsApi = createApi({
  reducerPath: 'ticketsApi',
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
  tagTypes: ['Tickets'],
  endpoints: (builder) => ({
    getAllTickets: builder.query<TicketDetails[], void>({
      query: () => 'tickets',
      providesTags: (result) =>
        result
          ? [...result.map(({ ticketId }) => ({ type: 'Tickets' as const, id: ticketId })), 'Tickets']
          : ['Tickets'],
    }),
    getTicketById: builder.query<TicketDetails, number>({
      query: (id) => `tickets/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Tickets', id }],
    }),
    createTicket: builder.mutation<TicketDetails, NewTicket>({
      query: (newTicket) => ({
        url: 'tickets',
        method: 'POST',
        body: newTicket,
      }),
      invalidatesTags: ['Tickets'],
    }),
    updateTicket: builder.mutation<TicketDetails, UpdateTicket>({
      query: ({ ticketId, ...patch }) => ({
        url: `tickets/${ticketId}`,
        method: 'PUT', // Or PATCH depending on your backend
        body: patch,
      }),
      invalidatesTags: (_result, _error, { ticketId }) => [{ type: 'Tickets', id: ticketId }],
    }),
    deleteTicket: builder.mutation<void, number>({
      query: (id) => ({
        url: `tickets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Tickets', id }],
    }),
  }),
});

export const {
  useGetAllTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} = ticketsApi;