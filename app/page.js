'use client';

import Link from 'next/link';
import { useLanguage } from '../utils/LanguageContext';
import { t } from '../utils/i18n';

export default function HomePage() {
  const { language } = useLanguage();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container">
          <div className="hero-content">
            <h1 id="hero-title" className="hero-title">
              {t('home.title', language)}<br />
              <span className="highlight">{t('home.cta', language)}</span>
            </h1>
            <p className="hero-description">
              {t('home.subtitle', language)}
            </p>
            <div className="hero-actions">
              <Link href="/document-explainer" className="btn btn-primary btn-large">
                📄 {t('nav.documentExplainer', language)}
              </Link>
              <Link href="/recorder" className="btn btn-outline btn-large">
                🎤 {t('nav.statementRecorder', language)}
              </Link>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-icon">⚖️</div>
              <p>"{t('home.tagline', language)}"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="mission" aria-labelledby="mission-title">
        <div className="container">
          <div className="mission-content">
            <h2 id="mission-title" className="section-title">Our Mission</h2>
            <p className="mission-text">
              Millions of citizens face the legal system without understanding what is happening 
              around them. Legal documents are filled with complex language, court proceedings 
              can be confusing, and the fear of the unknown often prevents people from seeking 
              the justice they deserve.
            </p>
            <p className="mission-text">
              <strong>{t('common.civisLaw', language)} {t('nav.home', language) === 'Home' ? 'is here to help' : 'यहाँ मदद करने के लिए है'}</strong> 
              {language === 'en' ? '. We are an "understanding layer" between the judicial system and citizens — translating complexity into clarity while respecting the authority of courts and the importance of legal professionals.' : 
               language === 'hi' ? '. हम न्यायिक प्रणाली और नागरिकों के बीच एक "समझ की परत" हैं — न्यायालयों के अधिकार और विधिक पेशेवरों के महत्व का सम्मान करते हुए जटिलता को स्पष्टता में अनुवाद करना।' :
               '. We are an "understanding layer" between the judicial system and citizens.'}
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="principles" aria-labelledby="principles-title">
        <div className="container">
          <h2 id="principles-title" className="section-title text-center">Our Core Design Principles</h2>
          <div className="principles-grid">
            <div className="principle-card">
              <div className="principle-icon">💡</div>
              <h3>Explain, don't advise</h3>
              <p>We help you understand what is happening, but we never tell you what to do legally.</p>
            </div>
            <div className="principle-card">
              <div className="principle-icon">💪</div>
              <h3>Empower, don't replace</h3>
              <p>We give you knowledge to make informed decisions, but we never replace your lawyer.</p>
            </div>
            <div className="principle-card">
              <div className="principle-icon">👤</div>
              <h3>Dignity-first</h3>
              <p>Every interaction is designed to respect your dignity, especially in sensitive cases.</p>
            </div>
            <div className="principle-card">
              <div className="principle-icon">🔒</div>
              <h3>Privacy by default</h3>
              <p>Your data is yours. We protect it with end-to-end encryption and never share without consent.</p>
            </div>
            <div className="principle-card">
              <div className="principle-icon">🌐</div>
              <h3>Language accessibility</h3>
              <p>Understanding justice should not depend on your language skills.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" aria-labelledby="features-title">
        <div className="container">
          <h2 id="features-title" className="section-title text-center">{t('home.features', language)}</h2>
          <p className="section-subtitle text-center">
            Tools designed to help you understand and navigate the legal system
          </p>
          
          <div className="features-grid">
            {/* Feature 1: Document Explainer */}
            <article className="feature-card-large">
              <div className="feature-header">
                <div className="feature-icon-large">📄</div>
                <div className="feature-badge">Core Feature</div>
              </div>
              <h3>{t('home.feature1Title', language)}</h3>
              <p>
                {t('home.feature1Desc', language)}
              </p>
              <ul className="feature-list">
                <li>✓ Plain-language explanations</li>
                <li>✓ What the document actually means</li>
                <li>✓ What happens next in the process</li>
                <li>✓ Multi-language support</li>
              </ul>
              <Link href="/document-explainer" className="btn btn-primary">
                {t('nav.documentExplainer', language)} →
              </Link>
            </article>

            {/* Feature 2: Statement Recorder */}
            <article className="feature-card-large">
              <div className="feature-header">
                <div className="feature-icon-large">🎤</div>
                <div className="feature-badge badge-warning">Sensitive Cases</div>
              </div>
              <h3>{t('home.feature2Title', language)}</h3>
              <p>
                {t('home.feature2Desc', language)}
              </p>
              <ul className="feature-list">
                <li>✓ Voice recording in your language</li>
                <li>✓ Automatic transcription</li>
                <li>✓ Review and approve before sharing</li>
                <li>✓ Full control over your data</li>
              </ul>
              <Link href="/recorder" className="btn btn-primary">
                {t('nav.statementRecorder', language)} →
              </Link>
            </article>

            {/* Feature 3: Court Translator */}
            <article className="feature-card-large">
              <div className="feature-header">
                <div className="feature-icon-large">🌐</div>
                <div className="feature-badge">Real-Time</div>
              </div>
              <h3>{t('home.feature3Title', language)}</h3>
              <p>
                {t('home.feature3Desc', language)}
              </p>
              <ul className="feature-list">
                <li>✓ Live subtitles in your language</li>
                <li>✓ Optional audio translation</li>
                <li>✓ Multiple language support</li>
                <li>✓ Clearly marked as non-official</li>
              </ul>
              <Link href="/translator" className="btn btn-primary">
                {t('nav.courtTranslator', language)} →
              </Link>
            </article>

            {/* Feature 4: Word Decoder */}
            <article className="feature-card-large">
              <div className="feature-header">
                <div className="feature-icon-large">📖</div>
                <div className="feature-badge">Quick Reference</div>
              </div>
              <h3>{t('home.feature4Title', language)}</h3>
              <p>
                {t('home.feature4Desc', language)}
              </p>
              <ul className="feature-list">
                <li>✓ One-tap explanations</li>
                <li>✓ No legal jargon</li>
                <li>✓ Real-life examples</li>
                <li>✓ Available everywhere</li>
              </ul>
              <Link href="/decoder" className="btn btn-primary">
                {t('nav.wordDecoder', language)} →
              </Link>
            </article>

            {/* Feature 5: Case Timeline */}
            <article className="feature-card-large">
              <div className="feature-header">
                <div className="feature-icon-large">📅</div>
                <div className="feature-badge">Visual Guide</div>
              </div>
              <h3>{t('home.feature5Title', language)}</h3>
              <p>
                {t('home.feature5Desc', language)}
              </p>
              <ul className="feature-list">
                <li>✓ Visual timeline stages</li>
                <li>✓ What happens at each stage</li>
                <li>✓ Approximate time expectations</li>
                <li>✓ Trauma-informed design</li>
              </ul>
              <Link href="/timeline" className="btn btn-primary">
                {t('nav.caseTimeline', language)} →
              </Link>
            </article>

            {/* Feature 6: Court Companion */}
            <article className="feature-card-large">
              <div className="feature-header">
                <div className="feature-icon-large">🤝</div>
                <div className="feature-badge">Companion</div>
              </div>
              <h3>Court Companion Mode</h3>
              <p>
                Your personal guide during court proceedings. Explains what is 
                happening in real-time and prepares you for what may be asked.
              </p>
              <ul className="feature-list">
                <li>✓ Real-time explanations</li>
                <li>✓ Reduces anxiety</li>
                <li>✓ Prepares you for questions</li>
                <li>✓ 8th-grade language level</li>
              </ul>
              <Link href="/translator" className="btn btn-primary">
                Use Court Companion →
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* Ethical Guardrails */}
      <section className="guardrails" aria-labelledby="guardrails-title">
        <div className="container">
          <div className="guardrails-content">
            <h2 id="guardrails-title" className="section-title">Our Ethical Guardrails</h2>
            <p>These rules are hard-coded into our platform:</p>
            
            <div className="guardrails-grid">
              <div className="guardrail-item not-allowed">
                <h4>❌ What We Don't Do</h4>
                <ul>
                  <li>Provide legal advice</li>
                  <li>Predict case outcomes</li>
                  <li>Criticize judges, police, or lawyers</li>
                  <li>Replace your lawyer</li>
                </ul>
              </div>
              
              <div className="guardrail-item allowed">
                <h4>✅ What We Do</h4>
                <ul>
                  <li>Provide explanations only</li>
                  <li>Focus on education and process</li>
                  <li>Respect all parties in the system</li>
                  <li>Help you understand your situation</li>
                </ul>
              </div>
            </div>
            
            <div className="disclaimer-banner">
              <p>
                <strong>{t('home.disclaimerTitle', language)}:</strong> {t('home.disclaimerText', language)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="audience" aria-labelledby="audience-title">
        <div className="container">
          <h2 id="audience-title" className="section-title text-center">Who This Platform Is For</h2>
          
          <div className="audience-grid">
            <div className="audience-card">
              <h3>👤 Citizens</h3>
              <p>
                Anyone who needs to understand court documents, follow their case progress, 
                or reduce their dependency on intermediaries for basic understanding.
              </p>
            </div>
            
            <div className="audience-card">
              <h3>🎗️ Victims</h3>
              <p>
                People who have experienced crime or harm and need a safe, dignified way 
                to record statements and understand the legal process ahead.
              </p>
            </div>
            
            <div className="audience-card">
              <h3>🤝 NGOs & Legal Aid</h3>
              <p>
                Organizations that help citizens navigate the legal system and need 
                consent-based tools to support their work without owning user data.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .home-page {
          padding-bottom: var(--spacing-3xl);
        }
        
        /* Hero Section */
        .hero {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          color: white;
          padding: var(--spacing-3xl) 0;
          position: relative;
          overflow: hidden;
        }
        
        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="2"/></svg>') repeat;
          background-size: 100px 100px;
        }
        
        .hero .container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-2xl);
          align-items: center;
          position: relative;
          z-index: 1;
        }
        
        .hero-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          margin-bottom: var(--spacing-lg);
          color: white;
          line-height: 1.1;
        }
        
        .hero-title .highlight {
          color: rgba(255, 255, 255, 0.9);
        }
        
        .hero-description {
          font-size: var(--font-size-md);
          line-height: var(--line-height-relaxed);
          margin-bottom: var(--spacing-xl);
          opacity: 0.95;
        }
        
        .hero-actions {
          display: flex;
          gap: var(--spacing-md);
          flex-wrap: wrap;
        }
        
        .hero-actions .btn {
          min-width: 200px;
        }
        
        .hero-visual {
          display: flex;
          justify-content: center;
        }
        
        .hero-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          max-width: 400px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .hero-icon {
          font-size: 4rem;
          margin-bottom: var(--spacing-md);
        }
        
        .hero-card p {
          margin: 0;
          font-style: italic;
          line-height: var(--line-height-relaxed);
        }
        
        /* Mission Section */
        .mission {
          background: var(--color-surface);
          padding: var(--spacing-3xl) 0;
        }
        
        .mission-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }
        
        .section-title {
          font-size: var(--font-size-2xl);
          margin-bottom: var(--spacing-lg);
          color: var(--color-text-primary);
        }
        
        .section-subtitle {
          font-size: var(--font-size-md);
          color: var(--color-text-secondary);
          margin-top: calc(-1 * var(--spacing-md));
          margin-bottom: var(--spacing-xl);
        }
        
        .text-center {
          text-align: center;
        }
        
        .mission-text {
          font-size: var(--font-size-md);
          line-height: var(--line-height-relaxed);
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-lg);
        }
        
        /* Principles Section */
        .principles {
          background: var(--color-secondary);
          padding: var(--spacing-3xl) 0;
        }
        
        .principles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-lg);
          margin-top: var(--spacing-xl);
        }
        
        .principle-card {
          background: var(--color-surface);
          padding: var(--spacing-xl);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          text-align: center;
          transition: transform var(--transition-normal), box-shadow var(--transition-normal);
        }
        
        .principle-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
        
        .principle-icon {
          font-size: 3rem;
          margin-bottom: var(--spacing-md);
        }
        
        .principle-card h3 {
          font-size: var(--font-size-lg);
          margin-bottom: var(--spacing-sm);
          font-family: 'Inter', sans-serif;
        }
        
        .principle-card p {
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
          margin: 0;
        }
        
        /* Features Section */
        .features {
          background: var(--color-surface);
          padding: var(--spacing-3xl) 0;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: var(--spacing-xl);
          margin-top: var(--spacing-xl);
        }
        
        .feature-card-large {
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          box-shadow: var(--shadow-md);
          border: 1px solid var(--color-border);
          transition: all var(--transition-normal);
        }
        
        .feature-card-large:hover {
          box-shadow: var(--shadow-xl);
          transform: translateY(-2px);
        }
        
        .feature-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }
        
        .feature-icon-large {
          font-size: 2.5rem;
        }
        
        .feature-badge {
          font-size: var(--font-size-xs);
          padding: var(--spacing-xs) var(--spacing-sm);
          background: var(--color-success-light);
          color: var(--color-success);
          border-radius: var(--radius-full);
          font-weight: 600;
        }
        
        .feature-card-large h3 {
          font-size: var(--font-size-xl);
          margin-bottom: var(--spacing-sm);
          font-family: 'Inter', sans-serif;
        }
        
        .feature-card-large > p {
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-md);
          line-height: var(--line-height-relaxed);
        }
        
        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0 0 var(--spacing-lg) 0;
        }
        
        .feature-list li {
          padding: var(--spacing-xs) 0;
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
        }
        
        /* Guardrails Section */
        .guardrails {
          background: var(--color-secondary);
          padding: var(--spacing-3xl) 0;
        }
        
        .guardrails-content {
          max-width: 900px;
          margin: 0 auto;
        }
        
        .guardrails-content > p {
          font-size: var(--font-size-md);
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-lg);
        }
        
        .guardrails-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }
        
        .guardrail-item {
          background: var(--color-surface);
          padding: var(--spacing-xl);
          border-radius: var(--radius-md);
        }
        
        .guardrail-item h4 {
          margin-bottom: var(--spacing-md);
          font-family: 'Inter', sans-serif;
        }
        
        .not-allowed h4 {
          color: #DC2626;
        }
        
        .allowed h4 {
          color: var(--color-success);
        }
        
        .guardrail-item ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .guardrail-item li {
          padding: var(--spacing-sm) 0;
          border-bottom: 1px solid var(--color-border);
          color: var(--color-text-secondary);
        }
        
        .guardrail-item li:last-child {
          border-bottom: none;
        }
        
        /* Audience Section */
        .audience {
          background: var(--color-surface);
          padding: var(--spacing-3xl) 0;
        }
        
        .audience-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-lg);
          margin-top: var(--spacing-xl);
        }
        
        .audience-card {
          background: var(--color-secondary);
          padding: var(--spacing-xl);
          border-radius: var(--radius-md);
          text-align: center;
        }
        
        .audience-card h3 {
          font-size: var(--font-size-xl);
          margin-bottom: var(--spacing-md);
          font-family: 'Inter', sans-serif;
        }
        
        .audience-card p {
          color: var(--color-text-secondary);
          margin: 0;
          line-height: var(--line-height-relaxed);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .hero .container {
            grid-template-columns: 1fr;
            text-align: center;
          }
          
          .hero-actions {
            justify-content: center;
          }
          
          .hero-visual {
            order: -1;
          }
          
          .hero-card {
            max-width: 100%;
          }
          
          .guardrails-grid {
            grid-template-columns: 1fr;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
