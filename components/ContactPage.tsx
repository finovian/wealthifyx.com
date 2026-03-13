'use client';

import { useState } from 'react';
import { Mail, ExternalLink, MessageSquare, ArrowRight, Check } from 'lucide-react';
import FAQSection from '@/components/FAQSection';

/* ── Data ── */
const stats = [
  { value: '24–48h', label: 'Response Time' },
  { value: '100%', label: 'Messages Read' },
  { value: '0', label: 'Spam or Upsells' },
  { value: '14+', label: 'Tools Built' },
];

const faqs = [
  {
    q: 'Do you respond to every message?',
    a: "Yes. Every message is read by a real person. We don't use automated responses or support ticket systems. Response time is typically within 24–48 hours on weekdays.",
  },
  {
    q: 'How do I request a new calculator?',
    a: 'Use the contact form above and select "Tool Request" as the subject. Tell us what calculator you need and what problem it would solve. We prioritize based on search demand and user requests.',
  },
  {
    q: 'Can I report a bug or incorrect calculation?',
    a: 'Please do — and include the inputs you used so we can reproduce it. Accuracy is our top priority and we treat every bug report as urgent.',
  },
];

const SUBJECT_OPTIONS = [
  'Tool Request',
  'Bug Report',
  'General Feedback',
  'Partnership / Affiliate',
  'Other',
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Tool Request',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handlePillClick = (subject: string) => {
    setFormData((prev) => ({ ...prev, subject }));
    const formElement = document.getElementById('contact-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // TODO: connect to form API
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: 'Tool Request', message: '' });
      
      // Reset after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <main className="min-h-screen">
      {/* ── Hero ── */}
      <section className="bg-[var(--bg-subtle)] border-b border-[var(--border)] p-[90px_48px_60px] md:max-lg:p-[80px_32px_48px] max-md:p-[72px_20px_40px]">
        <div className="max-w-[1100px] m-[0_auto]">
          <span className="section-eyebrow block mb-[16px]">{'// CONTACT'}</span>
          <h1 className="font-sans font-[400] tracking-[-2px] leading-[1.05] text-[var(--text-primary)] m-[0_0_24px_0] text-[clamp(40px,6vw,64px)] max-md:text-[36px] max-md:tracking-[-1px]">
            Contact WealthifyX.<br />
            <span className="text-[var(--accent)]  ">We&apos;d love to hear from you.</span>
          </h1>
          <p className="font-sans text-[18px] md:max-lg:text-[17px] max-md:text-[15px] text-[var(--text-muted)] leading-[1.7] max-w-[600px] m-[0]">
            Tool request · Bug report · Partnership inquiry <br className="hidden sm:block" />
            We read every message and respond within 24–48 hours.
          </p>

          {/* Quick nav pills */}
          <div className="flex flex-wrap gap-[8px] mt-[32px]">
            {["Request a Tool", "Report a Bug", "General Feedback"].map((label) => (
              <button
                key={label}
                onClick={() => handlePillClick(label === "Request a Tool" ? "Tool Request" : label === "Report a Bug" ? "Bug Report" : "General Feedback")}
                className="font-ubuntu text-[12px] font-[500] px-[16px] py-[6px] rounded-full border border-[var(--border)] text-[var(--text-muted)] bg-[var(--bg-base)] hover:border-[var(--accent-border)] hover:text-[var(--accent)] transition-colors duration-150 cursor-pointer"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-[var(--bg-base)] border-b border-[var(--border)] p-[24px_48px] md:max-lg:p-[24px_32px] max-md:p-[24px_20px]">
        <div className="max-w-[1100px] m-[0_auto] grid grid-cols-2 md:grid-cols-4 gap-[24px] md:gap-0 md:divide-x md:divide-[var(--border)]">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-start md:items-center md:px-[24px] gap-[4px]">
              <span className="font-sans text-[28px] md:text-[32px] font-[500] text-[var(--text-primary)] leading-none">
                {s.value}
              </span>
              <span className="font-sans text-[11px] text-[var(--text-faint)] uppercase tracking-[1px]">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="p-[80px_48px] md:max-lg:p-[64px_32px] max-md:p-[48px_20px] bg-[var(--bg-base)]">
        <div className="max-w-[1100px] m-[0_auto] grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-[48px] lg:gap-[64px] items-start">
          
          {/* Left Column: Contact Info */}
          <div className="flex flex-col gap-[16px]">
            <div className="card p-[24px] max-md:p-[20px] flex flex-col gap-[16px]">
              <div className="flex items-center gap-[12px]">
                <div className="w-[40px] h-[40px] rounded-[10px] bg-[var(--accent-bg)] border-[1px] border-[var(--accent-border)] flex items-center justify-center text-[var(--accent)] shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="font-ubuntu text-[12px] font-[500] text-[var(--text-secondary)] uppercase tracking-[0.5px]">Email Us</div>
                  <a href="mailto:hello@wealthifyx.com" className="font-sans text-[15px] text-[var(--accent)] font-[500] no-underline hover:underline transition-all">hello@wealthifyx.com</a>
                </div>
              </div>
              <p className="font-sans text-[13px] text-[var(--text-faint)] m-[0]">Fastest response for bug reports</p>
            </div>

            <div className="card p-[24px] max-md:p-[20px] flex flex-col gap-[16px]">
              <div className="flex items-center gap-[12px]">
                <div className="w-[40px] h-[40px] rounded-[10px] bg-[var(--bg-subtle)] border-[1px] border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] shrink-0">
                  <ExternalLink size={18} />
                </div>
                <div>
                  <div className="font-ubuntu text-[12px] font-[500] text-[var(--text-secondary)] uppercase tracking-[0.5px]">Follow on X</div>
                  <a href="https://x.com/WealthifyX" target="_blank" rel="noopener noreferrer" className="font-sans text-[15px] text-[var(--text-primary)] font-[500] no-underline hover:text-[var(--accent)] transition-all">@WealthifyX</a>
                </div>
              </div>
              <p className="font-sans text-[13px] text-[var(--text-faint)] m-[0]">Tool announcements and updates</p>
            </div>

            <div className="card p-[24px] max-md:p-[20px] flex flex-col gap-[16px]">
              <div className="flex items-center gap-[12px]">
                <div className="w-[40px] h-[40px] rounded-[10px] bg-[var(--bg-subtle)] border-[1px] border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] shrink-0">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <div className="font-ubuntu text-[12px] font-[500] text-[var(--text-secondary)] uppercase tracking-[0.5px]">Feature Requests</div>
                  <div className="font-sans text-[15px] text-[var(--text-primary)] font-[500]">Use the form →</div>
                </div>
              </div>
              <p className="font-sans text-[13px] text-[var(--text-faint)] m-[0]">We ship new tools monthly</p>
            </div>

            <div className="card p-[24px] max-md:p-[20px] bg-[var(--bg-subtle)] border border-[var(--border)] mt-[16px]">
              <h3 className="font-sans font-[600] text-[15px] text-[var(--text-primary)] mb-[16px]">What happens next</h3>
              <div className="flex flex-col gap-[12px]">
                {[
                  'We receive your message instantly',
                  'A real person reads it (no bots)',
                  'You get a reply within 24–48 hours',
                  "If it's a tool request, it goes on the roadmap",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-[12px]">
                    <span className="font-sans text-[11px] text-[var(--accent)] shrink-0 mt-[3px]">
                      0{i + 1} —
                    </span>
                    <span className="font-sans text-[13px] text-[var(--text-muted)] leading-[1.5]">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div id="contact-form" className="card p-[40px] max-md:p-[24px] shadow-[var(--shadow-md)]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                <div className="flex flex-col gap-[6px]">
                  <label htmlFor="name" className="font-ubuntu text-[12px] font-[500] text-[var(--text-secondary)] uppercase tracking-[0.5px] block">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Jane Doe"
                    className="input-field font-ubuntu h-[48px]"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <label htmlFor="email" className="font-ubuntu text-[12px] font-[500] text-[var(--text-secondary)] uppercase tracking-[0.5px] block">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="jane@example.com"
                    className="input-field font-ubuntu h-[48px]"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-[6px]">
                <label htmlFor="subject" className="font-ubuntu text-[12px] font-[500] text-[var(--text-secondary)] uppercase tracking-[0.5px] block">
                  Subject
                </label>
                <select
                  id="subject"
                  className="input-field font-ubuntu h-[48px] bg-[var(--bg-card)] cursor-pointer"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  {SUBJECT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-[6px]">
                <label htmlFor="message" className="font-ubuntu text-[12px] font-[500] text-[var(--text-secondary)] uppercase tracking-[0.5px] block">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  placeholder="How can we help you?"
                  className="input-field font-ubuntu min-h-[140px] py-[12px] resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending' || status === 'success'}
                className={`btn-primary w-full h-[52px] font-ubuntu font-[700] text-[15px] transition-all duration-200 flex items-center justify-center gap-[8px] ${
                  status === 'sending' ? 'opacity-[0.7] cursor-not-allowed' : 
                  status === 'success' ? 'bg-[var(--accent)] border-[var(--accent)]' : 
                  status === 'error' ? 'bg-[#ef4444] border-[#ef4444]' : ''
                }`}
              >
                {status === 'idle' && <>Send Message <ArrowRight size={16} /></>}
                {status === 'sending' && "Sending..."}
                {status === 'success' && <><Check size={18} /> Message Sent!</>}
                {status === 'error' && "Failed — Try Again"}
              </button>

              <div className="font-sans text-[11px] text-[var(--text-faint)] text-center mt-[8px]">
                We never share your email. No marketing. No tracking.
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <FAQSection faqs={faqs} id="faq" background="subtle" />

      {/* ── Final CTA ── */}
      <section className="p-[100px_48px] md:max-lg:p-[80px_32px] max-md:p-[64px_20px] bg-[var(--bg-base)] text-center">
        <div className="max-w-[640px] m-[0_auto]">
          <span className="section-eyebrow block mb-[16px]">{'// WHILE YOU\'RE HERE'}</span>
          <h2 className="section-heading mb-[20px] max-md:mb-[12px]">Try a calculator while you wait.</h2>
          <p className="section-subtext mb-[32px] max-md:text-[14px] m-[0_auto]">
            Most users hear back within a day. In the meantime, our tools are ready to use.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-[12px]">
            <a href="/tools" className="btn-primary inline-flex items-center justify-center px-[32px] py-[12px] text-[15px] max-md:w-full no-underline h-[50px]">
              Browse All Tools →
            </a>
            <a href="/tools/compound-interest-calculator" className="btn-ghost inline-flex items-center justify-center px-[32px] py-[12px] text-[15px] max-md:w-full no-underline h-[50px]">
              Try Calculator
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
