import React from 'react';
import { BookOpen, Search, Brain, BarChart, FileText } from 'lucide-react';
import type { Lang } from '../types';

interface Props { lang: Lang; }

export const GuidePage: React.FC<Props> = ({ lang }) => {
  const isAr = lang === 'ar';
  
  return (
    <div className="page p-6 md:p-12 max-w-5xl mx-auto" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="mb-20 animate-fade-in relative">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 blur-[120px] -z-10 rounded-full" />
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent flex items-center gap-5">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/5">
            <BookOpen className="text-primary" size={32} />
          </div>
          {isAr ? 'دليل الاستخدام السريع' : 'Quick Usage Guide'}
        </h1>
        <p className="mt-6 text-xl text-white/50 max-w-2xl leading-relaxed">
          {isAr 
            ? 'رحلتك من البيانات الخام إلى الرؤى الذكية تبدأ من هنا. اكتشف كيف تستخدم Kimit بأفضل طريقة.' 
            : 'Your journey from raw data to smart insights starts here. Discover how to use Kimit effectively.'}
        </p>
      </div>

      <div className="relative space-y-16">
        {/* Step 1: Z-Score */}
        <section className="relative flex flex-col md:flex-row gap-10 items-start group">
          <div className="w-16 h-16 rounded-full bg-primary/10 border-4 border-[#020617] ring-1 ring-primary/30 flex items-center justify-center shrink-0 text-primary font-black text-2xl z-10 shadow-xl">
            1
          </div>
          {/* Connecting line */}
          <div className="absolute top-16 bottom-0 right-8 w-0.5 bg-gradient-to-b from-primary/30 to-transparent -mr-[1px] hidden md:block" />
          
          <div className="glass p-10 rounded-[2.5rem] border border-white/5 group-hover:border-primary/30 transition-all duration-500 flex-1 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Search className="text-primary" size={28} />
              </div>
              {isAr ? 'ميزة Z-Score (كشف القيم الشاذة)' : 'Z-Score Anomaly Detection'}
            </h2>
            <p className="text-lg text-white/60 mb-8 leading-relaxed">
              {isAr 
                ? 'تستخدم المنصة خوارزمية Z-Score إحصائياً لتحديد القيم التي تبعد بشكل غير طبيعي عن متوسط البيانات. أي قيمة تزيد عن 3 في مقياس Z تُعتبر شاذة ومحتمل أن تكون خطأ في الإدخال أو حالة خاصة تستدعي الانتباه.'
                : 'The platform uses the Z-Score statistical algorithm to identify values that are abnormally far from the data mean. Any value higher than 3 on the Z-scale is considered an anomaly, potentially representing input errors.'}
            </p>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 inline-flex items-center gap-4">
               <span className="text-white/40 text-sm font-bold uppercase tracking-wider">{isAr ? 'المعادلة:' : 'Formula:'}</span>
               <code className="text-primary text-xl font-mono">Z = (x - μ) / σ</code>
            </div>
          </div>
        </section>

        {/* Step 2: AI Advisor */}
        <section className="relative flex flex-col md:flex-row gap-10 items-start group">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border-4 border-[#020617] ring-1 ring-blue-500/30 flex items-center justify-center shrink-0 text-blue-400 font-black text-2xl z-10 shadow-xl">
            2
          </div>
          <div className="absolute top-16 bottom-0 right-8 w-0.5 bg-gradient-to-b from-blue-500/30 to-transparent -mr-[1px] hidden md:block" />
          
          <div className="glass p-10 rounded-[2.5rem] border border-white/5 group-hover:border-blue-500/30 transition-all duration-500 flex-1 relative overflow-hidden">
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-500/5 blur-[100px] -z-10" />
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Brain className="text-blue-400" size={28} />
              </div>
              {isAr ? 'كيف يعمل "مستشار AI"؟' : 'AI Advisor Intelligence'}
            </h2>
            <p className="text-lg text-white/60 leading-relaxed">
              {isAr 
                ? 'يقوم المستشار الذكي بقراءة ملخص إحصائي لبياناتك ويربطه بمعارفه الواسعة ليقدم لك تحليلات، توجهات، وتوقعات. يمكنك سؤاله عن علاقة المتغيرات ببعضها أو طلب اقتراحات لتحسين الأداء.'
                : 'The AI Advisor reads a statistical summary of your data and links it with its extensive knowledge to provide insights, trends, and forecasts. Ask about variable correlations or request suggestions.'}
            </p>
          </div>
        </section>

        {/* Step 3: Visuals & Export */}
        <section className="relative flex flex-col md:flex-row gap-10 items-start group">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 border-4 border-[#020617] ring-1 ring-purple-500/30 flex items-center justify-center shrink-0 text-purple-400 font-black text-2xl z-10 shadow-xl">
            3
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 flex-1">
            <div className="glass p-8 rounded-[2rem] border border-white/5 hover:border-purple-500/30 transition-all">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                <BarChart className="text-purple-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">{isAr ? 'الرسوم التفاعلية' : 'Interactive Visuals'}</h3>
              <p className="text-white/50 leading-relaxed">
                {isAr 
                  ? 'رسوم بيانية ذكية تتيح لك التفاعل المباشر مع البيانات وفهم التوزيعات والأنماط بلمسة واحدة.'
                  : 'Smart charts that allow direct interaction with data to understand distributions and patterns.'}
              </p>
            </div>
            <div className="glass p-8 rounded-[2rem] border border-white/5 hover:border-purple-500/30 transition-all">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                <FileText className="text-purple-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">{isAr ? 'تصدير ذكي' : 'Smart Export'}</h3>
              <p className="text-white/50 leading-relaxed">
                {isAr 
                  ? 'احصل على بياناتك المنقحة بصيغ CSV/JSON أو حمل تقريراً كاملاً بصيغة PDF لتقديمه لفريقك.'
                  : 'Get your cleaned data in CSV/JSON or download a full PDF report for your team.'}
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-20 text-center">
         <button 
           onClick={() => window.location.hash = '#/'}
           className="px-10 py-5 bg-gradient-to-r from-primary to-blue-600 text-white font-black text-lg rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20"
         >
           {isAr ? 'ابدأ رحلتك الآن' : 'Start Your Journey'}
         </button>
      </div>
    </div>
  );
};
