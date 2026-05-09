// components/Pricing.jsx
"use client";

import PropTypes from "prop-types";

import { getPlanPeriod, getPlanPrice, pricingPlans } from "@/dashboard/components/pricing";

export default function Pricing({ openModal }) {
  return (
    <section id="pricing" className="max-w-6xl mx-auto py-20 px-6 md:px-12">
      <div className="font-mono-custom text-[10px] text-[#F5A623] uppercase tracking-[3px] mb-4">
        Pricing
      </div>
      <h2 className="font-syne text-[clamp(32px,4vw,52px)] font-extrabold tracking-tighter text-white mb-4">
        Simple pricing.
        <br />
        <em className="text-[#F5A623] not-italic">No surprises.</em>
      </h2>
      <p className="text-base text-[#64748B] max-w-[500px] mb-12">
        Start free, scale when you&apos;re ready. Every plan includes onboarding support and a
        30-day money-back guarantee.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {pricingPlans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} openModal={openModal} />
        ))}
      </div>
    </section>
  );
}

Pricing.propTypes = {
  openModal: PropTypes.func.isRequired,
};

function PricingCard({ plan, openModal }) {
  return (
    <div
      className={`relative rounded-2xl border bg-[#0C1220] p-8 transition-all hover:-translate-y-1 hover:border-[#243050] hover:shadow-2xl md:p-9 ${
        plan.featured
          ? "border-[#F5A623] shadow-[0_0_40px_rgba(245,166,35,0.15)]"
          : "border-[#1A2540]"
      }`}
    >
      {plan.featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#F5A623] px-4 py-1 font-mono-custom text-[9px] font-medium uppercase tracking-wider text-[#060911]">
          Most Popular
        </div>
      )}
      <div
        className={`mb-4 font-syne text-[15px] font-bold uppercase tracking-wider ${
          plan.featured ? "text-[#F5A623]" : "text-[#64748B]"
        }`}
      >
        {plan.name}
      </div>
      <div className="font-syne text-[52px] font-extrabold leading-none tracking-tighter text-white">
        <sup className="align-top text-[22px] font-semibold text-[#64748B]">$</sup>
        {getPlanPrice(plan)}
      </div>
      <div className="mt-1 mb-6 text-[13px] text-[#64748B]">{getPlanPeriod()}</div>
      <div className="mb-6 h-px bg-[#1A2540]" />
      <ul className="mb-8 flex flex-col gap-3">
        {plan.features.map((feature, idx) => {
          const isMuted = typeof feature === "object";
          const text = isMuted ? feature.text : feature;

          return (
            <li key={idx} className="flex items-start gap-2 text-[13px] text-[#64748B]">
              <span className="text-sm text-[#10B981]">+</span>
              <span className={isMuted ? "text-[#1E2D42]" : ""}>{text}</span>
            </li>
          );
        })}
      </ul>
      <button
        onClick={() => openModal("signup")}
        className={`w-full rounded-lg py-3 font-syne text-sm font-bold transition-all ${
          plan.featured
            ? "bg-[#F5A623] text-[#060911] shadow-[0_4px_20px_rgba(245,166,35,0.3)] hover:bg-[#E09018] hover:shadow-[0_4px_30px_rgba(245,166,35,0.5)]"
            : "border border-[#243050] bg-transparent text-[#E2E8F0] hover:border-[#F5A623] hover:text-[#F5A623]"
        }`}
      >
        {plan.ctaLabel}
      </button>
    </div>
  );
}

PricingCard.propTypes = {
  plan: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    featured: PropTypes.bool.isRequired,
    ctaLabel: PropTypes.string.isRequired,
    features: PropTypes.array.isRequired,
  }).isRequired,
  openModal: PropTypes.func.isRequired,
};
