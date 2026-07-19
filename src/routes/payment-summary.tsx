import { createFileRoute, Link } from "@tanstack/react-router";
import { Receipt, Calendar, Clock, Phone, User, CreditCard, ChevronLeft, Home, BadgeHelp, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBooking } from "@/lib/booking-context";
import { useLanguage } from "@/lib/language-context";

export const Route = createFileRoute("/payment-summary")({
  head: () => ({
    meta: [
      { title: "Payment Summary — Dr. Amanuel Hospital" },
      { name: "description", content: "Review your appointment booking summary and payment status." },
    ],
  }),
  component: PaymentSummaryPage,
});

function PaymentSummaryPage() {
  const { booking } = useBooking();
  const { lang } = useLanguage();

  return (
    <SiteLayout>
      <PageHero
        breadcrumb={lang === "am" ? "የክፍያ ማጠቃለያ" : lang === "or" ? "Maqannee Kafaltii" : "Payment Summary"}
        title={lang === "am" ? "የቀጠሮ ማጠቃለያ" : lang === "or" ? "Gabaasa Qaxaree" : "Appointment Summary"}
        subtitle={lang === "am" ? "የቀጠሮዎን ዝርዝር እና የክፍያ ሁኔታ እዚህ ያረጋግጡ" : lang === "or" ? "Odeeffannoo qaxaree fi haala kafaltii keessan asitti mirkaneessaa" : "Review your appointment details and payment status below."}
      />

      <section className="py-12 md:py-20 px-4">
        <div className="mx-auto max-w-2xl">
          {booking ? (
            <Card className="border border-border bg-card shadow-xl rounded-3xl overflow-hidden animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-amber-500/10 via-transparent to-transparent border-b border-border/40 p-6 sm:p-8">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 font-semibold text-sm tracking-wide uppercase">
                    <Receipt className="h-4 w-4" />
                    <span>Payment Pending</span>
                  </div>
                  <Badge variant="outline" className="rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20 px-3 py-1 font-semibold text-xs">
                    {booking.status}
                  </Badge>
                </div>
                <CardTitle className="mt-4 text-2xl font-bold font-display">Booking Reference</CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  Please review your appointment detail and make payment through {booking.paymentMethod}.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6 sm:p-8 space-y-6">
                
                {/* Details Section */}
                <div className="space-y-4">
                  <h3 className="font-display font-semibold text-base text-foreground border-b border-border/40 pb-2">Patient & Schedule Details</h3>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    
                    {/* Patient Name */}
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-secondary/20 border border-border/40">
                      <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground font-medium">Patient Name</p>
                        <p className="text-sm font-semibold text-foreground truncate">{booking.fullName}</p>
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-secondary/20 border border-border/40">
                      <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground font-medium">Phone Number</p>
                        <p className="text-sm font-semibold text-foreground truncate">{booking.phoneNumber}</p>
                      </div>
                    </div>

                    {/* Appointment Date */}
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-secondary/20 border border-border/40">
                      <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground font-medium">Appointment Date</p>
                        <p className="text-sm font-semibold text-foreground truncate">{booking.appointmentDate}</p>
                      </div>
                    </div>

                    {/* Appointment Time */}
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-secondary/20 border border-border/40">
                      <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground font-medium">Appointment Time</p>
                        <p className="text-sm font-semibold text-foreground truncate">{booking.appointmentTime}</p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Payment Section */}
                <div className="space-y-4 pt-2">
                  <h3 className="font-display font-semibold text-base text-foreground border-b border-border/40 pb-2">Payment Details</h3>
                  
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-border/40 bg-secondary/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/10 text-primary text-xl">
                        {booking.paymentMethod === "Telebirr" ? "📱" : booking.paymentMethod === "CBE Birr" ? "🏦" : "💵"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{booking.paymentMethod}</p>
                        <p className="text-xs text-muted-foreground">Selected Payment Option</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">{booking.amount} ETB</p>
                      <p className="text-xs text-muted-foreground">Fee amount</p>
                    </div>
                  </div>
                </div>

              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row gap-3 p-6 sm:p-8 bg-secondary/10 border-t border-border/40">
                <Button asChild variant="outline" className="flex-1 rounded-2xl h-11 border-border/60 hover:bg-secondary/40">
                  <Link to="/booking">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Booking
                  </Link>
                </Button>
                <Button asChild className="flex-1 rounded-2xl h-11 shadow-sm">
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go to Homepage
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="border border-border bg-card shadow-lg rounded-3xl overflow-hidden p-6 sm:p-8 text-center animate-fade-in">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
                <BadgeHelp className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl font-bold font-display">No Booking Details Found</CardTitle>
              <CardDescription className="mt-2 text-muted-foreground max-w-sm mx-auto text-sm">
                We couldn't find any temporary booking session. Please complete the booking form first to view your summary.
              </CardDescription>
              <div className="mt-6 flex justify-center">
                <Button asChild className="rounded-2xl h-11 px-6 shadow-sm">
                  <Link to="/booking">
                    Create a Booking
                  </Link>
                </Button>
              </div>
            </Card>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
