import { contentClass, headerClass } from "@/dashboard/components/dashboardTheme";
import {
  cn,
  getStatValueClass,
  getTriggerClass,
} from "@/dashboard/components/dashboardUtils";

export default function AutomationsPanel({ automations, onToggleAutomation }) {
  return (
    <>
      <div className={headerClass}>
        <div>
          <div className="font-['Syne',sans-serif] text-[20px] font-extrabold tracking-[-0.5px] text-[var(--white)]">
            Automations
          </div>
          <div className="mt-[2px] text-[12px] text-[var(--muted)] max-[720px]:text-[11px]">
            4 active workflows · 1,247 runs this month
          </div>
        </div>
        <div className="flex items-center gap-2 max-[1080px]:w-full max-[1080px]:flex-wrap">
          <button
            type="button"
            className="cursor-pointer rounded-[6px] bg-[var(--amber)] px-[14px] py-[6px] text-[12px] font-semibold text-[var(--bg)] transition-colors duration-200 hover:bg-[var(--amber2)] max-[720px]:w-full"
          >
            + New Workflow
          </button>
        </div>
      </div>

      <div className={contentClass}>
        <div className="mb-4 grid grid-cols-2 gap-3 max-[1080px]:grid-cols-1">
          {automations.map((item) => (
            <div
              key={item.id}
              className="rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-5 transition-colors duration-200 hover:border-[var(--border2)]"
            >
              <div className="mb-3 flex items-start justify-between max-[720px]:gap-[10px]">
                <div>
                  <div
                    className={cn(
                      "mb-[10px] w-fit rounded-[4px] px-2 py-[3px] font-['JetBrains_Mono',monospace] text-[9px]",
                      getTriggerClass(item.triggerClass),
                    )}
                  >
                    {item.trigger}
                  </div>
                  <div className="font-['Syne',sans-serif] text-[14px] font-bold text-[var(--white)]">
                    {item.name}
                  </div>
                </div>
                <div
                  className={cn(
                    "relative h-5 w-9 shrink-0 cursor-pointer rounded-[10px] transition-colors duration-200",
                    item.enabled ? "bg-[var(--green)]" : "bg-[var(--subtle)]",
                  )}
                  onClick={() => onToggleAutomation(item.id)}
                >
                  <div
                    className={cn(
                      "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all duration-200",
                      item.enabled ? "left-[18px]" : "left-0.5",
                    )}
                  />
                </div>
              </div>
              <div className="mb-[14px] text-[12px] leading-[1.5] text-[var(--muted)]">
                {item.desc}
              </div>
              <div className="flex flex-wrap gap-4 max-[720px]:gap-3">
                {item.stats.map((stat) => (
                  <div key={stat.label} className="text-[11px] text-[var(--muted)]">
                    <span
                      className={cn(
                        "block font-['Syne',sans-serif] text-[14px] font-bold",
                        getStatValueClass(stat.className),
                      )}
                      style={stat.style}
                    >
                      {stat.value}
                    </span>
                    {stat.label}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
