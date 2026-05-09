import { recentCalls } from "@/dashboard/components/dashboardData";
import {
  cardClass,
  contentClass,
  headerClass,
} from "@/dashboard/components/dashboardTheme";
import { cn } from "@/dashboard/components/dashboardUtils";

export default function NovaPanel() {
  return (
    <>
      <div className={headerClass}>
        <div>
          <div className="font-['Syne',sans-serif] text-[20px] font-extrabold tracking-[-0.5px] text-[var(--white)]">
            Nova - AI Receptionist
          </div>
          <div className="mt-[2px] text-[12px] text-[var(--muted)] max-[720px]:text-[11px]">
            ElevenLabs Voice AI · Live 24/7
          </div>
        </div>
        <div className="flex items-center gap-2 max-[1080px]:w-full max-[1080px]:flex-wrap">
          <span className="inline-flex items-center gap-[6px] rounded-[4px] bg-[rgba(16,185,129,0.1)] px-3 py-[5px] text-[11px] text-[var(--green)] max-[720px]:w-full max-[720px]:justify-center">
            ● Active &amp; Answering
          </span>
        </div>
      </div>

      <div className={contentClass}>
        <div className="grid grid-cols-2 gap-[14px] max-[1080px]:grid-cols-1">
          <div className={cardClass}>
            <div className="mb-4 font-['Syne',sans-serif] text-[14px] font-bold text-[var(--white)]">
              Nova Status
            </div>
            <div className="mb-4 flex items-center gap-[14px] rounded-[10px] border border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.06)] px-[18px] py-4 max-[1080px]:flex-wrap max-[1080px]:items-start">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[rgba(245,166,35,0.4)] bg-[linear-gradient(135deg,rgba(245,166,35,0.3),rgba(245,166,35,0.1))] text-[20px]">
                🤖
                <div className="absolute inset-[-4px] animate-pulse rounded-full border border-[rgba(16,185,129,0.4)]" />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-[var(--white)]">Nova is live</div>
                <div className="text-[11px] text-[var(--green)]">Answering calls right now</div>
              </div>
            </div>
            <div className="flex flex-col gap-[10px]">
              <Row label="Voice Style" value="Friendly & Professional" badge="ElevenLabs" />
              <Row label="Coverage" value={null} badge="24/7" badgeGreen />
              <Row label="Language" value="English (US)" />
            </div>
          </div>

          <div className={cardClass}>
            <div className="mb-4 font-['Syne',sans-serif] text-[14px] font-bold text-[var(--white)]">
              This Month
            </div>
            <div className="grid grid-cols-2 gap-[10px] max-[1080px]:grid-cols-1">
              <Metric accent="var(--green)" label="Calls Handled" value="189" valueClass="text-[var(--green)]" />
              <Metric accent="var(--amber)" label="Leads Captured" value="143" valueClass="text-[var(--amber)]" />
              <Metric accent="var(--cyan)" label="Avg Call Length" value="2.4m" valueClass="text-[var(--cyan)]" />
              <Metric accent="var(--purple)" label="Satisfaction" value="4.9★" valueClass="text-[var(--purple)]" />
            </div>
          </div>
        </div>

        <div className={cn(cardClass, "mt-[14px]")}>
          <div className="mb-4 font-['Syne',sans-serif] text-[14px] font-bold text-[var(--white)]">
            Recent Calls
          </div>
          <div className="flex flex-col">
            {recentCalls.map((item, index) => (
              <div
                key={`${item.text}-${item.time}`}
                className={cn(
                  "flex items-center gap-[10px] py-[9px] text-[12px]",
                  index !== recentCalls.length - 1 && "border-b border-[var(--border)]",
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
    </>
  );
}

function Metric({ accent, label, value, valueClass }) {
  return (
    <div
      className="relative overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-[18px] before:absolute before:bottom-0 before:left-0 before:top-0 before:w-[3px] before:content-['']"
      style={{ "--accent": accent }}
    >
      <div className="before:bg-[var(--accent)]" />
      <div
        className="pointer-events-none absolute bottom-0 left-0 top-0 w-[3px]"
        style={{ background: "var(--accent)" }}
      />
      <div className="mb-2 font-['JetBrains_Mono',monospace] text-[9px] uppercase tracking-[2px] text-[var(--muted)]">
        {label}
      </div>
      <div className={cn("font-['Syne',sans-serif] text-[22px] font-extrabold", valueClass)}>
        {value}
      </div>
    </div>
  );
}

function Row({ badge, badgeGreen = false, label, value }) {
  return (
    <div className="flex items-center justify-between gap-[14px] border-b border-[var(--border)] py-3 last:border-b-0 max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-2">
      <div>
        <div className="text-[13px] text-[var(--text)]">{label}</div>
        {value ? <div className="mt-[2px] text-[11px] text-[var(--muted)]">{value}</div> : null}
      </div>
      {badge ? (
        <span
          className={cn(
            "inline-flex items-center gap-[6px] rounded-[4px] px-[10px] py-[3px] font-['JetBrains_Mono',monospace] text-[10px]",
            badgeGreen
              ? "bg-[rgba(16,185,129,0.1)] text-[var(--green)]"
              : "border border-[rgba(245,166,35,0.2)] bg-[rgba(245,166,35,0.1)] text-[var(--amber)]",
          )}
        >
          {badge}
        </span>
      ) : (
        <span className="text-[12px] text-[var(--muted)]">{value}</span>
      )}
    </div>
  );
}
