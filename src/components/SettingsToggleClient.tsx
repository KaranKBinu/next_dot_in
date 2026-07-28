"use client";

import { useState } from "react";
import { toggleSettingAction } from "@/app/actions/settings";

export default function SettingsToggleClient({
  settingKey,
  title,
  description,
  initialValue,
}: {
  settingKey: string;
  title: string;
  description: string;
  initialValue: boolean;
}) {
  const [enabled, setEnabled] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const newValue = !enabled;
    const res = await toggleSettingAction(settingKey, newValue);
    if (res.success) {
      setEnabled(newValue);
    }
    setLoading(false);
  };

  return (
    <div className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
      <div>
        <h3 className="font-bold text-[#111827] text-xs uppercase tracking-wider">{title}</h3>
        <p className="text-xs text-[#6B7280] mt-0.5">{description}</p>
      </div>

      <button
        onClick={handleToggle}
        disabled={loading}
        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
          enabled ? "bg-[#111827] justify-end" : "bg-[#E7E5E4] justify-start"
        }`}
      >
        <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
      </button>
    </div>
  );
}
