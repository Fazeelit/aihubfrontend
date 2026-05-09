import BillingSettings from "@/dashboard/components/BillingSettings";
import { contentClass, headerClass } from "@/dashboard/components/dashboardTheme";

export default function BillingPanel({
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
  return (
    <>
      <div className={headerClass}>
        <div>
          <div className="font-['Syne',sans-serif] text-[20px] font-extrabold tracking-[-0.5px] text-[var(--white)]">
            Billing
          </div>
          <div className="mt-[2px] text-[12px] text-[var(--muted)] max-[720px]:text-[11px]">
            Manage plan, payments, invoices, and renewal settings
          </div>
        </div>
      </div>

      <div className={contentClass}>
        <BillingSettings
          billingCycle={billingCycle}
          billingProfile={billingProfile}
          currentPlan={currentPlan}
          currentPlanPeriod={currentPlanPeriod}
          currentPlanPrice={currentPlanPrice}
          onBillingCycleChange={onBillingCycleChange}
          onBillingProfileChange={onBillingProfileChange}
          onPaymentMethodChange={onPaymentMethodChange}
          onPlanChange={onPlanChange}
          onSaveBillingProfile={onSaveBillingProfile}
        />
      </div>
    </>
  );
}
