import React from 'react';
import { Shield, Database, Lock, ShieldAlert } from 'lucide-react';
import type { Lang } from '../types';

interface Props { lang: Lang; }

export const PrivacyPage: React.FC<Props> = ({ lang }) => {
  const isAr = lang === 'ar';
  
  const sections = [
    {
      icon: Shield,
      title: isAr ? 'طرفي' : 'Edge Computing',
      desc: isAr 
        ? 'معالجة بياناتك محلياً بالكامل دون مغادرة جهازك عبر تقنيات Edge الحديثة.' 
        : 'End-to-end local data processing powered by pure Edge computing technology.'
    },
    {
      icon: Database,
      title: isAr ? 'حصين' : 'Vault Storage',
      desc: isAr 
        ? 'تشفير سيادي وتخزين محلي للمفاتيح داخل خزنة Vault مشفرة تماماً.' 
        : 'Sovereign encryption with local key storage inside a fully isolated Vault.'
    },
    {
      icon: Lock,
      title: isAr ? 'سيادة' : 'Data Sovereignty',
      desc: isAr 
        ? 'امتثال مطلق لمعايير الخصوصية العالمية مع سيادة بيانات محلية كاملة.' 
        : 'Full compliance with global privacy protocols ensuring absolute data sovereignty.'
    }
  ];

  return (
    <div className="min-h-screen py-12 px-8 md:px-12" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-[900px] mx-auto" dir={isAr ? 'rtl' : 'ltr'}>
        <header className="mb-12 flex items-center gap-4">
          <ShieldAlert size={36} className="text-[#10b981]" />
          <h1 className="text-[clamp(24px,4vw,36px)] font-bold text-[#f8fafc]">
            {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((item, i) => (
            <div 
              key={i} 
              className="bg-[#1e293b] border border-[#334155] rounded-[12px] p-6 transition-all hover:border-[#10b981] group"
            >
              <div className="mb-4">
                <item.icon size={24} className="text-[#10b981]" />
              </div>
              <h3 className="text-[17px] font-semibold text-[#f8fafc] mb-2">
                {item.title}
              </h3>
              <p className="text-[14px] text-[#94a3b8] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <footer className="mt-12 pt-8 border-t border-[#334155] text-center">
          <p className="text-[14px] text-[#94a3b8]">
            {isAr ? 'تحديث: أبريل 2026' : 'Updated: April 2026'}
          </p>
        </footer>
      </div>
    </div>
  );
};
