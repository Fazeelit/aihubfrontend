"use client";

import { Key, X } from "lucide-react";

export default function NewRoleModal({
  isOpen,
  onClose,
  onSubmit,
  newRoleData,
  setNewRoleData,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-slate-200/70 bg-white/95 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)]">
        <div className="flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-700 p-6">
          <h2 className="text-2xl font-semibold text-white">Add New Role</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/90 transition hover:bg-white/10 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Role Name *
              </label>
              <input
                type="text"
                value={newRoleData.name}
                onChange={(event) =>
                  setNewRoleData((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="e.g., Support Staff"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                3-Letter Code Prefix *
              </label>
              <input
                type="text"
                value={newRoleData.codePrefix}
                onChange={(event) =>
                  setNewRoleData((current) => ({
                    ...current,
                    codePrefix: event.target.value.toUpperCase().slice(0, 3),
                  }))
                }
                placeholder="e.g., SUP"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                maxLength={3}
                required
              />
              <p className="mt-2 text-xs text-slate-500">
                Example format: SUP-1234
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <Key className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                <p className="text-sm text-slate-700">
                  Each role gets a unique 3-letter prefix. Users can then be mapped with
                  codes like {newRoleData.codePrefix || "XXX"}-1234.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-3 font-medium text-white transition hover:from-emerald-700 hover:to-teal-600"
            >
              Create Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
