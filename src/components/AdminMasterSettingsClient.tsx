"use client";

import { useState } from "react";
import { Store, ShoppingCart, Heart, Sparkles, Shield, ToggleLeft, ToggleRight, History } from "lucide-react";
import { masterUpdateSettingAction } from "@/app/actions/master";

export default function AdminMasterSettingsClient({
  settings,
  featureAudits,
}: {
  settings: Record<string, boolean>;
  featureAudits: any[];
}) {
  const [currentSettings, setCurrentSettings] = useState(settings);
  const [activeTab, setActiveTab] = useState<"store" | "checkout" | "customer" | "experience" | "admin" | "audits">("store");
  const [msg, setMsg] = useState<string | null>(null);

  const handleToggle = async (key: string) => {
    const newValue = !currentSettings[key];
    const res = await masterUpdateSettingAction(key, String(newValue));
    if (res.success) {
      setCurrentSettings((prev) => ({ ...prev, [key]: newValue }));
      setMsg(`Setting "${key}" updated.`);
      setTimeout(() => setMsg(null), 3000);
    } else {
      alert(res.error);
    }
  };

  const featureList = [
    { key: "wishlist_enabled", name: "Wishlist & Favorites", category: "customer", desc: "Allow customers to save garments to personal wishlist grids." },
    { key: "reviews_enabled", name: "Product Reviews System", category: "customer", desc: "Enable customer ratings, verified purchase reviews, and moderation." },
    { key: "coupons_enabled", name: "Coupons & Promotions", category: "checkout", desc: "Allow promotional discount codes during checkout." },
    { key: "featured_products_enabled", name: "Featured Collections Grid", category: "experience", desc: "Display curated hero product carousels on the homepage." },
    { key: "ai_intake_enabled", name: "AI Catalog Intake Helper", category: "experience", desc: "Enable automated attribute parsing for product uploads." },
    { key: "guest_checkout_enabled", name: "Guest Checkout", category: "checkout", desc: "Allow customers to place orders without creating an account." },
    { key: "maintenance_mode", name: "Platform Maintenance Mode", category: "admin", desc: "Restrict storefront access to administrators only." },
  ];

  return (
    <div className="space-y-6">
      {msg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
          {msg}
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-[#E7E5E4] space-x-4 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab("store")}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === "store" ? "border-[#111827] text-[#111827]" : "border-transparent text-[#6B7280] hover:text-[#111827]"
          }`}
        >
          Store Specs
        </button>

        <button
          onClick={() => setActiveTab("checkout")}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === "checkout" ? "border-[#111827] text-[#111827]" : "border-transparent text-[#6B7280] hover:text-[#111827]"
          }`}
        >
          Checkout Rules
        </button>

        <button
          onClick={() => setActiveTab("customer")}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === "customer" ? "border-[#111827] text-[#111827]" : "border-transparent text-[#6B7280] hover:text-[#111827]"
          }`}
        >
          Customer Features
        </button>

        <button
          onClick={() => setActiveTab("experience")}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === "experience" ? "border-[#111827] text-[#111827]" : "border-transparent text-[#6B7280] hover:text-[#111827]"
          }`}
        >
          Storefront Experience
        </button>

        <button
          onClick={() => setActiveTab("admin")}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === "admin" ? "border-[#111827] text-[#111827]" : "border-transparent text-[#6B7280] hover:text-[#111827]"
          }`}
        >
          System & Maintenance
        </button>

        <button
          onClick={() => setActiveTab("audits")}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === "audits" ? "border-[#111827] text-[#111827]" : "border-transparent text-[#6B7280] hover:text-[#111827]"
          }`}
        >
          Feature Flag Logs
        </button>
      </div>

      {/* Feature Toggles List */}
      {activeTab !== "audits" && (
        <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 space-y-4 shadow-xs">
          <div className="divide-y divide-[#E7E5E4]">
            {featureList
              .filter((f) => activeTab === "store" || f.category === activeTab)
              .map((feature) => {
                const isEnabled = !!currentSettings[feature.key];
                const lastAudit = featureAudits.find((a) => a.entityId === feature.key);

                return (
                  <div key={feature.key} className="py-4 flex items-center justify-between gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#111827]">{feature.name}</span>
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                            isEnabled ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"
                          }`}
                        >
                          {isEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280]">{feature.desc}</p>
                      {lastAudit && (
                        <p className="text-[10px] text-[#9CA3AF]">
                          Last updated by {lastAudit.actor?.name || lastAudit.actor?.email} (
                          {new Date(lastAudit.timestamp).toLocaleDateString("en-IN")})
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggle(feature.key)}
                      className="p-2 cursor-pointer text-[#111827] hover:scale-105 transition-all"
                    >
                      {isEnabled ? (
                        <ToggleRight className="w-8 h-8 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-[#9CA3AF]" />
                      )}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Feature Flag Logs */}
      {activeTab === "audits" && (
        <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Feature Flag Change History</h3>
          <div className="divide-y divide-[#E7E5E4] text-xs">
            {featureAudits.length === 0 ? (
              <p className="text-[#9CA3AF] py-4 text-center">No setting modification logs found.</p>
            ) : (
              featureAudits.map((a) => (
                <div key={a.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#111827]">{a.entityId}</span>
                    <span className="text-[#6B7280] ml-2">modified by {a.actor?.email}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#9CA3AF]">
                    {new Date(a.timestamp).toLocaleString("en-IN")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
