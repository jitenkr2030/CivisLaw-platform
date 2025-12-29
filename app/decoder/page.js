'use client';

import { useState } from 'react';
import { useLanguage } from '../../utils/LanguageContext';
import { t as getTranslation } from '../../utils/i18n';

export default function DecoderPage() {
  const { language } = useLanguage();
  const t = (key) => getTranslation(key, language);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchedTerm, setSearchedTerm] = useState(null);
  const [recentSearches, setRecentSearches] = useState(['Bailable', 'Adjournment', 'Cognizable']);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const legalTerms = [
    {
      term: 'Adjournment',
      meaning: 'When the court stops proceedings and schedules the next hearing for another day',
      example: 'The judge announced an adjournment until next Monday.',
      category: 'procedure',
      related: ['Hearing', 'Trial', 'Date']
    },
    {
      term: 'Bailable Offense',
      meaning: 'A crime where the accused person can get bail (be released from jail) easily by paying money',
      example: 'Traffic violations are usually bailable offenses.',
      category: 'bail',
      related: ['Bail', 'Non-Bailable', 'Bond']
    },
    {
      term: 'Non-Bailable Offense',
      meaning: 'A serious crime where getting bail is difficult and the judge decides case by case',
      example: 'Murder and rape are typically non-bailable offenses.',
      category: 'bail',
      related: ['Bail', 'Bailable', 'Remand']
    },
    {
      term: 'Cognizable Offense',
      meaning: 'A crime where the police can arrest someone without needing a court warrant first',
      example: 'Theft and assault are cognizable offenses.',
      category: 'crime',
      related: ['FIR', 'Police', 'Arrest']
    },
    {
      term: 'Non-Cognizable Offense',
      meaning: 'A minor crime where the police need a court warrant before making an arrest',
      example: 'Most disputes between neighbors are non-cognizable.',
      category: 'crime',
      related: ['Magistrate', 'Complaint', 'Summons']
    },
    {
      term: 'Stay Order',
      meaning: 'A court order that temporarily stops or pauses an action or decision',
      example: 'The court issued a stay order on the demolition.',
      category: 'order',
      related: ['injunction', 'Restraining Order', 'Interim Relief']
    },
    {
      term: 'Plaintiff',
      meaning: 'The person who starts a court case by filing a complaint against someone else',
      example: 'The plaintiff filed a case against the builder.',
      category: 'parties',
      related: ['Petitioner', 'Defendant', 'Respondent']
    },
    {
      term: 'Defendant',
      meaning: 'The person who is being sued or accused in a court case',
      example: 'The defendant denied all the allegations.',
      category: 'parties',
      related: ['Plaintiff', 'Accused', 'Respondent']
    },
    {
      term: 'Petitioner',
      meaning: 'The person who makes a request or application to the court',
      example: 'The petitioner sought legal aid from the court.',
      category: 'parties',
      related: ['Applicant', 'Plaintiff', 'Respondent']
    },
    {
      term: 'Respondent',
      meaning: 'The person who responds to a case or petition filed against them',
      example: 'The respondent was given time to file a reply.',
      category: 'parties',
      related: ['Defendant', 'Petitioner', 'Accused']
    },
    {
      term: 'FIR',
      meaning: 'First Information Report - the first written record of a crime, filed by the police',
      example: 'The police registered an FIR for the theft.',
      category: 'documents',
      related: ['Complaint', 'Police', 'Cognizable']
    },
    {
      term: 'Charge Sheet',
      meaning: 'A document that lists all the charges (accusations) against the accused person',
      example: 'The police submitted the charge sheet in court.',
      category: 'documents',
      related: ['Accused', 'Charges', 'Prosecution']
    },
    {
      term: 'Summons',
      meaning: 'A court order requiring someone to appear in court on a specific date',
      example: 'The witness received a summons to testify.',
      category: 'order',
      related: ['Notice', 'Appearance', 'Subpoena']
    },
    {
      term: ' Warrant',
      meaning: 'A court document that authorizes the police to arrest someone or search a place',
      example: 'The court issued a warrant for the accused arrest.',
      category: 'order',
      related: ['Arrest', 'Search', 'Bail']
    },
    {
      term: 'Contempt of Court',
      meaning: 'Disobeying the court or showing disrespect to the judge',
      example: 'He was charged with contempt of court for not following orders.',
      category: 'offense',
      related: ['Punishment', 'Court', 'Authority']
    },
    {
      term: 'Acquittal',
      meaning: 'When the court finds the accused person NOT GUILTY and clears them',
      example: 'The verdict was acquittal due to lack of evidence.',
      category: 'verdict',
      related: ['Verdict', 'Not Guilty', 'Discharge']
    },
    {
      term: 'Conviction',
      meaning: 'When the court finds the accused person GUILTY of the crime',
      example: 'The conviction led to a sentence of 5 years.',
      category: 'verdict',
      related: ['Verdict', 'Guilty', 'Sentence']
    },
    {
      term: 'Bail',
      meaning: 'Temporary release of an accused person from custody with or without conditions',
      example: 'The lawyer applied for bail on medical grounds.',
      category: 'bail',
      related: ['Bailable', 'Surety', 'Bond']
    },
    {
      term: 'Surety',
      meaning: 'A person who promises to pay money if the accused person does not come to court',
      example: 'The surety signed the bail bond.',
      category: 'bail',
      related: ['Bail', 'Guarantor', 'Bond']
    },
    {
      term: 'Remand',
      meaning: 'Keeping an accused person in custody while the case is being investigated',
      example: 'The accused was sent to judicial remand.',
      category: 'custody',
      related: ['Custody', 'Judicial', 'Investigation']
    },
    {
      term: 'Plea Bargaining',
      meaning: 'An agreement where the accused admits guilt for a lesser charge to avoid a full trial',
      example: 'He opted for plea bargaining to get a reduced sentence.',
      category: 'procedure',
      related: ['Plea', 'Admission', 'Settlement']
    },
    {
      term: 'Evidence',
      meaning: 'Anything presented in court to prove or disprove a fact (documents, witnesses, etc.)',
      example: 'The CCTV footage was submitted as evidence.',
      category: 'procedure',
      related: ['Witness', 'Document', 'Proof']
    },
    {
      term: 'Witness',
      meaning: 'A person who testifies in court about what they saw, heard, or know',
      example: 'Three witnesses were called to testify.',
      category: 'parties',
      related: ['Testimony', 'Evidence', 'Statement']
    },
    {
      term: 'Affidavit',
      meaning: 'A written statement confirmed by oath, used as evidence in court',
      example: 'She submitted an affidavit stating her version of events.',
      category: 'documents',
      related: ['Statement', 'Oath', 'Declaration']
    },
    {
      term: 'Jurisdiction',
      meaning: 'The authority of a court to hear and decide cases in a particular area',
      example: 'This case falls under the jurisdiction of the district court.',
      category: 'court',
      related: ['Court', 'Authority', 'Territory']
    },
    {
      term: 'Plaintiff',
      meaning: 'The person who starts a civil case by filing a complaint against someone else',
      example: 'The plaintiff sought compensation for damages.',
      category: 'parties',
      related: ['Complaint', 'Defendant', 'Compensation']
    },
    {
      term: 'Ex-Parte',
      meaning: 'When the court makes a decision without hearing one party (usually when they dont appear)',
      example: 'The court passed an ex-parte order.',
      category: 'procedure',
      related: ['Order', 'Appearance', 'Absent']
    },
    {
      term: 'Injunction',
      meaning: 'A court order telling someone to do or not do something',
      example: 'The court granted an injunction against construction.',
      category: 'order',
      related: ['Stay Order', 'Restraining Order', 'Court Order']
    },
    {
      term: 'Locus Standi',
      meaning: 'The legal right to appear in court and speak on a matter',
      example: 'The organization lacked locus standi in the case.',
      category: 'procedure',
      related: ['Right', 'Standing', 'Appearance']
    },
    {
      term: 'Quash',
      meaning: 'To cancel or nullify an order or case officially',
      example: 'The High Court quashed the lower court order.',
      category: 'order',
      related: ['Cancel', 'Nullify', 'Dismiss']
    }
  ];

  const categories = [
    { id: 'all', name: t('decoder.allTerms') },
    { id: 'procedure', name: t('decoder.courtProcedures') },
    { id: 'bail', name: t('decoder.bailCustody') },
    { id: 'crime', name: t('decoder.typesCrimes') },
    { id: 'order', name: t('decoder.courtOrders') },
    { id: 'parties', name: t('decoder.peopleInvolved') },
    { id: 'documents', name: t('decoder.legalDocuments') },
    { id: 'verdict', name: t('decoder.verdictsOutcomes') },
    { id: 'court', name: t('decoder.courtStructure') }
  ];

  const handleSearch = (term) => {
    const found = legalTerms.find(t => 
      t.term.toLowerCase().includes(term.toLowerCase())
    );
    setSearchedTerm(found || null);
    setSearchTerm(term);
    
    if (found && !recentSearches.includes(found.term)) {
      setRecentSearches(prev => [found.term, ...prev.slice(0, 4)]);
    }
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const filteredTerms = selectedCategory === 'all' 
    ? legalTerms 
    : legalTerms.filter(t => t.category === selectedCategory);

  const getRandomTerm = () => {
    const random = legalTerms[Math.floor(Math.random() * legalTerms.length)];
    handleSearch(random.term);
  };

  return (
    <div className="decoder-page">
      <div className="container">
        {/* Page Header */}
        <header className="page-header">
          <h1>{t('decoder.title')}</h1>
          <p className="page-description">
            {t('decoder.description')}
          </p>
        </header>

        {/* Search Section */}
        <div className="card search-card">
          <h2 className="search-title">{t('decoder.searchTitle')}</h2>
          <div className="search-input-group">
            <input
              type="text"
              className="form-input search-input"
              placeholder={t('decoder.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              aria-label="Search legal terms"
            />
            <button 
              className="btn btn-primary"
              onClick={() => getRandomTerm()}
            >
              🎲 {t('decoder.randomButton')}
            </button>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="recent-searches">
              <span className="recent-label">{t('decoder.recentLabel')}</span>
              {recentSearches.map((term, index) => (
                <button
                  key={index}
                  className="recent-tag"
                  onClick={() => handleSearch(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Result */}
        {searchedTerm && (
          <div className="card result-card">
            <div className="result-header">
              <h2 className="result-term">{searchedTerm.term}</h2>
              <span className={`category-badge ${searchedTerm.category}`}>
                {categories.find(c => c.id === searchedTerm.category)?.name}
              </span>
            </div>
            
            <div className="result-section">
              <h3>📝 {t('decoder.explanationLabel')}</h3>
              <p className="result-meaning">{searchedTerm.meaning}</p>
            </div>
            
            <div className="result-section">
              <h3>💡 {t('decoder.exampleLabel')}</h3>
              <p className="result-example">{searchedTerm.example}</p>
            </div>
            
            {searchedTerm.related && (
              <div className="result-section">
                <h3>🔗 {t('decoder.relatedLabel')}</h3>
                <div className="related-tags">
                  {searchedTerm.related.map((related, index) => (
                    <button
                      key={index}
                      className="related-tag"
                      onClick={() => handleSearch(related)}
                    >
                      {related}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Category Filter */}
        <div className="category-filter">
          <h3>{t('decoder.browseCategory')}</h3>
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryFilter(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Terms Grid */}
        <div className="terms-grid">
          {filteredTerms.map((item, index) => (
            <button
              key={index}
              className="term-card"
              onClick={() => handleSearch(item.term)}
            >
              <h3 className="term-name">{item.term}</h3>
              <p className="term-meaning">{item.meaning}</p>
              <span className="term-category">{categories.find(c => c.id === item.category)?.name}</span>
            </button>
          ))}
        </div>

        {/* Quick Reference */}
        <section className="quick-reference">
          <h2 className="section-title">📚 {t('decoder.quickReferenceTitle')}</h2>
          <div className="quick-grid">
            <div className="quick-card">
              <h3>{t('decoder.bailRelated')}</h3>
              <ul>
                <li><strong>Bail:</strong> Temporary release from jail with conditions</li>
                <li><strong>Bailable:</strong> Easy to get bail</li>
                <li><strong>Non-Bailable:</strong> Hard to get bail</li>
                <li><strong>Surety:</strong> Person who guarantees you will return to court</li>
              </ul>
            </div>
            <div className="quick-card">
              <h3>{t('decoder.crimeRelated')}</h3>
              <ul>
                <li><strong>Cognizable:</strong> Police can arrest without warrant</li>
                <li><strong>Non-Cognizable:</strong> Police need warrant to arrest</li>
                <li><strong>FIR:</strong> First report of a crime to police</li>
                <li><strong>Charge Sheet:</strong> List of accusations against accused</li>
              </ul>
            </div>
            <div className="quick-card">
              <h3>{t('decoder.courtProcess')}</h3>
              <ul>
                <li><strong>Adjournment:</strong> Postponement to another date</li>
                <li><strong>Summons:</strong> Order to appear in court</li>
                <li><strong>Witness:</strong> Person who testifies about what they know</li>
                <li><strong>Evidence:</strong> Proof presented in court</li>
              </ul>
            </div>
            <div className="quick-card">
              <h3>{t('decoder.peopleInCourt')}</h3>
              <ul>
                <li><strong>Plaintiff:</strong> Person who starts the case</li>
                <li><strong>Defendant:</strong> Person case is against</li>
                <li><strong>Petitioner:</strong> Person making a request to court</li>
                <li><strong>Respondent:</strong> Person responding to the case</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Download Card */}
        <section className="download-section">
          <div className="download-card">
            <div className="download-icon">📖</div>
            <div className="download-content">
              <h3>{t('decoder.downloadTitle')}</h3>
              <p>{t('decoder.downloadDescription')}</p>
            </div>
            <button className="btn btn-primary">
              📥 {t('decoder.downloadButton')}
            </button>
          </div>
        </section>
      </div>

      <style jsx>{`
        .decoder-page {
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
        
        .search-card {
          margin-bottom: var(--spacing-xl);
        }
        
        .search-title {
          font-size: var(--font-size-lg);
          margin-bottom: var(--spacing-md);
          text-align: center;
        }
        
        .search-input-group {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }
        
        .search-input {
          flex: 1;
        }
        
        .recent-searches {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }
        
        .recent-label {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
        }
        
        .recent-tag {
          padding: var(--spacing-xs) var(--spacing-sm);
          background: var(--color-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          font-size: var(--font-size-xs);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        
        .recent-tag:hover {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }
        
        .result-card {
          margin-bottom: var(--spacing-xl);
          border-left: 4px solid var(--color-primary);
        }
        
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
          padding-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--color-border);
        }
        
        .result-term {
          font-size: var(--font-size-2xl);
          color: var(--color-primary);
          margin: 0;
        }
        
        .category-badge {
          padding: var(--spacing-xs) var(--spacing-sm);
          background: var(--color-secondary);
          border-radius: var(--radius-full);
          font-size: var(--font-size-xs);
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .result-section {
          margin-bottom: var(--spacing-lg);
        }
        
        .result-section h3 {
          font-size: var(--font-size-md);
          margin-bottom: var(--spacing-sm);
          font-family: 'Inter', sans-serif;
        }
        
        .result-meaning {
          font-size: var(--font-size-md);
          line-height: var(--line-height-relaxed);
          margin: 0;
        }
        
        .result-example {
          background: var(--color-secondary);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          margin: 0;
          font-style: italic;
        }
        
        .related-tags {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }
        
        .related-tag {
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: var(--radius-full);
          font-size: var(--font-size-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        
        .related-tag:hover {
          background: var(--color-primary-dark);
        }
        
        .category-filter {
          margin-bottom: var(--spacing-xl);
        }
        
        .category-filter h3 {
          font-size: var(--font-size-lg);
          margin-bottom: var(--spacing-md);
        }
        
        .category-buttons {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }
        
        .category-btn {
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--color-secondary);
          border: 2px solid transparent;
          border-radius: var(--radius-full);
          font-size: var(--font-size-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        
        .category-btn:hover {
          background: var(--color-secondary-dark);
        }
        
        .category-btn.active {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }
        
        .terms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }
        
        .term-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
          text-align: left;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        
        .term-card:hover {
          border-color: var(--color-primary);
          box-shadow: var(--shadow-md);
        }
        
        .term-name {
          font-size: var(--font-size-lg);
          color: var(--color-primary);
          margin-bottom: var(--spacing-sm);
          font-family: 'Inter', sans-serif;
        }
        
        .term-meaning {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-md);
          line-height: var(--line-height-relaxed);
        }
        
        .term-category {
          font-size: var(--font-size-xs);
          color: var(--color-text-muted);
          text-transform: uppercase;
        }
        
        .quick-reference {
          background: var(--color-secondary);
          padding: var(--spacing-2xl);
          border-radius: var(--radius-lg);
          margin-bottom: var(--spacing-xl);
        }
        
        .section-title {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }
        
        .quick-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-lg);
        }
        
        .quick-card {
          background: var(--color-surface);
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
        }
        
        .quick-card h3 {
          font-size: var(--font-size-md);
          margin-bottom: var(--spacing-md);
          color: var(--color-primary);
          font-family: 'Inter', sans-serif;
        }
        
        .quick-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .quick-card li {
          padding: var(--spacing-sm) 0;
          border-bottom: 1px solid var(--color-border);
          font-size: var(--font-size-sm);
        }
        
        .quick-card li:last-child {
          border-bottom: none;
        }
        
        .quick-card strong {
          color: var(--color-primary);
        }
        
        .download-section {
          margin-top: var(--spacing-xl);
        }
        
        .download-card {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
          background: var(--color-primary);
          color: white;
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
        }
        
        .download-icon {
          font-size: 3rem;
        }
        
        .download-content {
          flex: 1;
        }
        
        .download-content h3 {
          color: white;
          margin-bottom: var(--spacing-xs);
        }
        
        .download-content p {
          margin: 0;
          opacity: 0.9;
        }
        
        .download-card .btn {
          background: white;
          color: var(--color-primary);
        }
        
        .download-card .btn:hover {
          background: var(--color-secondary);
        }
        
        @media (max-width: 768px) {
          .search-input-group {
            flex-direction: column;
          }
          
          .result-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-md);
          }
          
          .quick-grid {
            grid-template-columns: 1fr;
          }
          
          .download-card {
            flex-direction: column;
            text-align: center;
          }
          
          .category-buttons {
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: var(--spacing-sm);
          }
          
          .category-btn {
            flex-shrink: 0;
          }
        }
      `}</style>
    </div>
  );
}