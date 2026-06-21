"use client";

import { LayoutDashboard, ShieldCheck, Users, WalletCards } from "lucide-react";

export const adminRoutes = [
  {
    path: "/AdminDashboard",
    label: "Overview",
    title: "Overview",
    icon: LayoutDashboard,
    description: "Track user activity, onboarding momentum, and workspace health.",
    accent: "from-amber-300 via-orange-300 to-cyan-300",
  },
  {
    path: "/AdminDashboard/user-dashboard",
    label: "User Dashboard",
    title: "User Dashboard",
    icon: WalletCards,
    description: "Review plan selection, billing cycle, expiry timing, and workspace preferences.",
    accent: "from-fuchsia-200 via-rose-200 to-amber-200",
  },
  {
    path: "/AdminDashboard/users",
    label: "User",
    title: "User",
    icon: Users,
    description: "Review account status, recent signups, and account-level visibility.",
    accent: "from-cyan-300 via-sky-300 to-blue-300",
  },
  {
    path: "/AdminDashboard/roles",
    label: "Role",
    title: "Role",
    icon: ShieldCheck,
    description: "Understand access, admin responsibility, and how the workspace is governed.",
    accent: "from-emerald-300 via-lime-300 to-amber-300",
  },
];

export function getAdminRoute(pathname) {
  return adminRoutes.find((route) => pathname === route.path) || adminRoutes[0];
}
