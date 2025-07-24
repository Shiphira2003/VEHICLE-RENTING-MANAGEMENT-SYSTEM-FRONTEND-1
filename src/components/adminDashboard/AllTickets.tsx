// src/components/AllTickets.tsx

import { AiFillDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import type { RootState } from "../../apps/store";
import { useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
import Swal from "sweetalert2";
import { ticketsApi } from "../../features/api/ticketsApi";
import type { TicketDetails } from "../../types/ticketDetails";

// Helper function to get badge class based on ticket status
const getTicketStatusBadge = (status: TicketDetails["status"]) => {
  switch (status) {
    case "Open":
      return "badge-info text-blue-800 bg-blue-200 border-blue-300";
    case "Closed":
      return "badge-success text-green-800 bg-green-200 border-green-300";
    case "Pending":
      return "badge-warning text-yellow-800 bg-yellow-200 border-yellow-300";
    default:
      return "badge-primary";
  }
};

export const AllTickets = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const {
    data: ticketsData = [],
    isLoading,
    error,
  } = ticketsApi.useGetAllTicketsQuery(undefined, { skip: !isAuthenticated });
  const [updateTicket] = ticketsApi.useUpdateTicketMutation();
  const [deleteTicket] = ticketsApi.useDeleteTicketMutation();

  const handleUpdateTicketStatus = async (
    ticketId: number,
    currentStatus: TicketDetails["status"]
  ) => {
    let newStatus: TicketDetails["status"];
    if (currentStatus === "Open" || currentStatus === "Pending") {
      newStatus = "Closed";
    } else {
      newStatus = "Open"; // Allow re-opening
    }

    Swal.fire({
      title: `Confirm ${newStatus} Ticket?`,
      text: `You are about to change the ticket status to '${newStatus}'.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#f44336",
      confirmButtonText: `Yes, ${newStatus} it!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await updateTicket({ ticketId, status: newStatus }).unwrap();
          console.log(res);
          Swal.fire("Success!", `Ticket status updated to ${newStatus}.`, "success");
        } catch (error) {
          console.error("Failed to update ticket status:", error);
          Swal.fire("Something went wrong", "Please Try Again", "error");
        }
      }
    });
  };

  const handleDeleteTicket = async (ticketId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this ticket record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f44336",
      cancelButtonColor: "#2563eb",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteTicket(ticketId).unwrap();
          Swal.fire("Deleted!", "The ticket record has been deleted.", "success");
        } catch (error) {
          console.error("Failed to delete ticket:", error);
          Swal.fire("Error!", "Something went wrong while deleting.", "error");
        }
      }
    });
  };

  return (
    <>
      <div className="text-2xl font-bold text-center mb-4 text-purple-900">
        All Tickets
      </div>
      <div className="overflow-x-auto bg-gray-100 p-6 rounded-lg shadow-md">
        <table className="table w-full text-left">
          <thead>
            <tr>
              <th className="p-4 text-purple-600">Ticket ID</th>
              <th className="p-4 text-purple-600">Subject</th>
              <th className="p-4 text-purple-600">Description</th>
              <th className="p-4 text-purple-600">Status</th>
              <th className="p-4 text-purple-600">Created By</th>
              <th className="p-4 text-purple-600">Created At</th> text-black
              <th className="p-4 text-purple-600">Last Updated</th>
              <th className="p-4 text-purple-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan={8} className="text-red-600 text-center py-4 text-lg">
                  Error fetching tickets. Please try again.
                </td>
              </tr>
            ) : isLoading ? (
              <tr>
                <td colSpan={8} className="flex justify-center items-center py-8">
                  <PuffLoader color="#0aff13" size={60} />
                  <span className="ml-4 text-gray-700">Loading tickets...</span>
                </td>
              </tr>
            ) : ticketsData.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-600 py-8 text-lg">
                  No tickets available 😎
                </td>
              </tr>
            ) : (
              ticketsData.map((ticket: TicketDetails) => (
                <tr
                  key={ticket.ticketId}
                  className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                >
                  <th className="p-4 text-gray-700">{ticket.ticketId}</th>
                  <td className="p-4 font-bold text-purple-700">
                    {ticket.subject}
                  </td>
                  <td className="p-4 text-gray-700">{ticket.description}</td>
                  <td className="p-4">
                    <div
                      className={`badge text-xs font-semibold px-3 py-1 rounded-full ${getTicketStatusBadge(
                        ticket.status
                      )} `}
                    >
                      {ticket.status}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-800">
                      {ticket.user.firstName} {ticket.user.lastName}
                    </div>
                    <div className="text-sm opacity-50 text-gray-600">
                      {ticket.user.email}
                    </div>
                  </td>
                  <td className="p-4 text-gray-700">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-gray-700">
                    {new Date(ticket.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {ticket.status !== "Closed" && (
                      <button
                        className="text-blue-700 hover:text-blue-500 btn btn-sm btn-outline border-blue-500 transition-colors duration-200"
                        onClick={() =>
                          handleUpdateTicketStatus(ticket.ticketId, ticket.status)
                        }
                        title="Close Ticket"
                        aria-label="Close Ticket"
                      >
                        <FiEdit /> Close Ticket
                      </button>
                    )}
                    {ticket.status === "Closed" && (
                      <button
                        className="text-green-700 hover:text-green-500 btn btn-sm btn-outline border-green-500 transition-colors duration-200"
                        onClick={() =>
                          handleUpdateTicketStatus(ticket.ticketId, ticket.status)
                        }
                        title="Re-open Ticket"
                        aria-label="Re-open Ticket"
                      >
                        <FiEdit /> Re-open Ticket
                      </button>
                    )}
                    <button
                      className="text-red-500 hover:text-red-600 btn btn-sm ml-2 btn-outline border-red-500 transition-colors duration-200"
                      onClick={() => handleDeleteTicket(ticket.ticketId)}
                      title="Delete Ticket"
                      aria-label="Delete Ticket"
                    >
                      <AiFillDelete /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};