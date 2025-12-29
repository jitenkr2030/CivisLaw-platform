'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage, LanguageProvider } from '../utils/LanguageContext';
import { t } from '../utils/i18n';

function LayoutContent({ children }) {
  const { language, changeLanguage, supportedLanguages } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Update document language attribute
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <nav className="nav" role="navigation" aria-label="Main navigation">
            <Link href="/" className="logo" aria-label="CivisLaw Home">
              <span className="logo-icon" aria-hidden="true">⚖️</span>
              <span className="logo-text">{t('common.civisLaw', language)}</span>
            </Link>
            
            <button 
              className="mobile-menu-toggle" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            
            <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`} role="menubar">
              <li role="none">
                <Link href="/document-explainer" role="menuitem" onClick={() => setIsMenuOpen(false)}>
                  {t('nav.documentExplainer', language)}
                </Link>
              </li>
              <li role="none">
                <Link href="/recorder" role="menuitem" onClick={() => setIsMenuOpen(false)}>
                  {t('nav.statementRecorder', language)}
                </Link>
              </li>
              <li role="none">
                <Link href="/translator" role="menuitem" onClick={() => setIsMenuOpen(false)}>
                  {t('nav.courtTranslator', language)}
                </Link>
              </li>
              <li role="none">
                <Link href="/decoder" role="menuitem" onClick={() => setIsMenuOpen(false)}>
                  {t('nav.wordDecoder', language)}
                </Link>
              </li>
              <li role="none">
                <Link href="/timeline" role="menuitem" onClick={() => setIsMenuOpen(false)}>
                  {t('nav.caseTimeline', language)}
                </Link>
              </li>
            </ul>
            
            <div className="nav-actions">
              <select 
                className="language-selector form-input" 
                aria-label={t('nav.selectLanguage', language)}
                value={language}
                onChange={handleLanguageChange}
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>
          </nav>
        </div>
      </header>

      <main id="main-content" role="main">
        {children}
      </main>

      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>{t('common.civisLaw', language)}</h4>
              <p>{t('footer.tagline', language)}</p>
            </div>
            <div className="footer-section">
              <h4>{t('footer.quickLinks', language)}</h4>
              <Link href="/document-explainer">{t('nav.documentExplainer', language)}</Link>
              <Link href="/recorder">{t('nav.statementRecorder', language)}</Link>
              <Link href="/translator">{t('nav.courtTranslator', language)}</Link>
              <Link href="/decoder">{t('nav.wordDecoder', language)}</Link>
            </div>
            <div className="footer-section">
              <h4>{t('footer.resources', language)}</h4>
              <Link href="/timeline">{t('nav.caseTimeline', language)}</Link>
              <a href="#legal-disclaimer">{t('home.disclaimerTitle', language)}</a>
              <a href="#privacy-policy">{t('home.disclaimerTitle', language)}</a>
            </div>
            <div className="footer-section">
              <h4>{t('footer.important', language)}</h4>
              <p>{t('home.disclaimerText', language)}</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 {t('common.civisLaw', language)}. {t('footer.builtWith', language)}</p>
            <p>{t('footer.footerText', language)}</p>
          </div>
        </div>
      </footer>

      <a 
        href="https://weather.com" 
        className="emergency-exit" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label={t('common.emergencyExit', language)}
      >
        🏃 {t('common.emergencyExit', language)}
      </a>

      <style jsx>{`
        .header {
          background: var(--color-surface);
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 0;
          z-index: var(--z-sticky);
        }
        
        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-md) 0;
          gap: var(--spacing-lg);
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-family: 'Merriweather', serif;
          font-size: var(--font-size-xl);
          font-weight: 700;
          color: var(--color-primary);
          text-decoration: none;
        }
        
        .logo:hover {
          text-decoration: none;
          color: var(--color-primary-dark);
        }
        
        .logo-icon {
          font-size: var(--font-size-2xl);
        }
        
        .mobile-menu-toggle {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--spacing-sm);
        }
        
        .mobile-menu-toggle span {
          display: block;
          width: 25px;
          height: 3px;
          background: var(--color-text-primary);
          border-radius: 2px;
        }
        
        .nav-links {
          display: flex;
          list-style: none;
          gap: var(--spacing-xs);
          margin: 0;
          padding: 0;
        }
        
        .nav-links a {
          display: block;
          padding: var(--spacing-sm) var(--spacing-md);
          color: var(--color-text-secondary);
          font-weight: 500;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }
        
        .nav-links a:hover {
          background: var(--color-secondary);
          color: var(--color-primary);
          text-decoration: none;
        }
        
        .nav-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }
        
        .language-selector {
          min-width: 120px;
          padding: var(--spacing-sm) var(--spacing-md);
        }
        
        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: flex;
          }
          
          .nav-links {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--color-surface);
            flex-direction: column;
            padding: var(--spacing-md);
            box-shadow: var(--shadow-lg);
          }
          
          .nav-links.active {
            display: flex;
          }
          
          .nav-links a {
            padding: var(--spacing-md);
          }
          
          .nav-actions {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

export default function LayoutWrapper({ children }) {
  return (
    <LanguageProvider>
      <LayoutContent>
        {children}
      </LayoutContent>
    </LanguageProvider>
  );
}
