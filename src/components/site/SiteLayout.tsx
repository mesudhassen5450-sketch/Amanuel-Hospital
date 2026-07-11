import { type ReactNode, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { FloatingActions } from "@/components/site/FloatingActions";
import { CookieConsent } from "@/components/site/CookieConsent";
import { LanguageProvider } from "@/lib/language-context";

export function SiteLayout({ children }: { children: ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <LanguageProvider>
      <div className="flex min-h-screen flex-col">
        <ScrollProgress />
        <Navbar onOpenChat={() => setChatOpen(true)} />
        <main className="flex-1 animate-fade-in">{children}</main>
        <Footer />
        <FloatingActions chatOpen={chatOpen} setChatOpen={setChatOpen} />
        <CookieConsent />
      </div>
    </LanguageProvider>
  );
}
