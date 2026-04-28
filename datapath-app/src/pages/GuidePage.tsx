import React from 'react';
import { Search, Brain, BarChart2, FileText, BookOpen } from 'lucide-react';
import type { Lang } from '../types';

interface Props { lang: Lang; }

export const GuidePage: React.FC<Props> = ({ lang }) => {
  const isAr = lang === 'ar';
  
  const steps = [
    {
      icon: Search,
      title: isAr ? 'ميزة Z-Score (كشف القيم الشاذة)' : 'Z-Score Anomaly Detection',
      desc: isAr 
        ? 'تستخدم المنصة خوارزمية Z-Score إحصائياً لتحديد القيم التي تبعد بشكل غير طبيعي عن متوسط البيانات.' 
        : 'The platform uses the Z-Score statistical algorithm to identify values that are abnormally far from the data mean.',
      formula: 'Z = (x - μ) / σ'
    },
    {
      icon: Brain,
      title: isAr ? 'كيف يعمل "مستشار AI"؟' : 'AI Advisor Intelligence',
      desc: isAr 
        ? 'يقوم المستشار الذكي بقراءة ملخص إحصائي لبياناتك ويربطه بمعارفه الواسعة ليقدم لك تحليلات دقيقة.' 
        : 'The AI Advisor reads a statistical summary of your data and links it with its knowledge to provide insights.'
    },
    {
      icon: BarChart2,
      title: isAr ? 'الرسوم التفاعلية' : 'Interactive Visuals',
      desc: isAr 
        ? 'رسوم بيانية ذكية تتيح لك التفاعل المباشر مع البيانات وفهم التوزيعات والأنماط.' 
        : 'Smart charts that allow direct interaction with data to understand distributions and patterns.'
    },
    {
      icon: FileText,
      title: isAr ? 'تصدير ذكي' : 'Smart Export',
      desc: isAr 
        ? 'احصل على بياناتك المنقحة بصيغ CSV/JSON أو حمل تقريراً كاملاً بصيغة PDF.' 
        : 'Get your cleaned data in CSV/JSON or download a full PDF report for your team.'
    }
  ];

  return (
    <div className="min-h-screen py-12 px-8 md:px-12" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-[900px] mx-auto" dir={isAr ? 'rtl' : 'ltr'}>
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <BookOpen size={32} className="text-[#10b981]" />
            <h1 className="text-[clamp(24px,4vw,36px)] font-bold text-[#f8fafc]">
              {isAr ? 'دليل الاستخدام السريع' : 'Quick Usage Guide'}
            </h1>
          </div>
          <p className="text-[15px] text-[#94a3b8] leading-relaxed max-w-2xl">
            {isAr 
              ? 'رحلتك من البيانات الخام إلى الرؤى الذكية تبدأ من هنا. اكتشف كيف تستخدم Kimit بأفضل طريقة.' 
              : 'Your journey from raw data to smart insights starts here. Discover how to use Kimit effectively.'}
          </p>
        </header>

        <div className="relative space-y-12">
          {/* Vertical Line on Desktop */}
          <div className={`hidden md:block absolute ${isAr ? 'right-[15px]' : 'left-[15px]'} top-4 bottom-4 w-[2px] bg-[#334155] -z-0`} />
          
          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
              {/* Badge */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#10b981] text-white font-bold text-[14px] shrink-0 shadow-lg">
                {i + 1}
              </div>
              
              {/* Content Card */}
              <div className="flex-1 bg-[#1e293b] border border-[#334155] rounded-[12px] p-6 transition-all hover:border-[#10b981] group w-full">
                <div className="flex items-center gap-4 mb-4">
                  <step.icon size={24} className="text-[#10b981]" />
                  <h3 className="text-[17px] font-semibold text-[#f8fafc]">{step.title}</h3>
                </div>
                <p className="text-[14px] text-[#94a3b8] leading-relaxed mb-4">
                  {step.desc}
                </p>
                {step.formula && (
                  <div className="bg-[#0f172a] p-3 rounded-lg border border-[#334155] inline-block">
                    <code className="text-[#10b981] font-mono text-[13px]">{step.formula}</code>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button 
            onClick={() => window.location.hash = '#/'}
            className="px-8 py-4 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-[12px] transition-all shadow-lg active:scale-95"
          >
            {isAr ? 'ابدأ رحلتك الآن' : 'Start Your Journey'}
          </button>
        </div>
      </div>
    </div>
  );
};
