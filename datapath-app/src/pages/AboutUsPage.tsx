import { Mail, ExternalLink, ShieldCheck, Users, Zap, Link } from 'lucide-react';
import { CreatorFooter } from '../components/CreatorFooter';
import type { Lang } from '../types';

interface Props { lang: Lang; }

export const AboutUsPage: React.FC<Props> = ({ lang }) => {
  const isAr = lang === 'ar';
  
  return (
    <div className="page p-6 md:p-12 max-w-5xl mx-auto" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-6 py-2">
          {isAr ? 'من نحن' : 'About Us'}
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
          {isAr 
            ? 'Kimit هو مشروع طموح يهدف لتبسيط تحليل البيانات باستخدام الذكاء الاصطناعي، لنجعل البيانات تتحدث بلغة يفهمها الجميع.' 
            : 'Kimit is an ambitious project aimed at simplifying data analysis using AI, making data speak a language everyone understands.'}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {[
          { icon: ShieldCheck, title: isAr ? 'خصوصية تامة' : 'Full Privacy', desc: isAr ? 'بياناتك لا تغادر متصفحك أبداً. نحن لا نخزن أي بيانات على خوادمنا.' : 'Your data never leaves your browser. We don\'t store any data on our servers.' },
          { icon: Zap, title: isAr ? 'سرعة فائقة' : 'Ultra Fast', desc: isAr ? 'تم تحسين Kimit للعمل بسرعة البرق حتى مع الملفات الكبيرة.' : 'Kimit is optimized to run lightning fast even with large files.' },
          { icon: Users, title: isAr ? 'سهولة الاستخدام' : 'User Friendly', desc: isAr ? 'مصمم للجميع، من المبتدئين إلى محترفي البيانات.' : 'Designed for everyone, from beginners to data professionals.' }
        ].map((item, i) => (
          <div key={i} className="glass p-8 rounded-3xl border border-white/5 hover:border-primary/40 transition-all group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
            <item.icon className="text-primary mb-6 group-hover:scale-110 transition-transform relative z-10" size={40} />
            <h3 className="text-2xl font-bold mb-3 relative z-10">{item.title}</h3>
            <p className="text-white/50 leading-relaxed relative z-10">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-transparent -z-10" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#8b5cf6]/10 blur-[100px] -z-10 rounded-full" />
        
        <h2 className="text-3xl font-black mb-10 flex items-center gap-3">
          <span className="w-2 h-8 bg-primary rounded-full" />
          {isAr ? 'تواصل مع المطور' : 'Contact the Developer'}
        </h2>

        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-40 h-40 rounded-full border-4 border-white/10 p-1.5 bg-[#0f172a]">
               <div className="w-full h-full rounded-full bg-gradient-to-br from-[#10b981] to-[#3b82f6] flex items-center justify-center text-5xl font-black text-white shadow-inner">
                 IS
               </div>
            </div>
          </div>

          <div className="flex-1 space-y-6 text-center md:text-start">
            <p className="text-2xl font-bold text-white/90 leading-tight">
              {isAr ? 'إبراهيم صبري' : 'Ibrahim Sabrey'}
            </p>
            <p className="text-lg text-white/60 max-w-lg">
              {isAr 
                ? 'مطور برمجيات شغوف ببناء أدوات ذكية تحل مشاكل حقيقية وتجعل حياة المستخدمين أسهل.' 
                : 'A software developer passionate about building smart tools that solve real problems and make users\' lives easier.'}
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <a href="mailto:ebrahimsabrey2001@gmail.com" className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-primary/10 rounded-2xl border border-white/10 hover:border-primary/30 transition-all group">
                <Mail size={20} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">ebrahimsabrey2001@gmail.com</span>
              </a>
              <a href="https://www.linkedin.com/in/ibrahimsabrey?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-blue-500/10 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all group">
                <Link size={20} className="text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">LinkedIn</span>
                <ExternalLink size={14} className="opacity-40" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <CreatorFooter lang={lang} />
    </div>
  );
};
