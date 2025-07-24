// src/types/TicketDetails.ts

export interface TicketDetails {
  ticketId: number;
  userId: number;
  subject: string;
  description: string;
  status: "Open" | "Closed" | "Pending";
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  user: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    contactNo: string;
    address: string;
    role: "user" | "admin";
  };
}

export interface NewTicket {
  userId: number;
  subject: string;
  description: string;
  status: "Open" | "Closed" | "Pending";
}

export interface UpdateTicket {
  ticketId: number;
  subject?: string;
  description?: string;
  status?: "Open" | "Closed" | "Pending";
}