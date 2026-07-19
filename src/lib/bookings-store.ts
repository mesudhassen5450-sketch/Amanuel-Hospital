import fs from "fs/promises";
import path from "path";

export interface BookingRecord {
  id: string;
  fullName: string;
  phoneNumber: string;
  appointmentDate: string;
  appointmentTime: string;
  paymentMethod: "Telebirr" | "CBE Birr" | "Card / Other" | "Cash";
  amount: number;
  status: string;
  txRef?: string;
  paymentStatus?: string;
  createdAt: string;
}

const DB_FILE = path.join(process.cwd(), "bookings.json");

async function ensureDb() {
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

export async function getBookings(): Promise<BookingRecord[]> {
  await ensureDb();
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading bookings.json:", error);
    return [];
  }
}

export async function saveBookings(bookings: BookingRecord[]): Promise<boolean> {
  await ensureDb();
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(bookings, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing bookings.json:", error);
    return false;
  }
}

export async function addBooking(booking: Omit<BookingRecord, "id" | "createdAt"> & { id?: string }): Promise<BookingRecord | null> {
  const bookings = await getBookings();
  
  if (booking.txRef) {
    const existingIndex = bookings.findIndex(b => b.txRef === booking.txRef);
    if (existingIndex !== -1) {
      const updated = { ...bookings[existingIndex], ...booking };
      bookings[existingIndex] = updated;
      await saveBookings(bookings);
      return updated;
    }
  }

  const newRecord: BookingRecord = {
    ...booking,
    id: booking.id || booking.txRef || `bk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString()
  };

  bookings.push(newRecord);
  const success = await saveBookings(bookings);
  return success ? newRecord : null;
}

export async function updateBookingStatus(id: string, status: string): Promise<BookingRecord | null> {
  const bookings = await getBookings();
  const index = bookings.findIndex(b => b.id === id || b.txRef === id);
  if (index === -1) return null;

  bookings[index].status = status;
  if (status === "Paid & Confirmed") {
    bookings[index].paymentStatus = "success";
  }
  const success = await saveBookings(bookings);
  return success ? bookings[index] : null;
}

export async function deleteBooking(id: string): Promise<boolean> {
  const bookings = await getBookings();
  const filtered = bookings.filter(b => b.id !== id && b.txRef !== id);
  if (filtered.length === bookings.length) return false;

  return await saveBookings(filtered);
}
