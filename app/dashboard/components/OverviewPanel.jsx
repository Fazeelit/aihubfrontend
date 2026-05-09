import Link from "next/link";

import {
  activityItems,
  chartHeights,
  kpis,
} from "@/dashboard/components/dashboardData";
import {
  cardClass,
  contentClass,
  headerClass,
} from "@/dashboard/components/dashboardTheme";
import { cn, getKpiAccent } from "@/dashboard/components/dashboardUtils";

export default function OverviewPanel() {
  return (
    <>
      <div className={headerClass}>
        <div>
          <div className="font-['Syne',sans-serif] text-[20px] font-extrabold tracking-[-0.5px] text-[var(--white)]">
            Overview
          </div>
          <div className="mt-[2px] text-[12px] text-[var(--muted)] max-[720px]:text-[11px]">
            Nest Driving School · Last 30 days
          </div>
        </div>
        <div className="flex items-center gap-2 max-[1080px]:w-full max-[1080px]:flex-wrap">
          <span className="inline-flex items-center gap-[6px] rounded-[4px] bg-[rgba(16,185,129,0.1)] px-[10px] py-1 font-['JetBrains_Mono',monospace] text-[10px] text-[var(--green)] max-[720px]:w-full max-[720px]:justify-center">
            ● Nova Live
          </span>
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center rounded-[6px] bg-[var(--amber)] px-[14px] py-[6px] text-[12px] font-semibold text-[var(--bg)] transition-colors duration-200 hover:bg-[var(--amber2)] max-[720px]:w-full"
          >
            Back to Onboarding
          </Link>
          <button
            type="button"
            className="cursor-pointer rounded-[6px] bg-[var(--amber)] px-[14px] py-[6px] text-[12px] font-semibold text-[var(--bg)] transition-colors duration-200 hover:bg-[var(--amber2)] max-[720px]:w-full"
          >
            + New Automation
          </button>
        </div>
      </div>

      <div className={contentClass}>
        <div className="mb-5 grid grid-cols-4 gap-[14px] max-[1080px]:grid-cols-1 max-[720px]:gap-[10px]">
          {kpis.map((item) => (
            <div
              key={item.label}
              className={cn(
                "relative overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-[18px] before:absolute before:bottom-0 before:left-0 before:top-0 before:w-[3px] before:content-['']",
                getKpiAccent(item.tone),
              )}
            >
              <div className="mb-2 font-['JetBrains_Mono',monospace] text-[9px] uppercase tracking-[2px] text-[var(--muted)]">
                {item.label}
              </div>
              <div className="mb-1 font-['Syne',sans-serif] text-[28px] font-extrabold tracking-[-1px]">
                {item.value}
              </div>
              <div className="text-[11px] text-[var(--green)]">{item.change}</div>
            </div>
          ))}
        </div>

        <div className="mb-[14px] grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-[14px] max-[1080px]:grid-cols-1">
          <div className={cardClass}>
            <div className="mb-4 flex items-center justify-between font-['Syne',sans-serif] text-[14px] font-bold text-[var(--white)]">
              Leads This Month
              <span className="font-['DM_Sans',sans-serif] text-[11px] font-normal text-[var(--muted)]">
                Daily capture
              </span>
            </div>
            <div className="flex h-20 items-end gap-1">
              {chartHeights.map((height, index) => (
                <div
                  key={`${height}-${index}`}
                  className={cn(
                    "min-h-1 flex-1 rounded-t-[3px] bg-[var(--subtle)] transition-colors duration-300",
                    index >= chartHeights.length - 2 && "bg-[var(--amber)]",
                  )}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          <div className={cardClass}>
            <div className="mb-4 font-['Syne',sans-serif] text-[14px] font-bold text-[var(--white)]">
              Live Activity
            </div>
            <div className="flex flex-col">
              {activityItems.map((item, index) => (
                <div
                  key={`${item.text}-${item.time}`}
                  className={cn(
                    "flex items-center gap-[10px] py-[9px] text-[12px]",
                    index !== activityItems.length - 1 && "border-b border-[var(--border)]",
                    "max-[720px]:flex-wrap max-[720px]:items-start",
                  )}
                >
                  <div
                    className="h-[7px] w-[7px] shrink-0 rounded-full"
                    style={{ background: item.color }}
                  />
                  <span className="flex-1 text-[var(--text)]">{item.text}</span>
                  <span className="font-['JetBrains_Mono',monospace] text-[10px] text-[var(--muted)] max-[720px]:pl-[17px]">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-[14px] rounded-[10px] border border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.06)] px-[18px] py-4 max-[1080px]:flex-wrap max-[1080px]:items-start">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[rgba(245,166,35,0.4)] bg-[linear-gradient(135deg,rgba(245,166,35,0.3),rgba(245,166,35,0.1))] text-[20px]">
            🤖
            <div className="absolute inset-[-4px] animate-pulse rounded-full border border-[rgba(16,185,129,0.4)]" />
          </div>
          <div className="flex-1">
            <div className="mb-[2px] text-[14px] font-semibold text-[var(--white)]">
              Nova is active and answering calls
            </div>
            <div className="text-[11px] text-[var(--muted)]">
              AI receptionist · ElevenLabs voice · 24/7 coverage
            </div>
          </div>
          <div className="flex flex-wrap gap-4 max-[1080px]:w-full">
            <Stat value="189" label="Calls this month" />
            <Stat value="98%" label="Handled" />
            <Stat value="4.9★" label="Satisfaction" />
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <div className="font-['Syne',sans-serif] text-[16px] font-extrabold text-[var(--green)]">
        {value}
      </div>
      <div className="text-[10px] text-[var(--muted)]">{label}</div>
    </div>
  );
}
