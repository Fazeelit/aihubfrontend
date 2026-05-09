"use client";

import {
  billingCycles,
  getPlanPeriod,
  getPlanPrice,
  getPlanYearlyTotal,
  pricingPlans,
} from "@/dashboard/components/pricing";
import { cn } from "@/dashboard/components/dashboardUtils";

export default function BillingSettings({
  billingCycle,
  currentPlan,
  currentPlanPeriod,
  currentPlanPrice,
  onBillingCycleChange,
  onPlanChange,
}) {
  const yearlyCycle = billingCycles.yearly;

  return (
    <div className="space-y-6">
      <div className="rounded-[10px] border border-[var(--border2)] bg-[linear-gradient(135deg,rgba(245,166,35,0.14),rgba(34,211,238,0.05))] p-5">
        <div className="flex items-start justify-between gap-4 max-[720px]:flex-col">
          <div>
            <div className="mb-2 font-['JetBrains_Mono',monospace] text-[11px] font-semibold uppercase tracking-[1px] text-[var(--amber)]">
              Active Plan
            </div>
            <div className="font-['Syne',sans-serif] text-[24px] font-bold text-[var(--white)]">
              {currentPlan.name}
            </div>
            <div className="mt-2 max-w-[460px] text-[13px] leading-6 text-[var(--text)]">
              {currentPlan.description}
            </div>
          </div>

          <div className="min-w-[190px] rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[rgba(6,9,17,0.55)] p-4">
            <div className="text-[11px] uppercase tracking-[1px] text-[var(--muted)]">Current bill</div>
            <div className="mt-2 font-['Syne',sans-serif] text-[34px] font-bold leading-none text-[var(--white)]">
              ${currentPlanPrice}
            </div>
            <div className="mt-2 text-[12px] text-[var(--muted)]">{currentPlanPeriod}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 max-[900px]:flex-col max-[900px]:items-start">
        <div>
          <div className="font-['JetBrains_Mono',monospace] text-[12px] font-semibold uppercase tracking-[1px] text-[var(--muted)]">
            Billing Cycle
          </div>
          <div className="mt-2 text-[13px] text-[var(--muted)]">
            Annual billing keeps the same plans and applies the landing page discount logic.
          </div>
        </div>

        <div className="inline-flex rounded-full border border-[var(--border2)] bg-[var(--bg)] p-1">
          {Object.values(billingCycles).map((cycle) => (
            <button
              key={cycle.id}
              type="button"
              className={cn(
                "rounded-full px-4 py-2 text-[12px] font-semibold transition-all duration-200",
                billingCycle === cycle.id
                  ? "bg-[var(--amber)] text-[var(--bg)]"
                  : "text-[var(--muted)] hover:text-[var(--text)]",
              )}
              onClick={() => onBillingCycleChange(cycle.id)}
            >
              {cycle.label}
              {cycle.discountLabel ? ` - ${cycle.discountLabel}` : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 min-[1100px]:grid-cols-3">
        {pricingPlans.map((plan) => {
          const isCurrent = currentPlan.id === plan.id;
          const planPrice = getPlanPrice(plan, billingCycle);
          const planPeriod = getPlanPeriod(billingCycle);
          const yearlyTotal =
            billingCycle === yearlyCycle.id ? getPlanYearlyTotal(plan) : null;

          return (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-[16px] border bg-[var(--bg)] p-5 transition-all duration-200",
                plan.featured
                  ? "border-[var(--amber)] shadow-[0_0_32px_rgba(245,166,35,0.14)]"
                  : "border-[var(--border)]",
                isCurrent && "ring-1 ring-[var(--cyan)]",
              )}
            >
              {plan.featured ? (
                <div className="absolute -top-3 left-5 rounded-full bg-[var(--amber)] px-3 py-1 font-['JetBrains_Mono',monospace] text-[10px] uppercase tracking-[1px] text-[var(--bg)]">
                  Most popular
                </div>
              ) : null}

              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <div
                    className={cn(
                      "font-['Syne',sans-serif] text-[20px] font-bold",
                      plan.featured ? "text-[var(--amber)]" : "text-[var(--white)]",
                    )}
                  >
                    {plan.name}
                  </div>
                  <div className="mt-2 text-[12px] leading-5 text-[var(--muted)]">
                    {plan.description}
                  </div>
                </div>
                {isCurrent ? (
                  <span className="rounded-full bg-[rgba(34,211,238,0.1)] px-3 py-1 text-[10px] uppercase tracking-[1px] text-[var(--cyan)]">
                    Current
                  </span>
                ) : null}
              </div>

              <div className="mb-1 font-['Syne',sans-serif] text-[40px] font-bold leading-none text-[var(--white)]">
                <span className="mr-1 align-top text-[18px] text-[var(--muted)]">$</span>
                {planPrice}
              </div>
              <div className="text-[12px] text-[var(--muted)]">{planPeriod}</div>
              {yearlyTotal ? (
                <div className="mt-2 text-[11px] text-[var(--green)]">
                  ${yearlyTotal}/year charged annually
                </div>
              ) : null}

              <div className="my-5 h-px bg-[var(--border)]" />

              <ul className="space-y-3">
                {plan.features.map((feature, index) => {
                  const isMuted = typeof feature === "object";
                  const label = isMuted ? feature.text : feature;

                  return (
                    <li key={`${plan.id}-${index}`} className="flex items-start gap-2 text-[13px]">
                      <span className="mt-[2px] text-[var(--green)]">+</span>
                      <span className={isMuted ? "text-[var(--border3)]" : "text-[var(--text)]"}>
                        {label}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <button
                type="button"
                className={cn(
                  "mt-6 w-full rounded-[10px] px-4 py-3 font-['Syne',sans-serif] text-[14px] font-bold transition-colors duration-200",
                  isCurrent
                    ? "border border-[var(--border2)] bg-transparent text-[var(--muted)]"
                    : plan.featured
                      ? "bg-[var(--amber)] text-[var(--bg)] hover:bg-[var(--amber2)]"
                      : "border border-[var(--border2)] bg-transparent text-[var(--text)] hover:border-[var(--amber)] hover:text-[var(--amber)]",
                )}
                onClick={() => onPlanChange(plan.id)}
              >
                {isCurrent ? "Current Plan" : plan.ctaLabel}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
