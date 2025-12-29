'use client';

import Link from 'next/link';

export default function LayoutWrapper({ children }) {
  return (
    <>
      <header className="header">
        <div className="container">
          <nav className="nav" role="navigation" aria-label="Main navigation">
            <Link href="/" className="logo" aria-label="CivisLaw Home">
              <span className="logo-icon" aria-hidden="true">⚖️</span>
              <span className="logo-text">CivisLaw</span>
            </Link>
            
            <button 
              className="mobile-menu-toggle" 
              aria-label="Toggle navigation menu"
              aria-expanded="false"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            
            <ul className="nav-links" role="menubar">
              <li role="none">
                <Link href="/document-explainer" role="menuitem">
                  Document Explainer
                </Link>
              </li>
              <li role="none">
                <Link href="/recorder" role="menuitem">
                  Statement Recorder
                </Link>
              </li>
              <li role="none">
                <Link href="/translator" role="menuitem">
                  Court Translator
                </Link>
              </li>
              <li role="none">
                <Link href="/decoder" role="menuitem">
                  Word Decoder
                </Link>
              </li>
              <li role="none">
                <Link href="/timeline" role="menuitem">
                  Case Timeline
                </Link>
              </li>
            </ul>
            
            <div className="nav-actions">
              <select 
                className="language-selector form-input" 
                aria-label="Select Language"
                defaultValue="en"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="ta">தமிழ்</option>
                <option value="te">తెలుగు</option>
                <option value="bn">বাংলা</option>
                <option value="mr">मराठी</option>
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
              <h4>CivisLaw</h4>
              <p>Bridging the gap between the judicial system and citizens through clear, human-understandable explanations.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <Link href="/document-explainer">Document Explainer</Link>
              <Link href="/recorder">Statement Recorder</Link>
              <Link href="/translator">Court Translator</Link>
              <Link href="/decoder">Word Decoder</Link>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <Link href="/timeline">Case Timeline</Link>
              <a href="#legal-disclaimer">Legal Disclaimer</a>
              <a href="#privacy-policy">Privacy Policy</a>
            </div>
            <div className="footer-section">
              <h4>Important</h4>
              <p>This platform provides explanations only and does NOT provide legal advice. Always consult a qualified lawyer for legal matters.</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 CivisLaw. Built with dignity and respect for all citizens.</p>
            <p>Justice does not become fair by being delivered — it becomes fair when it is understood.</p>
          </div>
        </div>
      </footer>

      <a 
        href="https://weather.com" 
        className="emergency-exit" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Emergency Exit - Click to leave this site immediately"
      >
        🏃 Emergency Exit
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
