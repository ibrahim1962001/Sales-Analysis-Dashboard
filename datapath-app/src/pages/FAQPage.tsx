import React from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { Lang } from '../types';

interface Props { lang: Lang; }

export const FAQPage: React.FC<Props> = ({ lang }) => {
  const isAr = lang === 'ar';
  
  const faqs = [
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

  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <div className="page p-6 md:p-12 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <HelpCircle size={64} className="text-primary mx-auto mb-4 animate-bounce-slow" />
        <h1 className="text-4xl font-bold mb-4">{isAr ? 'الأسئلة الشائعة' : 'FAQ'}</h1>
        <p className="text-white/60">{isAr ? 'كل ما تحتاج معرفته عن منصة Kimit' : 'Everything you need to know about Kimit'}</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div 
            key={i} 
            className={`glass rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 ${openIndex === i ? 'border-primary/50 ring-1 ring-primary/20' : 'hover:border-white/20'}`}
          >
            <button 
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full px-6 py-5 flex justify-between items-center text-right md:text-inherit font-bold text-lg text-white/90"
            >
              <span className={isAr ? 'text-right' : 'text-left'}>{faq.q}</span>
              {openIndex === i ? <ChevronUp className="text-primary" /> : <ChevronDown className="text-white/30" />}
            </button>
            <div className={`px-6 overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-96 py-5 border-t border-white/10' : 'max-h-0'}`}>
              <p className="text-white/60 leading-relaxed">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
