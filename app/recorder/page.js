'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../utils/LanguageContext';
import { t } from '../../utils/i18n';

export default function RecorderPage() {
  const { language } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState([]);
  const [currentRecording, setCurrentRecording] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [showConsent, setShowConsent] = useState(true);
  const [consentGiven, setConsentGiven] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const timerRef = useRef(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setCurrentRecording(null);
    setTranscript(null);
    
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const newRecording = {
      id: Date.now(),
      duration: recordingTime,
      timestamp: new Date().toLocaleString(),
      language: language
    };
    setCurrentRecording(newRecording);
    setRecordings(prev => [newRecording, ...prev]);
  };

  const simulateTranscription = () => {
    const sampleTexts = {
      hi: "मेरा नाम सीता है। मैं कल शाम को अपने घर जा रही थी। रास्ते में एक अजनबी ने मेरा पीछा किया। मुझे बहुत डर लगा।",
      ta: "என்னுடைய பெயர் சீதா. நேற்று மாலை நான் வீட்டிற்கு செல்லுவதாக இருந்தேன். வழியில் ஒரு stranger என்னை follow செய்தான். எனக்கு மிகவும் பயமாக இருந்தது.",
      te: "నా పేరు సీతా. నిన్నటి సాయంత్రం నేను ఇంటికి వెళ్తున్నాను. రోడ్డుపై ఒక అజ్ఞాత వ్యక్తి నాకు వెనుకబడ్డాడు. నాకు చాలా భయం వచ్చింది.",
      bn: "আমার নাম সীতা। কাল সন্ধ্যায় আমি বাড়ি যাচ্ছিলাম। পথে একজন অপরিচিত ব্যক্তি আমাকে অনুসরণ করেছিল। আমি rেখে ফেলেছিলাম।",
      mr: "माझे नाव सीता आहे. काल संध्याकाळी मी घरी जात होते. वाटेत एका अनोळखी व्यक्तीने माझा पाठलाग केला. मला खूप भीती वाटली.",
      en: "My name is Sita. Yesterday evening I was going home. On the way, a stranger followed me. I was very scared."
    };
    
    setTranscript({
      text: sampleTexts[language] || sampleTexts['en'],
      timestamp: new Date().toLocaleString(),
      emotionalKeywords: ['scared', 'followed', 'fear']
    });
  };

  const handlePlayback = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setPlaybackProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setPlaybackProgress(0);
      }
    }, 500);
  };

  if (showConsent) {
    return (
      <div className="recorder-page">
        <div className="container">
          <header className="page-header">
            <h1>{t('recorder.title', language)}</h1>
            <p className="page-description">
              {t('recorder.description', language)}
            </p>
          </header>

          <div className="consent-modal">
            <div className="consent-card">
              <div className="consent-icon">🎤</div>
              <h2>{t('recorder.beforeBegin', language) || 'Before You Begin'}</h2>
              <div className="consent-content">
                <div className="consent-section">
                  <h3>🔒 {t('recorder.privacyMatters', language) || 'Your Privacy Matters'}</h3>
                  <ul>
                    <li>{t('recorder.privacy1', language) || 'Your recording is stored securely on your device'}</li>
                    <li>{t('recorder.privacy2', language) || 'You have full control over who can access it'}</li>
                    <li>{t('recorder.privacy3', language) || 'We use end-to-end encryption to protect your data'}</li>
                    <li>{t('recorder.privacy4', language) || 'You can delete your recording at any time'}</li>
                  </ul>
                </div>
                
                <div className="consent-section">
                  <h3>👤 {t('recorder.dignityPriority', language) || 'Your Dignity is Priority'}</h3>
                  <ul>
                    <li>{t('recorder.dignity1', language) || 'Record in your own language'}</li>
                    <li>{t('recorder.dignity2', language) || 'Take breaks whenever you need'}</li>
                    <li>{t('recorder.dignity3', language) || 'Review and approve your transcript before sharing'}</li>
                    <li>{t('recorder.dignity4', language) || 'Pause and resume recording as needed'}</li>
                  </ul>
                </div>
                
                <div className="consent-section">
                  <h3>⚠️ {t('recorder.importantToKnow', language) || 'Important to Know'}</h3>
                  <ul>
                    <li>{t('recorder.warning1', language) || 'This is for recording your statement, not for legal advice'}</li>
                    <li>{t('recorder.warning2', language) || 'Consult a lawyer for legal matters'}</li>
                    <li>{t('recorder.warning3', language) || 'This recording is not a substitute for official legal statements'}</li>
                  </ul>
                </div>
              </div>
              
              <div className="consent-actions">
                <button 
                  className="btn btn-primary btn-large"
                  onClick={() => {
                    setConsentGiven(true);
                    setShowConsent(false);
                  }}
                >
                  {t('recorder.agreeButton', language) || 'I Understand & Agree to Record'}
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => window.history.back()}
                >
                  {t('common.back', language)}
                </button>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .recorder-page {
            padding: var(--spacing-xl) 0 var(--spacing-3xl);
            min-height: 100vh;
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
          
          .consent-modal {
            display: flex;
            justify-content: center;
            padding: var(--spacing-xl) 0;
          }
          
          .consent-card {
            background: var(--color-surface);
            border-radius: var(--radius-lg);
            padding: var(--spacing-2xl);
            max-width: 700px;
            width: 100%;
            box-shadow: var(--shadow-lg);
          }
          
          .consent-icon {
            font-size: 4rem;
            text-align: center;
            margin-bottom: var(--spacing-lg);
          }
          
          .consent-card h2 {
            text-align: center;
            margin-bottom: var(--spacing-xl);
          }
          
          .consent-content {
            display: grid;
            gap: var(--spacing-lg);
            margin-bottom: var(--spacing-xl);
          }
          
          .consent-section {
            background: var(--color-secondary);
            padding: var(--spacing-lg);
            border-radius: var(--radius-md);
          }
          
          .consent-section h3 {
            font-size: var(--font-size-md);
            margin-bottom: var(--spacing-md);
            font-family: 'Inter', sans-serif;
          }
          
          .consent-section ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .consent-section li {
            padding: var(--spacing-xs) 0;
            color: var(--color-text-secondary);
            position: relative;
            padding-left: var(--spacing-lg);
          }
          
          .consent-section li::before {
            content: '•';
            position: absolute;
            left: 0;
            color: var(--color-primary);
            font-weight: bold;
          }
          
          .consent-actions {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-md);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="recorder-page">
      <div className="container">
        <header className="page-header">
          <h1>{t('recorder.title', language)}</h1>
          <p className="page-description">
            {t('recorder.description', language)}
          </p>
        </header>

        <div className="privacy-notice">
          <span className="privacy-icon">🔒</span>
          <span>{t('recorder.privacyNote', language)}</span>
        </div>

        <div className="card recording-card">
          <div className="card-header">
            <h2 className="card-title">{t('recorder.step2', language) || 'Step 2: Record Your Statement'}</h2>
          </div>
          
          <div className="audio-recorder">
            <button
              className={`recorder-button ${isRecording ? 'recording' : ''}`}
              onClick={isRecording ? stopRecording : startRecording}
              aria-label={isRecording ? t('recorder.stopButton', language) : t('recorder.recordButton', language)}
            >
              {isRecording ? (
                <span className="recorder-icon">⏹️</span>
              ) : (
                <span className="recorder-icon">🎤</span>
              )}
            </button>
            
            <p className="recorder-status">
              {isRecording ? (
                <>
                  <span className="recording-indicator"></span>
                  {t('recorder.recordingTime', language)}: {formatTime(recordingTime)}
                </>
              ) : (
                t('recorder.tapToStart', language) || 'Tap to start recording'
              )}
            </p>
            
            <p className="recorder-hint">
              {t('recorder.takeTime', language) || 'Take your time. You can pause and resume as needed.'}
            </p>
          </div>

          {currentRecording && (
            <div className="recording-playback">
              <h3>{t('recorder.yourRecording', language) || 'Your Recording'}</h3>
              <div className="playback-info">
                <span className="duration">⏱️ {formatTime(currentRecording.duration)}</span>
                <span className="timestamp">📅 {currentRecording.timestamp}</span>
              </div>
              
              <div className="playback-controls">
                <button className="btn btn-secondary" onClick={handlePlayback}>
                  ▶️ {t('recorder.playButton', language) || 'Play'}
                </button>
                <button className="btn btn-secondary">
                  ⏸️ {t('recorder.pauseButton', language) || 'Pause'}
                </button>
                <button className="btn btn-secondary" onClick={deleteRecording}>
                  🗑️ {t('recorder.deleteButton', language)}
                </button>
              </div>
              
              {playbackProgress > 0 && (
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${playbackProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">{t('recorder.step3', language) || 'Step 3: Review & Transcribe'}</h2>
          </div>
          
          {!transcript ? (
            <div className="transcribe-section">
              <p>{t('recorder.transcribeHint', language) || 'After recording, you can get an automatic transcription in your chosen language.'}</p>
              <button 
                className="btn btn-primary"
                onClick={simulateTranscription}
                disabled={!currentRecording}
              >
                📝 {t('recorder.generateTranscript', language)}
              </button>
            </div>
          ) : (
            <div className="transcript-result">
              <div className="transcript-header">
                <h3>{t('recorder.transcriptTitle', language)} ({language.toUpperCase()})</h3>
                <div className="transcript-actions">
                  <button className="btn btn-secondary btn-small">✏️ {t('recorder.editButton', language) || 'Edit'}</button>
                  <button className="btn btn-secondary btn-small">📋 {t('recorder.copyButton', language) || 'Copy'}</button>
                </div>
              </div>
              
              <div className="transcript-text">
                {transcript.text}
              </div>
              
              <div className="transcript-meta">
                <span>{t('recorder.generated', language) || 'Generated'}: {transcript.timestamp}</span>
              </div>
              
              {transcript.emotionalKeywords && (
                <div className="emotional-flags">
                  <h4>⚠️ {t('recorder.sensitiveDetected', language) || 'Sensitive Content Detected'}</h4>
                  <p>{t('recorder.emotionalKeywords', language) || 'The following emotional keywords were detected in your statement:'}</p>
                  <div className="keyword-tags">
                    {transcript.emotionalKeywords.map((keyword, index) => (
                      <span key={index} className="keyword-tag">{keyword}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <style jsx>{`
          .recorder-page {
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
          
          .privacy-notice {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            background: var(--color-success-light);
            padding: var(--spacing-md) var(--spacing-lg);
            border-radius: var(--radius-md);
            margin-bottom: var(--spacing-lg);
            font-size: var(--font-size-sm);
          }
          
          .privacy-icon {
            font-size: 1.5rem;
          }
          
          .recording-card {
            text-align: center;
          }
          
          .audio-recorder {
            background: var(--color-secondary);
            border-radius: var(--radius-lg);
            padding: var(--spacing-2xl);
            margin: var(--spacing-lg) 0;
          }
          
          .recorder-button {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: none;
            background: var(--color-primary);
            color: white;
            font-size: 2.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto var(--spacing-md);
            transition: all var(--transition-fast);
            box-shadow: var(--shadow-lg);
          }
          
          .recorder-button:hover {
            transform: scale(1.05);
          }
          
          .recorder-button.recording {
            background: #EF4444;
            animation: pulse-red 1.5s infinite;
          }
          
          @keyframes pulse-red {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          .recorder-status {
            font-size: var(--font-size-lg);
            font-weight: 600;
            color: var(--color-text-primary);
            margin-bottom: var(--spacing-sm);
          }
          
          .recording-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            background: #EF4444;
            border-radius: 50%;
            margin-right: var(--spacing-sm);
            animation: blink 1s infinite;
          }
          
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          .recorder-hint {
            font-size: var(--font-size-sm);
            color: var(--color-text-muted);
          }
          
          .recording-playback {
            margin-top: var(--spacing-xl);
            padding-top: var(--spacing-xl);
            border-top: 1px solid var(--color-border);
          }
          
          .recording-playback h3 {
            margin-bottom: var(--spacing-md);
          }
          
          .playback-info {
            display: flex;
            gap: var(--spacing-lg);
            margin-bottom: var(--spacing-md);
            font-size: var(--font-size-sm);
            color: var(--color-text-secondary);
          }
          
          .playback-controls {
            display: flex;
            gap: var(--spacing-sm);
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .progress-bar {
            height: 8px;
            background: var(--color-secondary-dark);
            border-radius: var(--radius-full);
            margin-top: var(--spacing-md);
            overflow: hidden;
          }
          
          .progress-fill {
            height: 100%;
            background: var(--color-primary);
            transition: width var(--transition-fast);
          }
          
          .transcribe-section {
            text-align: center;
            padding: var(--spacing-lg);
          }
          
          .transcribe-section p {
            margin-bottom: var(--spacing-md);
            color: var(--color-text-secondary);
          }
          
          .transcript-result {
            padding: var(--spacing-md) 0;
          }
          
          .transcript-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--spacing-md);
          }
          
          .transcript-actions {
            display: flex;
            gap: var(--spacing-sm);
          }
          
          .transcript-text {
            background: var(--color-secondary);
            padding: var(--spacing-lg);
            border-radius: var(--radius-md);
            font-size: var(--font-size-md);
            line-height: var(--line-height-relaxed);
            margin-bottom: var(--spacing-md);
          }
          
          .transcript-meta {
            font-size: var(--font-size-sm);
            color: var(--color-text-muted);
            margin-bottom: var(--spacing-lg);
          }
          
          .emotional-flags {
            background: var(--color-warning-light);
            border: 1px solid var(--color-warning);
            border-radius: var(--radius-md);
            padding: var(--spacing-lg);
          }
          
          .emotional-flags h4 {
            color: var(--color-warning);
            margin-bottom: var(--spacing-sm);
          }
          
          .emotional-flags p {
            font-size: var(--font-size-sm);
            margin-bottom: var(--spacing-md);
          }
          
          .keyword-tags {
            display: flex;
            gap: var(--spacing-sm);
            flex-wrap: wrap;
          }
          
          .keyword-tag {
            background: var(--color-warning);
            color: white;
            padding: var(--spacing-xs) var(--spacing-sm);
            border-radius: var(--radius-full);
            font-size: var(--font-size-sm);
          }
        `}</style>
      </div>
    </div>
  );
}
