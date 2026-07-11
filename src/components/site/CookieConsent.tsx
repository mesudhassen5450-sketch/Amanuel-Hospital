import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem("cookie-consent")) setVisible(true);
    } catch {
      /* ignore */
    }
  }, []);

  const accept = (value: string) => {
    try {
      localStorage.setItem("cookie-consent", value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm rounded-2xl border border-border bg-card p-4 card-shadow animate-fade-up">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground">
          <Cookie className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm text-foreground">
            We use cookies to improve your browsing experience. (Demo notice)
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" className="rounded-lg" onClick={() => accept("all")}>
              Accept
            </Button>
            <Button size="sm" variant="outline" className="rounded-lg" onClick={() => accept("essential")}>
              Essential only
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
