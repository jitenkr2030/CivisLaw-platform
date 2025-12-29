'use client';

import { useState, useRef, useEffect } from 'react';

export default function RecorderPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState([]);
  const [currentRecording, setCurrentRecording] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [showConsent, setShowConsent] = useState(true);
  const [consentGiven, setConsentGiven] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

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
    
    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // Simulate recording (in real app, would use MediaRecorder API)
    setTimeout(() => {
      // This simulates the recording completion
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Create a mock recording
    const newRecording = {
      id: Date.now(),
      duration: recordingTime,
      timestamp: new Date().toLocaleString(),
      language: selectedLanguage
    };
    setCurrentRecording(newRecording);
    setRecordings(prev => [newRecording, ...prev]);
  };

  const simulateTranscription = () => {
    setTranscript({
      text: selectedLanguage === 'hi' 
        ? "मेरा नाम सीता है। मैं कल शाम को अपने घर जा रही थी। रास्ते में एक अजनबी ने मेरा पीछा किया। मुझे बहुत डर लगा।"
        : selectedLanguage === 'ta'
        ? "என்னுடைய பெயர் சீதா. நேற்று மாலை நான் வீட்டிற்கு செல்லுவதாக இருந்தேன். வழியில் ஒரு stranger என்னை follow செய்தான். எனக்கு மிகவும் பயமாக இருந்தது."
        : selectedLanguage === 'te'
        ? "నా పేరు సీతా. నిన్నటి సాయంత్రం నేను ఇంటికి వెళ్తున్నాను. రోడ్డుపై ఒక అజ్ఞాత వ్యక్తి నాకు వెనుకబడ్డాడు. నాకు చాలా భయం వచ్చింది."
        : "My name is Sita. Yesterday evening I was going home. On the way, a stranger followed me. I was very scared.",
      timestamp: new Date().toLocaleString(),
      emotionalKeywords: ['scared', 'followed', 'fear']
    });
  };

  const handlePlayback = () => {
    // Simulate playback progress
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
            <h1>Victim Statement Recorder</h1>
            <p className="page-description">
              A safe, dignified way to record your statement in your own language. 
              Designed especially for sensitive cases with trauma-aware features.
            </p>
          </header>

          <div className="consent-modal">
            <div className="consent-card">
              <div className="consent-icon">🎤</div>
              <h2>Before You Begin</h2>
              <div className="consent-content">
                <div className="consent-section">
                  <h3>🔒 Your Privacy Matters</h3>
                  <ul>
                    <li>Your recording is stored securely on your device</li>
                    <li>You have full control over who can access it</li>
                    <li>We use end-to-end encryption to protect your data</li>
                    <li>You can delete your recording at any time</li>
                  </ul>
                </div>
                
                <div className="consent-section">
                  <h3>👤 Your Dignity is Priority</h3>
                  <ul>
                    <li>Record in your own language</li>
                    <li>Take breaks whenever you need</li>
                    <li>Review and approve your transcript before sharing</li>
                    <li>Pause and resume recording as needed</li>
                  </ul>
                </div>
                
                <div className="consent-section">
                  <h3>⚠️ Important to Know</h3>
                  <ul>
                    <li>This is for recording your statement, not for legal advice</li>
                    <li>Consult a lawyer for legal matters</li>
                    <li>This recording is not a substitute for official legal statements</li>
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
                  I Understand & Agree to Record
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => window.history.back()}
                >
                  Go Back
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
        {/* Page Header */}
        <header className="page-header">
          <h1>Victim Statement Recorder</h1>
          <p className="page-description">
            Record your statement safely and securely. Your voice matters, and we are here to help you tell your story with dignity.
          </p>
        </header>

        {/* Privacy Notice */}
        <div className="privacy-notice">
          <span className="privacy-icon">🔒</span>
          <span>Your recording is encrypted and stored only on your device. You control who sees it.</span>
        </div>

        {/* Language Selection */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Step 1: Choose Your Language</h2>
          </div>
          <div className="language-grid">
            {[
              { code: 'hi', name: 'हिंदी', label: 'Hindi' },
              { code: 'ta', name: 'தமிழ்', label: 'Tamil' },
              { code: 'te', name: 'తెలుగు', label: 'Telugu' },
              { code: 'bn', name: 'বাংলা', label: 'Bengali' },
              { code: 'mr', name: 'मराठी', label: 'Marathi' },
              { code: 'en', name: 'English', label: 'English' }
            ].map((lang) => (
              <label 
                key={lang.code} 
                className={`language-card ${selectedLanguage === lang.code ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="recordingLanguage"
                  value={lang.code}
                  checked={selectedLanguage === lang.code}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                />
                <span className="lang-name">{lang.name}</span>
                <span className="lang-label">{lang.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Recording Section */}
        <div className="card recording-card">
          <div className="card-header">
            <h2 className="card-title">Step 2: Record Your Statement</h2>
          </div>
          
          <div className="audio-recorder">
            <button
              className={`recorder-button ${isRecording ? 'recording' : ''}`}
              onClick={isRecording ? stopRecording : startRecording}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
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
                  Recording... {formatTime(recordingTime)}
                </>
              ) : (
                'Tap to start recording'
              )}
            </p>
            
            <p className="recorder-hint">
              Take your time. You can pause and resume as needed.
            </p>
          </div>

          {currentRecording && (
            <div className="recording-playback">
              <h3>Your Recording</h3>
              <div className="playback-info">
                <span className="duration">⏱️ {formatTime(currentRecording.duration)}</span>
                <span className="timestamp">📅 {currentRecording.timestamp}</span>
              </div>
              
              <div className="playback-controls">
                <button className="btn btn-secondary" onClick={handlePlayback}>
                  ▶️ Play
                </button>
                <button className="btn btn-secondary">
                  ⏸️ Pause
                </button>
                <button className="btn btn-secondary">
                  🗑️ Delete
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

        {/* Transcription Section */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Step 3: Review & Transcribe</h2>
          </div>
          
          {!transcript ? (
            <div className="transcribe-section">
              <p>After recording, you can get an automatic transcription in your chosen language.</p>
              <button 
                className="btn btn-primary"
                onClick={simulateTranscription}
                disabled={!currentRecording}
              >
                📝 Get Transcription
              </button>
            </div>
          ) : (
            <div className="transcript-result">
              <div className="transcript-header">
                <h3>Transcript ({selectedLanguage.toUpperCase()})</h3>
                <div className="transcript-actions">
                  <button className="btn btn-secondary btn-small">✏️ Edit</button>
                  <button className="btn btn-secondary btn-small">📋 Copy</button>
                </div>
              </div>
              
              <div className="transcript-text">
                {transcript.text}
              </div>
              
              <div className="transcript-meta">
                <span>Generated: {transcript.timestamp}</span>
              </div>
              
              {transcript.emotionalKeywords && (
                <div className="emotional-flags">
                  <h4>⚠️ Sensitive Content Detected</h4>
                  <p>The following emotional keywords were detected in your statement:</p>
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

        {/* English Translation */}
        {transcript && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Step 4: English Translation (Optional)</h2>
            </div>
            <div className="translation-display">
              <p className="translation-original">Original ({selectedLanguage.toUpperCase()}):</p>
              <p>{transcript.text}</p>
              <hr style={{ margin: 'var(--spacing-md) 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />
              <p className="translation-original">English Translation:</p>
              <p className="translation-text">
                "My name is Sita. Yesterday evening I was going home. On the way, a stranger followed me. I was very scared."
              </p>
            </div>
          </div>
        )}

        {/* Approval Section */}
        {transcript && (
          <div className="card approval-card">
            <div className="card-header">
              <h2 className="card-title">Step 5: Final Approval</h2>
            </div>
            
            <div className="approval-content">
              <div className="approval-checklist">
                <label className="approval-item">
                  <input type="checkbox" />
                  <span>I have reviewed the transcript and it accurately reflects my statement</span>
                </label>
                <label className="approval-item">
                  <input type="checkbox" />
                  <span>I consent to use this recording for my legal proceedings</span>
                </label>
                <label className="approval-item">
                  <input type="checkbox" />
                  <span>I understand this is not legal advice</span>
                </label>
              </div>
              
              <div className="approval-actions">
                <button className="btn btn-secondary">
                  💾 Save to Device
                </button>
                <button className="btn btn-primary">
                  📤 Export Recording
                </button>
              </div>
              
              <p className="approval-note">
                You can export your recording and transcript to share with your lawyer or legal aid organization.
              </p>
            </div>
          </div>
        )}

        {/* Previous Recordings */}
        {recordings.length > 1 && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Previous Recordings</h2>
            </div>
            <div className="recordings-list">
              {recordings.slice(1).map((recording) => (
                <div key={recording.id} className="recording-item">
                  <div className="recording-item-info">
                    <span className="recording-date">{recording.timestamp}</span>
                    <span className="recording-duration">{formatTime(recording.duration)}</span>
                  </div>
                  <div className="recording-item-actions">
                    <button className="btn btn-secondary btn-small">▶️ Play</button>
                    <button className="btn btn-secondary btn-small">📝 Transcript</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safety Resources */}
        <section className="safety-resources">
          <h2 className="section-title">Support & Resources</h2>
          <div className="resources-grid">
            <div className="resource-card">
              <h3>📞 Helplines</h3>
              <p>Women's Helpline: 181</p>
              <p>Police: 100</p>
              <p>Child Helpline: 1098</p>
            </div>
            <div className="resource-card">
              <h3>🏢 Legal Aid</h3>
              <p>State Legal Services Authority</p>
              <p>District Legal Services Authority</p>
            </div>
            <div className="resource-card">
              <h3>💬 Counseling</h3>
              <p>iCall: 9152987821</p>
              <p>Vandrevala: 1860 2662 345</p>
            </div>
          </div>
        </section>
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
        
        .language-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-md);
        }
        
        .language-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--spacing-lg);
          background: var(--color-secondary);
          border-radius: var(--radius-md);
          cursor: pointer;
          border: 2px solid transparent;
          transition: all var(--transition-fast);
        }
        
        .language-card:hover {
          background: var(--color-secondary-dark);
        }
        
        .language-card.selected {
          border-color: var(--color-primary);
          background: rgba(74, 124, 89, 0.1);
        }
        
        .language-card input {
          position: absolute;
          opacity: 0;
        }
        
        .lang-name {
          font-size: var(--font-size-lg);
          font-weight: 600;
        }
        
        .lang-label {
          font-size: var(--font-size-xs);
          color: var(--color-text-muted);
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
        
        .approval-content {
          padding: var(--spacing-md) 0;
        }
        
        .approval-checklist {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }
        
        .approval-item {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-sm);
          padding: var(--spacing-md);
          background: var(--color-secondary);
          border-radius: var(--radius-md);
          cursor: pointer;
        }
        
        .approval-item input {
          margin-top: 4px;
          width: 20px;
          height: 20px;
        }
        
        .approval-actions {
          display: flex;
          gap: var(--spacing-md);
          flex-wrap: wrap;
          margin-bottom: var(--spacing-md);
        }
        
        .approval-note {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
          font-style: italic;
        }
        
        .recordings-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        
        .recording-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-md);
          background: var(--color-secondary);
          border-radius: var(--radius-md);
        }
        
        .recording-item-info {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }
        
        .recording-date {
          font-weight: 600;
        }
        
        .recording-duration {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
        }
        
        .recording-item-actions {
          display: flex;
          gap: var(--spacing-sm);
        }
        
        .safety-resources {
          background: var(--color-secondary);
          padding: var(--spacing-2xl);
          border-radius: var(--radius-lg);
          margin-top: var(--spacing-xl);
        }
        
        .section-title {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }
        
        .resources-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-lg);
        }
        
        .resource-card {
          background: var(--color-surface);
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
          text-align: center;
        }
        
        .resource-card h3 {
          margin-bottom: var(--spacing-md);
          font-size: var(--font-size-md);
        }
        
        .resource-card p {
          margin: var(--spacing-xs) 0;
          font-size: var(--font-size-sm);
        }
        
        @media (max-width: 768px) {
          .language-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .resources-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
