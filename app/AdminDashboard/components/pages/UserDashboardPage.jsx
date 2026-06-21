"use client";

import {
  Bot,
  CalendarClock,
  CreditCard,
  Layers3,
  Settings2,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { useAdminWorkspace } from "../AdminWorkspaceProvider";

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatLabel(value) {
  return String(value || "Not set")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function InfoCard({ title, value, description, icon: Icon, tone }) {
  return (
    <article className="rounded-[26px] border border-slate-200 bg-white/90 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur">
      <div className={`inline-flex rounded-2xl bg-gradient-to-br p-2.5 text-slate-950 ${tone}`}>
        <Icon size={18} />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {title}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}

export default function UserDashboardPage() {
  const workspace = useAdminWorkspace();
  const planName = String(workspace.selectedPlanId || "pro").toUpperCase();
  const billingCycle = formatLabel(workspace.billingCycle);
  const activePanel = formatLabel(workspace.activePanel);
  const planExpiry = formatDate(workspace.estimatedRenewalAt);

  const summaryCards = [
    {
      title: "Selected AI Plan",
      value: planName,
      description: "Mapped from the user dashboard preference state.",
      icon: WalletCards,
      tone: "from-amber-300 via-orange-300 to-yellow-300",
    },
    {
      title: "Billing Cycle",
      value: billingCycle,
      description: "Reflects how the user subscription is currently billed.",
      icon: CreditCard,
      tone: "from-cyan-300 via-sky-300 to-blue-300",
    },
    {
      title: "Plan Expiry",
      value: planExpiry,
      description: "Estimated from the current billing cycle and latest dashboard sync.",
      icon: CalendarClock,
      tone: "from-emerald-300 via-lime-300 to-emerald-500",
    },
    {
      title: "Active Panel",
      value: activePanel,
      description: "Shows where the user last focused inside the main dashboard.",
      icon: Layers3,
      tone: "from-rose-200 via-fuchsia-200 to-violet-200",
    },
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-[30px] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">
          User Dashboard Mapping
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          Subscription, setup, and assistant preferences in one admin view
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          This page mirrors the important information the user configures across onboarding
          and the main dashboard, so admins can review plan selection, billing rhythm,
          workspace setup, assistant configuration, and automation readiness without
          changing the customer-facing experience.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[30px] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Settings2 size={16} className="text-cyan-600" />
            Workspace Settings
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Business Name</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{workspace.businessName}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Business Type</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{workspace.businessType}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Onboarding Status</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {formatLabel(workspace.onboardingStatus)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Go Live</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {workspace.isLive ? "Live" : "Pending"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Bot size={16} className="text-amber-600" />
            Assistant Profile
          </div>
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Greeting</p>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-900">
                {workspace.greeting || "No custom greeting configured yet."}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Voice Settings</p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {workspace.selectedVoiceSettings.length
                  ? workspace.selectedVoiceSettings.map((item) => item.value).join(" / ")
                  : "Default voice profile"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-[30px] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Sparkles size={16} className="text-emerald-600" />
            Automation Readiness
          </div>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Enabled Automations</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {workspace.enabledAutomations.length}/{workspace.automations.length || 0}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Admin view of the automation toggles coming from the user dashboard preferences.
            </p>
          </div>
          <div className="mt-4 space-y-3">
            {workspace.automations.length ? (
              workspace.automations.map((automation) => (
                <div
                  key={automation.id || automation.title}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {automation.title || automation.id || "Automation"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {automation.description || "Dashboard automation preference"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      automation.enabled
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {automation.enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                No automation preferences are available yet.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Settings2 size={16} className="text-fuchsia-600" />
            Connected Services
          </div>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Connected Integrations</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {workspace.connectedIntegrations.length}/{workspace.integrations.length || 0}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Synced from onboarding so admins can validate operational readiness.
            </p>
          </div>
          <div className="mt-4 space-y-3">
            {workspace.integrations.length ? (
              workspace.integrations.map((integration) => (
                <div
                  key={integration.id || integration.name}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{integration.name}</p>
                    <p className="text-xs text-slate-500">
                      {integration.desc || "Onboarding integration mapping"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      integration.connected
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {integration.connected ? "Connected" : "Pending"}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                No integrations have been configured yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
