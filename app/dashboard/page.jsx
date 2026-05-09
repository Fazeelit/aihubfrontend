"use client";

import { useEffect, useMemo, useState } from "react";

import AutomationsPanel from "@/dashboard/components/AutomationsPanel";
import AppointmentsPanel from "@/dashboard/components/AppointmentsPanel";
import ChatPanel from "@/dashboard/components/ChatPanel";
import DashboardSidebar from "@/dashboard/components/DashboardSidebar";
import {
  automationsSeed,
  documents,
  settingsTabs,
} from "@/dashboard/components/dashboardData";
import { themeVars } from "@/dashboard/components/dashboardTheme";
import DocumentsPanel from "@/dashboard/components/DocumentsPanel";
import LeadsPanel from "@/dashboard/components/LeadsPanel";
import NovaPanel from "@/dashboard/components/NovaPanel";
import OverviewPanel from "@/dashboard/components/OverviewPanel";
import {
  billingCycles,
  getPlanById,
  getPlanPeriod,
  getPlanPrice,
} from "@/dashboard/components/pricing";
import SettingsPanel from "@/dashboard/components/SettingsPanel";

export default function DashboardPage() {
  const [activePanel, setActivePanel] = useState("overview");
  const [automations, setAutomations] = useState(automationsSeed);
  const [activeDocument, setActiveDocument] = useState("policy");
  const [activeSettingsTab, setActiveSettingsTab] = useState(settingsTabs[0]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState("pro");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [settingsToggles, setSettingsToggles] = useState({
    claude: true,
    streaming: true,
    history: true,
  });
  const billingTab = settingsTabs[4];

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        setLoggedInUser(JSON.parse(storedUser));
      } catch {
        setLoggedInUser(null);
      }
    }

    const storedPlan = localStorage.getItem("dashboardPlanId");
    const storedCycle = localStorage.getItem("dashboardBillingCycle");

    if (storedPlan) {
      setSelectedPlanId(storedPlan);
    }

    if (storedCycle && billingCycles[storedCycle]) {
      setBillingCycle(storedCycle);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem("dashboardPlanId", selectedPlanId);
    localStorage.setItem("dashboardBillingCycle", billingCycle);
  }, [billingCycle, selectedPlanId]);

  const displayName = loggedInUser?.username || "Hasaan";
  const avatarLabel =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "HA";

  const activeDocumentData = useMemo(
    () => documents.find((item) => item.id === activeDocument) ?? documents[0],
    [activeDocument],
  );
  const currentPlan = useMemo(() => getPlanById(selectedPlanId), [selectedPlanId]);
  const currentPlanPrice = useMemo(
    () => getPlanPrice(currentPlan, billingCycle),
    [billingCycle, currentPlan],
  );
  const currentPlanPeriod = useMemo(() => getPlanPeriod(billingCycle), [billingCycle]);

  const toggleAutomation = (automationId) => {
    setAutomations((current) =>
      current.map((item) =>
        item.id === automationId ? { ...item, enabled: !item.enabled } : item,
      ),
    );
  };

  const toggleSetting = (key) => {
    if (key === "claude" && !currentPlan.capabilities.claude) {
      return;
    }

    setSettingsToggles((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  useEffect(() => {
    if (currentPlan.capabilities.claude || !settingsToggles.claude) {
      return;
    }

    setSettingsToggles((current) => ({
      ...current,
      claude: false,
    }));
  }, [currentPlan.capabilities.claude, settingsToggles.claude]);

  return (
    <main
      className="min-h-screen bg-[var(--bg)] font-['DM_Sans',sans-serif] text-[var(--text)]"
      style={themeVars}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] box-border bg-[var(--bg)] pt-12 min-[1440px]:max-w-[1600px] max-[1080px]:block max-[1080px]:pt-9 max-[720px]:pt-6">
        <DashboardSidebar
          activePanel={activePanel}
          avatarLabel={avatarLabel}
          currentPlanName={currentPlan.name}
          currentPlanPrice={currentPlanPrice}
          displayName={displayName}
          onPanelChange={setActivePanel}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          <div className={activePanel === "overview" ? "block" : "hidden"}>
            <OverviewPanel />
          </div>
          <div className={activePanel === "chat" ? "block" : "hidden"}>
            <ChatPanel avatarLabel={avatarLabel} />
          </div>
          <div className={activePanel === "leads" ? "block" : "hidden"}>
            <LeadsPanel />
          </div>
          <div className={activePanel === "appointments" ? "block" : "hidden"}>
            <AppointmentsPanel />
          </div>
          <div className={activePanel === "automations" ? "block" : "hidden"}>
            <AutomationsPanel automations={automations} onToggleAutomation={toggleAutomation} />
          </div>
          <div className={activePanel === "docs" ? "block" : "hidden"}>
            <DocumentsPanel
              activeDocument={activeDocument}
              activeDocumentData={activeDocumentData}
              onActiveDocumentChange={setActiveDocument}
            />
          </div>
          <div className={activePanel === "nova" ? "block" : "hidden"}>
            <NovaPanel />
          </div>
          <div className={activePanel === "settings" ? "block" : "hidden"}>
            <SettingsPanel
              activeSettingsTab={activeSettingsTab}
              billingCycle={billingCycle}
              billingTab={billingTab}
              currentPlan={currentPlan}
              currentPlanPeriod={currentPlanPeriod}
              currentPlanPrice={currentPlanPrice}
              onBillingCycleChange={setBillingCycle}
              onPlanChange={setSelectedPlanId}
              onSettingsTabChange={setActiveSettingsTab}
              onToggleSetting={toggleSetting}
              settingsToggles={settingsToggles}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
