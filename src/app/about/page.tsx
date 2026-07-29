import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, HeartHandshake, RefreshCw, Truck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex-1 bg-[#FAFAF8] text-[#111827] space-y-16 py-12 px-6 sm:px-8 max-w-7xl mx-auto animate-fade-in">
      {/* Editorial Hero Banner */}
      <section className="relative overflow-hidden border border-[#E7E5E4] rounded-2xl bg-white p-8 sm:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">
            OUR PHILOSOPHY
          </span>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111827] leading-tight">
            Designed for Everyday. Crafted for Timeless Style.
          </h1>

          <p className="text-sm text-[#6B7280] leading-relaxed">
            NEXT.IN was founded with a singular purpose: to craft architectural, high-grade clothing staples that transcend short-lived trend cycles. We believe in quiet luxury, tactile organic materials, and honest tailorship.
          </p>

          <div>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#111827] hover:bg-[#27272A] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-all"
            >
              Explore Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#F4F4F0] border border-[#E7E5E4]">
            <img
              src="/cos_style_editorial_hero_1785261534310.png"
              alt="Editorial Brand Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xl font-bold uppercase tracking-wider text-[#111827]">Core Brand Values</h2>
          <p className="text-xs text-[#6B7280]">The standards that guide every garment we produce</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 space-y-3">
            <Sparkles className="w-6 h-6 text-[#111827]" />
            <h3 className="font-bold text-sm text-[#111827]">Premium Quality</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">Heavyweight combed cotton, Japanese denims, and pure linen weaves built to last.</p>
          </div>

          <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 space-y-3">
            <ShieldCheck className="w-6 h-6 text-[#111827]" />
            <h3 className="font-bold text-sm text-[#111827]">Timeless Design</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">Minimalist geometric cuts that remain effortlessly relevant across seasons.</p>
          </div>

          <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 space-y-3">
            <HeartHandshake className="w-6 h-6 text-[#111827]" />
            <h3 className="font-bold text-sm text-[#111827]">Fair & Direct Pricing</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">Direct-to-consumer craftsmanship without unnecessary retail markups.</p>
          </div>

          <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 space-y-3">
            <Truck className="w-6 h-6 text-[#111827]" />
            <h3 className="font-bold text-sm text-[#111827]">Customer First</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">Encrypted Razorpay checkout, express domestic shipping, and 14-day hassle-free exchanges.</p>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="bg-white border border-[#E7E5E4] rounded-2xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-xl font-bold uppercase tracking-wider text-[#111827]">Our Promise To You</h2>
        <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
          Every piece in your order undergoes rigorous quality inspection prior to dispatch. If a garment does not exceed your expectations, our dedicated concierge support is here to assist you immediately.
        </p>
      </section>
    </div>
  );
}
