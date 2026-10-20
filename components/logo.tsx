import { Norican } from "next/font/google";

import { cn } from "@/lib/utils";

const norican = Norican({ weight: "400", subsets: ["latin"], display: "swap" });

/**
 * The KayD wordmark: Norican, the script the very first site used. Size it
 * with text classes. `tailClassName` styles "ayD", so the navigation can
 * fold the wordmark down to its K monogram.
 */
export function Logo({ className, tailClassName }: { className?: string; tailClassName?: string }) {
  return (
    <span className={cn(norican.className, "inline-flex leading-none", className)}>
      K<span className={cn("inline-block", tailClassName)}>ayD</span>
    </span>
  );
}
