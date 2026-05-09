"use client";

import { useMemo } from "react";

import { toast } from "react-hot-toast";

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
  billingProfile,
  currentPlan,
  currentPlanPeriod,
  currentPlanPrice,
  onBillingCycleChange,
  onBillingProfileChange,
  onPaymentMethodChange,
  onPlanChange,
  onSaveBillingProfile,
}) {
  const yearlyCycle = billingCycles.yearly;
  const {
    autopayEnabled = true,
    emailReceipts = true,
    vatNumber = "",
    billingEmail = "billing@smartaihub.com",
    cardholderName = "Hasaan Ali",
    paymentMethod = {
      brand: "Visa",
      last4: "4242",
      expiry: "08/28",
    },
  } = billingProfile ?? {};

  const yearlySavings = useMemo(() => {
    const monthlyTotal = currentPlan.monthlyPrice * 12;
    const yearlyTotal = getPlanYearlyTotal(currentPlan);
    return monthlyTotal - yearlyTotal;
  }, [currentPlan]);

  const billingInsights = useMemo(
    () => [
      {
        label: "Seats Included",
        value:
          currentPlan.capabilities.teamSeats === null
            ? "Unlimited"
            : `${currentPlan.capabilities.teamSeats} seats`,
        tone: "text-[var(--cyan)]",
      },
      {
        label: "Workflow Limit",
        value:
          currentPlan.capabilities.automations === null
            ? "Unlimited"
            : `${currentPlan.capabilities.automations} active`,
        tone: "text-[var(--green)]",
      },
      {
        label: "Voice Receptionist",
        value: currentPlan.capabilities.receptionist ? "Included" : "Upgrade required",
        tone: currentPlan.capabilities.receptionist
          ? "text-[var(--amber)]"
          : "text-[var(--muted)]",
      },
      {
        label: "Document Intelligence",
        value: currentPlan.capabilities.documentIntelligence ? "Enabled" : "Not included",
        tone: currentPlan.capabilities.documentIntelligence
          ? "text-[var(--purple)]"
          : "text-[var(--muted)]",
      },
    ],
    [currentPlan],
  );

  const invoiceHistory = useMemo(
    () => [
      {
        id: "inv-apr-2026",
        label: "April 2026",
        amount: `$${currentPlanPrice}`,
        status: "Paid",
        date: "Apr 01, 2026",
      },
      {
        id: "inv-mar-2026",
        label: "March 2026",
        amount: `$${currentPlanPrice}`,
        status: "Paid",
        date: "Mar 01, 2026",
      },
      {
        id: "inv-feb-2026",
        label: "February 2026",
        amount: `$${currentPlanPrice}`,
        status: "Paid",
        date: "Feb 01, 2026",
      },
    ],
    [currentPlanPrice],
  );

  const nextChargeDate = billingCycle === yearlyCycle.id ? "May 01, 2027" : "Jun 01, 2026";
  const activeCycle = billingCycles[billingCycle] ?? billingCycles.monthly;

  const handleDownloadInvoice = (invoice) => {
    toast.success(`${invoice.label} invoice download started`);
  };

  const handleSaveBillingProfile = () => {
    toast.success("Billing profile updated");
  };

  const handleRefreshCard = () => {
    onPaymentMethodChange(
      "expiry",
      paymentMethod.expiry === "08/28" ? "11/29" : "08/28",
    );
    toast.success("Payment method refreshed");
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[18px] border border-[var(--border2)] bg-[linear-gradient(135deg,rgba(245,166,35,0.16),rgba(34,211,238,0.06),rgba(167,139,250,0.07))] p-5 shadow-[0_24px_80px_rgba(3,7,18,0.35)]">
        <div className="flex items-start justify-between gap-4 max-[900px]:flex-col">
          <div>
            <div className="mb-2 font-['JetBrains_Mono',monospace] text-[11px] font-semibold uppercase tracking-[1px] text-[var(--amber)]">
              Billing Workspace
            </div>
            <div className="font-['Syne',sans-serif] text-[24px] font-bold text-[var(--white)]">
              {currentPlan.name} plan is active
            </div>
            <div className="mt-2 max-w-[460px] text-[13px] leading-6 text-[var(--text)]">
              {currentPlan.description} Manage your billing cycle, payment method, and plan
              changes from one place.
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>Next charge {nextChargeDate}</Badge>
              <Badge subtle>{activeCycle.label} billing</Badge>
              {billingCycle === yearlyCycle.id ? (
                <Badge success>Saving ${yearlySavings}/year</Badge>
              ) : null}
            </div>
          </div>

          <div className="grid min-w-[280px] grid-cols-2 gap-3 max-[900px]:w-full max-[720px]:grid-cols-1">
            <MetricCard
              label="Current bill"
              value={`$${currentPlanPrice}`}
              note={currentPlanPeriod}
              tone="text-[var(--white)]"
            />
            <MetricCard
              label="Annual savings"
              value={billingCycle === yearlyCycle.id ? `$${yearlySavings}` : "$0"}
              note={
                billingCycle === yearlyCycle.id
                  ? "Compared with monthly"
                  : "Switch to yearly to save 20%"
              }
              tone="text-[var(--green)]"
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 max-[900px]:grid-cols-1">
          {billingInsights.map((item) => (
            <div
              key={item.label}
              className="rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[rgba(6,9,17,0.48)] px-4 py-3"
            >
              <div className="text-[10px] uppercase tracking-[1px] text-[var(--muted)]">
                {item.label}
              </div>
              <div className={cn("mt-2 font-['Syne',sans-serif] text-[18px] font-bold", item.tone)}>
                {item.value}
              </div>
            </div>
          ))}
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

      <div className="grid grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] gap-4 max-[1100px]:grid-cols-1">
        <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg2)] p-5">
          <div className="mb-4 flex items-center justify-between gap-3 max-[720px]:flex-col max-[720px]:items-start">
            <div>
              <div className="font-['Syne',sans-serif] text-[18px] font-bold text-[var(--white)]">
                Payment Method
              </div>
              <div className="mt-1 text-[12px] text-[var(--muted)]">
                Keep a primary card on file for renewals and prorated upgrades.
              </div>
            </div>
            <button
              type="button"
              className="rounded-[8px] border border-[var(--border2)] px-4 py-2 text-[12px] font-semibold text-[var(--text)] transition-colors duration-200 hover:border-[var(--amber)] hover:text-[var(--amber)]"
              onClick={handleRefreshCard}
            >
              Refresh Card
            </button>
          </div>

          <div className="rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(145deg,#0f172a,#111927)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-[1px] text-[var(--muted)]">
                  Primary Card
                </div>
                <div className="mt-3 font-['Syne',sans-serif] text-[20px] font-bold text-[var(--white)]">
                  {paymentMethod.brand} ending in {paymentMethod.last4}
                </div>
                <div className="mt-2 text-[12px] text-[var(--muted)]">
                  Expires {paymentMethod.expiry} | Used for subscription renewals
                </div>
              </div>
              <div className="rounded-full bg-[rgba(16,185,129,0.12)] px-3 py-1 text-[10px] uppercase tracking-[1px] text-[var(--green)]">
                Secure
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 max-[720px]:grid-cols-1">
            <Field
              label="Cardholder Name"
              value={cardholderName}
              onChange={(value) => onBillingProfileChange("cardholderName", value)}
              placeholder="Name on card"
            />
            <Field
              label="Billing Email"
              value={billingEmail}
              onChange={(value) => onBillingProfileChange("billingEmail", value)}
              placeholder="billing@company.com"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 max-[720px]:grid-cols-1">
            <ToggleRow
              description="Charge renewals automatically on the due date."
              enabled={autopayEnabled}
              label="Autopay"
              onToggle={() => onBillingProfileChange("autopayEnabled", !autopayEnabled)}
            />
            <ToggleRow
              description="Send receipts and failed-payment alerts to your billing inbox."
              enabled={emailReceipts}
              label="Email Receipts"
              onToggle={() => onBillingProfileChange("emailReceipts", !emailReceipts)}
            />
          </div>

          <div className="mt-4">
            <Field
              label="VAT / Tax ID"
              value={vatNumber}
              onChange={(value) => onBillingProfileChange("vatNumber", value)}
              placeholder="Optional"
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 max-[720px]:flex-col max-[720px]:items-start">
            <div className="text-[12px] text-[var(--muted)]">
              Changes here apply to future invoices and renewal receipts.
            </div>
            <button
              type="button"
              className="rounded-[10px] bg-[var(--amber)] px-5 py-3 font-['Syne',sans-serif] text-[13px] font-bold text-[var(--bg)] transition-colors duration-200 hover:bg-[var(--amber2)]"
              onClick={onSaveBillingProfile ?? handleSaveBillingProfile}
            >
              Save Billing Profile
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg2)] p-5">
            <div className="font-['Syne',sans-serif] text-[18px] font-bold text-[var(--white)]">
              Upcoming Invoice
            </div>
            <div className="mt-4 space-y-3">
              <InvoiceRow label={`${currentPlan.name} Plan`} value={`$${currentPlanPrice}`} />
              <InvoiceRow label="Billing cycle" value={activeCycle.label} />
              <InvoiceRow label="Renewal date" value={nextChargeDate} />
              <InvoiceRow
                label="Projected total"
                value={
                  billingCycle === yearlyCycle.id
                    ? `$${getPlanYearlyTotal(currentPlan)}`
                    : `$${currentPlanPrice}`
                }
                highlight
              />
            </div>
          </div>

          <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg2)] p-5">
            <div className="mb-4 font-['Syne',sans-serif] text-[18px] font-bold text-[var(--white)]">
              Invoice History
            </div>
            <div className="space-y-3">
              {invoiceHistory.map((invoice) => (
                <div
                  key={invoice.id}
                  className="rounded-[12px] border border-[var(--border)] bg-[var(--bg)] px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[13px] font-semibold text-[var(--white)]">
                        {invoice.label}
                      </div>
                      <div className="mt-1 text-[11px] text-[var(--muted)]">
                        {invoice.date}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[13px] font-semibold text-[var(--white)]">
                        {invoice.amount}
                      </div>
                      <div className="mt-1 text-[11px] text-[var(--green)]">
                        {invoice.status}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-3 w-full rounded-[8px] border border-[var(--border2)] px-3 py-2 text-[12px] font-semibold text-[var(--text)] transition-colors duration-200 hover:border-[var(--amber)] hover:text-[var(--amber)]"
                    onClick={() => handleDownloadInvoice(invoice)}
                  >
                    Download PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
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

function Badge({ children, subtle = false, success = false }) {
  return (
    <div
      className={cn(
        "rounded-full px-3 py-1 text-[10px] uppercase tracking-[1px]",
        success
          ? "bg-[rgba(16,185,129,0.12)] text-[var(--green)]"
          : subtle
            ? "bg-[rgba(255,255,255,0.06)] text-[var(--muted)]"
            : "bg-[rgba(245,166,35,0.12)] text-[var(--amber)]",
      )}
    >
      {children}
    </div>
  );
}

function MetricCard({ label, note, tone, value }) {
  return (
    <div className="rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[rgba(6,9,17,0.52)] p-4">
      <div className="text-[10px] uppercase tracking-[1px] text-[var(--muted)]">{label}</div>
      <div className={cn("mt-2 font-['Syne',sans-serif] text-[30px] font-bold", tone)}>
        {value}
      </div>
      <div className="mt-2 text-[12px] text-[var(--muted)]">{note}</div>
    </div>
  );
}

function Field({ label, onChange, placeholder, value }) {
  return (
    <div>
      <label className="mb-[5px] block font-['JetBrains_Mono',monospace] text-[11px] uppercase tracking-[1px] text-[var(--muted)]">
        {label}
      </label>
      <input
        className="w-full rounded-[9px] border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[13px] text-[var(--text)] outline-none transition-colors duration-200 focus:border-[var(--amber)]"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function ToggleRow({ description, enabled, label, onToggle }) {
  return (
    <button
      type="button"
      className="flex items-center justify-between gap-3 rounded-[12px] border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-left transition-colors duration-200 hover:border-[var(--border2)]"
      onClick={onToggle}
    >
      <div>
        <div className="text-[13px] font-semibold text-[var(--white)]">{label}</div>
        <div className="mt-1 text-[11px] leading-5 text-[var(--muted)]">{description}</div>
      </div>
      <div
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
          enabled ? "bg-[var(--green)]" : "bg-[var(--subtle)]",
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-200",
            enabled ? "left-[22px]" : "left-0.5",
          )}
        />
      </div>
    </button>
  );
}

function InvoiceRow({ highlight = false, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3 text-[13px] last:border-b-0 last:pb-0">
      <span className="text-[var(--muted)]">{label}</span>
      <span
        className={cn(
          "font-semibold",
          highlight ? "text-[var(--amber)]" : "text-[var(--white)]",
        )}
      >
        {value}
      </span>
    </div>
  );
}
