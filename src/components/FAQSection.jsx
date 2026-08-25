import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { faqsData } from '../data/faqs';
import { generateWhatsAppUrl } from '../utils/whatsappHelper';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faqs" className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 mr-1 text-amber-500" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Everything you need to know about Guru Travel's services, booking workflow, and policies.
          </p>
        </div>

        <div className="space-y-3">
          {faqsData.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200/80 rounded-2xl overflow-hidden transition-colors duration-200 bg-white shadow-subtle"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-amber-600 transition-colors focus:outline-none"
                >
                  <span className="text-sm sm:text-base">{faq.question}</span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-amber-100 text-amber-900' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-0 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 bg-slate-50/40">
                    <p className="mt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Callout */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
          <h4 className="font-bold text-slate-950 text-base">Have a specific route or custom tour in mind?</h4>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
            Our Vaishali dispatch team is active 24/7 to answer route queries, vehicle availability, and provide instant quotes.
          </p>
          <div className="mt-4">
            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 shadow-sm transition-all"
            >
              <MessageSquare className="w-4 h-4 mr-2 text-emerald-600" />
              Ask on WhatsApp
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
