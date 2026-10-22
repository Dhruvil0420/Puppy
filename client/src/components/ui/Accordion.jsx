import React, { useState } from 'react';

export default function Accordion({ items = [], className = '' }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const itemId = `faq-item-${index}`;
        const panelId = `faq-panel-${index}`;

        return (
          <div
            key={index}
            className="rounded-3xl border border-cocoa/10 bg-white/70 backdrop-blur-sm transition-all duration-200 overflow-hidden shadow-soft"
          >
            <h3>
              <button
                type="button"
                id={itemId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left font-display text-lg sm:text-xl text-cocoa transition-colors hover:text-apricot cursor-pointer"
              >
                <span>{item.question}</span>
                <span
                  className={`size-8 shrink-0 rounded-full bg-honey/60 flex items-center justify-center text-cocoa text-base font-semibold transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-honey' : ''
                  }`}
                  aria-hidden="true"
                >
                  ↓
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={itemId}
              hidden={!isOpen}
              className={`px-5 sm:px-6 pb-6 text-cocoa/80 text-sm sm:text-base leading-relaxed transition-all duration-300 ${
                isOpen ? 'block animate-fade-in' : 'hidden'
              }`}
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
