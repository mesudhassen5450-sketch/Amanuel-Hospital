import { createContext, useContext, useState, type ReactNode } from "react";

export interface BookingData {
  fullName: string;
  phoneNumber: string;
  appointmentDate: string;
  appointmentTime: string;
  paymentMethod: "Telebirr" | "CBE Birr" | "Cash";
  amount: number;
  status: "Waiting for Payment";
}

interface BookingContextValue {
  booking: BookingData | null;
  setBooking: (booking: BookingData | null) => void;
}

const BookingContext = createContext<BookingContextValue>({
  booking: null,
  setBooking: () => {},
});

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBookingState] = useState<BookingData | null>(() => {
    try {
      const stored = typeof window !== "undefined" ? sessionStorage.getItem("temp_booking") : null;
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to parse stored booking", e);
    }
    return null;
  });

  const setBooking = (data: BookingData | null) => {
    setBookingState(data);
    try {
      if (typeof window !== "undefined") {
        if (data) {
          sessionStorage.setItem("temp_booking", JSON.stringify(data));
        } else {
          sessionStorage.removeItem("temp_booking");
        }
      }
    } catch (e) {
      console.error("Failed to save booking to session storage", e);
    }
  };

  return (
    <BookingContext.Provider value={{ booking, setBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}
