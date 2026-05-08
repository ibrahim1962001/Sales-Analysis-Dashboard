import React from 'react';
import { Shield, Database, Lock, ShieldAlert } from 'lucide-react';

interface Props {}

export const PrivacyPage: React.FC<Props> = ({ }) => {
  const sections = [
    {
      icon: Shield,
      title: 'Local Processing',
      desc: 'All data analysis happens directly in your browser. Your data never leaves your device.'
    },
    {
      icon: Database,
      title: 'Temporary Storage',
      desc: 'We use temporary browser memory only. Your records are never stored on cloud servers.'
    },
    {
      icon: Lock,
      title: 'Full Security',
      desc: 'Full commitment to global data protection standards to ensure your data sovereignty.'
    }
  ];

  return (
    <div className="p-section" dir="ltr">
      <header className="p-header p-flex-center">
        <ShieldAlert size={36} className="p-icon-box" style={{ marginBottom: 0 }} />
        <h1 className="p-title" style={{ marginBottom: 0 }}>
          Privacy Policy
        </h1>
      </header>

      <div className="p-grid-2">
        {sections.map((item, i) => (
          <div key={i} className="p-card">
            <div className="p-icon-box">
              <item.icon size={24} />
            </div>
            <h3 className="p-title" style={{ fontSize: '18px' }}>
              {item.title}
            </h3>
            <p className="p-subtitle">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <footer style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <p className="p-subtitle">
          Last Updated: April 2026
        </p>
      </footer>
    </div>
  );
};
