"use client";

import { useState } from "react";
import { CheckCircle, X } from "lucide-react";

export default function RegisterUserModal({
  isOpen,
  onClose,
  onSubmit,
  registerData,
  setRegisterData,
  canCreateUser = true,
  roleOptions = [],
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canCreateUser) {
      window.alert("You do not have permission to create users.");
      return;
    }

    const { username, email, password, phone, employeeId, role, department, status } =
      registerData;

    if (!username || !email || !password || !employeeId || !role || !department || !status) {
      window.alert("Please fill all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        username,
        email,
        password,
        phone,
        employeeId,
        role,
        department,
        status,
      });

      setRegisterData({
        username: "",
        email: "",
        password: "",
        phone: "",
        employeeId: "",
        role: "",
        department: "",
        status: "active",
      });
      setConfirmPassword("");
      setPasswordMismatch(false);
      onClose();
      setShowSuccessModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return showSuccessModal ? (
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 p-4 pt-24 backdrop-blur-sm sm:pt-28">
        <div className="w-full max-w-md rounded-3xl border border-slate-200/70 bg-white/95 p-6 text-center shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)]">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle className="h-5 w-5" />
          </div>
          <p className="text-lg font-semibold text-slate-900">User registered successfully</p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-2 font-medium text-white transition hover:from-emerald-700 hover:to-teal-600"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    ) : null;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200/70 bg-white/95 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)]">
          <div className="flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-700 p-5 sm:p-6">
            <div>
              <h2 className="text-xl font-semibold text-white sm:text-2xl">New User Register</h2>
              <p className="mt-1 text-xs text-white/90 sm:text-sm">
                Create a user account with role and access details.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-white/90 transition hover:bg-white/10 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                ["Name *", "username", "text", "User Name"],
                ["Email *", "email", "email", "example@example.com"],
                ["Password *", "password", "password", "Enter password"],
                ["Phone", "phone", "tel", "0311-1234567"],
                ["Employee ID *", "employeeId", "text", "ADM-1111"],
              ].map(([label, key, type, placeholder]) => (
                <div key={key}>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={registerData[key]}
                    onChange={(event) => {
                      setRegisterData((current) => ({
                        ...current,
                        [key]: event.target.value,
                      }));
                      setPasswordMismatch(false);
                    }}
                    placeholder={placeholder}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    required={label.includes("*")}
                  />
                </div>
              ))}

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setPasswordMismatch(false);
                  }}
                  placeholder="Confirm password"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
                {passwordMismatch ? (
                  <p className="mt-1.5 text-xs text-rose-600">Passwords are mismatched.</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Role *
                </label>
                <select
                  value={registerData.role}
                  onChange={(event) =>
                    setRegisterData((current) => ({
                      ...current,
                      role: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  required
                >
                  <option value="">Select Role</option>
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Department *
                </label>
                <select
                  value={registerData.department}
                  onChange={(event) =>
                    setRegisterData((current) => ({
                      ...current,
                      department: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  required
                >
                  <option value="">Select Department</option>
                  {["Administration"].map(
                    (department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Status *
                </label>
                <select
                  value={registerData.status}
                  onChange={(event) =>
                    setRegisterData((current) => ({
                      ...current,
                      status: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !canCreateUser}
                className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-2 text-sm font-semibold text-white transition hover:from-emerald-700 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Registering..." : "Register User"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccessModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200/70 bg-white/95 p-6 text-center shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)]">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <p className="text-lg font-semibold text-slate-900">User registered successfully</p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-2 font-medium text-white transition hover:from-emerald-700 hover:to-teal-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
