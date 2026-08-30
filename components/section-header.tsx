import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  index: string;
  label: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({
  index,
  label,
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="type-label flex items-center gap-2 text-muted-foreground">
        <span className="text-brand">{index}</span>
        <span aria-hidden="true">/</span>
        <span>{label}</span>
      </p>
      <h2 className="type-section mt-4">{title}</h2>
      {description ? (
        <p className="mt-4 leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
      <hr className="mt-8 border-border" />
    </div>
  );
}
