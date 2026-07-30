"use client";

import { useState } from "react";
import { Search, Filter, ShieldAlert, Clock, UserCheck } from "lucide-react";

export default function AdminAuditLogsClient({ initialLogs }: { initialLogs: any[] }) {
  const [logs, setLogs] = useState(initialLogs);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [entityFilter, setEntityFilter] = useState("ALL");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.email.toLowerCase().includes(search.toLowerCase()) ||
      (log.actor.name && log.actor.name.toLowerCase().includes(search.toLowerCase())) ||
      (log.entityId && log.entityId.toLowerCase().includes(search.toLowerCase()));

    const matchesAction = actionFilter === "ALL" || log.action === actionFilter;
    const matchesEntity = entityFilter === "ALL" || log.entityType === entityFilter;

    return matchesSearch && matchesAction && matchesEntity;
  });

  // Extract unique actions and entityTypes for filters
  const uniqueActions = Array.from(new Set(logs.map((l) => l.action)));
  const uniqueEntities = Array.from(new Set(logs.map((l) => l.entityType)));

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search logs by action, actor email, or entity ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs font-medium focus:outline-none focus:border-[#111827]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-[#6B7280]" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#111827]"
            >
              <option value="ALL">All Actions</option>
              {uniqueActions.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>

          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#111827]"
          >
            <option value="ALL">All Entity Types</option>
            {uniqueEntities.map((ent) => (
              <option key={ent} value={ent}>
                {ent}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFAF8] border-b border-[#E7E5E4] text-[10px] uppercase font-extrabold text-[#6B7280] tracking-wider">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Action</th>
                <th className="p-4">Entity</th>
                <th className="p-4">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E5E4] text-xs font-medium">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#9CA3AF] uppercase tracking-wider">
                    No audit logs match the specified search parameters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="p-4 text-[11px] text-[#6B7280] font-mono whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString("en-IN")}
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-[#111827]">{log.actor.name || "System"}</div>
                      <div className="text-[10px] text-[#6B7280]">{log.actor.email}</div>
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[#111827] font-mono text-[10px] font-bold uppercase">
                        {log.action}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-[#111827]">{log.entityType}</div>
                      {log.entityId && <div className="text-[10px] text-[#6B7280] font-mono truncate max-w-[150px]">{log.entityId}</div>}
                    </td>

                    <td className="p-4 font-mono text-[10px] text-[#6B7280]">
                      {log.metadata ? JSON.stringify(log.metadata) : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
