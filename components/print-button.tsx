"use client";

/** Opens the browser's print dialog, where "Save as PDF" makes the file. */
export function PrintButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      Print or save as PDF
    </button>
  );
}
