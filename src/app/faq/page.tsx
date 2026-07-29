"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Standard domestic shipping takes 3–5 business days across India. Express shipping options arrive within 1–2 business days.",
      category: "Shipping",
    },
    {
      question: "Can I return or exchange a product?",
      answer: "Yes! We accept returns and exchanges within 14 days of delivery provided items are unworn with original tags attached.",
      category: "Returns",
    },
    {
      question: "How can I track my order?",
      answer: "Once dispatched, you will receive an SMS and email notification containing your live tracking ID and Razorpay shipping details.",
      category: "Orders",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We support Credit/Debit Cards, UPI (GPay, PhonePe, Paytm), NetBanking, and Cash on Delivery through our secure Razorpay integration.",
      category: "Payments",
    },
    {
      question: "How do I choose the correct garment size?",
      answer: "Each product page includes a precise size guide with chest, length, and waist measurements in inches.",
      category: "Products",
    },
  ];

  return (
    <div className="flex-1 bg-[#FAFAF8] text-[#111827] py-12 px-6 sm:px-8 max-w-4xl mx-auto space-y-12 animate-fade-in">
      <div className="text-center space-y-2">
        <HelpCircle className="w-8 h-8 text-[#111827] mx-auto" />
        <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Help Center & FAQs</h1>
        <p className="text-xs text-[#6B7280]">Frequently asked questions regarding orders, shipping, and store policies</p>
      </div>

      <div className="bg-white border border-[#E7E5E4] rounded-2xl divide-y divide-[#E7E5E4] overflow-hidden">
        {faqs.map((faq, idx) => (
          <div key={idx} className="p-5 text-xs">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full flex items-center justify-between text-left font-bold text-[#111827] text-sm"
            >
              <span>{faq.question}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openIndex === idx ? "rotate-180" : ""}`} />
            </button>

            {openIndex === idx && (
              <p className="mt-3 text-xs text-[#6B7280] leading-relaxed animate-fade-in">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
