'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../utils/LanguageContext';
import { t, supportedLanguages } from '../../utils/i18n';

export default function TranslatorPage() {
  const { language } = useLanguage();
  const [activeMode, setActiveMode] = useState('realtime');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [selectedSourceLang, setSelectedSourceLang] = useState('en');
  const [selectedTargetLang, setSelectedTargetLang] = useState(language || 'hi');
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

  const getTranslation = (text) => {
    const translations = {
      hi: {
        'The court is now in session.': 'कोर्ट की कार्यवाही शुरू हो गई है।',
        'Your honor, we call our first witness.': 'माननीय न्यायाधीश, हम अपना पहला गवाह बुलाते हैं।',
        'The witness may be seated.': 'गवाह बैठ सकता है।',
        'I saw the incident happen at approximately 5 PM on the mentioned date.': 'मैंने घटना को उल्लिखित तारीख को लगभग शाम 5 बजे होते देखा।',
        'Objection, your honor. Leading the witness.': 'आपत्ति, माननीय। गवाह को सही रास्ते पर ले जा रहे हैं।',
        'Objection sustained. Counsel, please rephrase.': 'आपत्ति स्वीकार। काउंसल, कृपया पुनः कहें।',
        'We will adjourn this hearing to next Monday.': 'हम इस सुनवाई को अगले सोमवार तक स्थगित करते हैं।'
      },
      ta: {
        'The court is now in session.': 'நீதிமன்ற கூட்டம் தொடங்கியது.',
        'Your honor, we call our first witness.': 'ஆஜரான நீதிபதி, முதல் சாட்சியை அழைக்கிறோம்.',
        'The witness may be seated.': 'சாட்சி அமரலாம்.',
        'I saw the incident happen at approximately 5 PM on the mentioned date.': 'குறிப்பிட்ட தேதி மாலை 5 மணி அளவில் நிகழ்வை நான் பார்த்தேன்.',
        'Objection, your honor. Leading the witness.': 'ஆட்சேபம், ஆஜரான நீதிபதி. சாட்சியை தவறாக வழிநடத்துதல்.',
        'Objection sustained. Counsel, please rephrase.': 'ஆட்சேபம் ஏற்றுக்கொள்ளப்பட்டது. மறுபடியும் கேளுங்கள்.',
        'We will adjourn this hearing to next Monday.': 'இந்த விசாரணையை அடுத்த திங்கட்கிழமைக்கு தள்ளிவைக்கிறோம்.'
      },
      te: {
        'The court is now in session.': 'కోర్టు సమావేశం ప్రారంభమైంది.',
        'Your honor, we call our first witness.': 'గౌరవనీయ న్యాయమూర్తి, మేము మా మొదటి సాక్షిని పిలుస్తున్నాము.',
        'The witness may be seated.': 'సాక్షి కూర్చోవచ్చు.',
        'I saw the incident happen at approximately 5 PM on the mentioned date.': 'పేర్కొన్న తేదీ సాయంత్రం 5 గంటల సమయంలో ఘటన జరిగినట్లు నేను చూశాను.',
        'Objection, your honor. Leading the witness.': 'ఆపద, గౌరవనీయ న్యాయమూర్తి. సాక్షిని తప్పుదారి పట్టించడం.',
        'Objection sustained. Counsel, please rephrase.': 'ఆపద స్వీకరించబడినది. దయచేసి మళ్ళీ చెప్�ండి.',
        'We will adjourn this hearing to next Monday.': 'ఈ విచారణను తదుపరి సోమవారానికి వాయిదా వేస్తున్నాము.'
      },
      bn: {
        'The court is now in session.': 'আদালতের কার্যক্রম শুরু হয়েছে।',
        'Your honor, we call our first witness.': 'সম্মানিত বিচারক, আমরা আমাদের প্রথম সাক্ষীকে ডাকছি।',
        'The witness may be seated.': 'সাক্ষী বসতে পারেন।',
        'I saw the incident happen at approximately 5 PM on the mentioned date.': 'উল্লেখিত তারিখে সন্ধ্যা 5টার দিকে ঘটনাটি ঘটতে আমি দেখেছি।',
        'Objection, your honor. Leading the witness.': 'আপত্তি, সম্মানিত বিচারক। সাক্ষীকে ভুল পথে নিয়ে যাওয়া হচ্ছে।',
        'Objection sustained. Counsel, please rephrase.': 'আপত্তি গৃহীত হয়েছে। অনুগ্রহ করে পুনরায় বলুন।',
        'We will adjourn this hearing to next Monday.': 'আমরা এই শুনানি আগামী সোমবার পর্যন্ত মুলতুবি রাখছি।'
      },
      mr: {
        'The court is now in session.': 'कोर्टाची कार्यवाही सुरू झाली आहे.',
        'Your honor, we call our first witness.': 'माननीय न्यायाधीश, आम्ही आमचा पहिला साक्षी बोलावत आहोत.',
        'The witness may be seated.': 'साक्षी बसू शकतो.',
        'I saw the incident happen at approximately 5 PM on the mentioned date.': 'निर्देशित तारखेला सायंकाळी सुमारे 5 वाजता घटना घडताना मी पाहिली.',
        'Objection, your honor. Leading the witness.': 'आपत्ति, माननीय. साक्षीला चुकीच्या मार्गाने नेत आहेत.',
        'Objection sustained. Counsel, please rephrase.': 'आपत्ती स्वीकारली. कृपया पुन्हा सांगा.',
        'We will adjourn this hearing to next Monday.': 'आम्ही ही सुनावणी पुढच्या सोमवारपर्यंत तहकूब करत आहोत.'
      }
    };
    
    const langTranslations = translations[selectedTargetLang] || {};
    return langTranslations[text] || text;
  };

  return (
    <div className="translator-page">
      <div className="container">
        <header className="page-header">
          <h1>{t('translator.title', language)}</h1>
          <p className="page-description">
            {t('translator.description', language)}
          </p>
        </header>

        <div className="disclaimer-banner" role="alert">
          <p>
            <strong>⚠️ {t('home.disclaimerTitle', language)}:</strong> {t('translator.disclaimerText', language) || 'This tool provides real-time translations for understanding purposes only. It is NOT an official court record and has no legal validity. Always refer to official court proceedings.'}
          </p>
        </div>

        <div className="mode-tabs">
          <button
            className={`mode-tab ${activeMode === 'realtime' ? 'active' : ''}`}
            onClick={() => setActiveMode('realtime')}
          >
            🌐 {t('translator.realtimeMode', language) || 'Real-Time Translator'}
          </button>
          <button
            className={`mode-tab ${activeMode === 'companion' ? 'active' : ''}`}
            onClick={() => setActiveMode('companion')}
          >
            🤝 {t('translator.companionMode', language) || 'Court Companion Mode'}
          </button>
        </div>

        {activeMode === 'realtime' && (
          <div className="translator-content">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">{t('translator.step1', language) || 'Step 1: Choose Languages'}</h2>
              </div>
              <div className="language-selector-grid">
                <div className="form-group">
                  <label className="form-label">{t('translator.courtLanguage', language) || 'Court Language (What you\'re hearing)'}</label>
                  <select
                    className="form-select"
                    value={selectedSourceLang}
                    onChange={(e) => setSelectedSourceLang(e.target.value)}
                  >
                    {supportedLanguages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.nativeName} - {lang.name}</option>
                    ))}
                  </select>
                </div>
                <div className="language-arrow">→</div>
                <div className="form-group">
                  <label className="form-label">{t('translator.yourLanguage', language) || 'Your Language (Translation)'}</label>
                  <select
                    className="form-select"
                    value={selectedTargetLang}
                    onChange={(e) => setSelectedTargetLang(e.target.value)}
                  >
                    {supportedLanguages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.nativeName} - {lang.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="card translation-card">
              <div className="card-header">
                <h2 className="card-title">{t('translator.step2', language) || 'Step 2: Start Translation'}</h2>
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
                      {isListening ? t('translator.listening', language) || 'Listening...' : t('translator.pressStart', language) || 'Press "Start Listening" to begin real-time translation'}
                    </p>
                  ) : (
                    <div className="transcript-stream">
                      {transcript.map((item, index) => (
                        <div key={index} className="transcript-item">
                          <div className="transcript-speaker">{item.speaker}:</div>
                          <div className="transcript-original">{item.text}</div>
                          <div className="transcript-translation">
                            <span className="translation-label">→ {supportedLanguages.find(l => l.code === selectedTargetLang)?.nativeName}:</span>
                            {getTranslation(item.text)}
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
                      ⏹️ {t('translator.stopListening', language) || 'Stop Listening'}
                    </>
                  ) : (
                    <>
                      🎧 {t('translator.startListening', language) || 'Start Listening'}
                    </>
                  )}
                </button>
                
                <button 
                  className="btn btn-secondary"
                  disabled={transcript.length === 0}
                  onClick={() => setTranscript([])}
                >
                  📋 {t('common.clear', language)}
                </button>
                
                <button 
                  className="btn btn-secondary"
                  disabled={transcript.length === 0}
                >
                  💾 {t('common.save', language)}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeMode === 'companion' && (
          <div className="companion-content">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">🏛️ {t('timeline.title', language)}</h2>
              </div>
              <div className="court-status-grid">
                <button
                  className={`status-button ${courtStatus === 'idle' ? 'active' : ''}`}
                  onClick={() => setCourtStatus('idle')}
                >
                  <span className="status-indicator"></span>
                  {t('translator.statusIdle', language) || 'Not Started'}
                </button>
                <button
                  className={`status-button ${courtStatus === 'hearing' ? 'active' : ''}`}
                  onClick={() => setCourtStatus('hearing')}
                >
                  <span className="status-indicator"></span>
                  {t('translator.statusHearing', language) || 'Hearing'}
                </button>
                <button
                  className={`status-button ${courtStatus === 'discussion' ? 'active' : ''}`}
                  onClick={() => setCourtStatus('discussion')}
                >
                  <span className="status-indicator"></span>
                  {t('translator.statusDiscussion', language) || 'Discussion'}
                </button>
                <button
                  className={`status-button ${courtStatus === 'verdict' ? 'active' : ''}`}
                  onClick={() => setCourtStatus('verdict')}
                >
                  <span className="status-indicator"></span>
                  {t('translator.statusVerdict', language) || 'Verdict'}
                </button>
              </div>
            </div>

            <div className="card companion-card">
              <div className="card-header">
                <h2 className="card-title">📖 {t('translator.whatsHappening', language) || 'What\'s Happening?'}</h2>
              </div>
              
              <div className="companion-explanation">
                <div className="companion-avatar">⚖️</div>
                <div className="companion-text">
                  {courtStatus === 'idle' && (
                    <p>{t('translator.idleText', language) || 'The court session has not started yet. Please wait for proceedings to begin.'}</p>
                  )}
                  {courtStatus === 'hearing' && (
                    <p>{t('translator.hearingText', language) || 'A hearing is currently in progress. This means arguments, statements, or evidence is being presented before the judge.'}</p>
                  )}
                  {courtStatus === 'discussion' && (
                    <p>{t('translator.discussionText', language) || 'The court is in a discussion stage. Lawyers and the judge are likely discussing legal procedures or case management matters.'}</p>
                  )}
                  {courtStatus === 'verdict' && (
                    <p>{t('translator.verdictText', language) || 'The judge is delivering a judgment or verdict. This means a final decision is being announced.'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

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
            color: var(--color-primary);
          }
          
          .page-description {
            font-size: var(--font-size-md);
            color: var(--color-text-secondary);
            max-width: 700px;
            margin: 0 auto;
          }
          
          .disclaimer-banner {
            background: var(--color-warning-light);
            border: 1px solid var(--color-warning);
            border-radius: var(--radius-md);
            padding: var(--spacing-md);
            margin-bottom: var(--spacing-xl);
            font-size: var(--font-size-sm);
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
          
          .companion-explanation {
            display: flex;
            gap: var(--spacing-lg);
            padding: var(--spacing-lg);
            background: var(--color-secondary);
            border-radius: var(--radius-md);
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
          }
        `}</style>
      </div>
    </div>
  );
}
