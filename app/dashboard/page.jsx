"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  getMyOnboarding,
  getStoredAuthUser,
  getStoredAuthToken,
  getUserDashboardBootstrap,
  saveMyUserDashboard,
} from "@/authservice/AuthService";
import AppointmentsPanel from "@/dashboard/components/AppointmentsPanel";
import AutomationsPanel from "@/dashboard/components/AutomationsPanel";
import BillingPanel from "@/dashboard/components/BillingPanel";
import ChatPanel from "@/dashboard/components/ChatPanel";
import {
  accountNav,
  automationsSeed,
  businessNav,
  dashboardNav,
  documents,
  settingsTabs,
} from "@/dashboard/components/dashboardData";
import DashboardSidebar from "@/dashboard/components/DashboardSidebar";
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

const fallbackSettingsTabItems = settingsTabs.map((tab, index) => {
  const [icon = "", ...labelParts] = String(tab).split(" ");
  const fallbackIds = ["profile", "notifications", "integrations", "ai-model", "team"];

  return {
    id: fallbackIds[index] ?? `tab-${index + 1}`,
    icon,
    label: labelParts.join(" ") || String(tab),
  };
});

const defaultBusinessProfile = {
  businessName: "Nest Driving School",
  businessType: "Driving School",
  website: "nestdrivingschool.com",
};

const defaultSettingsToggles = {
  claude: true,
  streaming: true,
  history: true,
};
const defaultBillingProfile = {
  autopayEnabled: true,
  emailReceipts: true,
  vatNumber: "",
  billingEmail: "billing@smartaihub.com",
  cardholderName: "Hasaan Ali",
  paymentMethod: {
    brand: "Visa",
    last4: "4242",
    expiry: "08/28",
  },
};
const onboardingProfileStorageKey = "dashboardOnboardingProfile";
const defaultBusinessNamePrefix = "Nest";

function getBusinessTypeLabel(name) {
  return name || defaultBusinessProfile.businessType;
}

function getBusinessNameValue(businessName, businessType) {
  const trimmedName = typeof businessName === "string" ? businessName.trim() : "";
  const trimmedType = typeof businessType === "string" ? businessType.trim() : "";

  if (!trimmedName || trimmedName === `${defaultBusinessNamePrefix} Driving School`) {
    return trimmedType
      ? `${defaultBusinessNamePrefix} ${trimmedType}`
      : defaultBusinessProfile.businessName;
  }

  return trimmedName;
}

function buildBusinessProfileFromOnboarding(onboardingData, fallbackProfile = defaultBusinessProfile) {
  if (!onboardingData) {
    return fallbackProfile;
  }

  return {
    businessName: getBusinessNameValue(
      onboardingData.businessName,
      onboardingData.selectedBusiness?.name,
    ),
    businessType: getBusinessTypeLabel(onboardingData.selectedBusiness?.name),
    website: fallbackProfile.website,
  };
}

function getStoredOnboardingProfile() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedProfile = localStorage.getItem(onboardingProfileStorageKey);

  if (!storedProfile) {
    return null;
  }

  try {
    return JSON.parse(storedProfile);
  } catch {
    return null;
  }
}

function getStoredUser() {
  const storedUser = getStoredAuthUser();

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

function normalizeSettingsTabs(items) {
  const sourceItems = Array.isArray(items) && items.length ? items : fallbackSettingsTabItems;
  const normalized = sourceItems.filter((item) => item?.id !== "billing");

  return normalized.length ? normalized : fallbackSettingsTabItems;
}

function normalizeAccountItems(items) {
  const sourceItems = Array.isArray(items) && items.length ? items : accountNav;

  return sourceItems.map((item) =>
    item?.id === "billing-link" ? { ...item, id: "billing" } : item,
  );
}

function normalizeActivePanel(panelId) {
  return panelId === "billing-link" ? "billing" : panelId ?? "overview";
}

export default function DashboardPage() {
  const [activePanel, setActivePanel] = useState("overview");
  const [automations, setAutomations] = useState(automationsSeed);
  const [activeDocument, setActiveDocument] = useState("policy");
  const [activeSettingsTabId, setActiveSettingsTabId] = useState(
    fallbackSettingsTabItems[0]?.id ?? "profile",
  );
  const [loggedInUser, setLoggedInUser] = useState(() => getStoredUser());
  const [selectedPlanId, setSelectedPlanId] = useState("pro");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [settingsToggles, setSettingsToggles] = useState(defaultSettingsToggles);
  const [businessProfile, setBusinessProfile] = useState(defaultBusinessProfile);
  const [dashboardItems, setDashboardItems] = useState(dashboardNav);
  const [businessItems, setBusinessItems] = useState(businessNav);
  const [accountItems, setAccountItems] = useState(accountNav);
  const [settingsTabItems, setSettingsTabItems] = useState(fallbackSettingsTabItems);
  const [billingProfile, setBillingProfile] = useState(defaultBillingProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const skipNextAutosaveRef = useRef(true);
  const autosaveTimeoutRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      const storedUser = getStoredUser();
      const storedOnboardingProfile = getStoredOnboardingProfile();

      if (storedUser && isMounted) {
        setLoggedInUser(storedUser);
      }

      if (storedOnboardingProfile && isMounted) {
        setBusinessProfile((current) => ({
          ...current,
          businessName:
            storedOnboardingProfile.businessName || current.businessName,
          businessType:
            storedOnboardingProfile.businessType || current.businessType,
        }));
      }

      if (!getStoredAuthToken()) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const [dashboardResult, onboardingResult] = await Promise.allSettled([
          getUserDashboardBootstrap({ silent: true }),
          getMyOnboarding({ silent: true }),
        ]);
        const data =
          dashboardResult.status === "fulfilled" ? dashboardResult.value?.data ?? {} : {};
        const onboardingData =
          onboardingResult.status === "fulfilled" ? onboardingResult.value?.data ?? null : null;
        const preferences = data.preferences ?? {};
        const onboardingBusinessProfile = buildBusinessProfileFromOnboarding(onboardingData);

        if (!isMounted) {
          return;
        }

        setDashboardItems(data.navigation?.dashboardNav ?? dashboardNav);
        setBusinessItems(data.navigation?.businessNav ?? businessNav);
        setAccountItems(normalizeAccountItems(data.navigation?.accountNav));
        setSettingsTabItems(normalizeSettingsTabs(data.settings?.tabs));
        setActivePanel(normalizeActivePanel(preferences.activePanel));
        setActiveDocument(preferences.activeDocument ?? "policy");
        const nextSettingsTabId =
          preferences.activeSettingsTabId ?? fallbackSettingsTabItems[0]?.id ?? "profile";
        setActiveSettingsTabId(
          nextSettingsTabId === "billing"
            ? fallbackSettingsTabItems[0]?.id ?? "profile"
            : nextSettingsTabId,
        );
        setSelectedPlanId(preferences.selectedPlanId ?? "pro");
        setBillingCycle(preferences.billingCycle ?? "monthly");
        setBusinessProfile({
          ...(preferences.businessProfile ?? defaultBusinessProfile),
          businessName:
            storedOnboardingProfile?.businessName ||
            onboardingBusinessProfile.businessName ||
            preferences.businessProfile?.businessName ||
            defaultBusinessProfile.businessName,
          businessType:
            storedOnboardingProfile?.businessType ||
            onboardingBusinessProfile.businessType ||
            preferences.businessProfile?.businessType ||
            defaultBusinessProfile.businessType,
        });
        setSettingsToggles(preferences.settingsToggles ?? defaultSettingsToggles);
        setBillingProfile({
          ...defaultBillingProfile,
          ...(preferences.billingProfile ?? {}),
          paymentMethod: {
            ...defaultBillingProfile.paymentMethod,
            ...(preferences.billingProfile?.paymentMethod ?? {}),
          },
        });
        setAutomations(preferences.automations ?? automationsSeed);

        if (data.profile?.displayName) {
          setLoggedInUser((current) => ({
            ...(current ?? {}),
            username: data.profile.displayName,
          }));
        }
      } catch {
        if (isMounted) {
          setAccountItems(normalizeAccountItems(accountNav));
          setSettingsTabItems(fallbackSettingsTabItems);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;

      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem("dashboardPlanId", selectedPlanId);
    localStorage.setItem("dashboardBillingCycle", billingCycle);
  }, [billingCycle, selectedPlanId]);

  const currentPlan = useMemo(() => getPlanById(selectedPlanId), [selectedPlanId]);
  const currentPlanPrice = useMemo(
    () => getPlanPrice(currentPlan, billingCycle),
    [billingCycle, currentPlan],
  );
  const currentPlanPeriod = useMemo(() => getPlanPeriod(billingCycle), [billingCycle]);
  const activeDocumentData = useMemo(
    () => documents.find((item) => item.id === activeDocument) ?? documents[0],
    [activeDocument],
  );

  const displayName = loggedInUser?.username || "Hasaan";
  const avatarLabel =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "HA";

  const persistDashboard = async ({ silent = false } = {}) => {
    if (!getStoredAuthToken()) {
      return true;
    }

    const payload = {
      activePanel,
      activeDocument,
      activeSettingsTabId,
      selectedPlanId,
      billingCycle,
      businessProfile,
      billingProfile,
      settingsToggles,
      automations: automations.map(({ id, enabled }) => ({ id, enabled })),
    };

    if (!silent) {
      setIsSaving(true);
    }

    try {
      await saveMyUserDashboard(payload, { silent });
      return true;
    } catch {
      return false;
    } finally {
      if (!silent) {
        setIsSaving(false);
      }
    }
  };

  useEffect(() => {
    if (isLoading || !getStoredAuthToken()) {
      return;
    }

    if (skipNextAutosaveRef.current) {
      skipNextAutosaveRef.current = false;
      return;
    }

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = setTimeout(() => {
      void persistDashboard({ silent: true });
    }, 700);

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [
    activeDocument,
    activePanel,
    activeSettingsTabId,
    automations,
    billingCycle,
    billingProfile,
    businessProfile,
    isLoading,
    selectedPlanId,
    settingsToggles,
  ]);

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

  const handleBusinessProfileChange = (key, value) => {
    setBusinessProfile((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleBillingProfileChange = (key, value) => {
    setBillingProfile((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handlePaymentMethodChange = (key, value) => {
    setBillingProfile((current) => ({
      ...current,
      paymentMethod: {
        ...current.paymentMethod,
        [key]: value,
      },
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

  if (isLoading) {
    return (
      <main
        className="min-h-screen bg-[var(--bg)] font-['DM_Sans',sans-serif] text-[var(--text)]"
        style={themeVars}
      >
        <div className="mx-auto flex min-h-screen max-w-[1600px] items-center justify-center px-6 text-[14px] text-[var(--muted)]">
          Loading dashboard...
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-[var(--bg)] font-['DM_Sans',sans-serif] text-[var(--text)]"
      style={themeVars}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] box-border bg-[var(--bg)] pt-12 min-[1440px]:max-w-[1600px] max-[1080px]:block max-[1080px]:pt-9 max-[720px]:pt-6">
        <DashboardSidebar
          accountItems={accountItems}
          activePanel={activePanel}
          avatarLabel={avatarLabel}
          businessItems={businessItems}
          currentPlanName={currentPlan.name}
          currentPlanPrice={currentPlanPrice}
          dashboardItems={dashboardItems}
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
              activeSettingsTabId={activeSettingsTabId}
              businessProfile={businessProfile}
              isSaving={isSaving}
              onBusinessProfileChange={handleBusinessProfileChange}
              onSaveChanges={() => {
                void persistDashboard({ silent: false });
              }}
              onSettingsTabChange={setActiveSettingsTabId}
              onToggleSetting={toggleSetting}
              settingsTabItems={settingsTabItems}
              settingsToggles={settingsToggles}
            />
          </div>
          <div className={activePanel === "billing" ? "block" : "hidden"}>
            <BillingPanel
              billingCycle={billingCycle}
              billingProfile={billingProfile}
              currentPlan={currentPlan}
              currentPlanPeriod={currentPlanPeriod}
              currentPlanPrice={currentPlanPrice}
              onBillingCycleChange={setBillingCycle}
              onBillingProfileChange={handleBillingProfileChange}
              onPaymentMethodChange={handlePaymentMethodChange}
              onPlanChange={setSelectedPlanId}
              onSaveBillingProfile={() => {
                void persistDashboard({ silent: false });
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
