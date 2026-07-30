"use client";

import { useState } from "react";
import { AlertTriangle, Power, ShieldAlert, Archive } from "lucide-react";
import { masterBulkUnpublishAction, masterEnableMaintenanceModeAction } from "@/app/actions/master";

export default function AdminMasterDangerZoneClient({ isMaintenanceMode }: { isMaintenanceMode: boolean }) {
  const [maintenance, setMaintenance] = useState(isMaintenanceMode);
  const [confirmBulk, setConfirmBulk] = useState(false);
  const [bulkInput, setBulkInput] = useState("");
  const [msg, setMsg] = useState<{ error?: string; success?: string } | null>(null);

  const handleToggleMaintenance = async () => {
    const nextState = !maintenance;
    if (!confirm(`Are you sure you want to ${nextState ? "ENABLE" : "DISABLE"} Maintenance Mode?`)) return;

    setMsg(null);
    const res = await masterEnableMaintenanceModeAction(nextState);
    if (res.success) {
      setMaintenance(nextState);
      setMsg({ success: `Maintenance mode ${nextState ? "ENABLED" : "DISABLED"}.` });
    } else {
      setMsg({ error: res.error });
    }
  };

  const handleBulkUnpublish = async () => {
    if (bulkInput !== "UNPUBLISH ALL") {
      alert('Please type "UNPUBLISH ALL" to confirm.');
      return;
    }

    setMsg(null);
    const res = await masterBulkUnpublishAction();
    if (res.success) {
      setConfirmBulk(false);
      setBulkInput("");
      setMsg({ success: `Bulk action executed: ${res.count} products unpublished.` });
    } else {
      setMsg({ error: res.error });
    }
  };

  return (
    <div className="space-y-6">
      {msg && (
        <div
          className={`p-3.5 rounded-lg text-xs font-semibold ${
            msg.success ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {msg.success || msg.error}
        </div>
      )}

      {/* Maintenance Mode Override */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 space-y-4 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#111827]">Store Maintenance Mode</h3>
              <span
                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                  maintenance ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-emerald-50 text-emerald-800 border-emerald-200"
                }`}
              >
                {maintenance ? "Active" : "Disabled"}
              </span>
            </div>
            <p className="text-xs text-[#6B7280]">
              Temporarily restrict storefront browsing and order placement to administrators. Existing data is preserved.
            </p>
          </div>

          <button
            onClick={handleToggleMaintenance}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
              maintenance
                ? "bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-700"
                : "bg-[#111827] hover:bg-[#27272A] text-white border-[#111827]"
            }`}
          >
            {maintenance ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
          </button>
        </div>
      </div>

      {/* Bulk Product Unpublish */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 space-y-4 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#111827] font-bold text-sm">
              <Archive className="w-4 h-4 text-[#111827]" />
              <span>Bulk Unpublish Products</span>
            </div>
            <p className="text-xs text-[#6B7280]">
              Instantly set all published products to draft mode (`isPublished = false`). Products remain in the database but are hidden from the storefront.
            </p>
          </div>

          <button
            onClick={() => setConfirmBulk(true)}
            className="px-4 py-2.5 bg-[#111827] hover:bg-[#27272A] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
          >
            Unpublish All Products
          </button>
        </div>
      </div>

      {/* Double Confirmation Modal */}
      {confirmBulk && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-rose-300 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-700" />
              <span>Confirm Destruction Action</span>
            </div>

            <p className="text-xs text-[#6B7280] leading-relaxed">
              This action will unpublish <strong>all items</strong> in your store catalog. To confirm this destructive override, type <strong className="text-rose-800">UNPUBLISH ALL</strong> below.
            </p>

            <input
              type="text"
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              placeholder='Type "UNPUBLISH ALL"'
              className="w-full p-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-rose-700"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setConfirmBulk(false);
                  setBulkInput("");
                }}
                className="px-4 py-2 border border-[#E7E5E4] rounded-lg text-xs font-bold uppercase text-[#6B7280]"
              >
                Cancel
              </button>

              <button
                disabled={bulkInput !== "UNPUBLISH ALL"}
                onClick={handleBulkUnpublish}
                className="px-4 py-2 bg-rose-800 hover:bg-rose-900 disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
              >
                Execute Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
