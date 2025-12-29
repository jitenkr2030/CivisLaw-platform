'use client';

import { useState } from 'react';
import { useLanguage } from '../../utils/LanguageContext';
import { t as getTranslation } from '../../utils/i18n';

export default function TimelinePage() {
  const { language } = useLanguage();
  const t = (key) => getTranslation(key, language);

  const [selectedCaseType, setSelectedCaseType] = useState('criminal');
  const [expandedStage, setExpandedStage] = useState(null);
  const [currentStage, setCurrentStage] = useState(3);

  const caseTypes = [
    { id: 'criminal', name: t('timeline.criminalCase'), description: t('timeline.criminalCaseDesc') },
    { id: 'civil', name: t('timeline.civilCase'), description: t('timeline.civilCaseDesc') },
    { id: 'family', name: t('timeline.familyCase'), description: t('timeline.familyCaseDesc') }
  ];

  const timelineStages = {
    criminal: [
      {
        stage: 1,
        name: 'FIR Registration',
        icon: '📋',
        duration: 'Day 1',
        description: 'First Information Report is filed with the police',
        whatHappens: [
          'Police record the complaint in writing',
          'Police give a copy of FIR to the complainant',
          'Police begin investigation if the offense is cognizable'
        ],
        whatYouNeed: [
          'A copy of your FIR',
          'Police station name and complaint number',
          "Details of what happened"
        ],
        whatYouDontNeed: [
          'A lawyer just to file an FIR (you can do it yourself)',
          'To pay money to anyone for filing FIR',
          'To wait for anyone permission'
        ]
      },
      {
        stage: 2,
        name: 'Investigation',
        icon: '🔍',
        duration: '15-90 days (can vary)',
        description: 'Police gather evidence and statements',
        whatHappens: [
          'Police visit the crime scene',
          'Police collect evidence (photos, documents, etc.)',
          'Police record statements of witnesses',
          'Police may arrest the accused if needed'
        ],
        whatYouNeed: [
          'Cooperate with police investigation',
          'Provide any evidence you have',
          'Attend police station if called'
        ],
        whatYouDontNeed: [
          'To follow police everywhere',
          'To sign blank papers',
          'To pay money for investigation'
        ]
      },
      {
        stage: 3,
        name: 'Statement Recording',
        icon: '🎤',
        duration: 'During investigation',
        description: 'Your statement is recorded as part of evidence',
        whatHappens: [
          'Police record your statement in detail',
          'You read and sign the statement',
          'Statement becomes part of case file'
        ],
        whatYouNeed: [
          'To tell the truth',
          'To remember details clearly',
          'To correct anything wrong before signing'
        ],
        whatYouDontNeed: [
          'To rush through your statement',
          'To say what others tell you',
          'To sign without reading'
        ]
      },
      {
        stage: 4,
        name: 'Medical Examination',
        icon: '🏥',
        duration: 'As soon as possible',
        description: 'Physical examination for evidence collection',
        whatHappens: [
          'Medical examination conducted by doctor',
          'Evidence collected (samples, photos)',
          'Medical report prepared'
        ],
        whatYouNeed: [
          'To cooperate with medical staff',
          'To ask for a female doctor if preferred',
          'To get a copy of medical report'
        ],
        whatYouDontNeed: [
          'To be embarrassed - medical staff are professionals',
          'To delay examination (earlier is better)',
          'To go alone - you can take someone you trust'
        ]
      },
      {
        stage: 5,
        name: 'Charge Sheet',
        icon: '📄',
        duration: 'After investigation completes',
        description: 'Police submit final report with charges',
        whatHappens: [
          'Police submit chargesheet to court',
          'Charges mentioned against accused',
          'Court examines the chargesheet'
        ],
        whatYouNeed: [
          'A copy of chargesheet from police',
          'To know what charges were filed',
          'To understand the next court dates'
        ],
        whatYouDontNeed: [
          'To panic when you see technical language',
          'To understand every legal term (we can help!)',
          'To be present at this filing (lawyer can handle)'
        ]
      },
      {
        stage: 6,
        name: 'Framing of Charges',
        icon: '⚖️',
        duration: 'First court appearance after chargesheet',
        description: 'Court formally reads charges to accused',
        whatHappens: [
          'Judge reads charges to accused person',
          'Accused asked to plead guilty or not',
          'Trial begins if not guilty'
        ],
        whatYouNeed: [
          'To know the date of this hearing',
          'To have your lawyer present',
          'To understand the charges (we can explain!)'
        ],
        whatYouDontNeed: [
          'To be in court physically if lawyer is there',
          'To know all legal procedures',
          'To answer questions without your lawyer'
        ]
      },
      {
        stage: 7,
        name: 'Trial',
        icon: '🏛️',
        duration: '6 months to several years',
        description: 'Main court proceedings and evidence examination',
        whatHappens: [
          'Prosecution presents evidence and witnesses',
          'Defense cross-examines witnesses',
          'Defense presents their evidence',
          'Arguments from both sides'
        ],
        whatYouNeed: [
          'To attend court on scheduled dates',
          'To have your lawyer coordinate the case',
          'To be patient - trials take time',
          'To keep copies of all documents'
        ],
        whatYouDontNeed: [
          'To speak in court without permission',
          'To confront the accused',
          'To memorize everything'
        ]
      },
      {
        stage: 8,
        name: 'Judgment',
        icon: '📜',
        duration: 'After trial concludes',
        description: 'Court announces final verdict',
        whatHappens: [
          'Judge announces guilty or not guilty',
          'If guilty, quantum of punishment decided',
          'If acquitted, you are free to go'
        ],
        whatYouNeed: [
          'To be present for judgment day',
          'To understand what the judgment means',
          'To know your rights (appeal, etc.)'
        ],
        whatYouDontNeed: [
          'To accept verbal explanations - get written copy',
          'To sign anything without understanding',
          'To delay - there are time limits for appeals'
        ]
      }
    ],
    civil: [
      {
        stage: 1,
        name: 'Plaint/Complaint',
        icon: '📝',
        duration: 'Day 1',
        description: 'Filing your case (plaint) in court',
        whatHappens: [
          'You file a written complaint (plaint)',
          'Court registers the case',
          'Summons issued to defendant'
        ],
        whatYouNeed: [
          'Clear description of your claim',
          'All relevant documents',
          'Court fee (varies by claim amount)'
        ],
        whatYouDontNeed: [
          'To file in wrong court (check jurisdiction)',
          'To use overly complex language',
          'To pay illegal fees'
        ]
      },
      {
        stage: 2,
        name: 'Written Statement',
        icon: '✍️',
        duration: '30 days (usually)',
        description: 'Defendant responds to your complaint',
        whatHappens: [
          'Defendant files their response',
          'Court adds it to case file',
          'You get a copy of the response'
        ],
        whatYouNeed: [
          'To wait for the response',
          'To read and understand it',
          'To prepare your reply if needed'
        ],
        whatYouDontNeed: [
          'To panic at allegations in it',
          'To respond immediately without thinking',
          'To argue in writing without legal help'
        ]
      },
      {
        stage: 3,
        name: 'Framing of Issues',
        icon: '📌',
        duration: 'After written statement',
        description: 'Court identifies what needs to be decided',
        whatHappens: [
          'Judge identifies disputed points',
          'Court decides what evidence is needed',
          'List of issues framed for trial'
        ],
        whatYouNeed: [
          'To understand what points are in dispute',
          'To know what evidence to prepare',
          'To coordinate with your lawyer'
        ],
        whatYouDontNeed: [
          'To argue about every small point',
          'To present irrelevant evidence',
          'To delay this stage unnecessarily'
        ]
      },
      {
        stage: 4,
        name: 'Evidence',
        icon: '📚',
        duration: 'Varies widely',
        description: 'Both sides present their evidence',
        whatHappens: [
          'You present documents and witnesses',
          'Defendant does the same',
          'Court examines all evidence'
        ],
        whatYouNeed: [
          'Original documents (keep copies!)',
          'Witnesses who can testify',
          'Organized case file'
        ],
        whatYouDontNeed: [
          'To submit fake or tampered documents',
          'To pressure witnesses',
          'To hide relevant evidence'
        ]
      },
      {
        stage: 5,
        name: 'Arguments',
        icon: '🗣️',
        duration: 'After evidence',
        description: 'Lawyers present final arguments',
        whatHappens: [
          'Your lawyer presents oral arguments',
          'Defendant lawyer presents their case',
          'Judge may ask questions'
        ],
        whatYouNeed: [
          'To trust your lawyer to argue',
          'To provide all relevant facts',
          'To be patient during proceedings'
        ],
        whatYouDontNeed: [
          'To interrupt the proceedings',
          'To argue with the judge',
          'To speak without permission'
        ]
      },
      {
        stage: 6,
        name: 'Judgment',
        icon: '⚖️',
        duration: 'After arguments',
        description: 'Court announces its decision',
        whatHappens: [
          'Judge reads judgment',
          'Either you win or lose',
          'Court may order costs or remedies'
        ],
        whatYouNeed: [
          'To understand the judgment clearly',
          'To get a written copy',
          'To know your appeal rights'
        ],
        whatYouDontNeed: [
          'To accept verbal-only judgments',
          'To celebrate or mourn immediately',
          'To ignore appeal deadlines'
        ]
      }
    ],
    family: [
      {
        stage: 1,
        name: 'Filing Petition',
        icon: '📝',
        duration: 'Day 1',
        description: 'Starting your family court case',
        whatHappens: [
          'You file a petition (divorce, custody, etc.)',
          'Court registers the case',
          'Notice issued to other party'
        ],
        whatYouNeed: [
          'Marriage certificate and ID proofs',
          'Clear description of relief sought',
          'Attempt at reconciliation (in some cases)'
        ],
        whatYouDontNeed: [
          'To publicize your case',
          'To involve unnecessary people',
          'To rush without proper documents'
        ]
      },
      {
        stage: 2,
        name: 'Response',
        icon: '📨',
        duration: '30-60 days',
        description: 'Other party responds to your petition',
        whatHappens: [
          'Spouse/party files their reply',
          'They may contest the petition',
          'Mediation may be suggested'
        ],
        whatYouNeed: [
          'To read and understand their response',
          'To prepare your counter-response',
          'To consider settlement options'
        ],
        whatYouDontNeed: [
          'To respond in anger',
          'To hide assets or information',
          'To involve children in the conflict'
        ]
      },
      {
        stage: 3,
        name: 'Interim Orders',
        icon: '⏱️',
        duration: 'As needed',
        description: 'Temporary orders while case is pending',
        whatHappens: [
          'Court may order interim maintenance',
          'Custody may be decided temporarily',
          'Living arrangements may be ordered'
        ],
        whatYouNeed: [
          'To clearly state your needs',
          'To provide financial documents',
          'To consider childrens welfare'
        ],
        whatYouDontNeed: [
          'To make unreasonable demands',
          'To deny access without reason',
          'To hide income or assets'
        ]
      },
      {
        stage: 4,
        name: 'Evidence & Arguments',
        icon: '📚',
        duration: 'Varies',
        description: 'Presenting your case',
        whatHappens: [
          'Both sides present evidence',
          'Witnesses may be called',
          'Final arguments presented'
        ],
        whatYouNeed: [
          'Relevant documents and witnesses',
          'To focus on facts, not emotions',
          'To have good legal representation'
        ],
        whatYouDontNeed: [
          'To make false statements',
          'To coach witnesses improperly',
          'To waste courts time unnecessarily'
        ]
      },
      {
        stage: 5,
        name: 'Final Order',
        icon: '🏠',
        duration: 'After arguments',
        description: 'Court issues final decision',
        whatHappens: [
          'Court passes final order',
          'Divorce decree, custody order, etc.',
          'Financial settlements finalized'
        ],
        whatYouNeed: [
          'To get a certified copy of order',
          'To understand compliance requirements',
          'To plan your next steps'
        ],
        whatYouDontNeed: [
          'To violate the order',
          'To ignore compliance deadlines',
          'To take unilateral actions'
        ]
      }
    ]
  };

  const toggleStage = (stageNumber) => {
    setExpandedStage(expandedStage === stageNumber ? null : stageNumber);
  };

  return (
    <div className="timeline-page">
      <div className="container">
        {/* Page Header */}
        <header className="page-header">
          <h1>{t('timeline.pageTitle')}</h1>
          <p className="page-description">
            {t('timeline.pageDescription')}
          </p>
        </header>

        {/* Case Type Selection */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">{t('timeline.step1Title')}</h2>
          </div>
          <div className="case-type-grid">
            {caseTypes.map(type => (
              <button
                key={type.id}
                className={`case-type-card ${selectedCaseType === type.id ? 'selected' : ''}`}
                onClick={() => setSelectedCaseType(type.id)}
              >
                <span className="case-type-icon">
                  {type.id === 'criminal' ? '🚨' : type.id === 'civil' ? '📊' : '👨‍👩‍👧'}
                </span>
                <span className="case-type-name">{type.name}</span>
                <span className="case-type-desc">{type.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Current Stage Selector */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">{t('timeline.step2Title')}</h2>
          </div>
          <div className="current-stage-selector">
            <p>{t('timeline.currentStagePrompt')}</p>
            <div className="stage-buttons">
              {timelineStages[selectedCaseType].map((stage) => (
                <button
                  key={stage.stage}
                  className={`stage-btn ${currentStage === stage.stage ? 'current' : ''} ${currentStage > stage.stage ? 'completed' : ''}`}
                  onClick={() => {
                    setCurrentStage(stage.stage);
                    toggleStage(stage.stage);
                  }}
                >
                  <span className="stage-number">{stage.stage}</span>
                  <span className="stage-name">{stage.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stage Details */}
        {timelineStages[selectedCaseType].map((stage) => (
          <div 
            key={stage.stage}
            className={`stage-card ${expandedStage === stage.stage ? 'expanded' : ''} ${currentStage === stage.stage ? 'current' : ''} ${currentStage > stage.stage ? 'completed' : ''}`}
          >
            <div 
              className="stage-header"
              onClick={() => toggleStage(stage.stage)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && toggleStage(stage.stage)}
            >
              <div className="stage-info">
                <div className="stage-marker">
                  {currentStage > stage.stage ? '✓' : stage.stage}
                </div>
                <div className="stage-content">
                  <h3 className="stage-title">
                    {stage.icon} {stage.name}
                  </h3>
                  <p className="stage-description">{stage.description}</p>
                </div>
              </div>
              <div className="stage-meta">
                <span className="stage-duration">⏱️ {stage.duration}</span>
                <span className={`stage-status ${currentStage === stage.stage ? 'current' : currentStage > stage.stage ? 'completed' : 'upcoming'}`}>
                  {currentStage === stage.stage ? t('timeline.youAreHere') : currentStage > stage.stage ? t('timeline.completed') : t('timeline.upcoming')}
                </span>
              </div>
              <span className="expand-icon">{expandedStage === stage.stage ? '−' : '+'}</span>
            </div>
            
            {expandedStage === stage.stage && (
              <div className="stage-details">
                <div className="details-grid">
                  <div className="detail-section">
                    <h4>📋 {t('timeline.whatHappens')}</h4>
                    <ul>
                      {stage.whatHappens.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="detail-section">
                    <h4>✅ {t('timeline.whatYouNeed')}</h4>
                    <ul>
                      {stage.whatYouNeed.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="detail-section">
                    <h4>❌ {t('timeline.whatYouDontNeed')}</h4>
                    <ul>
                      {stage.whatYouDontNeed.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Time Expectations */}
        <section className="time-expectations">
          <h2 className="section-title">⏰ {t('timeline.timeExpectationsTitle')}</h2>
          <div className="time-cards">
            <div className="time-card">
              <div className="time-icon">⚡</div>
              <h3>{t('timeline.fastTrackCases')}</h3>
              <p>{t('timeline.fastTrackTime')}</p>
              <span>{t('timeline.fastTrackDesc')}</span>
            </div>
            <div className="time-card">
              <div className="time-icon">📅</div>
              <h3>{t('timeline.regularCases')}</h3>
              <p>{t('timeline.regularTime')}</p>
              <span>{t('timeline.regularCasesDesc')}</span>
            </div>
            <div className="time-card">
              <div className="time-icon">⏳</div>
              <h3>{t('timeline.complexCases')}</h3>
              <p>{t('timeline.complexTime')}</p>
              <span>{t('timeline.complexCasesDesc')}</span>
            </div>
          </div>
          <p className="time-note">
            ⚠️ {t('timeline.timeNote')}
          </p>
        </section>

        {/* Emotional Support */}
        <section className="emotional-support">
          <h2 className="section-title">💚 {t('timeline.selfCareTitle')}</h2>
          <div className="support-grid">
            <div className="support-card">
              <h3>{t('timeline.overwhelmedTitle')}</h3>
              <p>{t('timeline.overwhelmedDesc')}</p>
            </div>
            <div className="support-card">
              <h3>{t('timeline.notAloneTitle')}</h3>
              <p>{t('timeline.notAloneDesc')}</p>
            </div>
            <div className="support-card">
              <h3>{t('timeline.oneDayTitle')}</h3>
              <p>{t('timeline.oneDayDesc')}</p>
            </div>
            <div className="support-card">
              <h3>{t('timeline.helpTitle')}</h3>
              <p>{t('timeline.helpDesc')}</p>
            </div>
          </div>
        </section>

        {/* Emergency Contacts */}
        <section className="emergency-contacts">
          <h2 className="section-title">📞 {t('timeline.emergencyTitle')}</h2>
          <div className="contacts-grid">
            <div className="contact-card">
              <h3>{t('timeline.policeEmergency')}</h3>
              <p className="contact-number">100</p>
              <p>{t('timeline.policeEmergencyDesc')}</p>
            </div>
            <div className="contact-card">
              <h3>{t('timeline.womensHelpline')}</h3>
              <p className="contact-number">181</p>
              <p>{t('timeline.womensHelplineDesc')}</p>
            </div>
            <div className="contact-card">
              <h3>{t('timeline.childHelpline')}</h3>
              <p className="contact-number">1098</p>
              <p>{t('timeline.childHelplineDesc')}</p>
            </div>
            <div className="contact-card">
              <h3>{t('timeline.icall')}</h3>
              <p className="contact-number">9152987821</p>
              <p>{t('timeline.icallDesc')}</p>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .timeline-page {
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
        
        .case-type-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-lg);
        }
        
        .case-type-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--spacing-xl);
          background: var(--color-secondary);
          border: 2px solid transparent;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: center;
        }
        
        .case-type-card:hover {
          background: var(--color-secondary-dark);
        }
        
        .case-type-card.selected {
          border-color: var(--color-primary);
          background: rgba(74, 124, 89, 0.1);
        }
        
        .case-type-icon {
          font-size: 3rem;
          margin-bottom: var(--spacing-md);
        }
        
        .case-type-name {
          font-size: var(--font-size-lg);
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
        }
        
        .case-type-desc {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
        }
        
        .current-stage-selector {
          padding: var(--spacing-md) 0;
        }
        
        .current-stage-selector > p {
          margin-bottom: var(--spacing-md);
          color: var(--color-text-secondary);
        }
        
        .stage-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-sm);
        }
        
        .stage-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--color-secondary);
          border: 2px solid transparent;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        
        .stage-btn:hover {
          background: var(--color-secondary-dark);
        }
        
        .stage-btn.current {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }
        
        .stage-btn.completed {
          background: var(--color-success-light);
          border-color: var(--color-success);
        }
        
        .stage-number {
          width: 28px;
          height: 28px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: var(--font-size-sm);
        }
        
        .stage-btn.current .stage-number {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .stage-name {
          font-size: var(--font-size-sm);
          font-weight: 500;
        }
        
        .stage-card {
          margin-bottom: var(--spacing-md);
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--color-border);
          transition: all var(--transition-fast);
        }
        
        .stage-card.current {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px rgba(74, 124, 89, 0.2);
        }
        
        .stage-card.completed {
          background: rgba(5, 150, 105, 0.05);
        }
        
        .stage-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-lg);
          cursor: pointer;
          transition: background var(--transition-fast);
        }
        
        .stage-header:hover {
          background: var(--color-secondary);
        }
        
        .stage-info {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-md);
          flex: 1;
        }
        
        .stage-marker {
          width: 40px;
          height: 40px;
          background: var(--color-secondary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: var(--color-text-secondary);
          flex-shrink: 0;
        }
        
        .stage-card.current .stage-marker {
          background: var(--color-primary);
          color: white;
          animation: pulse 2s infinite;
        }
        
        .stage-card.completed .stage-marker {
          background: var(--color-success);
          color: white;
        }
        
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74, 124, 89, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(74, 124, 89, 0); }
        }
        
        .stage-content {
          flex: 1;
        }
        
        .stage-title {
          font-size: var(--font-size-lg);
          margin-bottom: var(--spacing-xs);
          font-family: 'Inter', sans-serif;
        }
        
        .stage-description {
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
          margin: 0;
        }
        
        .stage-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: var(--spacing-xs);
        }
        
        .stage-duration {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
        }
        
        .stage-status {
          font-size: var(--font-size-xs);
          font-weight: 600;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-full);
        }
        
        .stage-status.current {
          background: var(--color-primary);
          color: white;
        }
        
        .stage-status.completed {
          background: var(--color-success-light);
          color: var(--color-success);
        }
        
        .stage-status.upcoming {
          background: var(--color-secondary);
          color: var(--color-text-secondary);
        }
        
        .expand-icon {
          font-size: var(--font-size-xl);
          color: var(--color-text-muted);
          padding: var(--spacing-sm);
        }
        
        .stage-details {
          padding: 0 var(--spacing-lg) var(--spacing-lg);
          padding-left: calc(var(--spacing-lg) + 56px);
          animation: slideDown 0.3s ease;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .details-grid {
          display: grid;
          gap: var(--spacing-lg);
        }
        
        .detail-section {
          background: var(--color-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
        }
        
        .detail-section h4 {
          font-size: var(--font-size-md);
          margin-bottom: var(--spacing-md);
          font-family: 'Inter', sans-serif;
        }
        
        .detail-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .detail-section li {
          padding: var(--spacing-sm) 0;
          padding-left: var(--spacing-lg);
          position: relative;
          font-size: var(--font-size-sm);
          line-height: var(--line-height-relaxed);
        }
        
        .detail-section li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--color-primary);
          font-weight: bold;
        }
        
        .time-expectations {
          background: var(--color-secondary);
          padding: var(--spacing-2xl);
          border-radius: var(--radius-lg);
          margin-top: var(--spacing-xl);
        }
        
        .section-title {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }
        
        .time-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }
        
        .time-card {
          background: var(--color-surface);
          padding: var(--spacing-xl);
          border-radius: var(--radius-md);
          text-align: center;
        }
        
        .time-icon {
          font-size: 2.5rem;
          margin-bottom: var(--spacing-md);
        }
        
        .time-card h3 {
          margin-bottom: var(--spacing-sm);
          font-family: 'Inter', sans-serif;
        }
        
        .time-card p {
          font-size: var(--font-size-xl);
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: var(--spacing-xs);
        }
        
        .time-card span {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
        }
        
        .time-note {
          background: var(--color-warning-light);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          color: var(--color-warning);
          text-align: center;
        }
        
        .emotional-support {
          margin-top: var(--spacing-xl);
        }
        
        .support-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-lg);
        }
        
        .support-card {
          background: var(--color-surface);
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
          border-left: 4px solid var(--color-success);
        }
        
        .support-card h3 {
          color: var(--color-success);
          margin-bottom: var(--spacing-sm);
          font-family: 'Inter', sans-serif;
        }
        
        .support-card p {
          margin: 0;
          color: var(--color-text-secondary);
          line-height: var(--line-height-relaxed);
        }
        
        .emergency-contacts {
          background: var(--color-secondary);
          padding: var(--spacing-2xl);
          border-radius: var(--radius-lg);
          margin-top: var(--spacing-xl);
        }
        
        .contacts-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--spacing-lg);
        }
        
        .contact-card {
          background: var(--color-surface);
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
          text-align: center;
        }
        
        .contact-card h3 {
          font-size: var(--font-size-md);
          margin-bottom: var(--spacing-sm);
          font-family: 'Inter', sans-serif;
        }
        
        .contact-number {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: var(--spacing-xs);
        }
        
        .contact-card p:last-child {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
          margin: 0;
        }
        
        @media (max-width: 768px) {
          .case-type-grid {
            grid-template-columns: 1fr;
          }
          
          .time-cards {
            grid-template-columns: 1fr;
          }
          
          .support-grid {
            grid-template-columns: 1fr;
          }
          
          .contacts-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .stage-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-md);
          }
          
          .stage-meta {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}