'use client';

import { useState, useRef } from 'react';
import { useLanguage } from '../../utils/LanguageContext';
import { t } from '../../utils/i18n';

export default function DocumentExplainerPage() {
  const { language } = useLanguage();
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const file = files[0];
    const allowedTypes = ['application/pdf', 'application/msword', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload PDF, DOC, or TXT files only.');
      return;
    }
    
    setFile(file);
    setResults(null);
  };

  const analyzeDocument = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setResults(null);
    
    // Simulate document analysis
    setTimeout(() => {
      const mockResults = {
        summary: t('documentExplainer.processing', language) === 'Analyzing document...' 
          ? 'This document appears to be a legal notice regarding property dispute. It outlines the parties involved, the nature of the dispute, and the legal actions being taken.'
          : 'यह दस्तावेज़ संपत्ति विवाद से संबंधित एक कानूनी नोटिस प्रतीत होता है। इसमें शामिल पक्षों, विवाद की प्रकृति और की जा रही कानूनी कार्रवाई का उल्लेख है।',
        keyTerms: [
          { term: 'Plaintiff', meaning: language === 'hi' ? 'वादी - जो मुकदमा दायर करता है' : 'The person who files the lawsuit' },
          { term: 'Defendant', meaning: language === 'hi' ? 'प्रतिवादी - जिस पर मुकदमा किया गया' : 'The person against whom the lawsuit is filed' },
          { term: 'Injunction', meaning: language === 'hi' ? 'प्रतिबंध - अदालत का आदेश' : 'Court order to do or not do something' },
          { term: 'Jurisdiction', meaning: language === 'hi' ? 'क्षेत्राधिकार - अधिकार क्षेत्र' : 'Authority of the court to hear the case' },
        ],
        provisions: [
          { title: 'Section 151', description: 'Code of Civil Procedure - Power of Court to issue interim orders' },
          { title: 'Section 100', description: 'Specific Relief Act - Perpetual Injunction' },
        ],
        timeline: 'Expected timeline: 6-12 months for final resolution, with interim hearings every 2-4 weeks.',
      };
      
      setResults(mockResults);
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="document-explainer-page">
      <div className="container">
        <header className="page-header">
          <h1>{t('documentExplainer.title', language)}</h1>
          <p>{t('documentExplainer.description', language)}</p>
        </header>

        {/* Upload Section */}
        <section className="upload-section" aria-labelledby="upload-title">
          <h2 id="upload-title" className="visually-hidden">Upload Document</h2>
          
          <div 
            className={`upload-area ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleChange}
              className="file-input"
              aria-label="Upload document"
            />
            
            {file ? (
              <div className="file-info">
                <span className="file-icon">📄</span>
                <span className="file-name">{file.name}</span>
                <button 
                  className="btn btn-small btn-outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setResults(null);
                  }}
                >
                  {t('common.clear', language)}
                </button>
              </div>
            ) : (
              <>
                <div className="upload-icon">📁</div>
                <p className="upload-text">{t('documentExplainer.uploadArea', language)}</p>
                <p className="upload-formats">{t('documentExplainer.supportedFormats', language)}</p>
              </>
            )}
          </div>

          <div className="privacy-note">
            🔒 {t('documentExplainer.privacyNote', language)}
          </div>

          <button 
            className="btn btn-primary btn-large"
            onClick={analyzeDocument}
            disabled={!file || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <span className="spinner"></span>
                {t('documentExplainer.processing', language)}
              </>
            ) : (
              t('documentExplainer.analyzeButton', language)
            )}
          </button>
        </section>

        {/* Results Section */}
        {results && (
          <section className="results-section" aria-labelledby="results-title">
            <h2 id="results-title" className="section-title">{t('documentExplainer.resultsTitle', language)}</h2>
            
            <div className="results-grid">
              {/* Summary Card */}
              <article className="result-card">
                <h3>📋 {t('documentExplainer.summary', language)}</h3>
                <p>{results.summary}</p>
              </article>

              {/* Key Terms Card */}
              <article className="result-card">
                <h3>🔑 {t('documentExplainer.keyTerms', language)}</h3>
                <dl className="terms-list">
                  {results.keyTerms.map((item, index) => (
                    <div key={index} className="term-item">
                      <dt>{item.term}</dt>
                      <dd>{item.meaning}</dd>
                    </div>
                  ))}
                </dl>
              </article>

              {/* Provisions Card */}
              <article className="result-card">
                <h3>📜 {t('documentExplainer.provisions', language)}</h3>
                <ul className="provisions-list">
                  {results.provisions.map((item, index) => (
                    <li key={index}>
                      <strong>{item.title}:</strong> {item.description}
                    </li>
                  ))}
                </ul>
              </article>

              {/* Timeline Card */}
              <article className="result-card">
                <h3>⏱️ {t('nav.caseTimeline', language)}</h3>
                <p>{results.timeline}</p>
              </article>
            </div>
          </section>
        )}

        <style jsx>{`
          .document-explainer-page {
            padding: var(--spacing-xl) 0 var(--spacing-3xl);
          }
          
          .page-header {
            text-align: center;
            margin-bottom: var(--spacing-2xl);
          }
          
          .page-header h1 {
            font-size: var(--font-size-2xl);
            margin-bottom: var(--spacing-md);
            color: var(--color-primary);
          }
          
          .page-header p {
            font-size: var(--font-size-md);
            color: var(--color-text-secondary);
            max-width: 600px;
            margin: 0 auto;
          }
          
          .upload-section {
            max-width: 600px;
            margin: 0 auto;
          }
          
          .upload-area {
            border: 2px dashed var(--color-border);
            border-radius: var(--radius-lg);
            padding: var(--spacing-2xl);
            text-align: center;
            cursor: pointer;
            transition: all var(--transition-fast);
            background: var(--color-surface);
            margin-bottom: var(--spacing-lg);
          }
          
          .upload-area:hover,
          .upload-area.drag-active {
            border-color: var(--color-primary);
            background: var(--color-secondary);
          }
          
          .upload-area.has-file {
            border-style: solid;
            border-color: var(--color-success);
          }
          
          .file-input {
            display: none;
          }
          
          .upload-icon {
            font-size: 3rem;
            margin-bottom: var(--spacing-md);
          }
          
          .upload-text {
            font-size: var(--font-size-md);
            margin-bottom: var(--spacing-sm);
          }
          
          .upload-formats {
            font-size: var(--font-size-sm);
            color: var(--color-text-secondary);
          }
          
          .file-info {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--spacing-md);
          }
          
          .file-icon {
            font-size: 2rem;
          }
          
          .file-name {
            font-weight: 500;
          }
          
          .privacy-note {
            background: var(--color-secondary);
            padding: var(--spacing-md);
            border-radius: var(--radius-md);
            margin-bottom: var(--spacing-lg);
            font-size: var(--font-size-sm);
            text-align: center;
          }
          
          .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-right: var(--spacing-sm);
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          .results-section {
            margin-top: var(--spacing-2xl);
          }
          
          .section-title {
            font-size: var(--font-size-xl);
            margin-bottom: var(--spacing-xl);
            text-align: center;
            color: var(--color-text-primary);
          }
          
          .results-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: var(--spacing-lg);
          }
          
          .result-card {
            background: var(--color-surface);
            border-radius: var(--radius-md);
            padding: var(--spacing-lg);
            box-shadow: var(--shadow-sm);
          }
          
          .result-card h3 {
            font-size: var(--font-size-lg);
            margin-bottom: var(--spacing-md);
            font-family: 'Inter', sans-serif;
          }
          
          .result-card p {
            color: var(--color-text-secondary);
            line-height: var(--line-height-relaxed);
          }
          
          .terms-list {
            margin: 0;
          }
          
          .term-item {
            margin-bottom: var(--spacing-md);
            padding-bottom: var(--spacing-md);
            border-bottom: 1px solid var(--color-border);
          }
          
          .term-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
          }
          
          .term-item dt {
            font-weight: 600;
            color: var(--color-primary);
            margin-bottom: var(--spacing-xs);
          }
          
          .term-item dd {
            margin: 0;
            font-size: var(--font-size-sm);
            color: var(--color-text-secondary);
          }
          
          .provisions-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .provisions-list li {
            padding: var(--spacing-sm) 0;
            border-bottom: 1px solid var(--color-border);
            font-size: var(--font-size-sm);
          }
          
          .provisions-list li:last-child {
            border-bottom: none;
          }
          
          .visually-hidden {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            border: 0;
          }
        `}</style>
      </div>
    </div>
  );
}
