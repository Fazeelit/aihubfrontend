"use client";

import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://backendaihub.onrender.com/api";
const NORMALIZED_BASE_URL = BASE_URL.replace(/\/+$/, "");
const AUTH_TOKEN_KEY = "authToken";
const AUTH_USER_KEY = "authUser";

function getAuthStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage;
}

function migrateLegacyAuthStorage() {
  if (typeof window === "undefined") {
    return;
  }

  const sessionStorage = getAuthStorage();

  if (!sessionStorage) {
    return;
  }

  const legacyToken = window.localStorage.getItem(AUTH_TOKEN_KEY);
  const legacyUser = window.localStorage.getItem(AUTH_USER_KEY);

  if (legacyToken && !sessionStorage.getItem(AUTH_TOKEN_KEY)) {
    sessionStorage.setItem(AUTH_TOKEN_KEY, legacyToken);
  }

  if (legacyUser && !sessionStorage.getItem(AUTH_USER_KEY)) {
    sessionStorage.setItem(AUTH_USER_KEY, legacyUser);
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
}

async function authRequest(
  endpoint,
  {
    method = "POST",
    data = null,
    includeAuth = false,
    showSuccessToast = true,
    showErrorToast = true,
  } = {},
) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (includeAuth && typeof window !== "undefined") {
      const token = getStoredAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const response = await axios({
      url: `${NORMALIZED_BASE_URL}${endpoint}`,
      method,
      headers,
      data,
      timeout: 30000,
    });

    if (showSuccessToast && response.data?.message) {
      toast.success(response.data.message);
    }

    return response.data;
  } catch (error) {
    const isEventLikeError =
      typeof Event !== "undefined" && error instanceof Event;
    const isAxiosNetworkError =
      axios.isAxiosError(error) && !error.response && Boolean(error.request);
    const fallbackMessage = "Something went wrong";
    const message =
      isEventLikeError
        ? fallbackMessage
        :
      isAxiosNetworkError
        ? `Unable to reach the API at ${NORMALIZED_BASE_URL}. Check the API URL, CORS settings, and whether the backend is running.`
        :
      error?.message === "[object Event]"
        ? fallbackMessage
        :
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      fallbackMessage;

    if (showErrorToast) {
      toast.error(message);
    }
    throw new Error(message);
  }
}

export function getStoredAuthToken() {
  const storage = getAuthStorage();

  if (!storage) {
    return null;
  }

  migrateLegacyAuthStorage();
  return storage.getItem(AUTH_TOKEN_KEY);
}

export function getStoredAuthUser() {
  const storage = getAuthStorage();

  if (!storage) {
    return null;
  }

  migrateLegacyAuthStorage();
  return storage.getItem(AUTH_USER_KEY);
}

export function setStoredAuthSession({ token, user }) {
  const storage = getAuthStorage();

  if (!storage) {
    return;
  }

  if (token) {
    storage.setItem(AUTH_TOKEN_KEY, token);
  }

  if (user) {
    storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
}

export function clearStoredAuthSession() {
  const storage = getAuthStorage();

  if (!storage) {
    return;
  }

  storage.removeItem(AUTH_TOKEN_KEY);
  storage.removeItem(AUTH_USER_KEY);

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    window.localStorage.removeItem(AUTH_USER_KEY);
  }
}

export async function loginUser(payload) {
  return authRequest("/users/login", {
    method: "POST",
    data: payload,
  });
}

export async function signupUser(payload) {
  return authRequest("/users/signup", {
    method: "POST",
    data: payload,
  });
}

export async function getOnboardingConfig() {
  return authRequest("/onboarding/config", {
    method: "GET",
    showSuccessToast: false,
  });
}

export async function getMyOnboarding({ silent = false } = {}) {
  return authRequest("/onboarding/me", {
    method: "GET",
    includeAuth: true,
    showSuccessToast: false,
    showErrorToast: !silent,
  });
}

export async function saveMyOnboarding(payload, { silent = false } = {}) {
  return authRequest("/onboarding/me", {
    method: "PUT",
    data: payload,
    includeAuth: true,
    showSuccessToast: !silent,
    showErrorToast: !silent,
  });
}

export async function deleteOnboardingById(id) {
  return authRequest(`/onboarding/${id}`, {
    method: "DELETE",
    includeAuth: true,
  });
}

export async function getUserDashboardBootstrap({ silent = false } = {}) {
  return authRequest("/userdashboard/bootstrap", {
    method: "GET",
    includeAuth: true,
    showSuccessToast: false,
    showErrorToast: !silent,
  });
}

export async function getMyUserDashboard({ silent = false } = {}) {
  return authRequest("/userdashboard/me", {
    method: "GET",
    includeAuth: true,
    showSuccessToast: false,
    showErrorToast: !silent,
  });
}

export async function saveMyUserDashboard(payload, { silent = false } = {}) {
  return authRequest("/userdashboard/me", {
    method: "PUT",
    data: payload,
    includeAuth: true,
    showSuccessToast: !silent,
    showErrorToast: !silent,
  });
}

export async function deleteUserDashboardById(id) {
  return authRequest(`/userdashboard/${id}`, {
    method: "DELETE",
    includeAuth: true,
  });
}

export { authRequest };
