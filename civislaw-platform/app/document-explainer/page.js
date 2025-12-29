'use client';

import { useState } from 'react';

export default function DocumentExplainerPage() {
  const [activeTab, setActiveTab] = useState('text');
  const [documentText, setDocumentText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file.name);
      // In a real app, we would extract text from PDF/image here
      setDocumentText(`[Content from ${file.name} would be extracted here]\n\nSample legal text:\n"The petition stands dismissed due to lack of merit. The applicant has failed to establish any cause of action entitling them to the relief sought. Cost of Rs. 10,000/- to be paid by the petitioner to the respondent."`);
    }
  };

  const analyzeDocument = () => {
    if (!documentText.trim()) return;
    
    setIsAnalyzing(true);
    setExplanation(null);
    
    // Simulate API call
    setTimeout(() => {
      const mockExplanation = {
        plainLanguage: "The court has rejected your application because the judge did not find strong enough reasons to accept it. You will need to pay Rs. 10,000 to the other party as a cost of this case.",
        meaning: "This means your petition has been dismissed. The court found that you did not have a valid legal basis for your request.",
        processImpact: "You cannot proceed with this case in this court. You may have options to appeal this decision within a specific time period (usually 30-90 days). Consult a lawyer to understand your options.",
        keyTerms: [
          { term: "Dismissed", meaning: "Rejected or thrown out" },
          { term: "Lack of merit", meaning: "Not enough valid legal reasons" },
          { term: "Cause of action", meaning: "Legal basis for a case" },
          { term: "Relief", meaning: "What you are asking the court to do" },
          { term: "Rs. 10,000", meaning: "10,000 Rupees - this is money you must pay" }
        ]
      };
      setExplanation(mockExplanation);
      setIsAnalyzing(false);
    }, 2000);
  };

  const sampleTexts = [
    {
      label: "Court Order Sample",
      text: "The petition stands dismissed due to lack of merit. The applicant has failed to establish any cause of action entitling them to the relief sought. Cost of Rs. 10,000/- to be paid by the petitioner to the respondent."
    },
    {
      label: "Notice Sample",
      text: "Take notice that the above named respondent is hereby summoned to appear before this Hon'ble Court on 15th January 2024 at 10:30 AM in response to the complaint filed against you under Section 354 IPC."
    },
    {
      label: "FIR Sample",
      text: "FIR No. 2024/1234 dated 01.01.2024\n\nThis is to certify that a complaint was received from Smt. Sita Devi w/o Ram Singh r/o Villagexyz regarding theft of gold ornaments valued at Rs. 1,50,000/- from her residence on 31.12.2023."
    }
  ];

  const loadSampleText = (sample) => {
    setDocumentText(sample.text);
    setUploadedFile(sample.label);
  };

  return (
    <div className="document-explainer-page">
      <div className="container">
        {/* Page Header */}
        <header className="page-header">
          <h1>Court Language → Human Language Engine</h1>
          <p className="page-description">
            Transform complex legal documents into simple, understandable language. 
            Upload court orders, FIRs, charge sheets, or notices to get plain-language explanations.
          </p>
        </header>

        {/* Disclaimer */}
        <div className="disclaimer-banner" role="alert">
          <p>
            <strong>⚠️ Important:</strong> This tool provides explanations only and does NOT constitute legal advice. 
            Always consult a qualified lawyer for legal matters. The explanations are for understanding purposes only.
          </p>
        </div>

        {/* Main Content */}
        <div className="explainer-content">
          {/* Input Section */}
          <div className="input-section">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Step 1: Provide Your Document</h2>
              </div>
              
              {/* Tabs */}
              <div className="tabs" role="tablist">
                <button 
                  role="tab"
                  className={`tab ${activeTab === 'text' ? 'active' : ''}`}
                  onClick={() => setActiveTab('text')}
                  aria-selected={activeTab === 'text'}
                >
                  Type or Paste Text
                </button>
                <button 
                  role="tab"
                  className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
                  onClick={() => setActiveTab('upload')}
                  aria-selected={activeTab === 'upload'}
                >
                  Upload Document
                </button>
              </div>

              {/* Tab Content */}
              <div className="tab-content" role="tabpanel">
                {activeTab === 'text' && (
                  <div className="form-group">
                    <label htmlFor="document-text" className="form-label">
                      Paste court order, notice, FIR, or other legal document text here:
                    </label>
                    <textarea
                      id="document-text"
                      className="form-textarea"
                      value={documentText}
                      onChange={(e) => setDocumentText(e.target.value)}
                      placeholder="Paste the text from your legal document here..."
                      rows={10}
                    />
                  </div>
                )}

                {activeTab === 'upload' && (
                  <div className="upload-section">
                    <div 
                      className="document-upload"
                      onClick={() => document.getElementById('file-input').click()}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && document.getElementById('file-input').click()}
                    >
                      <div className="document-upload-icon">📁</div>
                      <p className="document-upload-text">
                        Click to upload or drag and drop
                      </p>
                      <p className="document-upload-hint">
                        PDF, Image (JPG, PNG), or Text files up to 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      id="file-input"
                      accept=".pdf,.jpg,.jpeg,.png,.txt"
                      onChange={handleFileUpload}
                      className="sr-only"
                    />
                    {uploadedFile && (
                      <p className="file-selected">
                        ✓ Selected: {uploadedFile}
                      </p>
                    )}
                  </div>
                )}

                {/* Sample Texts */}
                <div className="sample-texts">
                  <p className="sample-label">Or try a sample document:</p>
                  <div className="sample-buttons">
                    {sampleTexts.map((sample, index) => (
                      <button
                        key={index}
                        className="btn btn-secondary btn-small"
                        onClick={() => loadSampleText(sample)}
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Language Selection */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Step 2: Choose Output Language</h2>
              </div>
              <div className="language-options">
                <label className="language-option">
                  <input
                    type="radio"
                    name="language"
                    value="en"
                    checked={selectedLanguage === 'en'}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  />
                  <span className="language-label">English</span>
                </label>
                <label className="language-option">
                  <input
                    type="radio"
                    name="language"
                    value="hi"
                    checked={selectedLanguage === 'hi'}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  />
                  <span className="language-label">हिंदी (Hindi)</span>
                </label>
                <label className="language-option">
                  <input
                    type="radio"
                    name="language"
                    value="ta"
                    checked={selectedLanguage === 'ta'}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  />
                  <span className="language-label">தமிழ் (Tamil)</span>
                </label>
                <label className="language-option">
                  <input
                    type="radio"
                    name="language"
                    value="te"
                    checked={selectedLanguage === 'te'}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  />
                  <span className="language-label">తెలుగు (Telugu)</span>
                </label>
              </div>
            </div>

            {/* Analyze Button */}
            <button
              className="btn btn-primary btn-block btn-large"
              onClick={analyzeDocument}
              disabled={!documentText.trim() || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <span className="loading-spinner"></span>
                  Analyzing Document...
                </>
              ) : (
                <>
                  📊 Explain This Document
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="output-section">
            {explanation ? (
              <div className="explanation-results">
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">📝 Plain-Language Explanation</h2>
                  </div>
                  <div className="card-body">
                    <p className="explanation-text">
                      {selectedLanguage === 'hi' ? 
                        "न्यायालय ने आपकी याचिका को इसलिए खारिज कर दिया है क्योंकि न्यायाधीश को आपके अनुरोध को स्वीकार करने के लिए पर्याप्त मजबूत कारण नहीं मिले।" :
                       selectedLanguage === 'ta' ?
                        "நீதிமன்றம் உங்கள் மனுவை நிராகரித்துவிட்டது ஏனென்றால் நீதிபதிக்கு உங்கள் கோரிக்கையை ஏற்றுக்கொள்ள போதுமான வலுவான காரணங்கள் கிடைக்கவில்லை." :
                       selectedLanguage === 'te' ?
                        "కోర్టు మీ పిటిషన్‌ను తిరస్కరించింది ఎందుకంటే న్యాయమూర్తికి మీ అభ్యర్థనను అంగీకరించడానికి తగినంత బలమైన కారణాలు దొరకలేదు." :
                       explanation.plainLanguage
                      }
                    </p>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">💡 What This Actually Means</h2>
                  </div>
                  <div className="card-body">
                    <p className="explanation-text">{explanation.meaning}</p>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">⚖️ What Happens Next</h2>
                  </div>
                  <div className="card-body">
                    <p className="explanation-text">{explanation.processImpact}</p>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">📖 Key Terms Explained</h2>
                  </div>
                  <div className="card-body">
                    <div className="terms-grid">
                      {explanation.keyTerms.map((term, index) => (
                        <div key={index} className="term-item">
                          <strong>{term.term}</strong>
                          <p>{term.meaning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="action-buttons">
                  <button className="btn btn-secondary" onClick={() => window.print()}>
                    🖨️ Print Explanation
                  </button>
                  <button className="btn btn-secondary">
                    📋 Copy to Clipboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <h3>Your Explanation Will Appear Here</h3>
                <p>Upload or paste a legal document and click "Explain This Document" to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* How It Works */}
        <section className="how-it-works">
          <h2 className="section-title text-center">How This Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Upload Document</h3>
              <p>Paste text or upload a PDF/image of your court document</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Select Language</h3>
              <p>Choose your preferred language for the explanation</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Get Explanation</h3>
              <p>Receive plain-language explanation of what the document says</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Understand Next Steps</h3>
              <p>Know what happens next in your legal process</p>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .document-explainer-page {
          padding: var(--spacing-xl) 0 var(--spacing-3xl);
        }
        
        .page-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }
        
        .page-header h1 {
          font-size: var(--font-size-2xl);
          margin-bottom: var(--spacing-sm);
        }
        
        .page-description {
          font-size: var(--font-size-md);
          color: var(--color-text-secondary);
          max-width: 700px;
          margin: 0 auto;
        }
        
        .explainer-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-xl);
          margin-bottom: var(--spacing-3xl);
        }
        
        .input-section,
        .output-section {
          min-width: 0;
        }
        
        .tab-content {
          padding: var(--spacing-md) 0;
        }
        
        .upload-section {
          text-align: center;
        }
        
        .document-upload {
          border: 3px dashed var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-2xl);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        
        .document-upload:hover {
          border-color: var(--color-primary);
          background: rgba(74, 124, 89, 0.05);
        }
        
        .document-upload-icon {
          font-size: 3rem;
          margin-bottom: var(--spacing-md);
        }
        
        .document-upload-text {
          font-size: var(--font-size-md);
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-xs);
        }
        
        .document-upload-hint {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
          margin: 0;
        }
        
        .file-selected {
          margin-top: var(--spacing-md);
          color: var(--color-success);
          font-weight: 600;
        }
        
        .sample-texts {
          margin-top: var(--spacing-lg);
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--color-border);
        }
        
        .sample-label {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
          margin-bottom: var(--spacing-sm);
        }
        
        .sample-buttons {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }
        
        .language-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-md);
        }
        
        .language-option {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md);
          background: var(--color-secondary);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        
        .language-option:hover {
          background: var(--color-secondary-dark);
        }
        
        .language-option input {
          width: 18px;
          height: 18px;
        }
        
        .language-label {
          font-weight: 500;
        }
        
        .empty-state {
          text-align: center;
          padding: var(--spacing-3xl);
          background: var(--color-secondary);
          border-radius: var(--radius-lg);
          min-height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .empty-icon {
          font-size: 4rem;
          margin-bottom: var(--spacing-md);
        }
        
        .empty-state h3 {
          margin-bottom: var(--spacing-sm);
          color: var(--color-text-secondary);
        }
        
        .empty-state p {
          color: var(--color-text-muted);
          margin: 0;
        }
        
        .explanation-text {
          font-size: var(--font-size-md);
          line-height: var(--line-height-relaxed);
          margin: 0;
        }
        
        .terms-grid {
          display: grid;
          gap: var(--spacing-md);
        }
        
        .term-item {
          padding: var(--spacing-md);
          background: var(--color-secondary);
          border-radius: var(--radius-md);
        }
        
        .term-item strong {
          display: block;
          color: var(--color-primary);
          margin-bottom: var(--spacing-xs);
        }
        
        .term-item p {
          margin: 0;
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
        }
        
        .action-buttons {
          display: flex;
          gap: var(--spacing-md);
          margin-top: var(--spacing-lg);
        }
        
        .how-it-works {
          background: var(--color-secondary);
          padding: var(--spacing-3xl) 0;
          border-radius: var(--radius-lg);
        }
        
        .section-title {
          margin-bottom: var(--spacing-xl);
        }
        
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--spacing-lg);
          margin-top: var(--spacing-xl);
        }
        
        .step-card {
          text-align: center;
          padding: var(--spacing-lg);
        }
        
        .step-number {
          width: 48px;
          height: 48px;
          background: var(--color-primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-xl);
          font-weight: 700;
          margin: 0 auto var(--spacing-md);
        }
        
        .step-card h3 {
          font-size: var(--font-size-md);
          margin-bottom: var(--spacing-sm);
          font-family: 'Inter', sans-serif;
        }
        
        .step-card p {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin: 0;
        }
        
        @media (max-width: 900px) {
          .explainer-content {
            grid-template-columns: 1fr;
          }
          
          .steps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 600px) {
          .steps-grid {
            grid-template-columns: 1fr;
          }
          
          .language-options {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
