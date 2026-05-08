import React from 'react';
import { Mail, ShieldCheck, Users, Zap, Link } from 'lucide-react';
import { CreatorFooter } from '../components/CreatorFooter';

interface Props {}

export const AboutUsPage: React.FC<Props> = ({ }) => {
  
  const features = [
    {
      icon: ShieldCheck,
      title: 'Full Privacy',
      desc: 'Your data never leaves your browser. We don\'t store any data on our servers.'
    },
    {
      icon: Zap,
      title: 'Ultra Fast',
      desc: 'Kimit is optimized to run lightning fast even with large files.'
    },
    {
      icon: Users,
      title: 'User Friendly',
      desc: 'Designed for everyone, from beginners to data professionals.'
    }
  ];

  return (
    <div className="p-section" dir="ltr">
      <header className="p-header">
        <h1 className="p-title">
          About Us
        </h1>
        <p className="p-subtitle">
          Kimit is an ambitious project aimed at simplifying data analysis using AI, making data speak a language everyone understands.
        </p>
      </header>

      <div className="p-grid-3" style={{ marginBottom: '48px' }}>
        {features.map((f, i) => (
          <div key={i} className="p-card">
            <div className="p-icon-box">
              <f.icon size={24} />
            </div>
            <h3 className="p-title" style={{ fontSize: '17px', marginBottom: '8px' }}>{f.title}</h3>
            <p className="p-subtitle" style={{ fontSize: '14px' }}>{f.desc}</p>
          </div>
        ))}
      </div>

      <section className="p-card">
        <h2 className="p-title" style={{ fontSize: '20px', marginBottom: '32px' }}>
          Contact the Developer
        </h2>
        
        <div className="p-flex-row" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div className="p-avatar">IS</div>
          
          <div style={{ flex: 1, minWidth: '250px' }}>
            <h3 className="p-title" style={{ fontSize: '18px', marginBottom: '8px' }}>
              Ibrahim Sabrey
            </h3>
            <p className="p-subtitle" style={{ marginBottom: '24px' }}>
              A software developer passionate about building smart tools that solve real problems and make users' lives easier.
            </p>
            
            <div className="p-flex-center" style={{ flexWrap: 'wrap' }}>
              <a href="mailto:ebrahimsabrey2001@gmail.com" className="p-pill">
                <Mail size={16} />
                Email
              </a>
              <a href="https://linkedin.com/in/ibrahimsabrey" target="_blank" rel="noopener noreferrer" className="p-pill">
                <Link size={16} />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ marginTop: '48px' }}>
        <CreatorFooter />
      </footer>
    </div>
  );
};
