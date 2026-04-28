import React from 'react';
import { Mail, ShieldCheck, Users, Zap, Link } from 'lucide-react';
import { CreatorFooter } from '../components/CreatorFooter';
import type { Lang } from '../types';

interface Props { lang: Lang; }

export const AboutUsPage: React.FC<Props> = ({ lang }) => {
  const isAr = lang === 'ar';
  
  const features = [
    {
      icon: ShieldCheck,
      title: isAr ? 'خصوصية تامة' : 'Full Privacy',
      desc: isAr ? 'بياناتك لا تغادر متصفحك أبداً. نحن لا نخزن أي بيانات على خوادمنا.' : 'Your data never leaves your browser. We don\'t store any data on our servers.'
    },
    {
      icon: Zap,
      title: isAr ? 'سرعة فائقة' : 'Ultra Fast',
      desc: isAr ? 'تم تحسين Kimit للعمل بسرعة البرق حتى مع الملفات الكبيرة.' : 'Kimit is optimized to run lightning fast even with large files.'
    },
    {
      icon: Users,
      title: isAr ? 'سهولة الاستخدام' : 'User Friendly',
      desc: isAr ? 'مصمم للجميع، من المبتدئين إلى محترفي البيانات.' : 'Designed for everyone, from beginners to data professionals.'
    }
  ];

  return (
    <div className="min-h-screen py-12 px-8 md:px-12" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-[900px] mx-auto" dir={isAr ? 'rtl' : 'ltr'}>
        <header className="mb-12">
          <h1 className="text-[clamp(24px,4vw,36px)] font-bold text-[#f8fafc] mb-4">
            {isAr ? 'عن Kimit AI' : 'About Us'}
          </h1>
          <p className="text-[15px] text-[#94a3b8] leading-relaxed">
            {isAr 
              ? 'Kimit هو مشروع طموح يهدف لتبسيط تحليل البيانات باستخدام الذكاء الاصطناعي، لنجعل البيانات تتحدث بلغة يفهمها الجميع.' 
              : 'Kimit is an ambitious project aimed at simplifying data analysis using AI, making data speak a language everyone understands.'}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((f, i) => (
            <div key={i} className="bg-[#1e293b] border border-[#334155] rounded-[12px] p-6 transition-all hover:border-[#10b981] group">
              <div className="mb-4">
                <f.icon size={24} className="text-[#10b981]" />
              </div>
              <h3 className="text-[17px] font-semibold text-[#f8fafc] mb-2">{f.title}</h3>
              <p className="text-[14px] text-[#94a3b8] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <section className="bg-[#1e293b] border border-[#334155] rounded-[12px] p-8">
          <h2 className="text-[20px] font-bold text-[#f8fafc] mb-8">
            {isAr ? 'تواصل مع المطور' : 'Contact the Developer'}
          </h2>
          
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-16 h-16 rounded-full bg-[#10b981] flex items-center justify-center shrink-0 shadow-lg">
              <span className="text-[18px] font-bold text-white">IS</span>
            </div>
            
            <div className="flex-1 text-center md:text-start">
              <h3 className="text-[18px] font-bold text-[#f8fafc] mb-2">
                {isAr ? 'إبراهيم صبري' : 'Ibrahim Sabrey'}
              </h3>
              <p className="text-[14px] text-[#94a3b8] leading-relaxed mb-6">
                {isAr 
                  ? 'مطور برمجيات شغوف ببناء أدوات ذكية تحل مشاكل حقيقية وتجعل حياة المستخدمين أسهل.' 
                  : 'A software developer passionate about building smart tools that solve real problems and make users\' lives easier.'}
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <a href="mailto:ebrahimsabrey2001@gmail.com" className="flex items-center gap-2 px-4 py-2 bg-[#334155] rounded-full text-[13px] font-medium text-[#f8fafc] hover:bg-[#475569] transition-colors">
                  <Mail size={16} className="text-[#10b981]" />
                  {isAr ? 'البريد الإلكتروني' : 'Email'}
                </a>
                <a href="https://linkedin.com/in/ibrahimsabrey" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[#334155] rounded-full text-[13px] font-medium text-[#f8fafc] hover:bg-[#475569] transition-colors">
                  <Link size={16} className="text-[#10b981]" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-12">
          <CreatorFooter lang={lang} />
        </footer>
      </div>
    </div>
  );
};
