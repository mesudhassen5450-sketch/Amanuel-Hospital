import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}

export function SectionHeading({ eyebrow, title, subtitle, align = "center" }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "")}>
      <span className="inline-block rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
        {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-2xl font-bold text-foreground md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground md:text-lg">{subtitle}</p>}
    </div>
  );
}
