import React from 'react';
import { Search, Brain, BarChart2, FileText, BookOpen } from 'lucide-react';

interface Props {}

export const GuidePage: React.FC<Props> = ({ }) => {
  
  const steps = [
    {
      icon: Search,
      title: 'Explore Data',
      desc: 'Upload your file and Kimit will automatically analyze structure, types, and correlations.'
    },
    {
      icon: Brain,
      title: 'AI Intelligence',
      desc: 'Ask the smart consultant anything about your data and get accurate answers.'
    },
    {
      icon: BarChart2,
      title: 'Visualizations',
      desc: 'Turn numbers into stunning visual stories with a single click.'
    },
    {
      icon: FileText,
      title: 'Export Reports',
      desc: 'Extract your results in Excel, PDF, or high-quality images.'
    }
  ];

  return (
    <div className="p-section" dir="ltr">
      <header className="p-header">
        <div className="p-flex-center" style={{ marginBottom: '16px' }}>
          <BookOpen size={32} className="p-icon-box" style={{ marginBottom: 0 }} />
          <h1 className="p-title" style={{ marginBottom: 0 }}>
            User Guide
          </h1>
        </div>
        <p className="p-subtitle">
          Learn how to use Kimit AI Studio to transform your raw data into valuable insights in minutes.
        </p>
      </header>

      <div style={{ position: 'relative' }}>
        {/* Connecting Line */}
        <div className="p-step-line" style={{ left: '15px' }} />

        <div style={{ display: 'grid', gap: '48px' }}>
          {steps.map((step, i) => (
            <div key={i} className="p-flex-row" style={{ position: 'relative', zIndex: 1 }}>
              <div className="p-badge">{i + 1}</div>
              
              <div className="p-card" style={{ flex: 1 }}>
                <div className="p-flex-center" style={{ marginBottom: '16px' }}>
                  <div className="p-icon-box" style={{ marginBottom: 0 }}>
                    <step.icon size={24} />
                  </div>
                  <h3 className="p-title" style={{ fontSize: '18px', marginBottom: 0 }}>
                    {step.title}
                  </h3>
                </div>
                <p className="p-subtitle">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="p-card" style={{ marginTop: '64px', background: 'linear-gradient(135deg, var(--bg-secondary), rgba(16, 185, 129, 0.05))', textAlign: 'center' }}>
        <h2 className="p-title" style={{ fontSize: '20px' }}>
          Ready to start?
        </h2>
        <p className="p-subtitle" style={{ marginBottom: '24px' }}>
          Go to the home page and upload your first data file now.
        </p>
        <button className="p-pill" style={{ border: 'none', cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
          Start Now
        </button>
      </footer>
    </div>
  );
};
