import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, CreditCard, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentGateProps {
  onPayment: () => void;
  isProcessingPayment?: boolean;
  amount?: number;
}

export function PaymentGate({ onPayment, isProcessingPayment = false, amount = 100 }: PaymentGateProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Mock payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPayment();
    }, 2000);
  };

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-card border-border shadow-2xl max-h-[85vh] overflow-y-auto">
        <CardContent className="p-4 sm:p-6">
          
          {/* Lock Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-amber-500/10 p-4 rounded-full">
              <Lock className="h-8 w-8 text-amber-600" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-bold text-center text-foreground font-display mb-2">
            Unlock Video Consultation
          </h3>

          {/* Description */}
          <p className="text-sm sm:text-base text-center text-muted-foreground mb-6">
            Payment is required to start the video consultation with your doctor.
          </p>

          {/* Price Card */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Video Consultation Fee</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground font-display">{amount} ETB</p>
              </div>
              <div className="bg-amber-500/10 p-3 rounded-lg">
                <CreditCard className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            className={cn(
              "w-full h-14 py-3.5 text-base font-semibold rounded-xl shadow-md",
              "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            )}
            onClick={handlePayment}
            disabled={isProcessing || isProcessingPayment}
          >
            {isProcessing || isProcessingPayment ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              "Pay with Telebirr / Chapa"
            )}
          </Button>

          {/* Note */}
          <p className="text-[11px] sm:text-xs text-center text-muted-foreground mt-4">
            Secure payment powered by Telebirr and Chapa
          </p>

        </CardContent>
      </Card>
    </div>
  );
}
