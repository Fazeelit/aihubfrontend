"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeft, X } from "lucide-react";
import { adminRoutes } from "./adminRoutes";

export default function Sidebar({
  isOpen,
  isCollapsed,
  onClose,
}) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 transition md:hidden ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-14 z-50 h-[calc(100%-3.5rem)] transform border-r border-slate-900 bg-slate-950 text-white transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "w-20 md:translate-x-0" : "w-60 md:translate-x-0"}`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-900 px-3.5 pb-2.5 pt-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-amber-300 via-orange-300 to-cyan-300 p-[1px] shadow-lg shadow-cyan-950/20">
                <div className="flex items-center gap-2 rounded-2xl bg-slate-950 px-2.5 py-2">
                  <div className="rounded-xl bg-amber-300 p-1.5 text-slate-950">
                    <PanelLeft size={14} />
                  </div>
                  {!isCollapsed ? (
                    <div>
                      <p className="font-syne text-[14px] font-extrabold tracking-tight text-white">
                        <span className="text-[#F5A623]">Smart</span>AI Hub
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-900 hover:text-white md:hidden"
                aria-label="Close admin navigation"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <nav className="flex-1 px-2.5 py-2.5">
            <p
              className={`px-2 text-[10px] uppercase tracking-[0.18em] text-slate-500 ${
                isCollapsed ? "hidden" : "block"
              }`}
            >
              Workspace
            </p>

            <div className="mt-2.5 space-y-2">
              {adminRoutes.map((route) => {
                const Icon = route.icon;
                const active = pathname === route.path;

                return (
                  <Link
                    key={route.path}
                    href={route.path}
                    onClick={onClose}
                    className={`group flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition ${
                      active
                        ? "bg-gradient-to-r from-amber-300 via-orange-300 to-cyan-300 text-slate-950 shadow-lg shadow-cyan-950/20"
                        : "text-slate-300 hover:bg-slate-900 hover:text-white"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  >
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${
                        active
                          ? "bg-white/40"
                          : "bg-slate-900 text-slate-300 group-hover:bg-slate-800"
                      }`}
                    >
                      <Icon size={18} />
                    </span>
                    {!isCollapsed ? (
                      <span className="block text-[13px] font-medium">{route.label}</span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </nav>

        </div>
      </aside>
    </>
  );
}
