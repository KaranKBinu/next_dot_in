"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, Clock, MapPin, CheckCircle2, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex-1 bg-[#FAFAF8] text-[#111827] space-y-16 py-12 px-6 sm:px-8 max-w-7xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Contact Customer Concierge</h1>
        <p className="text-xs text-[#6B7280] mt-1">Get in touch with our team regarding orders, sizing, or general inquiries</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E7E5E4] rounded-2xl p-6 space-y-6 text-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Reach Us Directly</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#111827] mt-0.5" />
                <div>
                  <p className="font-bold text-[#111827]">Email Support</p>
                  <p className="text-[#6B7280]">support@next.in</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#111827] mt-0.5" />
                <div>
                  <p className="font-bold text-[#111827]">Phone Concierge</p>
                  <p className="text-[#6B7280]">+91 1800 123 4567</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#111827] mt-0.5" />
                <div>
                  <p className="font-bold text-[#111827]">Business Hours</p>
                  <p className="text-[#6B7280]">Monday – Saturday: 9:00 AM – 7:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#111827] mt-0.5" />
                <div>
                  <p className="font-bold text-[#111827]">Design Studio & HQ</p>
                  <p className="text-[#6B7280]">NEXT.IN Apparel Studio, MG Road, Kochi, Kerala 682016</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-[#E7E5E4] rounded-2xl p-8 space-y-6 text-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Send Us A Message</h2>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" /> Message Sent Successfully!
                </div>
                <p className="text-xs text-emerald-700">Thank you for reaching out. A customer support specialist will respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full mt-1 px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs text-[#111827]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full mt-1 px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs text-[#111827]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Order Inquiry / Sizing Help"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs text-[#111827]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs text-[#111827]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#111827] hover:bg-[#27272A] text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-all"
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
