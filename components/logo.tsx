import { Norican } from "next/font/google";

import { cn } from "@/lib/utils";

const norican = Norican({ weight: "400", subsets: ["latin"], display: "swap" });

/** The KayD wordmark: Norican, the script the very first site used. Size it with text classes. */
export function Logo({ className }: { className?: string }) {
  return <span className={cn(norican.className, "leading-none", className)}>KayD</span>;
}
