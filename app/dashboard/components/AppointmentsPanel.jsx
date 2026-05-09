import {
  appointmentAlerts,
  appointmentMetrics,
  instructorSchedule,
  todaysAppointments,
} from "@/dashboard/components/dashboardData";
import {
  cardClass,
  contentClass,
  headerClass,
} from "@/dashboard/components/dashboardTheme";
import { cn } from "@/dashboard/components/dashboardUtils";

export default function AppointmentsPanel() {
  return (
    <>
      <div className={headerClass}>
        <div>
          <div className="font-['Syne',sans-serif] text-[20px] font-extrabold tracking-[-0.5px] text-[var(--white)]">
            Appointments
          </div>
          <div className="mt-[2px] text-[12px] text-[var(--muted)] max-[720px]:text-[11px]">
            Lesson schedule, instructor availability, and smart confirmations
          </div>
        </div>
        <div className="flex items-center gap-2 max-[1080px]:w-full max-[1080px]:flex-wrap">
          <span className="inline-flex items-center gap-[6px] rounded-[4px] bg-[rgba(16,185,129,0.1)] px-[10px] py-1 font-['JetBrains_Mono',monospace] text-[10px] text-[var(--green)] max-[720px]:w-full max-[720px]:justify-center">
            ● Reminder automations active
          </span>
          <button
            type="button"
            className="cursor-pointer rounded-[6px] bg-[var(--amber)] px-[14px] py-[6px] text-[12px] font-semibold text-[var(--bg)] transition-colors duration-200 hover:bg-[var(--amber2)] max-[720px]:w-full"
          >
            + Book Lesson
          </button>
        </div>
      </div>

      <div className={contentClass}>
        <div className="mb-5 grid grid-cols-4 gap-[14px] max-[1080px]:grid-cols-1 max-[720px]:gap-[10px]">
          {appointmentMetrics.map((metric) => (
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

        <div className="mb-[14px] grid grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)] gap-[14px] max-[1200px]:grid-cols-1">
          <div className={cardClass}>
            <div className="mb-4 flex items-center justify-between">
              <div className="font-['Syne',sans-serif] text-[14px] font-bold text-[var(--white)]">
                Today&apos;s Appointments
              </div>
              <span className="font-['JetBrains_Mono',monospace] text-[10px] uppercase tracking-[1px] text-[var(--muted)]">
                Live schedule
              </span>
            </div>

            <div className="space-y-3">
              {todaysAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-[10px] border border-[var(--border)] bg-[var(--bg)] p-4 transition-colors duration-200 hover:border-[var(--border2)]"
                >
                  <div className="mb-3 flex items-start justify-between gap-3 max-[720px]:flex-col">
                    <div>
                      <div className="font-['Syne',sans-serif] text-[18px] font-bold text-[var(--white)]">
                        {appointment.time}
                      </div>
                      <div className="mt-1 text-[13px] text-[var(--text)]">
                        {appointment.student}
                      </div>
                    </div>
                    <span className={cn("rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.8px]", getAppointmentStatusClass(appointment.status))}>
                      {appointment.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px] text-[var(--muted)] max-[720px]:grid-cols-1">
                    <Info label="Instructor" value={appointment.instructor} />
                    <Info label="Lesson Type" value={appointment.type} />
                    <Info label="Location" value={appointment.location} />
                    <Info label="AI Support" value="Reminder + route tracking enabled" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-[14px]">
            <div className={cardClass}>
              <div className="mb-4 font-['Syne',sans-serif] text-[14px] font-bold text-[var(--white)]">
                Instructor Schedule
              </div>
              <div className="space-y-3">
                {instructorSchedule.map((instructor) => (
                  <div
                    key={instructor.id}
                    className="rounded-[10px] border border-[var(--border)] bg-[var(--bg)] p-3"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="text-[13px] font-semibold text-[var(--white)]">
                        {instructor.name}
                      </div>
                      <span className="text-[10px] text-[var(--green)]">
                        {instructor.utilization}
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--muted)]">{instructor.lessons}</div>
                    <div className="mt-2 rounded-[8px] bg-[rgba(255,255,255,0.02)] px-2.5 py-2 text-[10px] text-[var(--muted)]">
                      Next open slot: {instructor.nextSlot}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={cardClass}>
              <div className="mb-4 font-['Syne',sans-serif] text-[14px] font-bold text-[var(--white)]">
                AI Scheduling Insights
              </div>
              <div className="space-y-3">
                {appointmentAlerts.map((alert) => (
                  <Insight
                    key={alert.title}
                    body={alert.body}
                    title={alert.title}
                    tone={alert.tone}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div className="mb-1 font-['JetBrains_Mono',monospace] text-[9px] uppercase tracking-[1px] text-[var(--subtle)]">
        {label}
      </div>
      <div className="text-[12px] text-[var(--text)]">{value}</div>
    </div>
  );
}

function getMetricTone(tone) {
  if (tone === "amber") return "text-[var(--amber)]";
  if (tone === "green") return "text-[var(--green)]";
  if (tone === "cyan") return "text-[var(--cyan)]";
  return "text-[var(--purple)]";
}

function getAppointmentStatusClass(status) {
  if (status === "Confirmed") {
    return "bg-[rgba(16,185,129,0.12)] text-[var(--green)]";
  }

  if (status === "In Progress") {
    return "bg-[rgba(34,211,238,0.12)] text-[var(--cyan)]";
  }

  return "bg-[rgba(245,166,35,0.12)] text-[var(--amber)]";
}

function Insight({ body, title, tone }) {
  return (
    <div className="rounded-[10px] border border-[var(--border)] bg-[var(--bg)] p-3">
      <div className={cn("mb-1 text-[12px] font-semibold", getMetricTone(tone))}>{title}</div>
      <div className="text-[11px] leading-[1.6] text-[var(--muted)]">{body}</div>
    </div>
  );
}
