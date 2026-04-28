import React, { useState, useMemo } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import type { Lang } from '../types';

interface Props { lang: Lang; }

const getFaqs = (isAr: boolean) => [
  {
    q: isAr ? 'هل البيانات آمنة؟' : 'Is my data safe?',
    a: isAr ? 'نعم تماماً! Kimit يعمل محلياً بالكامل (Client-side). بياناتك لا تُرفع إلى أي سيرفر، بل يتم تحليلها في الذاكرة المؤقتة لمتصفحك فقط.' : 'Absolutely! Kimit runs entirely locally (Client-side). Your data is never uploaded to any server; it is analyzed only in your browser\'s temporary memory.'
  },
  {
    q: isAr ? 'ماذا أفعل إذا تجمد المتصفح؟' : 'What if the browser freezes?',
    a: isAr ? 'هذا قد يحدث مع الملفات الضخمة جداً (أكثر من مليون سجل) نظراً لقيود الذاكرة في المتصفح. ننصح بتقسيم الملف أو استخدام متصفح قوي مثل Chrome.' : 'This might happen with massive files (over 1 million records) due to browser memory limits. We recommend splitting the file or using a robust browser like Chrome.'
  },
  {
    q: isAr ? 'هل يدعم ملفات JSON؟' : 'Does it support JSON files?',
    a: isAr ? 'حالياً ندعم CSV و Excel بشكل كامل. دعم JSON في خطتنا المستقبلية القريبة جداً!' : 'Currently we fully support CSV and Excel. JSON support is in our near-future roadmap!'
  },
  {
    q: isAr ? 'هل الموقع مجاني؟' : 'Is it free?',
    a: isAr ? 'نعم، الموقع مجاني بالكامل للاستخدام الشخصي والتجاري.' : 'Yes, the site is completely free for personal and commercial use.'
  }
];

export const FAQPage: React.FC<Props> = ({ lang }) => {
  const isAr = lang === 'ar';
  const faqs = useMemo(() => getFaqs(isAr), [isAr]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen py-12 px-8 md:px-12" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-[900px] mx-auto" dir={isAr ? 'rtl' : 'ltr'}>
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <HelpCircle size={32} className="text-[#10b981]" />
            <h1 className="text-[clamp(24px,4vw,36px)] font-bold text-[#f8fafc]">
              {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </h1>
          </div>
          <p className="text-[15px] text-[#94a3b8] leading-relaxed">
            {isAr ? 'كل ما تحتاج معرفته عن منصة Kimit وكيفية التعامل مع بياناتك بذكاء.' : 'Everything you need to know about Kimit and how to handle your data smartly.'}
          </p>
        </header>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`bg-[#1e293b] border rounded-[12px] overflow-hidden transition-all duration-300 ${
                openIndex === i ? 'border-[#10b981]' : 'border-[#334155]'
              }`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-5 flex justify-between items-center text-start focus:outline-none group"
              >
                <span className={`text-[17px] font-semibold transition-colors ${
                  openIndex === i ? 'text-[#10b981]' : 'text-[#f8fafc]'
                }`}>
                  {faq.q}
                </span>
                <ChevronDown 
                  size={20} 
                  className={`text-[#94a3b8] transition-transform duration-300 ${
                    openIndex === i ? 'rotate-180 text-[#10b981]' : ''
                  }`} 
                />
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === i ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 pt-2 border-t border-[#334155]/50">
                  <p className="text-[14px] text-[#94a3b8] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-16 bg-[#1e293b] border border-[#334155] rounded-[12px] p-8 text-center">
          <h3 className="text-[18px] font-bold text-[#f8fafc] mb-4">
            {isAr ? 'لديك سؤال آخر؟' : 'Still have questions?'}
          </h3>
          <p className="text-[14px] text-[#94a3b8] mb-8">
            {isAr ? 'نحن هنا للمساعدة! تواصل معنا مباشرة عبر البريد الإلكتروني.' : "We're here to help! Contact us directly via email."}
          </p>
          <a 
            href="mailto:ebrahimsabrey2001@gmail.com" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#334155] rounded-full text-[13px] font-medium text-[#f8fafc] hover:bg-[#475569] transition-colors"
          >
            {isAr ? 'تواصل مع الدعم' : 'Contact Support'}
          </a>
        </section>
      </div>
    </div>
  );
};
