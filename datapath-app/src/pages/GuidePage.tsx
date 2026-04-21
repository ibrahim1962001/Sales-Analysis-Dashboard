import React from 'react';
import { BookOpen, Search, Brain, BarChart, FileText } from 'lucide-react';
import type { Lang } from '../types';

interface Props { lang: Lang; }

export const GuidePage: React.FC<Props> = ({ lang }) => {
  const isAr = lang === 'ar';
  
  return (
    <div className="page p-6 md:p-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-12 flex items-center gap-4">
        <BookOpen className="text-primary" size={40} />
        {isAr ? 'دليل الاستخدام السريع' : 'Quick Usage Guide'}
      </h1>

      <div className="space-y-12">
        {/* Z-Score Section */}
        <section className="glass p-8 rounded-3xl border border-white/10 relative group">
          <div className="absolute top-8 left-8 text-primary/10 group-hover:text-primary/20 transition-colors">
            <Search size={120} />
          </div>
          <div className="relative">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Search className="text-primary" />
              {isAr ? 'ميزة Z-Score (كشف القيم الشاذة)' : 'Z-Score (Anomaly Detection)'}
            </h2>
            <p className="text-white/70 mb-6 leading-relaxed max-w-2xl">
              {isAr 
                ? 'تستخدم المنصة خوارزمية Z-Score إحصائياً لتحديد القيم التي تبعد بشكل غير طبيعي عن متوسط البيانات. أي قيمة تزيد عن 3 في مقياس Z تُعتبر شاذة ومحتمل أن تكون خطأ في الإدخال أو حالة خاصة تستدعي الانتباه.'
                : 'The platform uses the Z-Score statistical algorithm to identify values that are abnormally far from the data mean. Any value higher than 3 on the Z-scale is considered an anomaly, potentially representing input errors or special cases that require attention.'}
            </p>
            <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 inline-block">
               <code className="text-primary">Z = (x - μ) / σ</code>
            </div>
          </div>
        </section>

        {/* AI Advisor Section */}
        <section className="glass p-8 rounded-3xl border border-white/10 relative group">
          <div className="absolute top-8 left-8 text-blue-400/10 group-hover:text-blue-400/20 transition-colors">
            <Brain size={120} />
          </div>
          <div className="relative">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Brain className="text-blue-400" />
              {isAr ? 'كيف يعمل "مستشار AI"؟' : 'How does the AI Advisor work?'}
            </h2>
            <p className="text-white/70 leading-relaxed max-w-2xl">
              {isAr 
                ? 'يقوم المستشار الذكي بقراءة ملخص إحصائي لبياناتك (بدون رفع الملف بالكامل) ويربطه بمعارفه الواسعة ليقدم لك تحليلات، توجهات، وتوقعات. يمكنك سؤاله عن علاقة المتغيرات ببعضها أو طلب اقتراحات لتحسين الأداء.'
                : 'The AI Advisor reads a statistical summary of your data (without uploading the full file) and links it with its extensive knowledge to provide insights, trends, and forecasts. You can ask about variable correlations or request suggestions for performance improvement.'}
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <div className="grid md:grid-cols-2 gap-8">
           <div className="glass p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart className="text-green-400" size={20} />
                {isAr ? 'الرسوم البيانية' : 'Visual Charts'}
              </h3>
              <p className="text-white/50 text-sm">
                {isAr 
                  ? 'نقوم بإنشاء رسوم بيانية تلقائية بناءً على نوع البيانات. الرسوم التفاعلية تتيح لك التكبير والتصغير وتصدير الصور.'
                  : 'We generate automatic charts based on data types. Interactive charts allow zooming and exporting as images.'}
              </p>
           </div>
           <div className="glass p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="text-orange-400" size={20} />
                {isAr ? 'تصدير التقارير' : 'Exporting Reports'}
              </h3>
              <p className="text-white/50 text-sm">
                {isAr 
                  ? 'بعد الانتهاء من التنقية والتحليل، يمكنك تحميل الملف بصيغة CSV أو JSON، أو الحصول على تقرير PDF كامل.'
                  : 'After cleaning and analysis, you can download the file in CSV or JSON format, or get a full PDF report.'}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
