"use client";

import { useState } from "react";
import { ShieldCheck, ShieldAlert, KeyRound, Lock, UserCheck, AlertTriangle } from "lucide-react";
import { resetUserPasswordAction } from "@/app/actions/user-management";

export default function AdminMasterSecurityClient({
  currentMaster,
  masterAdmins,
  admins,
  recentSecurityAudits,
}: {
  currentMaster: any;
  masterAdmins: any[];
  admins: any[];
  recentSecurityAudits: any[];
}) {
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Current Active Master Status */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6B7280]">
              Active Session Security
            </span>
            <h3 className="text-sm font-bold text-[#111827]">
              Authenticated as Master Admin ({currentMaster.email})
            </h3>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Session protected with HTTP-only tokens, strict SameSite policies, and server-side authorization checks.
            </p>
          </div>
        </div>
      </div>

      {/* Administrative Roster */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Master Admins */}
        <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-700" /> Master Admins ({masterAdmins.length})
          </h3>
          <div className="divide-y divide-[#E7E5E4]">
            {masterAdmins.map((m) => (
              <div key={m.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#111827]">{m.name || m.email}</span>
                  <p className="text-[10px] text-[#6B7280]">{m.email}</p>
                </div>
                <span className="text-[10px] font-bold uppercase bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded">
                  Full Authority
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Standard Admins */}
        <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#111827]" /> Store Admins ({admins.length})
          </h3>
          <div className="divide-y divide-[#E7E5E4]">
            {admins.length === 0 ? (
              <p className="text-xs text-[#9CA3AF] py-3">No standard admin accounts created.</p>
            ) : (
              admins.map((a) => (
                <div key={a.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#111827]">{a.name || a.email}</span>
                    <p className="text-[10px] text-[#6B7280]">{a.email}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded">
                    Store Admin
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Security Audit Trail */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 space-y-4 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
          Recent Privilege & Authentication Events
        </h3>
        <div className="divide-y divide-[#E7E5E4] text-xs">
          {recentSecurityAudits.length === 0 ? (
            <p className="text-[#9CA3AF] py-3 text-center">No security audit events recorded.</p>
          ) : (
            recentSecurityAudits.map((a) => (
              <div key={a.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#111827] font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100">
                    {a.action}
                  </span>
                  <span className="text-[#6B7280] ml-2">by {a.actor?.email}</span>
                </div>
                <span className="text-[10px] font-mono text-[#9CA3AF]">
                  {new Date(a.timestamp).toLocaleString("en-IN")}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
