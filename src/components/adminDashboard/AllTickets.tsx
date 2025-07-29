import { AiFillDelete } from "react-icons/ai";
import { FiEdit, FiFilter } from "react-icons/fi";
import type { RootState } from "../../apps/store";
import { useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
import Swal from "sweetalert2";
import { ticketsApi } from "../../features/api/ticketsApi";
import type { TicketDetails } from "../../types/ticketDetails";
import { useState } from "react";

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
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const {
    data: ticketsData = [],
    isLoading,
    error,
  } = ticketsApi.useGetAllTicketsQuery(undefined, { skip: !isAuthenticated });
  const [] = ticketsApi.useUpdateTicketMutation();
  const [deleteTicket] = ticketsApi.useDeleteTicketMutation();

  const filteredTickets = ticketsData.filter((ticket: TicketDetails) => {
    if (statusFilter === "All") return true;
    return ticket.status === statusFilter;
  });

  const handleUpdateTicketStatus = async (
    _ticketId: number,
    currentStatus: TicketDetails["status"]
  ) => {
    let newStatus: TicketDetails["status"] =
      currentStatus === "Closed" ? "Open" : "Closed";

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
          Swal.fire("Success!", `Ticket status updated to ${newStatus}.`, "success");
        } catch (error) {
          Swal.fire("Error", "Failed to update ticket.", "error");
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
          Swal.fire("Error!", "Something went wrong while deleting.", "error");
        }
      }
    });
  };

  return (
    <div className="w-full px-4 md:px-8 py-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="text-2xl font-bold text-purple-900">All Tickets</div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2">
            <FiFilter className="text-purple-600" />
            <span className="text-gray-700 font-medium">Filter by Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select select-bordered w-full md:max-w-xs"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-gray-100 p-4 md:p-6 rounded-lg shadow-md">
        <table className="table w-full text-sm md:text-base">
          <thead>
            <tr>
              <th className="p-2 md:p-4 text-purple-600">ID</th>
              <th className="p-2 md:p-4 text-purple-600">Subject</th>
              <th className="p-2 md:p-4 text-purple-600">Description</th>
              <th className="p-2 md:p-4 text-purple-600">Status</th>
              <th className="p-2 md:p-4 text-purple-600">Created By</th>
              <th className="p-2 md:p-4 text-purple-600">Created At</th>
              <th className="p-2 md:p-4 text-purple-600">Updated</th>
              <th className="p-2 md:p-4 text-purple-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan={8} className="text-red-600 text-center py-4">
                  Error fetching tickets.
                </td>
              </tr>
            ) : isLoading ? (
              <tr>
                <td colSpan={8} className="flex justify-center items-center py-8">
                  <PuffLoader color="#0aff13" size={50} />
                  <span className="ml-4 text-gray-700">Loading tickets...</span>
                </td>
              </tr>
            ) : filteredTickets.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-600 py-8">
                  No {statusFilter === "All" ? "" : statusFilter} tickets available
                </td>
              </tr>
            ) : (
              filteredTickets.map((ticket: TicketDetails) => (
                <tr key={ticket.ticketId} className="hover:bg-gray-50">
                  <td className="p-2 md:p-4 text-gray-700">{ticket.ticketId}</td>
                  <td className="p-2 md:p-4 font-semibold text-purple-700">{ticket.subject}</td>
                  <td className="p-2 md:p-4 text-gray-700">{ticket.description}</td>
                  <td className="p-2 md:p-4">
                    <span className={`badge ${getTicketStatusBadge(ticket.status)}`}>{ticket.status}</span>
                  </td>
                  <td className="p-2 md:p-4">
                    <div className="font-bold text-gray-800">
                      {ticket.user.firstName} {ticket.user.lastName}
                    </div>
                    <div className="text-xs text-gray-500">{ticket.user.email}</div>
                  </td>
                  <td className="p-2 md:p-4 text-gray-700">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 md:p-4 text-gray-700">
                    {new Date(ticket.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 md:p-4 space-y-2 md:space-y-0 md:space-x-2 flex flex-col md:flex-row">
                    <button
                      onClick={() => handleUpdateTicketStatus(ticket.ticketId, ticket.status)}
                      className={`btn btn-sm btn-outline transition duration-200 ${
                        ticket.status === "Closed"
                          ? "text-green-700 border-green-500 hover:text-green-500"
                          : "text-blue-700 border-blue-500 hover:text-blue-500"
                      }`}
                    >
                      <FiEdit className="inline-block mr-1" />
                      {ticket.status === "Closed" ? "Re-open" : "Close"}
                    </button>
                    <button
                      onClick={() => handleDeleteTicket(ticket.ticketId)}
                      className="btn btn-sm btn-outline text-red-500 border-red-500 hover:text-red-600"
                    >
                      <AiFillDelete className="inline-block mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
