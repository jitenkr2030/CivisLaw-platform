'use client';

import { useState, useEffect, useRef } from 'react';

export default function TranslatorPage() {
  const [activeMode, setActiveMode] = useState('realtime');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [selectedSourceLang, setSelectedSourceLang] = useState('en');
  const [selectedTargetLang, setSelectedTargetLang] = useState('hi');
  const [companionMode, setCompanionMode] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState(null);
  const [courtStatus, setCourtStatus] = useState('idle');
  const [volume, setVolume] = useState(0);
  const animationRef = useRef(null);

  // Simulate real-time court proceedings
  useEffect(() => {
    if (isListening && courtStatus === 'active') {
      const proceedings = [
        { speaker: 'Judge', text: 'The court is now in session.', explanation: 'The hearing has started. Everyone should stand up to show respect.' },
        { speaker: 'Prosecutor', text: 'Your honor, we call our first witness.', explanation: 'The lawyer for the government wants to present their first person who will speak about what they saw or know.' },
        { speaker: 'Judge', text: 'The witness may be seated.', explanation: 'The judge is allowing the witness to sit down and start speaking.' },
        { speaker: 'Witness', text: 'I saw the incident happen at approximately 5 PM on the mentioned date.', explanation: 'The witness is saying they saw what happened around 5 in the evening on the day in question.' },
        { speaker: 'Defense', text: 'Objection, your honor. Leading the witness.', explanation: 'The defense lawyer is saying the prosecutor asked the question in a way that suggested the answer.' },
        { speaker: 'Judge', text: 'Objection sustained. Counsel, please rephrase.', explanation: 'The judge agreed with the objection. The prosecutor must ask the question differently.' },
        { speaker: 'Judge', text: 'We will adjourn this hearing to next Monday.', explanation: 'The judge is saying the court will not meet again until next Monday. This is called an adjournment.' }
      ];

      let index = 0;
      const interval = setInterval(() => {
        if (index < proceedings.length) {
          const item = proceedings[index];
          setTranscript(prev => [...prev.slice(-10), item]);
          setCurrentExplanation(item.explanation);
          index++;
        } else {
          setCourtStatus('adjourned');
          setIsListening(false);
          clearInterval(interval);
        }
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isListening, courtStatus]);

  // Audio visualization
  useEffect(() => {
    if (isListening) {
      const animate = () => {
        setVolume(Math.random() * 100);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setVolume(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening]);

  const startListening = () => {
    setIsListening(true);
    setCourtStatus('active');
    setTranscript([]);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' }
  ];

  const courtActivities = [
    { id: 'hearing', name: 'Hearing in Progress', description: 'Arguments or statements are being made before the court' },
    { id: 'discussion', name: 'Discussion Stage', description: 'Lawyers and judge are discussing the case' },
    { id: 'verdict', name: 'Judgment/Delivery', description: 'The judge is announcing the final decision' },
    { id: 'break', name: 'Court Adjourned', description: 'The court is taking a break or scheduling next date' }
  ];

  return (
    <div className="translator-page">
      <div className="container">
        {/* Page Header */}
        <header className="page-header">
          <h1>AI Court Translator & Companion</h1>
          <p className="page-description">
            Understand what is happening in court in real-time. Get translations and explanations 
            of court proceedings in simple, non-technical language.
          </p>
        </header>

        {/* Disclaimer */}
        <div className="disclaimer-banner" role="alert">
          <p>
            <strong>⚠️ Important:</strong> This tool provides real-time translations for understanding purposes only. 
            It is NOT an official court record and has no legal validity. Always refer to official court proceedings.
          </p>
        </div>

        {/* Mode Selection */}
        <div className="mode-tabs">
          <button
            className={`mode-tab ${activeMode === 'realtime' ? 'active' : ''}`}
            onClick={() => setActiveMode('realtime')}
          >
            🌐 Real-Time Translator
          </button>
          <button
            className={`mode-tab ${activeMode === 'companion' ? 'active' : ''}`}
            onClick={() => setActiveMode('companion')}
          >
            🤝 Court Companion Mode
          </button>
        </div>

        {activeMode === 'realtime' && (
          <div className="translator-content">
            {/* Language Selection */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Step 1: Choose Languages</h2>
              </div>
              <div className="language-selector-grid">
                <div className="form-group">
                  <label className="form-label">Court Language (What you're hearing)</label>
                  <select
                    className="form-select"
                    value={selectedSourceLang}
                    onChange={(e) => setSelectedSourceLang(e.target.value)}
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.native} - {lang.name}</option>
                    ))}
                  </select>
                </div>
                <div className="language-arrow">→</div>
                <div className="form-group">
                  <label className="form-label">Your Language (Translation)</label>
                  <select
                    className="form-select"
                    value={selectedTargetLang}
                    onChange={(e) => setSelectedTargetLang(e.target.value)}
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.native} - {lang.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Translation Area */}
            <div className="card translation-card">
              <div className="card-header">
                <h2 className="card-title">Step 2: Start Translation</h2>
              </div>
              
              <div className="translation-display-area">
                <div className="audio-visualizer">
                  {isListening ? (
                    <div className="visualizer-bars">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className="visualizer-bar"
                          style={{
                            height: `${Math.random() * volume}%`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        ></div>
                      ))}
                    </div>
                  ) : (
                    <div className="visualizer-placeholder">
                      🎧
                    </div>
                  )}
                </div>

                <div className="transcript-area">
                  {transcript.length === 0 ? (
                    <p className="transcript-placeholder">
                      {isListening ? 'Listening...' : 'Press "Start Listening" to begin real-time translation'}
                    </p>
                  ) : (
                    <div className="transcript-stream">
                      {transcript.map((item, index) => (
                        <div key={index} className="transcript-item">
                          <div className="transcript-speaker">{item.speaker}:</div>
                          <div className="transcript-original">{item.text}</div>
                          <div className="transcript-translation">
                            <span className="translation-label">→ {languages.find(l => l.code === selectedTargetLang)?.native}:</span>
                            {item.text === 'The court is now in session.' && 'कोर्ट की कार्यवाही शुरू हो गई है।'}
                            {item.text === 'Your honor, we call our first witness.' && 'माननीय न्यायाधीश, हम अपना पहला गवाह बुलाते हैं।'}
                            {item.text === 'The witness may be seated.' && 'गवाह बैठ सकता है।'}
                            {item.text === 'I saw the incident happen at approximately 5 PM on the mentioned date.' && 'मैंने घटना को उल्लिखित तारीख को लगभग शाम 5 बजे होते देखा।'}
                            {item.text === 'Objection, your honor. Leading the witness.' && 'आपत्ति, माननीय। गवाह को सही रास्ते पर ले जा रहे हैं।'}
                            {item.text === 'Objection sustained. Counsel, please rephrase.' && 'आपत्ति स्वीकार। काउंसल, कृपया पुनः कहें।'}
                            {item.text === 'We will adjourn this hearing to next Monday.' && 'हम इस सुनवाई को अगले सोमवार तक स्थगित करते हैं।'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="translation-controls">
                <button
                  className={`btn ${isListening ? 'btn-danger' : 'btn-primary'} btn-large`}
                  onClick={isListening ? stopListening : startListening}
                >
                  {isListening ? (
                    <>
                      ⏹️ Stop Listening
                    </>
                  ) : (
                    <>
                      🎧 Start Listening
                    </>
                  )}
                </button>
                
                <button 
                  className="btn btn-secondary"
                  disabled={transcript.length === 0}
                >
                  📋 Clear
                </button>
                
                <button 
                  className="btn btn-secondary"
                  disabled={transcript.length === 0}
                >
                  💾 Save
                </button>
              </div>
            </div>
          </div>
        )}

        {activeMode === 'companion' && (
          <div className="companion-content">
            {/* Court Status */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">🏛️ Court Status</h2>
              </div>
              <div className="court-status-grid">
                {courtActivities.map((activity) => (
                  <button
                    key={activity.id}
                    className={`status-button ${courtStatus === activity.id ? 'active' : ''}`}
                    onClick={() => setCourtStatus(activity.id)}
                  >
                    <span className="status-indicator"></span>
                    {activity.name}
                  </button>
                ))}
              </div>
              <p className="court-status-description">
                {courtActivities.find(a => a.id === courtStatus)?.description}
              </p>
            </div>

            {/* Companion Explanation */}
            <div className="card companion-card">
              <div className="card-header">
                <h2 className="card-title">📖 What's Happening?</h2>
              </div>
              
              <div className="companion-explanation">
                <div className="companion-avatar">⚖️</div>
                <div className="companion-text">
                  {courtStatus === 'idle' && (
                    <p>The court session has not started yet. Please wait for proceedings to begin.</p>
                  )}
                  {courtStatus === 'hearing' && (
                    <p>A hearing is currently in progress. This means arguments, statements, or evidence is being presented before the judge. If you are called upon, you may need to speak or present your case.</p>
                  )}
                  {courtStatus === 'discussion' && (
                    <p>The court is in a discussion stage. Lawyers and the judge are likely discussing legal procedures, evidence rules, or case management matters. This is normal and part of the judicial process.</p>
                  )}
                  {courtStatus === 'verdict' && (
                    <p>The judge is delivering a judgment or verdict. This means a final decision is being announced. Please stand up out of respect when the judge speaks the verdict.</p>
                  )}
                  {courtStatus === 'break' && (
                    <p>The court has been adjourned or is on a break. This means proceedings have paused and will continue at a scheduled date. The next date will be mentioned by the judge.</p>
                  )}
                </div>
              </div>

              <div className="companion-tips">
                <h3>💡 Tips for This Stage</h3>
                <ul>
                  {courtStatus === 'hearing' && (
                    <>
                      <li>Listen carefully to what is being said</li>
                      <li>Your turn to speak will be announced</li>
                      <li>Speak clearly and respectfully to the judge</li>
                    </>
                  )}
                  {courtStatus === 'discussion' && (
                    <>
                      <li>This is normal procedure - don't worry</li>
                      <li>You may be asked to confirm details</li>
                      <li>Stay attentive but relax</li>
                    </>
                  )}
                  {courtStatus === 'verdict' && (
                    <>
                      <li>Stand up when the judge enters or speaks the verdict</li>
                      <li>Listen carefully to the entire verdict</li>
                      <li>Ask for clarification if you don't understand</li>
                    </>
                  )}
                  {courtStatus === 'break' && (
                    <>
                      <li>Note down the next court date</li>
                      <li>You are free to leave the courthouse</li>
                      <li>Prepare for the next hearing</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Quick Reference */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">📋 Common Court Phrases</h2>
              </div>
              <div className="phrases-grid">
                <div className="phrase-item">
                  <div className="phrase-original">"Objection"</div>
                  <div className="phrase-meaning">A lawyer is saying something is wrong or not allowed</div>
                </div>
                <div className="phrase-item">
                  <div className="phrase-original">"Sustained"</div>
                  <div className="phrase-meaning">The judge agrees with the objection</div>
                </div>
                <div className="phrase-item">
                  <div className="phrase-original">"Overruled"</div>
                  <div className="phrase-meaning">The judge disagrees with the objection</div>
                </div>
                <div className="phrase-item">
                  <div className="phrase-original">"Adjourned"</div>
                  <div className="phrase-meaning">Court is paused until another date</div>
                </div>
                <div className="phrase-item">
                  <div className="phrase-original">"Dismissed"</div>
                  <div className="phrase-meaning">The case or request is rejected</div>
                </div>
                <div className="phrase-item">
                  <div className="phrase-original">"Plaintiff/Petitioner"</div>
                  <div className="phrase-meaning">The person who started the case</div>
                </div>
                <div className="phrase-item">
                  <div className="phrase-original">"Respondent/Defendant"</div>
                  <div className="phrase-meaning">The person the case is against</div>
                </div>
                <div className="phrase-item">
                  <div className="phrase-original">"Contempt of Court"</div>
                  <div className="phrase-meaning">Disrespecting the court's authority</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How It Works */}
        <section className="how-it-works">
          <h2 className="section-title text-center">How to Use This Tool</h2>
          <div className="steps-row">
            <div className="step-item">
              <div className="step-icon">🎧</div>
              <p>Wear earphones for private listening</p>
            </div>
            <div className="step-item">
              <div className="step-icon">🌐</div>
              <p>Select your language</p>
            </div>
            <div className="step-item">
              <div className="step-icon">▶️</div>
              <p>Start listening during court</p>
            </div>
            <div className="step-item">
              <div className="step-icon">📖</div>
              <p>Read translations in real-time</p>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .translator-page {
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
        
        .mode-tabs {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
          border-bottom: 2px solid var(--color-border);
          padding-bottom: var(--spacing-md);
        }
        
        .mode-tab {
          padding: var(--spacing-md) var(--spacing-xl);
          background: none;
          border: none;
          font-size: var(--font-size-md);
          font-weight: 600;
          color: var(--color-text-secondary);
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }
        
        .mode-tab:hover {
          background: var(--color-secondary);
        }
        
        .mode-tab.active {
          background: var(--color-primary);
          color: white;
        }
        
        .language-selector-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: var(--spacing-lg);
          align-items: end;
        }
        
        .language-arrow {
          font-size: var(--font-size-2xl);
          color: var(--color-primary);
          padding-bottom: var(--spacing-md);
        }
        
        .translation-card {
          min-height: 400px;
        }
        
        .translation-display-area {
          margin: var(--spacing-xl) 0;
        }
        
        .audio-visualizer {
          height: 100px;
          background: var(--color-secondary);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--spacing-lg);
        }
        
        .visualizer-bars {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          height: 60px;
        }
        
        .visualizer-bar {
          width: 8px;
          background: var(--color-primary);
          border-radius: 4px;
          transition: height 0.1s ease;
        }
        
        .visualizer-placeholder {
          font-size: 3rem;
          color: var(--color-text-muted);
        }
        
        .transcript-area {
          min-height: 200px;
          max-height: 400px;
          overflow-y: auto;
          background: var(--color-background);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
        }
        
        .transcript-placeholder {
          text-align: center;
          color: var(--color-text-muted);
          padding: var(--spacing-xl);
        }
        
        .transcript-stream {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        
        .transcript-item {
          padding: var(--spacing-md);
          background: var(--color-surface);
          border-radius: var(--radius-md);
          border-left: 4px solid var(--color-primary);
        }
        
        .transcript-speaker {
          font-weight: 600;
          color: var(--color-primary);
          margin-bottom: var(--spacing-xs);
        }
        
        .transcript-original {
          font-style: italic;
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-sm);
        }
        
        .transcript-translation {
          background: var(--color-secondary);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-md);
        }
        
        .translation-label {
          font-weight: 600;
          color: var(--color-primary);
          margin-right: var(--spacing-sm);
        }
        
        .translation-controls {
          display: flex;
          gap: var(--spacing-md);
          flex-wrap: wrap;
          margin-top: var(--spacing-lg);
        }
        
        .btn-danger {
          background: #EF4444;
          color: white;
        }
        
        .btn-danger:hover {
          background: #DC2626;
        }
        
        .court-status-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }
        
        .status-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-lg);
          background: var(--color-secondary);
          border: 2px solid transparent;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        
        .status-button:hover {
          background: var(--color-secondary-dark);
        }
        
        .status-button.active {
          border-color: var(--color-primary);
          background: rgba(74, 124, 89, 0.1);
        }
        
        .status-indicator {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--color-border);
        }
        
        .status-button.active .status-indicator {
          background: var(--color-primary);
          animation: pulse 2s infinite;
        }
        
        .court-status-description {
          text-align: center;
          color: var(--color-text-secondary);
          padding: var(--spacing-md);
          background: var(--color-secondary);
          border-radius: var(--radius-md);
        }
        
        .companion-explanation {
          display: flex;
          gap: var(--spacing-lg);
          padding: var(--spacing-lg);
          background: var(--color-secondary);
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-lg);
        }
        
        .companion-avatar {
          font-size: 3rem;
          flex-shrink: 0;
        }
        
        .companion-text p {
          font-size: var(--font-size-md);
          line-height: var(--line-height-relaxed);
          margin: 0;
        }
        
        .companion-tips {
          padding: var(--spacing-lg);
          background: var(--color-success-light);
          border-radius: var(--radius-md);
        }
        
        .companion-tips h3 {
          color: var(--color-success);
          margin-bottom: var(--spacing-md);
          font-family: 'Inter', sans-serif;
        }
        
        .companion-tips ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .companion-tips li {
          padding: var(--spacing-sm) 0;
          padding-left: var(--spacing-lg);
          position: relative;
        }
        
        .companion-tips li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--color-success);
          font-weight: bold;
        }
        
        .phrases-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-md);
        }
        
        .phrase-item {
          padding: var(--spacing-md);
          background: var(--color-secondary);
          border-radius: var(--radius-md);
        }
        
        .phrase-original {
          font-weight: 600;
          color: var(--color-primary);
          margin-bottom: var(--spacing-xs);
        }
        
        .phrase-meaning {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
        }
        
        .how-it-works {
          background: var(--color-secondary);
          padding: var(--spacing-2xl);
          border-radius: var(--radius-lg);
          margin-top: var(--spacing-xl);
        }
        
        .section-title {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }
        
        .steps-row {
          display: flex;
          justify-content: center;
          gap: var(--spacing-xl);
          flex-wrap: wrap;
        }
        
        .step-item {
          text-align: center;
          max-width: 150px;
        }
        
        .step-icon {
          font-size: 2.5rem;
          margin-bottom: var(--spacing-sm);
        }
        
        .step-item p {
          margin: 0;
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
        }
        
        @media (max-width: 768px) {
          .mode-tabs {
            flex-direction: column;
          }
          
          .language-selector-grid {
            grid-template-columns: 1fr;
          }
          
          .language-arrow {
            transform: rotate(90deg);
            padding: var(--spacing-sm) 0;
          }
          
          .court-status-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .phrases-grid {
            grid-template-columns: 1fr;
          }
          
          .steps-row {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
