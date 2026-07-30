"use client";

import { useState } from "react";
import { UserPlus, Search, ShieldAlert, KeyRound, Trash2, Filter } from "lucide-react";
import {
  createUserAction,
  updateUserRoleAction,
  resetUserPasswordAction,
  deleteUserAction,
} from "@/app/actions/user-management";

export default function AdminUsersClient({
  initialUsers,
  currentUserId,
}: {
  initialUsers: any[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [resetModalUserId, setResetModalUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState<{ error?: string; success?: string } | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
      (u.phone && u.phone.includes(search));

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);
    const formData = new FormData(e.currentTarget);
    const res = await createUserAction(formData);

    if (res.success && res.user) {
      setUsers((prev) => [res.user, ...prev]);
      setShowCreateModal(false);
      setMsg({ success: "User account created successfully." });
    } else {
      setMsg({ error: res.error });
    }
  };

  const handleRoleChange = async (userId: string, newRole: "CUSTOMER" | "ADMIN" | "MASTER_ADMIN") => {
    setMsg(null);
    const res = await updateUserRoleAction(userId, newRole);
    if (res.success) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      setMsg({ success: "User role updated successfully." });
    } else {
      setMsg({ error: res.error });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalUserId || !newPassword) return;
    setMsg(null);

    const res = await resetUserPasswordAction(resetModalUserId, newPassword);
    if (res.success) {
      setResetModalUserId(null);
      setNewPassword("");
      setMsg({ success: "User password reset successfully." });
    } else {
      setMsg({ error: res.error });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    setMsg(null);

    const res = await deleteUserAction(userId);
    if (res.success) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setMsg({ success: "User account deleted." });
    } else {
      setMsg({ error: res.error });
    }
  };

  return (
    <div className="space-y-4">
      {msg && (
        <div
          className={`p-3.5 rounded-lg text-xs font-semibold ${
            msg.success ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {msg.success || msg.error}
        </div>
      )}

      {/* Controls Bar */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs font-medium focus:outline-none focus:border-[#111827]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-[#6B7280]" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#111827]"
            >
              <option value="ALL">All Roles</option>
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
              <option value="MASTER_ADMIN">Master Admin</option>
            </select>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-[#111827] hover:bg-[#27272A] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 cursor-pointer transition-all"
          >
            <UserPlus className="w-4 h-4" /> Create User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFAF8] border-b border-[#E7E5E4] text-[10px] uppercase font-extrabold text-[#6B7280] tracking-wider">
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Reviews</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E5E4] text-xs font-medium">
              {filteredUsers.map((u) => {
                const isSelf = u.id === currentUserId;
                return (
                  <tr key={u.id} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-[#111827] flex items-center gap-1.5">
                        <span>{u.name || "Unnamed User"}</span>
                        {isSelf && (
                          <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#6B7280]">{u.email}</div>
                    </td>

                    <td className="p-4">
                      <select
                        disabled={isSelf}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                        className={`border rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                          u.role === "MASTER_ADMIN"
                            ? "bg-rose-50 border-rose-300 text-rose-800"
                            : u.role === "ADMIN"
                            ? "bg-blue-50 border-blue-300 text-blue-800"
                            : "bg-[#FAFAF8] border-[#E7E5E4] text-[#111827]"
                        } disabled:opacity-50`}
                      >
                        <option value="CUSTOMER">Customer</option>
                        <option value="ADMIN">Admin</option>
                        <option value="MASTER_ADMIN">Master Admin</option>
                      </select>
                    </td>

                    <td className="p-4 font-bold text-[#111827]">{u._count?.orders || 0}</td>
                    <td className="p-4 font-bold text-[#111827]">{u._count?.reviews || 0}</td>

                    <td className="p-4 text-[11px] text-[#6B7280]">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setResetModalUserId(u.id)}
                          className="p-1.5 rounded hover:bg-slate-100 text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer"
                          title="Reset Password"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>

                        <button
                          disabled={isSelf}
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 rounded hover:bg-rose-50 text-rose-600 transition-colors disabled:opacity-30 cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#E7E5E4] rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Create New User Account</h3>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#6B7280] uppercase tracking-wider block mb-1">Full Name</label>
                <input required name="name" type="text" className="w-full p-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg" />
              </div>
              <div>
                <label className="font-bold text-[#6B7280] uppercase tracking-wider block mb-1">Email</label>
                <input required name="email" type="email" className="w-full p-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg" />
              </div>
              <div>
                <label className="font-bold text-[#6B7280] uppercase tracking-wider block mb-1">Password</label>
                <input required name="password" type="password" className="w-full p-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg" />
              </div>
              <div>
                <label className="font-bold text-[#6B7280] uppercase tracking-wider block mb-1">Account Role</label>
                <select name="role" className="w-full p-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg font-bold uppercase">
                  <option value="CUSTOMER">Customer</option>
                  <option value="ADMIN">Admin</option>
                  <option value="MASTER_ADMIN">Master Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-[#E7E5E4] rounded-lg font-bold uppercase text-[#6B7280]"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#111827] text-white rounded-lg font-bold uppercase">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetModalUserId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#E7E5E4] rounded-xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Reset User Password</h3>
            <form onSubmit={handleResetPassword} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#6B7280] uppercase tracking-wider block mb-1">New Password</label>
                <input
                  required
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full p-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setResetModalUserId(null)}
                  className="px-4 py-2 border border-[#E7E5E4] rounded-lg font-bold uppercase text-[#6B7280]"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#111827] text-white rounded-lg font-bold uppercase">
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
