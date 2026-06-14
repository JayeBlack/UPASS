import { useState, useRef, useEffect } from "react";

type ExportFormat = "csv" | "pdf";

interface ExportDropdownProps {
  onExport: (format: ExportFormat) => void;
  label?: string;
  compact?: boolean;
}

const ExportDropdown = ({ onExport, label = "Export", compact = false }: ExportDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className={`inline-flex items-center gap-2 rounded-lg gradient-gold text-secondary-foreground font-medium hover:opacity-90 transition-opacity cursor-pointer ${compact ? "px-3 py-2 text-xs" : "px-5 py-2.5 text-sm"}`}
      >
        {label}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-[999] bg-card border border-border rounded-lg shadow-lg overflow-hidden min-w-[160px]">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onExport("csv"); setOpen(false); }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            CSV File
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onExport("pdf"); setOpen(false); }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            PDF File
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;