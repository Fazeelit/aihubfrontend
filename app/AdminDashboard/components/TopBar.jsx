"use client";

import { Building2, Menu, ShieldCheck } from "lucide-react";

export default function TopBar({
  businessName,
  businessType,
  displayName,
  onToggleSidebar,
}) {
  return (
    <header className="sticky top-14 z-30 mx-4 rounded-[28px] border border-slate-200/80 bg-white/85 backdrop-blur-xl shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:mx-6">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800"
            aria-label="Toggle admin navigation"
          >
            <Menu size={20} />
          </button>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-2 text-amber-700">
            <Building2 size={18} />
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
              {businessType}
            </p>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">
              {businessName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm sm:block">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
              <ShieldCheck size={14} className="text-emerald-600" />
              Admin Session
            </div>
            <p className="mt-1 text-sm font-medium text-slate-900">{displayName}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
