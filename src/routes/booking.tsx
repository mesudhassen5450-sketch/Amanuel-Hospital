import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, CreditCard, ArrowRight, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useBooking, type BookingData } from "@/lib/booking-context";
import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/translations";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book Appointment — Dr. Amanuel Hospital" },
      { name: "description", content: "Schedule an appointment at Dr. Amanuel Hospital. Select date, time, and payment method online." },
    ],
  }),
  component: BookingPage,
});

const timeSlots = [
  "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"
];

const paymentMethods = [
  { id: "Telebirr", name: "Telebirr", icon: "📱", desc: "Pay with Telebirr mobile wallet" },
  { id: "CBE Birr", name: "CBE Birr", icon: "🏦", desc: "Pay via CBE Birr mobile money" },
  { id: "Cash", name: "Cash", icon: "💵", desc: "Pay in cash at the hospital counter" }
] as const;

function BookingPage() {
  const { setBooking } = useBooking();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
  });
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<"Telebirr" | "CBE Birr" | "Cash" | "">("");
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      errs.fullName = "Please enter a valid full name (at least 2 characters).";
    }
    
    // Validate Ethiopian phone numbers (+251... or 09...) or simple international numbers
    const phoneTrim = form.phoneNumber.trim();
    if (!/^[+\d][\d\s-]{6,}$/.test(phoneTrim)) {
      errs.phoneNumber = "Please enter a valid phone number.";
    }
    
    if (!selectedDate) {
      errs.appointmentDate = "Please choose a date for your appointment.";
    }
    
    if (!selectedTime) {
      errs.appointmentTime = "Please select a preferred time slot.";
    }
    
    if (!selectedPayment) {
      errs.paymentMethod = "Please select a payment method.";
    }
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && selectedDate && selectedPayment) {
      const bookingData: BookingData = {
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        appointmentDate: format(selectedDate, "yyyy-MM-dd"),
        appointmentTime: selectedTime,
        paymentMethod: selectedPayment,
        amount: 300,
        status: "Waiting for Payment"
      };
      
      setBooking(bookingData);
      navigate({ to: "/payment-summary" });
    }
  };

  return (
    <SiteLayout>
      <PageHero
        breadcrumb={lang === "am" ? "ቀጠሮ መያዣ" : lang === "or" ? "Qabannoo Qaxaree" : "Booking"}
        title={lang === "am" ? "ቀጠሮ ያስይዙ" : lang === "or" ? "Qaxaree Qabadhu" : "Book an Appointment"}
        subtitle={lang === "am" ? "እባክዎን ከዚህ በታች ያሉትን ዝርዝሮች በመሙላት ቀጠሮዎን ያጠናቅቁ" : lang === "or" ? "Odeeffannoo armaan gadii guutuun qaxaree keessan mirkaneessaa" : "Please fill in the details below to schedule your medical appointment."}
      />

      <section className="py-12 md:py-20 px-4">
        <div className="mx-auto max-w-3xl">
          <Card className="border border-border bg-card shadow-lg rounded-3xl overflow-hidden animate-fade-in">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-transparent to-transparent border-b border-border/40 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm tracking-wide uppercase">
                <Sparkles className="h-4 w-4 text-primary animate-pulse-soft" />
                <span>Appointment Booking Form</span>
              </div>
              <CardTitle className="mt-2 text-2xl font-bold font-display">Schedule Your Visit</CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                Provide your details, select a date & time, and pick your payment method to secure your slot.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8" noValidate>
              <CardContent className="space-y-6 p-0">
                
                {/* Full Name & Phone Number */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="book-name" className="text-foreground font-medium">Full Name</Label>
                    <Input
                      id="book-name"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="e.g. Abebe Kebede"
                      className={cn(
                        "rounded-xl h-11 border-input/60 focus-visible:ring-primary",
                        errors.fullName && "border-destructive focus-visible:ring-destructive"
                      )}
                      aria-invalid={!!errors.fullName}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-destructive flex items-center gap-1 font-medium">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="book-phone" className="text-foreground font-medium">Phone Number</Label>
                    <Input
                      id="book-phone"
                      type="tel"
                      value={form.phoneNumber}
                      onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                      placeholder="e.g. +251 911 223 344"
                      className={cn(
                        "rounded-xl h-11 border-input/60 focus-visible:ring-primary",
                        errors.phoneNumber && "border-destructive focus-visible:ring-destructive"
                      )}
                      aria-invalid={!!errors.phoneNumber}
                    />
                    {errors.phoneNumber && (
                      <p className="text-xs text-destructive flex items-center gap-1 font-medium">{errors.phoneNumber}</p>
                    )}
                  </div>
                </div>

                {/* Calendar Picker (Date) */}
                <div className="space-y-2">
                  <Label className="text-foreground font-medium block">Appointment Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-11 rounded-xl border-input/60",
                          !selectedDate && "text-muted-foreground",
                          errors.appointmentDate && "border-destructive"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                        {selectedDate ? format(selectedDate, "PPP") : "Choose a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.appointmentDate && (
                    <p className="text-xs text-destructive flex items-center gap-1 font-medium">{errors.appointmentDate}</p>
                  )}
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <Label className="text-foreground font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4 text-primary" />
                    Appointment Time
                  </Label>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                    {timeSlots.map((time) => {
                      const isSelected = selectedTime === time;
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer",
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow"
                              : "border-border hover:bg-secondary/40 text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                  {errors.appointmentTime && (
                    <p className="text-xs text-destructive flex items-center gap-1 font-medium">{errors.appointmentTime}</p>
                  )}
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-3">
                  <Label className="text-foreground font-medium flex items-center gap-1">
                    <CreditCard className="h-4 w-4 text-primary" />
                    Payment Method
                  </Label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {paymentMethods.map((pm) => {
                      const isSelected = selectedPayment === pm.id;
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setSelectedPayment(pm.id)}
                          className={cn(
                            "flex flex-row items-center gap-3 p-4 rounded-2xl border text-left transition-all hover-lift cursor-pointer",
                            isSelected
                              ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                              : "border-border hover:border-border/80 hover:bg-secondary/20"
                          )}
                        >
                          <span className="text-2xl">{pm.icon}</span>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-foreground">{pm.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{pm.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.paymentMethod && (
                    <p className="text-xs text-destructive flex items-center gap-1 font-medium">{errors.paymentMethod}</p>
                  )}
                </div>

              </CardContent>

              <CardFooter className="flex flex-col items-stretch p-0 pt-4 border-t border-border/40">
                <div className="flex items-center justify-between mb-4 text-sm font-semibold">
                  <span className="text-muted-foreground">Consultation Fee</span>
                  <span className="text-foreground text-lg">300 ETB</span>
                </div>
                <Button type="submit" className="w-full rounded-2xl h-12 text-sm font-semibold flex items-center justify-center gap-2 group shadow-md transition-all">
                  Continue
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}
