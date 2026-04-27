import React from 'react';
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
    a: isAr ? 'هذا قد يحدث مع الملفات الضخمة جداً (أكثر من مليون سجل) نظراً لقيود الذاكرة في المتصفح. ننصح بتقسيم الملف أو استخدام متصفح قوي مثل Chrome وإغلاق التبويبات غير الضرورية.' : 'This might happen with massive files (over 1 million records) due to browser memory limits. We recommend splitting the file or using a robust browser like Chrome and closing unnecessary tabs.'
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
  const faqs = React.useMemo(() => getFaqs(isAr), [isAr]);
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <div className="page p-6 md:p-12 max-w-4xl mx-auto" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="text-center mb-16 animate-fade-in relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 blur-[60px] -z-10" />
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20 rotate-3">
          <HelpCircle size={40} className="text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-4">
          {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
        </h1>
        <p className="text-lg text-white/50 max-w-md mx-auto leading-relaxed">
          {isAr ? 'كل ما تحتاج معرفته عن منصة Kimit وكيفية التعامل مع بياناتك بذكاء.' : 'Everything you need to know about Kimit and how to handle your data smartly.'}
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div 
            key={i} 
            className={`glass rounded-[1.5rem] border transition-all duration-500 overflow-hidden ${
              openIndex === i 
                ? 'border-primary/40 bg-primary/5 shadow-[0_0_40px_-10px_rgba(16,185,129,0.1)]' 
                : 'border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
            }`}
          >
            <button 
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full px-8 py-6 flex justify-between items-center text-start focus:outline-none group"
            >
              <span className={`text-lg md:text-xl font-bold transition-colors duration-300 ${openIndex === i ? 'text-primary' : 'text-white/80'}`}>
                {faq.q}
              </span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                openIndex === i ? 'bg-primary text-white rotate-180' : 'bg-white/5 text-white/30 group-hover:bg-white/10'
              }`}>
                <ChevronDown size={20} />
              </div>
            </button>
            <div 
              className={`px-8 transition-all duration-500 ease-in-out ${
                openIndex === i ? 'max-h-[500px] pb-8 opacity-100' : 'max-h-0 pb-0 opacity-0'
              }`}
            >
              <div className="pt-4 border-t border-white/5">
                <p className="text-lg text-white/50 leading-relaxed font-medium">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 p-10 glass rounded-[2rem] border border-white/5 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <h3 className="text-2xl font-bold mb-4 relative z-10">{isAr ? 'لديك سؤال آخر؟' : 'Still have questions?'}</h3>
        <p className="text-white/50 mb-8 relative z-10">{isAr ? 'نحن هنا للمساعدة! تواصل معنا مباشرة.' : "We're here to help! Contact us directly."}</p>
        <a 
          href="mailto:ebrahimsabrey2001@gmail.com" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 relative z-10"
        >
          {isAr ? 'تواصل معنا الآن' : 'Contact Support'}
        </a>
      </div>
    </div>
  );
};
