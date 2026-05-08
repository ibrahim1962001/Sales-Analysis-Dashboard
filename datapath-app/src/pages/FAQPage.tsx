import React, { useState, useMemo } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface Props {}

const getFaqs = () => [
  {
    q: 'Is my data safe?',
    a: 'Absolutely! Kimit runs entirely locally (Client-side). Your data is never uploaded to any server; it is analyzed only in your browser\'s temporary memory.'
  },
  {
    q: 'What if the browser freezes?',
    a: 'This might happen with massive files (over 1 million records) due to browser memory limits. We recommend splitting the file or using a robust browser like Chrome.'
  },
  {
    q: 'Does it support JSON files?',
    a: 'Currently we fully support CSV and Excel. JSON support is in our near-future roadmap!'
  },
  {
    q: 'Is it free?',
    a: 'Yes, the site is completely free for personal and commercial use.'
  }
];

export const FAQPage: React.FC<Props> = ({ }) => {
  const faqs = useMemo(() => getFaqs(), []);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="p-section" dir="ltr">
      <header className="p-header">
        <div className="p-flex-center" style={{ marginBottom: '16px' }}>
          <HelpCircle size={32} className="p-icon-box" style={{ marginBottom: 0 }} />
          <h1 className="p-title" style={{ marginBottom: 0 }}>
            Frequently Asked Questions
          </h1>
        </div>
        <p className="p-subtitle">
          Everything you need to know about Kimit and how to handle your data smartly.
        </p>
      </header>

      <div>
        {faqs.map((faq, i) => (
          <div key={i} className="p-accordion-item" style={{ borderColor: openIndex === i ? 'var(--accent)' : 'var(--border)' }}>
            <button 
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="p-accordion-btn"
            >
              <span style={{ color: openIndex === i ? 'var(--accent)' : 'var(--text-primary)' }}>
                {faq.q}
              </span>
              <ChevronDown 
                size={20} 
                style={{ 
                  color: openIndex === i ? 'var(--accent)' : 'var(--text-secondary)',
                  transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s'
                }} 
              />
            </button>
            
            {openIndex === i && (
              <div className="p-accordion-content" style={{ borderTop: '1px solid rgba(51, 65, 85, 0.5)' }}>
                <div style={{ paddingTop: '16px' }}>
                  {faq.a}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <section className="p-card" style={{ marginTop: '64px', textAlign: 'center' }}>
        <h3 className="p-title" style={{ fontSize: '18px' }}>
          Still have questions?
        </h3>
        <p className="p-subtitle" style={{ marginBottom: '32px' }}>
          We're here to help! Contact us directly via email.
        </p>
        <a href="mailto:ebrahimsabrey2001@gmail.com" className="p-pill">
          Contact Support
        </a>
      </section>
    </div>
  );
};
