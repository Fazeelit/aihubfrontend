import { cn } from "@/dashboard/components/dashboardUtils";

export default function ToggleBig({ enabled, onClick, disabled = false }) {
  return (
    <div
      className={cn(
        "relative h-6 w-11 rounded-[12px] transition-colors duration-200",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        enabled ? "bg-[var(--green)]" : "bg-[var(--subtle)]",
      )}
      onClick={disabled ? undefined : onClick}
    >
      <div
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-200",
          enabled ? "left-[22px]" : "left-0.5",
        )}
      />
    </div>
  );
}
