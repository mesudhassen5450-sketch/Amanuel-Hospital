import { createServerFn } from "@tanstack/react-start";
import { getBookings, addBooking, updateBookingStatus, deleteBooking, type BookingRecord } from "./bookings-store";

export const getAdminBookings = createServerFn({ method: "POST" })
  .validator((data: { username: string; password: string }) => data)
  .handler(async ({ data }) => {
    // Username + Password authentication
    if (data.username !== "admin" || data.password !== "4321") {
      throw new Error("Unauthorized access: Invalid username or password.");
    }
    return await getBookings();
  });

export const addBookingServer = createServerFn({ method: "POST" })
  .validator((data: Omit<BookingRecord, "id" | "createdAt"> & { id?: string }) => data)
  .handler(async ({ data }) => {
    return await addBooking(data);
  });

export const updateBookingStatusServer = createServerFn({ method: "POST" })
  .validator((data: { id: string; status: string }) => data)
  .handler(async ({ data }) => {
    return await updateBookingStatus(data.id, data.status);
  });

export const deleteBookingServer = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return await deleteBooking(data.id);
  });
