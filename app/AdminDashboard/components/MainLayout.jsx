"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CheckCircle2, Link2, Loader, Rocket, Sparkles } from "lucide-react";
import { getStoredAuthToken } from "@/authservice/AuthService";
import { AdminWorkspaceProvider, useAdminWorkspace } from "./AdminWorkspaceProvider";
import { getAdminRoute } from "./adminRoutes";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function MainLayout({ children }) {
  return (
    <AdminWorkspaceProvider>
      <AdminFrame>{children}</AdminFrame>
    </AdminWorkspaceProvider>
  );
}

function AdminFrame({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const workspace = useAdminWorkspace();
  const route = useMemo(() => getAdminRoute(pathname), [pathname]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!getStoredAuthToken()) {
      router.replace("/auth/login");
      return;
    }

    if (!workspace.isLoading && workspace.role && workspace.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [router, workspace.isLoading, workspace.role]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const onboardingProgress = Math.round((workspace.onboardingStep / 5) * 100);

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarOpen((current) => !current);
      return;
    }

    setSidebarCollapsed((current) => !current);
  };

  const onboardingLoaderDots = Array.from({ length: 8 }, (_, index) => {
    const angle = (index / 8) * Math.PI * 2 - Math.PI / 2;
    const radius = 44;

    return {
      id: index,
      style: {
        left: `calc(50% + ${Math.cos(angle) * radius}px - 12px)`,
        top: `calc(50% + ${Math.sin(angle) * radius}px - 12px)`,
        animationDelay: `${index * 0.12}s`,
      },
    };
  });

  if (workspace.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#fef3c7_0%,#f8fafc_28%,#e2e8f0_100%)] px-6">
        <div className="rounded-[28px] border border-slate-200 bg-white/90 px-8 py-7 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="relative mx-auto mb-5 h-32 w-32 animate-spin [animation-duration:1.1s] [animation-timing-function:linear]">
            {onboardingLoaderDots.map((dot) => (
              <span
                key={dot.id}
                className="absolute h-6 w-6 rounded-full bg-gradient-to-br from-[#ffe978] via-[#ffd84d] to-[#ffbc25] shadow-[0_10px_20px_rgba(245,158,11,0.22)]"
                style={{
                  ...dot.style,
                  opacity: 1 - dot.id * 0.06,
                  transform: `scale(${1 - dot.id * 0.03})`,
                }}
              />
            ))}
          </div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
            Admin Workspace
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
            Syncing onboarding and dashboard data
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Preparing the admin experience from the latest workspace setup.
          </p>
          <div className="mt-5 flex items-center justify-center">
            <Loader
              className="h-5 w-5 animate-spin text-amber-500"
              aria-label="Loading onboarding"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top,#fef3c7_0%,#f8fafc_28%,#e2e8f0_100%)]">
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
      />

      <div
        className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-60"
        }`}
      >
        <TopBar
          businessName={workspace.businessName}
          businessType={workspace.businessType}
          displayName={workspace.displayName}
          onToggleSidebar={handleToggleSidebar}
        />

        <div className="px-4 pb-6 pt-12 sm:px-6 sm:pt-25">
          <section className="overflow-hidden rounded-[30px] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(8,47,73,0.92),rgba(245,158,11,0.88))] p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.16)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium">
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white/90">
                    {route.label}
                  </span>
                  <span className="rounded-full border border-emerald-300/30 bg-emerald-300/15 px-3 py-1 text-emerald-100">
                    {workspace.isLive ? "Nova Live" : "Launch Pending"}
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white/85">
                    {String(workspace.selectedPlanId || "pro").toUpperCase()} · {workspace.billingCycle}
                  </span>
                </div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {route.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
                  {route.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-100">
                    <Rocket size={16} />
                    Onboarding
                  </div>
                  <p className="mt-2 text-2xl font-semibold">{onboardingProgress}%</p>
                  <p className="text-xs text-slate-200">
                    Step {workspace.onboardingStep} of 5
                  </p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyan-100">
                    <Link2 size={16} />
                    Integrations
                  </div>
                  <p className="mt-2 text-2xl font-semibold">
                    {workspace.connectedIntegrations.length}
                  </p>
                  <p className="text-xs text-slate-200">
                    of {workspace.integrations.length || 0} connected
                  </p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-emerald-100">
                    <Sparkles size={16} />
                    Automations
                  </div>
                  <p className="mt-2 text-2xl font-semibold">
                    {workspace.enabledAutomations.length}
                  </p>
                  <p className="text-xs text-slate-200">
                    of {workspace.automations.length || 0} enabled
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-100">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                <CheckCircle2 size={14} className="text-emerald-300" />
                {workspace.selectedBusinessName}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                <Sparkles size={14} className="text-cyan-300" />
                Focus: {workspace.activePanel}
              </span>
              {workspace.selectedVoiceSettings[0]?.value ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                  <Rocket size={14} className="text-amber-300" />
                  Voice: {workspace.selectedVoiceSettings[0].value}
                </span>
              ) : null}
            </div>
          </section>

          <main className="mt-5">{children}</main>
        </div>
      </div>
    </div>
  );
}
