import React from 'react';
import { ShieldAlert, EyeOff, ServerOff, Database } from 'lucide-react';
import type { Lang } from '../types';

interface Props { lang: Lang; }

export const PrivacyPage: React.FC<Props> = ({ lang }) => {
  const isAr = lang === 'ar';
  
  return (
    <div className="page p-6 md:p-12 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <ShieldAlert size={48} className="text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold">
          {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
        </h1>
      </div>

      <div className="space-y-8 text-white/70 leading-loose">
        <section className="glass p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <ServerOff className="text-red-400" size={20} />
            {isAr ? 'لا يوجد خوادم (No Servers)' : 'No Servers'}
          </h2>
          <p>
            {isAr 
              ? 'نحن لا نقوم بتحميل بياناتك إلى أي خادم (Server). كل عمليات المعالجة والتحليل والتنظيف تتم بالكامل داخل متصفحك (Client-side) باستخدام JavaScript. بمجرد إغلاق التبويب، يتم مسح البيانات من ذاكرة المتصفح.'
              : 'We do not upload your data to any server. All processing, analysis, and cleaning are performed entirely within your browser (Client-side) using JavaScript. Once you close the tab, the data is cleared from the browser memory.'}
          </p>
        </section>

        <section className="glass p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <EyeOff className="text-blue-400" size={20} />
            {isAr ? 'خصوصية البيانات' : 'Data Privacy'}
          </h2>
          <p>
            {isAr
              ? 'بما أن البيانات تُعالج محلياً، فلا يمكن لأي شخص (بما في ذلك نحن المطورون) الوصول إلى ملفاتك أو رؤيتها. أنت المتحكم الوحيد في بياناتك.'
              : 'As data is processed locally, no one (including us developers) can access or see your files. You are the sole controller of your data.'}
          </p>
        </section>

        <section className="glass p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Database className="text-green-400" size={20} />
            {isAr ? 'تخزين مفاتيح API' : 'API Key Storage'}
          </h2>
          <p>
            {isAr
              ? 'إذا قمت بإدخال مفتاح API لـ Groq، يتم تخزينه فقط في LocalStorage الخاص بمتصفحك لتسهيل استخدامه في المرات القادمة. نحن لا نحتفظ به في أي قاعدة بيانات خارجية.'
              : 'If you enter a Groq API key, it is stored only in your browser\'s LocalStorage for convenience. We do not keep it in any external database.'}
          </p>
        </section>

        <div className="border-t border-white/10 pt-8 text-center text-sm text-white/40">
          {isAr ? 'آخر تحديث: أبريل 2026' : 'Last Updated: April 2026'}
        </div>
      </div>
    </div>
  );
};
