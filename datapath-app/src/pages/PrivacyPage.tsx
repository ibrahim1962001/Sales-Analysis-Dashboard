import React from 'react';
import { ShieldAlert, ServerOff, Database, ShieldCheck } from 'lucide-react';
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <section className="premium-card p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
            <ServerOff className="text-red-400" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Cairo', sans-serif" }}>
            {isAr ? 'طرفي' : 'Edge'}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            {isAr 
              ? 'معالجة بياناتك محلياً بالكامل دون مغادرة جهازك عبر تقنيات Edge.'
              : 'End-to-end local data processing powered by pure Edge computing technology.'}
          </p>
        </section>

        <section className="premium-card p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
            <Database className="text-emerald-400" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Cairo', sans-serif" }}>
            {isAr ? 'حصين' : 'Vault'}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            {isAr
              ? 'تشفير سيادي وتخزين محلي للمفاتيح داخل خزنة Vault مشفرة تماماً.'
              : 'Sovereign encryption with local key storage inside a fully isolated Vault.'}
          </p>
        </section>

        <section className="premium-card p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
            <ShieldCheck className="text-blue-400" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Cairo', sans-serif" }}>
            {isAr ? 'سيادة' : 'Sovereignty'}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            {isAr
              ? 'امتثال مطلق لمعايير خصوصية أبريل 2026 مع سيادة بيانات محلية.'
              : 'Full compliance with April 2026 protocols ensuring absolute data sovereignty.'}
          </p>
        </section>
      </div>

      <div className="text-center pt-8">
        <div className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.2em] text-white/40">
          {isAr ? 'تحديث: أبريل 2026' : 'Updated: April 2026'}
        </div>
      </div>
    </div>
  );
};
