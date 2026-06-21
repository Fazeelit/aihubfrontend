"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  authRequest,
  getMyOnboarding,
  getStoredAuthToken,
  getStoredAuthUser,
  getUserDashboardBootstrap,
} from "@/authservice/AuthService";

const onboardingProfileStorageKey = "dashboardOnboardingProfile";

const AdminWorkspaceContext = createContext(null);

function parseJson(rawValue) {
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}

function readStoredUser() {
  return parseJson(getStoredAuthUser());
}

function readLocalOnboardingProfile() {
  if (typeof window === "undefined") {
    return null;
  }

  return parseJson(window.localStorage.getItem(onboardingProfileStorageKey));
}

function buildInitialState() {
  const storedUser = readStoredUser();
  const localOnboardingProfile = readLocalOnboardingProfile();

  return {
    isLoading: true,
    user: storedUser,
    businessName:
      localOnboardingProfile?.businessName || "Smart AI Hub Workspace",
    businessType:
      localOnboardingProfile?.businessType || "AI-Powered Business",
    onboarding: null,
    dashboard: null,
    users: [],
    lastSyncedAt: null,
    estimatedRenewalAt: null,
  };
}

export function AdminWorkspaceProvider({ children }) {
  const [state, setState] = useState(buildInitialState);

  useEffect(() => {
    let mounted = true;

    const syncWorkspace = async () => {
      const storedUser = readStoredUser();
      const localOnboardingProfile = readLocalOnboardingProfile();

      startTransition(() => {
        if (!mounted) {
          return;
        }

        setState((current) => ({
          ...current,
          user: storedUser,
          businessName:
            localOnboardingProfile?.businessName || current.businessName,
          businessType:
            localOnboardingProfile?.businessType || current.businessType,
          isLoading: Boolean(getStoredAuthToken()),
        }));
      });

      if (!getStoredAuthToken()) {
        startTransition(() => {
          if (mounted) {
            setState((current) => ({
              ...current,
              isLoading: false,
            }));
          }
        });
        return;
      }

      const [onboardingResult, dashboardResult, usersResult] =
        await Promise.allSettled([
          getMyOnboarding({ silent: true }),
          getUserDashboardBootstrap({ silent: true }),
          authRequest("/users", {
            method: "GET",
            includeAuth: true,
            showSuccessToast: false,
            showErrorToast: false,
          }),
        ]);

      if (!mounted) {
        return;
      }

      const onboarding =
        onboardingResult.status === "fulfilled"
          ? onboardingResult.value?.data ?? null
          : null;
      const dashboard =
        dashboardResult.status === "fulfilled"
          ? dashboardResult.value?.data ?? null
          : null;
      const users =
        usersResult.status === "fulfilled"
          ? usersResult.value?.users ??
            usersResult.value?.data?.users ??
            usersResult.value?.data ??
            []
          : [];

      const businessName =
        dashboard?.preferences?.businessProfile?.businessName ||
        onboarding?.businessName ||
        localOnboardingProfile?.businessName ||
        "Smart AI Hub Workspace";
      const businessType =
        dashboard?.preferences?.businessProfile?.businessType ||
        onboarding?.selectedBusiness?.name ||
        localOnboardingProfile?.businessType ||
        "AI-Powered Business";

      startTransition(() => {
        setState({
          isLoading: false,
          user: storedUser,
          businessName,
          businessType,
          onboarding,
          dashboard,
          users: Array.isArray(users) ? users : [],
          lastSyncedAt: new Date().toISOString(),
        });
      });
    };

    void syncWorkspace();

    const handleRefresh = () => {
      void syncWorkspace();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("auth-state-changed", handleRefresh);
      window.addEventListener("storage", handleRefresh);
    }

    return () => {
      mounted = false;

      if (typeof window !== "undefined") {
        window.removeEventListener("auth-state-changed", handleRefresh);
        window.removeEventListener("storage", handleRefresh);
      }
    };
  }, []);

  const value = useMemo(() => {
    const onboarding = state.onboarding;
    const dashboard = state.dashboard;
    const users = state.users;
    const integrations = Array.isArray(onboarding?.integrations)
      ? onboarding.integrations
      : [];
    const connectedIntegrations = integrations.filter((item) => item?.connected);
    const voiceSettings = Array.isArray(onboarding?.voiceSettings)
      ? onboarding.voiceSettings
      : [];
    const selectedVoiceSettings = voiceSettings.filter((item) => item?.selected);
    const automations = Array.isArray(dashboard?.preferences?.automations)
      ? dashboard.preferences.automations
      : [];
    const enabledAutomations = automations.filter((item) => item?.enabled);
    const recentUsers = [...users]
      .filter((item) => item?.createdAt)
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
      .slice(0, 6);
    const recentLogins = [...users]
      .filter((item) => item?.lastLogin)
      .sort((left, right) => new Date(right.lastLogin) - new Date(left.lastLogin))
      .slice(0, 6);
    const renewalBase =
      dashboard?.updatedAt ||
      dashboard?.createdAt ||
      onboarding?.updatedAt ||
      onboarding?.createdAt ||
      state.user?.createdAt ||
      state.lastSyncedAt;
    let estimatedRenewalAt = null;

    if (renewalBase) {
      const renewalDate = new Date(renewalBase);

      if (!Number.isNaN(renewalDate.getTime())) {
        renewalDate.setMonth(
          renewalDate.getMonth() + (dashboard?.preferences?.billingCycle === "yearly" ? 12 : 1)
        );
        estimatedRenewalAt = renewalDate.toISOString();
      }
    }

    return {
      ...state,
      integrations,
      connectedIntegrations,
      voiceSettings,
      selectedVoiceSettings,
      automations,
      enabledAutomations,
      selectedPlanId:
        dashboard?.preferences?.selectedPlanId || "pro",
      billingCycle:
        dashboard?.preferences?.billingCycle || "monthly",
      activePanel:
        dashboard?.preferences?.activePanel || "overview",
      greeting: onboarding?.greeting || "",
      onboardingStep: onboarding?.currentStep || 2,
      onboardingStatus: onboarding?.onboardingStatus || "in_progress",
      isLive: Boolean(onboarding?.isLive),
      selectedBusinessName:
        onboarding?.selectedBusiness?.name || state.businessType,
      selectedBusinessDescription:
        onboarding?.selectedBusiness?.desc || "",
      selectedBusinessToolkit:
        onboarding?.selectedBusiness?.toolkit || "",
      displayName:
        state.user?.username || dashboard?.profile?.displayName || "Admin",
      email: state.user?.email || "",
      role: String(state.user?.role || "").trim().toLowerCase(),
      totalUsers: users.length,
      adminUsers: users.filter((item) => item?.role === "admin").length,
      activeUsers: users.filter((item) => item?.status === "active").length,
      recentUsers,
      recentLogins,
      estimatedRenewalAt,
    };
  }, [state]);

  return (
    <AdminWorkspaceContext.Provider value={value}>
      {children}
    </AdminWorkspaceContext.Provider>
  );
}

export function useAdminWorkspace() {
  const context = useContext(AdminWorkspaceContext);

  if (!context) {
    throw new Error("useAdminWorkspace must be used within AdminWorkspaceProvider.");
  }

  return context;
}
