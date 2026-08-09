import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { AvailableDoctorsModal } from "./AvailableDoctorsModal";

export function VideoCallBadge() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="hidden items-center gap-1.5 rounded-xl border-primary/30 text-primary hover:bg-primary/10 hover:border-primary md:inline-flex"
      >
        <Video className="h-3.5 w-3.5" />
        <span>Video Call</span>
        <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
          Live
        </Badge>
      </Button>
      
      <AvailableDoctorsModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
