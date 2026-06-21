"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle,
  ChevronDown,
  Copy,
  Edit,
  Eye,
  Filter,
  Key,
  LayoutGrid,
  List,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Shield,
  Trash2,
  UserPlus,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { signupUser } from "@/authservice/AuthService";
import { useAdminWorkspace } from "../AdminWorkspaceProvider";
import NewRoleModal from "../users/NewRoleModal";
import RegisterUserModal from "../users/RegisterUserModal";

const defaultRolesData = [
  {
    name: "ADMIN",
    label: "Administrator",
    codePrefix: "ADM",
    permissions: ["Full Access", "User Management", "Settings", "Reports"],
    color: "from-purple-600 to-indigo-500",
  }
];

function getUserTimestamp(user) {
  const candidates = [
    user?.createdAt,
    user?.updatedAt,
    user?.registrationDate,
    user?.lastActive,
    user?.lastLogin,
    user?.id,
  ];

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    const parsed = new Date(candidate);
    const time = parsed.getTime();

    if (!Number.isNaN(time)) {
      return time;
    }
  }

  return 0;
}

function sortUsersNewestFirst(items) {
  return [...items].sort((left, right) => getUserTimestamp(right) - getUserTimestamp(left));
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString();
}

function formatRoleLabel(value) {
  return String(value || "Viewer")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function isProtectedAdminUser(user) {
  const name = String(user?.username || user?.name || "").trim().toLowerCase();
  const email = String(user?.email || "").trim().toLowerCase();
  const role = String(user?.role || "").trim().toLowerCase();

  return (
    name === "admin" ||
    email === "admin" ||
    role === "admin" ||
    role === "administrator"
  );
}

function generateSecretCode(prefix) {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${digits}`;
}

function getStatusBadge(status) {
  const normalized = String(status || "active").toLowerCase();
  const styles = {
    active: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    inactive: "bg-rose-100 text-rose-700",
  };
  const icons = {
    active: CheckCircle,
    pending: Calendar,
    inactive: XCircle,
  };
  const Icon = icons[normalized] || CheckCircle;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
        styles[normalized] || styles.active
      }`}
    >
      <Icon className="h-3 w-3" />
      {normalized.charAt(0).toUpperCase() + normalized.slice(1)}
    </span>
  );
}

function SummaryCard({ label, value, gradient }) {
  return (
    <div className={`rounded-2xl border border-white/30 bg-gradient-to-br ${gradient} p-5 shadow-lg shadow-black/10`}>
      <p className="text-sm text-white/90">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function DetailRow({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
        {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
        {label}
      </div>
      <p className="mt-2 text-sm font-medium text-slate-900">{value || "-"}</p>
    </div>
  );
}

export default function UserManagementPage() {
  const workspace = useAdminWorkspace();
  const pageSize = 10;
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  const [editConfirmPassword, setEditConfirmPassword] = useState("");
  const [editPasswordMismatch, setEditPasswordMismatch] = useState(false);
  const [rolesData, setRolesData] = useState(defaultRolesData);
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    employeeId: "",
    role: "",
    department: "",
    status: "active",
  });
  const [newRoleData, setNewRoleData] = useState({
    name: "",
    codePrefix: "",
    permissions: [],
  });
  const [editUserData, setEditUserData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    employeeId: "",
    role: "",
    department: "",
    status: "active",
  });

  const abilities = useMemo(
    () => ({
      canCreateUser: workspace.role === "admin",
      canEditUser: workspace.role === "admin",
      canDeleteUser: workspace.role === "admin",
      canCreateRole: workspace.role === "admin",
    }),
    [workspace.role]
  );

  useEffect(() => {
    const mappedUsers = sortUsersNewestFirst(
      (workspace.users || []).map((user, index) => ({
        id: user?._id || user?.id || user?.email || index + 1,
        createdAt: user?.createdAt || null,
        updatedAt: user?.updatedAt || null,
        username: user?.username || user?.name || "Unknown User",
        email: user?.email || "N/A",
        phone: user?.phone || "N/A",
        role: String(user?.role || "USER").toUpperCase(),
        department: user?.department || "Administration",
        status: String(user?.status || "active").toLowerCase(),
        lastActive: user?.lastLogin
          ? new Date(user.lastLogin).toISOString().split("T")[0]
          : user?.createdAt
            ? new Date(user.createdAt).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        lastLogin: user?.lastLogin || null,
        permissions: Array.isArray(user?.permissions) ? user.permissions : ["Basic Access"],
        secretCode: user?.employeeId || "N/A",
        registrationDate: user?.createdAt
          ? new Date(user.createdAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      }))
    );

    setUsers(mappedUsers);
  }, [workspace.users]);

  const roleOptions = useMemo(
    () => rolesData.map((role) => ({ label: role.label, value: role.name })),
    [rolesData]
  );

  const roleFilterOptions = useMemo(
    () => ["All Roles", ...rolesData.map((role) => role.name)],
    [rolesData]
  );

  const filteredUsers = useMemo(
    () =>
      sortUsersNewestFirst(
        users.filter((user) => {
          const matchesSearch =
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(user.phone || "").includes(searchTerm) ||
            String(user.secretCode || "").toLowerCase().includes(searchTerm.toLowerCase());
          const matchesRole = selectedRole === "All Roles" || user.role === selectedRole;
          const matchesStatus =
            selectedStatus === "All Status" || user.status === selectedStatus;

          return matchesSearch && matchesRole && matchesStatus;
        })
      ),
    [users, searchTerm, selectedRole, selectedStatus]
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredUsers.length / pageSize)),
    [filteredUsers.length]
  );

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredUsers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole, selectedStatus, viewMode]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const openUserDetails = (user) => {
    setActiveUser(user);
    setShowUserDetailsModal(true);
    setSelectedUserId(null);
  };

  const openEditUser = (user) => {
    setActiveUser(user);
    setEditUserData({
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      phone: user?.phone || "",
      employeeId: user?.secretCode || "",
      role: user?.role || "",
      department: user?.department || "",
      status: user?.status || "active",
    });
    setEditConfirmPassword("");
    setEditPasswordMismatch(false);
    setShowEditUserModal(true);
    setSelectedUserId(null);
  };

  const handleRegisterUser = async (payload) => {
    if (!abilities.canCreateUser) {
      window.alert("You do not have permission to register users.");
      return;
    }

    let createdUser = null;

    try {
      const response = await signupUser({
        username: payload.username.trim(),
        email: payload.email.trim(),
        password: payload.password,
        phone: payload.phone,
        employeeId: payload.employeeId.toUpperCase(),
        role: payload.role,
        department: payload.department,
        status: payload.status,
      });

      createdUser = response?.data?.user || null;
    } catch {
      createdUser = null;
    }

    const roleMeta = rolesData.find((item) => item.name === payload.role);
    const nextUser = {
      id: createdUser?._id || createdUser?.id || `${payload.email}-${Date.now()}`,
      createdAt: createdUser?.createdAt || new Date().toISOString(),
      updatedAt: createdUser?.updatedAt || new Date().toISOString(),
      username: createdUser?.username || payload.username,
      email: createdUser?.email || payload.email,
      phone: payload.phone || "N/A",
      role: createdUser?.role || payload.role,
      department: payload.department,
      status: String(createdUser?.status || payload.status || "active").toLowerCase(),
      lastActive: new Date().toISOString().split("T")[0],
      lastLogin: null,
      permissions: roleMeta?.permissions || ["Basic Access"],
      secretCode: createdUser?.employeeId || payload.employeeId.toUpperCase(),
      registrationDate: new Date().toISOString().split("T")[0],
    };

    setUsers((current) => sortUsersNewestFirst([nextUser, ...current]));
  };

  const handleCreateRole = (event) => {
    event.preventDefault();

    if (!abilities.canCreateRole) {
      window.alert("You do not have permission to create roles.");
      return;
    }

    if (!newRoleData.name || !newRoleData.codePrefix || newRoleData.codePrefix.length !== 3) {
      window.alert("Role name and 3-character code prefix are required.");
      return;
    }

    const newRole = {
      name: newRoleData.name.toUpperCase().replace(/\s+/g, "_"),
      label: newRoleData.name,
      codePrefix: newRoleData.codePrefix.toUpperCase(),
      permissions: ["Basic Access"],
      color: "from-gray-600 to-gray-500",
    };

    setRolesData((current) => [...current, newRole]);
    window.alert(
      `Role "${newRoleData.name}" created.\nSample Secret Code: ${generateSecretCode(
        newRoleData.codePrefix.toUpperCase()
      )}`
    );
    setNewRoleData({ name: "", codePrefix: "", permissions: [] });
    setShowNewRoleModal(false);
  };

  const handleUpdateUser = (event) => {
    event.preventDefault();

    if (!abilities.canEditUser || !activeUser?.id) {
      window.alert("You do not have permission to edit users.");
      return;
    }

    if (editUserData.password !== editConfirmPassword) {
      setEditPasswordMismatch(true);
      return;
    }

    setUsers((current) =>
      sortUsersNewestFirst(
        current.map((user) =>
          user.id === activeUser.id
            ? {
                ...user,
                updatedAt: new Date().toISOString(),
                username: editUserData.username,
                email: editUserData.email,
                phone: editUserData.phone,
                role: editUserData.role,
                department: editUserData.department,
                status: String(editUserData.status || "active").toLowerCase(),
                secretCode: editUserData.employeeId,
              }
            : user
        )
      )
    );

    setShowEditUserModal(false);
    setActiveUser(null);
    setShowEditSuccessModal(true);
  };

  const handleDeleteUser = (userId) => {
    if (!abilities.canDeleteUser) {
      window.alert("You do not have permission to delete users.");
      return;
    }

    const user = users.find((item) => item.id === userId) || null;
    if (isProtectedAdminUser(user)) {
      window.alert("Admin user cannot be deleted.");
      return;
    }

    setDeleteCandidate(user);
    setShowDeleteConfirmModal(true);
  };

  return (
    <div className="min-h-screen rounded-[30px] bg-[radial-gradient(1200px_circle_at_top,_#eef2ff,_#ffffff_45%,_#ecfeff_100%)] p-2 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.45)] backdrop-blur">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-700 p-2 shadow-sm">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">User Management</h1>
                <p className="mt-1 text-slate-600">
                  Manage users and secret code registration
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowNewRoleModal(true)}
                disabled={!abilities.canCreateRole}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 font-medium text-white shadow-sm transition hover:from-emerald-600 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus className="h-5 w-5" />
                <span>New Role</span>
              </button>
              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                disabled={!abilities.canCreateUser}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-700 px-4 py-3 font-medium text-white shadow-sm transition hover:to-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <UserPlus className="h-5 w-5" />
                <span>Register User</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-[0_16px_45px_-32px_rgba(15,23,42,0.4)] backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Total Users" value={users.length} gradient="from-cyan-500 via-blue-500 to-indigo-500" />
          <SummaryCard label="Active Users" value={users.filter((user) => user.status === "active").length} gradient="from-emerald-500 via-green-500 to-blue-500" />
          <SummaryCard label="Admin Roles" value={users.filter((user) => ["administrator", "admin"].includes(String(user.role || "").toLowerCase())).length} gradient="from-amber-500 via-orange-500 to-rose-500" />
          <SummaryCard label="Last Login Customer" value={users.filter((user) => user.lastActive === new Date().toISOString().split("T")[0]).length} gradient="from-fuchsia-500 via-purple-500 to-indigo-500" />
        </div>

        <div className="mb-8 rounded-3xl border border-white/70 bg-white/85 p-5 shadow-[0_16px_45px_-32px_rgba(15,23,42,0.35)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name, email, phone, or secret code"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowFilters((current) => !current)}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className={`h-4 w-4 transition ${showFilters ? "rotate-180" : ""}`} />
              </button>

              <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`rounded-xl px-3 py-2 ${viewMode === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-xl px-3 py-2 ${viewMode === "grid" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {showFilters ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <select
                value={selectedRole}
                onChange={(event) => setSelectedRole(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              >
                {roleFilterOptions.map((role) => (
                  <option key={role} value={role}>
                    {role === "All Roles" ? role : formatRoleLabel(role)}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              >
                {["All Status", "active", "pending", "inactive"].map((status) => (
                  <option key={status} value={status}>
                    {status === "All Status"
                      ? status
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>

        {viewMode === "list" ? (
          <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-[0_16px_45px_-32px_rgba(15,23,42,0.35)] backdrop-blur">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {["User", "Email", "Phone", "Role", "Status", "Registered", "Actions"].map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {paginatedUsers.length ? (
                    paginatedUsers.map((user) => (
                      <tr key={String(user.id)}>
                        <td className="px-4 py-4 font-medium text-slate-900">{user.username}</td>
                        <td className="px-4 py-4 text-slate-600">{user.email}</td>
                        <td className="px-4 py-4 text-slate-600">{user.phone}</td>
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            {formatRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-4 py-4">{getStatusBadge(user.status)}</td>
                        <td className="px-4 py-4 text-slate-600">{formatDate(user.createdAt)}</td>
                        <td className="px-4 py-4">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedUserId((current) =>
                                  current === user.id ? null : user.id
                                )
                              }
                              className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>

                            {selectedUserId === user.id ? (
                              <div className="absolute right-0 top-12 z-20 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                                <button type="button" onClick={() => openUserDetails(user)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50">
                                  <Eye className="h-4 w-4" />
                                  View
                                </button>
                                <button type="button" onClick={() => openEditUser(user)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50">
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </button>
                                <button type="button" onClick={() => handleDeleteUser(user.id)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-rose-600 transition hover:bg-rose-50">
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-10 text-center text-slate-500">
                        No user data is available yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {paginatedUsers.map((user) => (
              <article
                key={String(user.id)}
                className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_16px_45px_-32px_rgba(15,23,42,0.35)] backdrop-blur"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{user.username}</p>
                    <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                  </div>
                  {getStatusBadge(user.status)}
                </div>

                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    {user.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-slate-400" />
                    {formatRoleLabel(user.role)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-slate-400" />
                    {user.secretCode}
                    <button
                      type="button"
                      onClick={() => navigator.clipboard?.writeText(String(user.secretCode || ""))}
                      className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button type="button" onClick={() => openUserDetails(user)} className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    View
                  </button>
                  <button type="button" onClick={() => openEditUser(user)} className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDeleteUser(user.id)} className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50">
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/70 bg-white/85 px-5 py-4 shadow-[0_16px_45px_-32px_rgba(15,23,42,0.35)] backdrop-blur sm:flex-row">
          <p className="text-sm text-slate-500">
            Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((current) => Math.max(1, current - 1))}
              disabled={currentPage === 1}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 text-sm font-medium text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((current) => Math.min(totalPages, current + 1))}
              disabled={currentPage === totalPages}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <RegisterUserModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSubmit={handleRegisterUser}
        registerData={registerData}
        setRegisterData={setRegisterData}
        canCreateUser={abilities.canCreateUser}
        roleOptions={roleOptions}
      />

      <NewRoleModal
        isOpen={showNewRoleModal}
        onClose={() => setShowNewRoleModal(false)}
        onSubmit={handleCreateRole}
        newRoleData={newRoleData}
        setNewRoleData={setNewRoleData}
      />

      {showUserDetailsModal && activeUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">{activeUser.username}</h2>
                <p className="mt-1 text-sm text-slate-500">Full user account details</p>
              </div>
              <button type="button" onClick={() => setShowUserDetailsModal(false)} className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <DetailRow label="Email" value={activeUser.email} icon={Mail} />
              <DetailRow label="Phone" value={activeUser.phone} icon={Phone} />
              <DetailRow label="Role" value={formatRoleLabel(activeUser.role)} icon={Shield} />
              <DetailRow label="Status" value={activeUser.status} icon={CheckCircle} />
              <DetailRow label="Secret Code" value={activeUser.secretCode} icon={Key} />
              <DetailRow label="Registered" value={formatDate(activeUser.createdAt)} icon={Calendar} />
              <DetailRow label="Department" value={activeUser.department} />
              <DetailRow label="Last Active" value={activeUser.lastActive} />
            </div>
          </div>
        </div>
      ) : null}

      {showEditUserModal && activeUser ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 p-4 pt-16 backdrop-blur-sm sm:pt-20">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200/70 bg-white/95 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)]">
            <div className="flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-700 p-6">
              <h2 className="text-2xl font-semibold text-white">Edit User</h2>
              <button type="button" onClick={() => setShowEditUserModal(false)} className="rounded-full p-2 text-white/90 transition hover:bg-white/10 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {[
                  ["Name *", "username", "text"],
                  ["Email *", "email", "email"],
                  ["Phone", "phone", "tel"],
                  ["Employee ID *", "employeeId", "text"],
                ].map(([label, key, type]) => (
                  <div key={key}>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">{label}</label>
                    <input
                      type={type}
                      value={editUserData[key]}
                      onChange={(event) => {
                        setEditUserData((current) => ({ ...current, [key]: event.target.value }));
                        setEditPasswordMismatch(false);
                      }}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      required={label.includes("*")}
                    />
                  </div>
                ))}

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">Password</label>
                  <input
                    type="password"
                    value={editUserData.password}
                    onChange={(event) => {
                      setEditUserData((current) => ({ ...current, password: event.target.value }));
                      setEditPasswordMismatch(false);
                    }}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">Confirm Password</label>
                  <input
                    type="password"
                    value={editConfirmPassword}
                    onChange={(event) => {
                      setEditConfirmPassword(event.target.value);
                      setEditPasswordMismatch(false);
                    }}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  {editPasswordMismatch ? (
                    <p className="mt-1.5 text-xs text-rose-600">Passwords are mismatched.</p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">Role *</label>
                  <select
                    value={editUserData.role}
                    onChange={(event) =>
                      setEditUserData((current) => ({ ...current, role: event.target.value }))
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
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">Department *</label>
                  <input
                    type="text"
                    value={editUserData.department}
                    onChange={(event) =>
                      setEditUserData((current) => ({ ...current, department: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">Status *</label>
                  <select
                    value={editUserData.status}
                    onChange={(event) =>
                      setEditUserData((current) => ({ ...current, status: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    required
                  >
                    {["active", "pending", "inactive"].map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditUserModal(false);
                    setActiveUser(null);
                  }}
                  className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!abilities.canEditUser}
                  className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-2 text-sm font-semibold text-white transition hover:from-emerald-700 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showEditSuccessModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200/70 bg-white/95 p-6 text-center shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)]">
            <p className="text-lg font-semibold text-slate-900">User updated successfully</p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setShowEditSuccessModal(false)}
                className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-2 font-medium text-white transition hover:from-emerald-700 hover:to-teal-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showDeleteConfirmModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)]">
            <p className="text-center text-lg font-semibold text-slate-900">
              Are you sure want to delete {deleteCandidate?.username || "this user"}?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  if (deleteCandidate?.id != null) {
                    setUsers((current) =>
                      current.filter((user) => user.id !== deleteCandidate.id)
                    );
                  }
                  setShowDeleteConfirmModal(false);
                  setDeleteCandidate(null);
                }}
                className="rounded-xl bg-rose-600 px-6 py-2 font-medium text-white transition hover:bg-rose-700"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setDeleteCandidate(null);
                }}
                className="rounded-xl border border-slate-200 px-6 py-2 font-medium text-slate-700 transition hover:bg-slate-50"
              >
                No
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
