"use client";

import {
  Activity,
  CircleUserRound,
  ShieldCheck,
  UserPlus,
  Waves,
} from "lucide-react";
import { useAdminWorkspace } from "../AdminWorkspaceProvider";

function formatDateTime(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatRelativeTone(dateValue) {
  if (!dateValue) {
    return "No recent activity";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "No recent activity";
  }

  const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));

  if (hours < 1) {
    return "Active this hour";
  }

  if (hours < 24) {
    return `Active ${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `Active ${days}d ago`;
}

function StatCard({ title, value, description, icon: Icon, tone }) {
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

export default function Dashboard() {
  const workspace = useAdminWorkspace();
  const latestLogin = workspace.recentLogins[0]?.lastLogin || workspace.lastSyncedAt;
  const workspaceName = "Smart AI Hub";
  const businessName = workspace.businessName || "Nest Driving School";
  const businessType = workspace.businessType || "Driving School";
  const setupLabel = `Step ${workspace.onboardingStep || 0}`;
  const toolsLabel = `${workspace.connectedIntegrations.length}/${workspace.integrations.length || 0}`;

  const statCards = [
    {
      title: "Total Users",
      value: workspace.totalUsers,
      description: "Visible users loaded from the shared account directory.",
      icon: CircleUserRound,
      tone: "from-amber-300 via-orange-300 to-yellow-300",
    },
    {
      title: "Active Users",
      value: workspace.activeUsers,
      description: "Users whose account status is currently active.",
      icon: Activity,
      tone: "from-cyan-300 via-sky-300 to-blue-300",
    },
    {
      title: "Admin Accounts",
      value: workspace.adminUsers,
      description: "Accounts with admin role visibility inside the workspace.",
      icon: ShieldCheck,
      tone: "from-emerald-300 via-lime-300 to-emerald-500",
    },
    {
      title: "Latest Activity",
      value: formatRelativeTone(latestLogin),
      description: "Based on the most recent recorded login timestamp.",
      icon: Waves,
      tone: "from-rose-200 via-fuchsia-200 to-violet-200",
    },
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-[30px] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">
          Overview
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          User activity and workspace health for the admin team
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          This overview keeps the admin focus on people and activity first. It combines
          account records with onboarding and dashboard state so you can quickly see who is
          active, who joined recently, and how ready the workspace is for live usage.
        </p>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[26px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
              Workspace
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-3xl font-semibold tracking-tight">{workspaceName}</p>
              <p className="text-xl font-semibold text-slate-100">{businessName}</p>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-300">
                {businessType}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Status
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-900">
                {workspace.isLive ? "Live" : "Pending"}
              </p>
            </div>
            <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Setup
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-900">{setupLabel}</p>
            </div>
            <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Tools
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-900">{toolsLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[30px] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Activity size={16} className="text-cyan-600" />
            Recent User Activity
          </div>
          <div className="mt-5 space-y-3">
            {workspace.recentLogins.length ? (
              workspace.recentLogins.map((user) => (
                <div
                  key={user._id || user.email}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {user.username || user.email || "Unknown user"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {user.email || "No email"} | {String(user.role || "user").toUpperCase()}
                    </p>
                  </div>
                  <div className="text-sm text-slate-600 md:text-right">
                    <p className="font-medium text-slate-900">{formatDateTime(user.lastLogin)}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {(Array.isArray(user.loginDevices) && user.loginDevices[user.loginDevices.length - 1]) ||
                        "Device not available"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                No recent login activity is available yet.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <UserPlus size={16} className="text-emerald-600" />
            Recently Added Users
          </div>
          <div className="mt-5 space-y-3">
            {workspace.recentUsers.length ? (
              workspace.recentUsers.map((user) => (
                <div
                  key={user._id || `${user.email}-recent`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {user.username || user.email || "New user"}
                    </p>
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium uppercase text-slate-700">
                      {user.status || "pending"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{user.email || "No email available"}</p>
                  <p className="mt-2 text-sm text-slate-600">{formatDateTime(user.createdAt)}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                No recent user registrations are available yet.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[30px] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600">
            Workspace Snapshot
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Business Name</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{workspace.businessName}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Selected Plan</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {String(workspace.selectedPlanId || "pro").toUpperCase()}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Onboarding</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                Step {workspace.onboardingStep}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Last Sync</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {formatDateTime(workspace.lastSyncedAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Waves size={16} className="text-amber-600" />
            Activity Notes
          </div>
          <div className="mt-5 grid gap-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Connected Integrations</p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {workspace.connectedIntegrations.length}/{workspace.integrations.length || 0}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Enabled Automations</p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {workspace.enabledAutomations.length}/{workspace.automations.length || 0}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Launch State</p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {workspace.isLive ? "Live workspace" : "Pre-launch workspace"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
