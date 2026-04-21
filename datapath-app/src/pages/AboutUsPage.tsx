import { Mail, ExternalLink, ShieldCheck, Users, Zap, Link } from 'lucide-react';
import type { Lang } from '../types';

interface Props { lang: Lang; }

export const AboutUsPage: React.FC<Props> = ({ lang }) => {
  const isAr = lang === 'ar';
  
  return (
    <div className="page p-6 md:p-12 max-w-5xl mx-auto">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-4">
          {isAr ? 'من نحن' : 'About Us'}
        </h1>
        <p className="text-xl text-white/60">
          {isAr ? 'Kimit هو مشروع طموح يهدف لتبسيط تحليل البيانات باستخدام الذكاء الاصطناعي.' : 'Kimit is an ambitious project aimed at simplifying data analysis using AI.'}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          { icon: ShieldCheck, title: isAr ? 'خصوصية تامة' : 'Full Privacy', desc: isAr ? 'بياناتك لا تغادر متصفحك أبداً. نحن لا نخزن أي بيانات على خوادمنا.' : 'Your data never leaves your browser. We don\'t store any data on our servers.' },
          { icon: Zap, title: isAr ? 'سرعة فائقة' : 'Ultra Fast', desc: isAr ? 'تم تحسين Kimit للعمل بسرعة البرق حتى مع الملفات الكبيرة.' : 'Kimit is optimized to run lightning fast even with large files.' },
          { icon: Users, title: isAr ? 'سهولة الاستخدام' : 'User Friendly', desc: isAr ? 'مصمم للجميع، من المبتدئين إلى محترفي البيانات.' : 'Designed for everyone, from beginners to data professionals.' }
        ].map((item, i) => (
          <div key={i} className="glass p-6 rounded-2xl border border-white/10 hover:border-primary/50 transition-all group">
            <item.icon className="text-primary mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-white/50">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass p-8 rounded-3xl border border-white/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10" />
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          {isAr ? 'تواصل مع المطور' : 'Contact the Developer'}
        </h2>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-32 h-32 rounded-full border-4 border-primary/20 p-1">
             <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-3xl font-bold">
               IS
             </div>
          </div>
          <div className="flex-1 space-y-4 text-center md:text-right">
            <p className="text-lg text-white/80">
              {isAr ? 'أنا إبراهيم صبري، مطور برمجيات شغوف ببناء أدوات ذكية تحل مشاكل حقيقية.' : 'I\'m Ibrahim Sabrey, a software developer passionate about building smart tools that solve real problems.'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <a href="mailto:ebrahimsabrey2001@gmail.com" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all">
                <Mail size={18} className="text-primary" />
                ebrahimsabrey2001@gmail.com
              </a>
              <a href="https://www.linkedin.com/in/ibrahimsabrey?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all">
                <Link size={18} className="text-primary" />
                LinkedIn <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
