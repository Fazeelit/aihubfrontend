"use client";

import { CheckCircle2, KeyRound, ShieldCheck, Sparkles } from "lucide-react";
import { useAdminWorkspace } from "../AdminWorkspaceProvider";
import { adminRoutes } from "../adminRoutes";

export default function RolesPage() {
  const workspace = useAdminWorkspace();

  const governanceCards = [
    {
      title: "Current Admin Role",
      value: workspace.role || "admin",
      note: "Derived from the authenticated user session in the shared auth model.",
      icon: ShieldCheck,
      tone: "from-amber-300 via-orange-300 to-amber-500",
    },
    {
      title: "Launch Responsibility",
      value: workspace.isLive ? "Maintain" : "Prepare",
      note: "Mapped from onboarding status and live readiness in the onboarding schema.",
      icon: Sparkles,
      tone: "from-cyan-300 via-sky-300 to-blue-300",
    },
    {
      title: "Account Coverage",
      value: `${workspace.adminUsers}/${workspace.totalUsers || 0}`,
      note: "Admin-account count across the visible user records.",
      icon: CheckCircle2,
      tone: "from-emerald-300 via-lime-300 to-emerald-500",
    },
  ];

  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-3">
        {governanceCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.title}
              className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur"
            >
              <div className={`inline-flex rounded-2xl bg-gradient-to-br p-2.5 text-slate-950 ${card.tone}`}>
                <Icon size={18} />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {card.title}
              </p>
              <p className="mt-2 text-2xl font-semibold capitalize tracking-tight text-slate-900">
                {card.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{card.note}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[30px] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
            Governance Model
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            Role access is interpreted through the app setup lifecycle
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            The current app backend exposes `user` and `admin` roles at the account level.
            In this redesigned admin area, that role is contextualized with onboarding
            completion, dashboard preferences, integrations, and launch readiness so admins
            can govern both access and product adoption together.
          </p>

          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Current Workspace Role</p>
              <p className="mt-2 text-sm font-medium capitalize text-slate-900">
                {workspace.role || "admin"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Onboarding Context</p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                Step {workspace.onboardingStep} | {String(workspace.onboardingStatus || "in_progress").replace("_", " ")}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Operational Focus</p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {workspace.activePanel || "overview"} | {workspace.selectedBusinessName}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <KeyRound size={16} className="text-cyan-600" />
            Admin Responsibilities Across The Workspace
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {adminRoutes.map((route) => {
              const Icon = route.icon;

              return (
                <article
                  key={route.path}
                  className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm"
                >
                  <div className={`inline-flex rounded-2xl bg-gradient-to-br p-2.5 text-slate-950 ${route.accent}`}>
                    <Icon size={18} />
                  </div>
                  <p className="mt-4 text-lg font-semibold text-slate-900">{route.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{route.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
