import {
  crmMetrics,
  leadActivities,
  leadPipeline,
} from "@/dashboard/components/dashboardData";
import {
  cardClass,
  contentClass,
  headerClass,
} from "@/dashboard/components/dashboardTheme";
import { cn } from "@/dashboard/components/dashboardUtils";

export default function LeadsPanel() {
  return (
    <>
      <div className={headerClass}>
        <div>
          <div className="font-['Syne',sans-serif] text-[20px] font-extrabold tracking-[-0.5px] text-[var(--white)]">
            Leads & CRM
          </div>
          <div className="mt-[2px] text-[12px] text-[var(--muted)] max-[720px]:text-[11px]">
            AI-assisted pipeline, smart follow-up, and booking visibility
          </div>
        </div>
        <div className="flex items-center gap-2 max-[1080px]:w-full max-[1080px]:flex-wrap">
          <span className="inline-flex items-center gap-[6px] rounded-[4px] bg-[rgba(16,185,129,0.1)] px-[10px] py-1 font-['JetBrains_Mono',monospace] text-[10px] text-[var(--green)] max-[720px]:w-full max-[720px]:justify-center">
            ● AI lead routing active
          </span>
          <button
            type="button"
            className="cursor-pointer rounded-[6px] bg-[var(--amber)] px-[14px] py-[6px] text-[12px] font-semibold text-[var(--bg)] transition-colors duration-200 hover:bg-[var(--amber2)] max-[720px]:w-full"
          >
            + Add Lead
          </button>
        </div>
      </div>

      <div className={contentClass}>
        <div className="mb-5 grid grid-cols-4 gap-[14px] max-[1080px]:grid-cols-1 max-[720px]:gap-[10px]">
          {crmMetrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-[18px]"
            >
              <div className="mb-2 font-['JetBrains_Mono',monospace] text-[9px] uppercase tracking-[2px] text-[var(--muted)]">
                {metric.label}
              </div>
              <div className={cn("mb-1 font-['Syne',sans-serif] text-[28px] font-extrabold tracking-[-1px]", getMetricTone(metric.tone))}>
                {metric.value}
              </div>
              <div className="text-[11px] text-[var(--muted)]">{metric.detail}</div>
            </div>
          ))}
        </div>

        <div className="mb-[14px] grid grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)] gap-[14px] max-[1200px]:grid-cols-1">
          <div className={cn(cardClass, "overflow-hidden")}>
            <div className="mb-4 flex items-center justify-between">
              <div className="font-['Syne',sans-serif] text-[14px] font-bold text-[var(--white)]">
                Pipeline Overview
              </div>
              <span className="font-['JetBrains_Mono',monospace] text-[10px] uppercase tracking-[1px] text-[var(--muted)]">
                AI prioritized
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 max-[1080px]:grid-cols-1">
              {leadPipeline.map((column) => (
                <div
                  key={column.id}
                  className="rounded-[10px] border border-[var(--border)] bg-[var(--bg)] p-3"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[13px] font-semibold text-[var(--white)]">
                        {column.title}
                      </div>
                      <div className="mt-1 text-[10px] text-[var(--muted)]">
                        Est. value {column.value}
                      </div>
                    </div>
                    <span className="rounded-full bg-[rgba(245,166,35,0.12)] px-2.5 py-1 font-['JetBrains_Mono',monospace] text-[10px] text-[var(--amber)]">
                      {column.count}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {column.leads.map((lead) => (
                      <div
                        key={lead.id}
                        className="rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-3 transition-colors duration-200 hover:border-[var(--border2)]"
                      >
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <div>
                            <div className="text-[13px] font-semibold text-[var(--white)]">
                              {lead.name}
                            </div>
                            <div className="mt-1 text-[10px] text-[var(--muted)]">
                              {lead.source}
                            </div>
                          </div>
                          <span className={cn("rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.8px]", getLeadBadgeClass(lead.priority))}>
                            {lead.priority}
                          </span>
                        </div>
                        <div className="mb-2 text-[11px] text-[var(--text)]">{lead.status}</div>
                        <div className="mb-2 text-[10px] text-[var(--muted)]">
                          Interested in: {lead.packageInterest}
                        </div>
                        <div className="rounded-[8px] bg-[rgba(255,255,255,0.02)] px-2.5 py-2 text-[10px] text-[var(--muted)]">
                          Next step: {lead.nextStep}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-[14px]">
            <div className={cardClass}>
              <div className="mb-4 font-['Syne',sans-serif] text-[14px] font-bold text-[var(--white)]">
                AI Recommendations
              </div>
              <div className="space-y-3">
                <Insight
                  title="Call hot leads within 15 minutes"
                  body="3 incoming leads are marked hot and likely to book if contacted before the end of today."
                  tone="amber"
                />
                <Insight
                  title="Trigger no-show prevention flow"
                  body="7 booked students have not confirmed lesson reminders. Send Nova SMS confirmation sequence."
                  tone="cyan"
                />
                <Insight
                  title="Upsell Road Test Ready package"
                  body="4 qualified leads asked about test prep. AI recommends bundling accompaniment plus final lesson."
                  tone="green"
                />
              </div>
            </div>

            <div className={cardClass}>
              <div className="mb-4 font-['Syne',sans-serif] text-[14px] font-bold text-[var(--white)]">
                Recent CRM Activity
              </div>
              <div className="flex flex-col">
                {leadActivities.map((item, index) => (
                  <div
                    key={`${item.text}-${item.time}`}
                    className={cn(
                      "flex items-center gap-[10px] py-[9px] text-[12px]",
                      index !== leadActivities.length - 1 && "border-b border-[var(--border)]",
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
        </div>
      </div>
    </>
  );
}

function getMetricTone(tone) {
  if (tone === "amber") return "text-[var(--amber)]";
  if (tone === "green") return "text-[var(--green)]";
  if (tone === "cyan") return "text-[var(--cyan)]";
  return "text-[var(--purple)]";
}

function getLeadBadgeClass(priority) {
  if (priority === "Hot") {
    return "bg-[rgba(239,68,68,0.12)] text-[var(--red)]";
  }

  if (priority === "Warm") {
    return "bg-[rgba(245,166,35,0.12)] text-[var(--amber)]";
  }

  return "bg-[rgba(16,185,129,0.12)] text-[var(--green)]";
}

function Insight({ body, title, tone }) {
  return (
    <div className="rounded-[10px] border border-[var(--border)] bg-[var(--bg)] p-3">
      <div className={cn("mb-1 text-[12px] font-semibold", getMetricTone(tone))}>{title}</div>
      <div className="text-[11px] leading-[1.6] text-[var(--muted)]">{body}</div>
    </div>
  );
}
