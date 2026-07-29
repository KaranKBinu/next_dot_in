export default function LegalPage({ title, sections }: { title: string; sections: { heading: string; body: string }[] }) {
  return (
    <div className="flex-1 bg-[#FAFAF8] text-[#111827] py-12 px-6 sm:px-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="border-b border-[#E7E5E4] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#111827]">{title}</h1>
        <p className="text-xs text-[#6B7280] mt-1">Last updated: January 2026 • NEXT.IN Apparel Legal Team</p>
      </div>

      <div className="bg-white border border-[#E7E5E4] rounded-2xl p-8 space-y-8 text-xs leading-relaxed">
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827]">{sec.heading}</h2>
            <p className="text-[#6B7280]">{sec.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      sections={[
        { heading: "1. Information We Collect", body: "We collect customer details including name, shipping address, email address, and phone number required for order fulfillment." },
        { heading: "2. Payment Information & Security", body: "All transaction payments are processed via end-to-end encrypted Razorpay gateways. NEXT.IN never stores raw credit card credentials." },
        { heading: "3. User Data Rights", body: "Customers retain full rights to update, review, or request deletion of personal account records at any time by contacting privacy@next.in." },
      ]}
    />
  );
}

export function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      sections={[
        { heading: "1. Acceptance of Terms", body: "By accessing NEXT.IN and placing orders, you agree to comply with our store operating policies and pricing schedules." },
        { heading: "2. Product Availability", body: "Garment listings and pricing are subject to availability. NEXT.IN reserves the right to modify inventory levels without prior notice." },
      ]}
    />
  );
}

export function ShippingPolicyPage() {
  return (
    <LegalPage
      title="Shipping Policy"
      sections={[
        { heading: "1. Dispatch Timelines", body: "All orders are processed and dispatched from our Kochi studio within 24–48 business hours." },
        { heading: "2. Shipping Fees", body: "We offer complimentary standard domestic shipping across India on orders above ₹1,999." },
      ]}
    />
  );
}

export function ReturnPolicyPage() {
  return (
    <LegalPage
      title="Return & Refund Policy"
      sections={[
        { heading: "1. 14-Day Return Window", body: "Items in unworn condition with original tags attached can be returned or exchanged within 14 days of delivery." },
        { heading: "2. Refund Processing", body: "Refunds are processed back to your original payment method within 5–7 business days following item inspection." },
      ]}
    />
  );
}

export function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      sections={[
        { heading: "1. How We Use Cookies", body: "We use essential cookies to maintain your shopping bag items and account session state." },
      ]}
    />
  );
}

export function AccessibilityStatementPage() {
  return (
    <LegalPage
      title="Accessibility Statement"
      sections={[
        { heading: "1. Our Commitment", body: "NEXT.IN is dedicated to ensuring digital accessibility for people with disabilities, enforcing WCAG 2.1 standards across all pages." },
      ]}
    />
  );
}
