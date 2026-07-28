import { getSystemSettings } from "@/lib/settings";
import SettingsToggleClient from "@/components/SettingsToggleClient";

export default async function AdminSettingsPage() {
  const settings = await getSystemSettings();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">System Settings</h1>
        <p className="text-xs text-[#6B7280] mt-0.5">Toggle optional storefront modules</p>
      </div>

      <div className="bg-white border border-[#E7E5E4] rounded-md p-6 divide-y divide-[#E7E5E4]">
        <SettingsToggleClient
          settingKey="wishlist_enabled"
          title="Customer Wishlists"
          description="Allow customers to save products to a personal wishlist."
          initialValue={settings.wishlist_enabled}
        />

        <SettingsToggleClient
          settingKey="reviews_enabled"
          title="Product Reviews"
          description="Enable customer rating and review submissions on product pages."
          initialValue={settings.reviews_enabled}
        />

        <SettingsToggleClient
          settingKey="coupons_enabled"
          title="Coupon & Promo Code Support"
          description="Enable coupon code inputs during checkout."
          initialValue={settings.coupons_enabled}
        />

        <SettingsToggleClient
          settingKey="featured_products_enabled"
          title="Featured Products Section"
          description="Show featured products grid on homepage."
          initialValue={settings.featured_products_enabled}
        />

        <SettingsToggleClient
          settingKey="ai_intake_enabled"
          title="AI Photo Intake Helper"
          description="Enable automatic categorization and tagging during product creation."
          initialValue={settings.ai_intake_enabled}
        />
      </div>
    </div>
  );
}
