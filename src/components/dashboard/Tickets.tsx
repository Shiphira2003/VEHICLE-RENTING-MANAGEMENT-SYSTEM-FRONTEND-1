import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import  type { RootState } from '../../apps/store';
import { useGetAllTicketsQuery, useCreateTicketMutation } from '../../features/api/ticketsApi';
import type { TicketDetails, NewTicket } from '../../types/ticketDetails';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';

type TicketFormValues = {
  subject: string;
  description: string;
};

const UserTickets = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.userId);
  const { data: allTickets, isLoading, isError, error, refetch } = useGetAllTicketsQuery();
  const [createTicket, { isLoading: isCreatingTicket }] = useCreateTicketMutation();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TicketFormValues>();

  const userTickets = React.useMemo(() => {
    if (!allTickets || !userId) return [];
    return allTickets.filter((ticket: TicketDetails) => ticket.userId === userId);
  }, [allTickets, userId]);

  const onSubmitNewTicket = async (data: TicketFormValues) => {
    if (!userId) {
      Swal.fire('Error!', 'User ID not found. Cannot create ticket.', 'error');
      return;
    }
    try {
      const newTicketPayload: NewTicket = {
        userId: userId,
        subject: data.subject,
        description: data.description,
        status: 'Open', // Default status for new tickets
      };
      await createTicket(newTicketPayload).unwrap();
      Swal.fire('Success!', 'Your support ticket has been submitted.', 'success');
      reset(); // Clear form
      refetch(); // Re-fetch tickets to show the new one
    } catch (err: any) {
      Swal.fire('Error!', err?.data?.message || 'Failed to submit ticket.', 'error');
      console.error('Failed to submit ticket:', err);
    }
  };

  if (!userId) {
    return <div className="text-center py-10 text-white">Please log in to manage your tickets.</div>;
  }

  if (isLoading) return <div className="text-center py-10 text-white">Loading your tickets...</div>;
  if (isError) {
    Swal.fire({
      icon: 'error',
      title: 'Ticket Error',
      text: `Failed to fetch tickets: ${(error)}`,
    });
    return <div className="text-center py-10 text-red-500">Error loading tickets.</div>;
  }

  return (
    <div className="min-h-screen bg-darkGray text-white p-6">
      <h2 className="text-3xl font-bold text-purple-600 text-center mb-8 text-accentPink">My Support Tickets</h2>

      {/* Form to create a new ticket */}
      <div className="bg-lightGray rounded-lg shadow-md p-6 mb-8 max-w-2xl mx-auto">
        <h3 className="text-2xl font-semibold mb-4 text-orange-400">Submit a New Ticket</h3>
        <form onSubmit={handleSubmit(onSubmitNewTicket)} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-bold mb-2" htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              className="input input-bordered w-full bg-gray-800 text-white border-gray-600 focus:border-accentPink"
              placeholder="e.g., Issue with recent booking"
              {...register('subject', { required: 'Subject is required' })}
            />
            {errors.subject && <p className="text-red-500 text-xs italic">{errors.subject.message}</p>}
          </div>
          <div>
            <label className="block text-white text-sm font-bold mb-2" htmlFor="description">Description</label>
            <textarea
              id="description"
              className="textarea textarea-bordered w-full bg-gray-800 text-white border-gray-600 focus:border-accentPink h-24"
              placeholder="Describe your issue in detail..."
              {...register('description', { required: 'Description is required' })}
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs italic">{errors.description.message}</p>}
          </div>
          <button
            type="submit"
            className="btn bg-orange-500 hover:bg-orange-600 text-white w-full"
            disabled={isCreatingTicket}
          >
            {isCreatingTicket ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </form>
      </div>

      {/* List of existing tickets */}
      <h3 className="text-2xl font-bold text-center mb-6 text-accentPink">Your Existing Tickets</h3>
      {userTickets.length === 0 ? (
        <div className="text-center py-4 text-white">You have no existing tickets.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full bg-lightGray rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-300 text-white">
                <th className="p-4  text-purple-500 text-left">Ticket ID</th>
                <th className="p-4  text-purple-500 text-left">Subject</th>
                <th className="p-4  text-purple-500 text-left">Status</th>
                <th className="p-4  text-purple-500 text-left">Created At</th>
                <th className="p-4  text-purple-500 text-left">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {userTickets.map((ticket: TicketDetails) => (
                <tr key={ticket.ticketId} className="border-b  border-gray-600 hover:bg-gray-700 transition-colors duration-150">
                  <td className="p-4 text-black">{ticket.ticketId}</td>
                  <td className="p-4 text-black">{ticket.subject}</td>
                  <td className="p-4 text-black">{ticket.status}</td>
                  <td className="p-4 text-black">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-black">{new Date(ticket.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody> text-black
          </table>
        </div>
      )}
    </div>
  );
};

export default UserTickets;