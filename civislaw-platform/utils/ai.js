/**
 * AIService - Hybrid AI Processing Service
 * Combines Cloud AI (online) with Local AI (offline) for document analysis
 */

import databaseService from './database';
import cryptoService from './crypto';

class AIService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.useCloudAI = true;
    this.localModelLoaded = false;
    
    // Set up online/offline listeners
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncOfflineData();
    });
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  /**
   * Initialize the AI service
   */
  async init(options = {}) {
    const { preferOffline = false } = options;
    
    if (preferOffline) {
      this.useCloudAI = false;
      await this.loadLocalModel();
    }
    
    // Listen for sync messages from service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', async (event) => {
        if (event.data.type === 'SYNC_COMPLETE') {
          console.log('[AIService] Sync complete, AI requests processed');
        }
      });
    }
    
    console.log('[AIService] Initialized');
    return true;
  }

  /**
   * Load local AI model for offline processing
   */
  async loadLocalModel() {
    if (this.localModelLoaded) return true;
    
    try {
      // In a full implementation, this would load TensorFlow.js or Transformers.js
      // For now, we'll use rule-based local processing
      console.log('[AIService] Loading local AI model...');
      
      // Simulate model loading
      this.localModelLoaded = true;
      console.log('[AIService] Local model loaded successfully');
      return true;
    } catch (error) {
      console.error('[AIService] Failed to load local model:', error);
      return false;
    }
  }

  /**
   * Analyze document - main entry point
   */
  async analyzeDocument(documentData, options = {}) {
    const { useEncryption = true, priority = 'balanced' } = options;
    
    if (!this.isOnline && !this.localModelLoaded) {
      // Queue for later processing
      return this.queueForOfflineAnalysis(documentData, options);
    }
    
    if (this.isOnline && this.useCloudAI) {
      // Try cloud AI first
      try {
        return await this.analyzeWithCloud(documentData, options);
      } catch (error) {
        console.warn('[AIService] Cloud AI failed, falling back to local:', error);
        // Fall back to local AI
        return this.analyzeWithLocal(documentData, options);
      }
    }
    
    // Use local AI
    return this.analyzeWithLocal(documentData, options);
  }

  /**
   * Analyze document using cloud AI
   */
  async analyzeWithCloud(documentData, options = {}) {
    const { documentText, documentType, language = 'en' } = documentData;
    
    // First, redact PII
    const sanitizedText = await this.redactPII(documentText);
    
    // Check cache for similar documents
    const cacheKey = await cryptoService.hash(sanitizedText.substring(0, 500));
    const cached = await databaseService.getCachedTranslation(cacheKey);
    if (cached) {
      console.log('[AIService] Found cached analysis');
      return cached;
    }
    
    // Call API (would be real API in production)
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        document: sanitizedText,
        language,
        documentType
      })
    });
    
    if (!response.ok) {
      throw new Error('Analysis failed');
    }
    
    const result = await response.json();
    
    // Cache the result
    if (result.success) {
      await databaseService.cacheTranslation(
        sanitizedText,
        JSON.stringify(result.data),
        language,
        'cached'
      );
    }
    
    return result.data;
  }

  /**
   * Analyze document using local AI (offline)
   */
  async analyzeWithLocal(documentData, options = {}) {
    const { documentText, documentType, language = 'en' } = documentData;
    
    console.log('[AIService] Running local document analysis');
    
    // Use rule-based analysis for offline mode
    const analysis = this.performRuleBasedAnalysis(documentText, documentType);
    
    // Add local context
    analysis.offlineMode = true;
    analysis.processedLocally = true;
    
    return analysis;
  }

  /**
   * Perform rule-based document analysis (offline)
   */
  performRuleBasedAnalysis(text, documentType) {
    const lowerText = text.toLowerCase();
    
    // Detect document type if not provided
    const detectedType = this.detectDocumentType(text, documentType);
    
    // Extract key entities
    const entities = this.extractEntities(text);
    
    // Generate summary
    const summary = this.generateSimpleSummary(text, detectedType);
    
    // Identify key legal terms
    const keyTerms = this.identifyLegalTerms(text);
    
    // Determine process impact
    const processImpact = this.determineProcessImpact(text, detectedType);
    
    return {
      documentType: detectedType,
      summary,
      keyTerms,
      processImpact,
      entities,
      confidence: 0.75, // Lower confidence for offline mode
      offlineMode: true
    };
  }

  /**
   * Detect document type from content
   */
  detectDocumentType(text, providedType) {
    if (providedType) return providedType;
    
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('first information report') || lowerText.includes('fir')) {
      return 'FIR';
    }
    if (lowerText.includes('charge') && lowerText.includes('sheet')) {
      return 'Charge Sheet';
    }
    if (lowerText.includes('summon')) {
      return 'Summons';
    }
    if (lowerText.includes('judgment') || lowerText.includes('order')) {
      return 'Court Order';
    }
    if (lowerText.includes('petition')) {
      return 'Petition';
    }
    if (lowerText.includes('complaint')) {
      return 'Complaint';
    }
    
    return 'Legal Document';
  }

  /**
   * Extract entities from text (names, dates, etc.)
   */
  extractEntities(text) {
    const entities = {
      dates: [],
      amounts: [],
      locations: [],
      sections: []
    };
    
    // Extract dates
    const datePatterns = [
      /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/g,
      /\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)/gi,
      /\d{4}-\d{2}-\d{2}/g
    ];
    
    datePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        entities.dates.push(...matches);
      }
    });
    
    // Extract monetary amounts
    const amountPattern = /Rs\.?\s*\d+[\d,\.]*/gi;
    const amounts = text.match(amountPattern);
    if (amounts) {
      entities.amounts.push(...amounts);
    }
    
    // Extract legal sections
    const sectionPattern = /Section\s+\d+[\w]+/gi;
    const sections = text.match(sectionPattern);
    if (sections) {
      entities.sections.push(...sections);
    }
    
    return entities;
  }

  /**
   * Generate simple summary (offline)
   */
  generateSimpleSummary(text, documentType) {
    const lowerText = text.toLowerCase();
    let summary = '';
    
    switch (documentType) {
      case 'FIR':
        if (lowerText.includes('dismiss')) {
          summary = 'This is a First Information Report that has been filed regarding an incident.';
        } else {
          summary = 'First Information Report registered for investigation.';
        }
        break;
      case 'Summons':
        if (lowerText.includes('appear')) {
          summary = 'You are being called to appear in court on a specified date.';
        } else {
          summary = 'Court summons requiring your response or appearance.';
        }
        break;
      case 'Court Order':
        if (lowerText.includes('dismiss') || lowerText.includes('dismissed')) {
          summary = 'The court has dismissed or rejected the petition/application.';
        } else if (lowerText.includes('allow') || lowerText.includes('granted')) {
          summary = 'The court has allowed or granted the petition/application.';
        } else {
          summary = 'A court order has been issued with specific directions.';
        }
        break;
      case 'Charge Sheet':
        summary = 'The police have filed charges against the accused person.';
        break;
      default:
        summary = 'This is a legal document that requires your attention.';
    }
    
    return summary;
  }

  /**
   * Identify key legal terms
   */
  identifyLegalTerms(text) {
    const lowerText = text.toLowerCase();
    const terms = [];
    
    const legalTermPatterns = [
      { term: 'Bailable', keywords: ['bailable'] },
      { term: 'Non-Bailable', keywords: ['non-bailable', 'nonbailable'] },
      { term: 'Cognizable', keywords: ['cognizable'] },
      { term: 'Non-Cognizable', keywords: ['non-cognizable', 'noncognizable'] },
      { term: 'Bail', keywords: ['bail', 'bond'] },
      { term: 'Adjournment', keywords: ['adjourn', 'adjournment'] },
      { term: 'Stay Order', keywords: ['stay', 'injunction'] },
      { term: 'Contempt', keywords: ['contempt'] },
      { term: 'Acquittal', keywords: ['acquitt'] },
      { term: 'Conviction', keywords: ['convict'] },
      { term: 'Remand', keywords: ['remand', 'custody'] },
      { term: 'Summons', keywords: ['summon'] },
      { term: 'Warrant', keywords: ['warrant'] }
    ];
    
    legalTermPatterns.forEach(({ term, keywords }) => {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        terms.push(term);
      }
    });
    
    return terms;
  }

  /**
   * Determine process impact
   */
  determineProcessImpact(text, documentType) {
    const lowerText = text.toLowerCase();
    let impact = '';
    
    if (lowerText.includes('dismiss') || lowerText.includes('dismissed')) {
      impact = 'The petition/application has been rejected. You may have the right to appeal within a specific timeframe.';
    } else if (lowerText.includes('adjourn')) {
      impact = 'The hearing has been postponed. Note the next date and appear accordingly.';
    } else if (lowerText.includes('summon')) {
      impact = 'You must appear in court on the specified date. Failure to appear may have legal consequences.';
    } else {
      impact = 'Please consult with a lawyer to understand the full implications of this document.';
    }
    
    return impact;
  }

  /**
   * Translate text - main entry point
   */
  async translateText(text, sourceLang, targetLang, options = {}) {
    if (!this.isOnline && !this.localModelLoaded) {
      return this.translateWithLocal(text, sourceLang, targetLang);
    }
    
    if (this.isOnline && this.useCloudAI) {
      try {
        return await this.translateWithCloud(text, sourceLang, targetLang);
      } catch (error) {
        console.warn('[AIService] Cloud translation failed, using local');
        return this.translateWithLocal(text, sourceLang, targetLang);
      }
    }
    
    return this.translateWithLocal(text, sourceLang, targetLang);
  }

  /**
   * Translate using cloud AI
   */
  async translateWithCloud(text, sourceLang, targetLang) {
    // Check cache first
    const hash = await cryptoService.hash(text);
    const cached = await databaseService.getCachedTranslation(hash);
    if (cached && cached.targetLang === targetLang) {
      const decrypted = this.isEncrypted 
        ? await cryptoService.decrypt(cached.translated)
        : cached.translated;
      return decrypted;
    }
    
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, sourceLang, targetLang })
    });
    
    if (!response.ok) {
      throw new Error('Translation failed');
    }
    
    const result = await response.json();
    
    // Cache the result
    await databaseService.cacheTranslation(text, result.data.translation, sourceLang, targetLang);
    
    return result.data.translation;
  }

  /**
   * Translate using local rules (offline)
   */
  translateWithLocal(text, sourceLang, targetLang) {
    console.log('[AIService] Using local translation');
    
    // Basic dictionary-based translation for common legal terms
    const legalTerms = {
      'court': { hi: 'न्यायालय', ta: 'நீதிமன்றம்', te: 'కోర్టు' },
      'hearing': { hi: 'सुनवाई', ta: 'விசாரணை', te: 'విచారణ' },
      'judgment': { hi: 'निर्णय', ta: 'தீர்ப்பு', te: 'తీర్పు' },
      'order': { hi: 'आदेश', ta: 'உத்தரவு', te: 'ఆదేశం' },
      'dismissed': { hi: 'खारिज', ta: 'தள்ளுபடி', te: 'తిరస్కరణ' },
      'summons': { hi: 'समन', ta: 'அழைப்பாணை', te: 'సమనం' },
      'objection': { hi: 'आपत्ति', ta: 'எதிர்ப்பு', te: 'ఆపత్తి' },
      'witness': { hi: 'गवाह', ta: 'சாட்சி', te: 'సాక్షి' },
      'evidence': { hi: 'साक्ष्य', ta: 'சான்று', te: 'సాక్ష్యం' },
      'defendant': { hi: 'प्रतिवादी', ta: 'பதில் சொல்லும்', te: 'ప్రతివాది' },
      'plaintiff': { hi: 'वादी', ta: 'வாதி', te: 'వాది' },
      'accused': { hi: 'आरोपी', ta: 'குற்றம் சாட்டப்பட்ட', te: 'ఆరోపితుడు' },
      'bail': { hi: 'जमानत', ta: 'கணக்கில்', te: 'బెయిల్' },
      'verdict': { hi: 'निर्णय', ta: 'தீர்ப்பு', te: 'వర్దిక్టు' }
    };
    
    let translated = text;
    Object.entries(legalTerms).forEach(([english, translations]) => {
      const regex = new RegExp(`\\b${english}\\b`, 'gi');
      if (translations[targetLang]) {
        translated = translated.replace(regex, translations[targetLang]);
      }
    });
    
    return translated;
  }

  /**
   * Transcribe audio - main entry point
   */
  async transcribeAudio(audioData, language, options = {}) {
    if (!this.isOnline) {
      return this.transcribeWithLocal(audioData, language);
    }
    
    try {
      return await this.transcribeWithCloud(audioData, language);
    } catch (error) {
      console.warn('[AIService] Cloud transcription failed, using local');
      return this.transcribeWithLocal(audioData, language);
    }
  }

  /**
   * Transcribe using cloud AI
   */
  async transcribeWithCloud(audioData, language) {
    const response = await fetch('/api/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioData, language })
    });
    
    if (!response.ok) {
      throw new Error('Transcription failed');
    }
    
    return await response.json();
  }

  /**
   * Transcribe using local Web Speech API
   */
  async transcribeWithLocal(audioData, language) {
    // Use Web Speech API for offline transcription
    return new Promise((resolve, reject) => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        reject(new Error('Speech recognition not supported'));
        return;
      }
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = this.getSpeechLang(language);
      recognition.continuous = true;
      recognition.interimResults = false;
      
      // For local transcription, we'd need to play the audio through
      // This is a simplified version - full implementation would use audio playback
      
      resolve({
        text: 'Audio transcription requires online processing for better accuracy.',
        confidence: 0.5,
        offlineMode: true
      });
    });
  }

  /**
   * Get speech API language code
   */
  getSpeechLang(lang) {
    const langMap = {
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'bn': 'bn-IN',
      'mr': 'mr-IN',
      'en': 'en-US'
    };
    return langMap[lang] || 'en-US';
  }

  /**
   * Redact PII before sending to cloud AI
   */
  async redactPII(text) {
    let redacted = text;
    
    // Patterns for PII
    const patterns = [
      // Aadhaar number pattern
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
      // Phone numbers
      /\b\d{10}\b/g,
      // Email addresses
      /\b[\w.-]+@[\w.-]+\.\w{2,}\b/gi,
      // PIN codes
      /\b\d{6}\b/g,
      // Names (simplified - would need NER in production)
      /\b([A-Z][a-z]+ [A-Z][a-z]+)\b/g
    ];
    
    patterns.forEach(pattern => {
      redacted = redacted.replace(pattern, '[REDACTED]');
    });
    
    return redacted;
  }

  /**
   * Queue document for offline analysis
   */
  async queueForOfflineAnalysis(documentData, options) {
    const queued = await databaseService.queueForSync({
      type: 'document-analysis',
      data: documentData,
      options
    });
    
    console.log('[AIService] Document queued for offline analysis');
    
    return {
      queued: true,
      message: 'Document analysis will complete when connection is restored',
      queueId: queued.id
    };
  }

  /**
   * Sync offline data when back online
   */
  async syncOfflineData() {
    console.log('[AIService] Syncing offline data...');
    
    const pendingItems = await databaseService.getPendingSyncItems();
    
    for (const item of pendingItems) {
      try {
        if (item.type === 'document-analysis') {
          const result = await this.analyzeWithCloud(item.data, item.options);
          await databaseService.markSyncComplete(item.id);
          console.log('[AIService] Synced document analysis');
        }
      } catch (error) {
        console.error('[AIService] Sync failed for item:', item.id);
        await databaseService.incrementSyncRetry(item.id);
      }
    }
  }

  /**
   * Get AI service status
   */
  getStatus() {
    return {
      isOnline: this.isOnline,
      cloudAIEnabled: this.useCloudAI,
      localModelLoaded: this.localModelLoaded
    };
  }
}

// Export as singleton
const aiService = new AIService();
export default aiService;

// Export class for testing
export { AIService };
