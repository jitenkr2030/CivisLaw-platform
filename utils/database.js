/**
 * DatabaseService - Offline-First Local Storage
 * Uses IndexedDB via Dexie.js wrapper for structured data storage
 */

import cryptoService from './crypto';

class DatabaseService {
  constructor() {
    this.db = null;
    this.dbName = 'CivisLawDatabase';
    this.dbVersion = 1;
    this.isEncrypted = false;
  }

  /**
   * Initialize the database
   */
  async init(encryptionEnabled = false) {
    try {
      this.db = await this.openDatabase();
      this.isEncrypted = encryptionEnabled;
      
      // Create indexes for better query performance
      await this.createIndexes();
      
      console.log('[DatabaseService] Initialized successfully');
      return true;
    } catch (error) {
      console.error('[DatabaseService] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Open IndexedDB
   */
  openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => {
        console.error('[DatabaseService] Failed to open database');
        reject(request.error);
      };
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Documents store
        if (!db.objectStoreNames.contains('documents')) {
          const docStore = db.createObjectStore('documents', { keyPath: 'id' });
          docStore.createIndex('type', 'type', { unique: false });
          docStore.createIndex('createdAt', 'createdAt', { unique: false });
          docStore.createIndex('caseId', 'caseId', { unique: false });
        }
        
        // Recordings store
        if (!db.objectStoreNames.contains('recordings')) {
          const recStore = db.createObjectStore('recordings', { keyPath: 'id' });
          recStore.createIndex('caseId', 'caseId', { unique: false });
          recStore.createIndex('createdAt', 'createdAt', { unique: false });
          recStore.createIndex('language', 'language', { unique: false });
        }
        
        // Transcripts store
        if (!db.objectStoreNames.contains('transcripts')) {
          const transStore = db.createObjectStore('transcripts', { keyPath: 'id' });
          transStore.createIndex('recordingId', 'recordingId', { unique: false });
          transStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
        
        // Cases store
        if (!db.objectStoreNames.contains('cases')) {
          const caseStore = db.createObjectStore('cases', { keyPath: 'id' });
          caseStore.createIndex('type', 'type', { unique: false });
          caseStore.createIndex('status', 'status', { unique: false });
          caseStore.createIndex('currentStage', 'currentStage', { unique: false });
          caseStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
        
        // Notes store
        if (!db.objectStoreNames.contains('notes')) {
          const noteStore = db.createObjectStore('notes', { keyPath: 'id' });
          noteStore.createIndex('caseId', 'caseId', { unique: false });
          noteStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
        
        // Translations cache store
        if (!db.objectStoreNames.contains('translations')) {
          const transCacheStore = db.createObjectStore('translations', { keyPath: 'id' });
          transCacheStore.createIndex('hash', 'hash', { unique: true });
          transCacheStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
        
        // Legal terms cache store
        if (!db.objectStoreNames.contains('legalTerms')) {
          const termsStore = db.createObjectStore('legalTerms', { keyPath: 'term' });
          termsStore.createIndex('category', 'category', { unique: false });
        }
        
        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
        
        // Sync queue store
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
          syncStore.createIndex('type', 'type', { unique: false });
          syncStore.createIndex('createdAt', 'createdAt', { unique: false });
          syncStore.createIndex('status', 'status', { unique: false });
        }
        
        console.log('[DatabaseService] Database schema created');
      };
    });
  }

  /**
   * Create additional indexes
   */
  async createIndexes() {
    // Indexes are created in onupgradeneeded
    return true;
  }

  // ==================== Document Operations ====================

  /**
   * Save a document
   */
  async saveDocument(doc) {
    const document = {
      ...doc,
      id: doc.id || cryptoService.generateSecureId(),
      createdAt: doc.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    if (this.isEncrypted) {
      // Encrypt sensitive content
      const encrypted = await cryptoService.encryptFields(document, ['content', 'extractedText']);
      await this.put('documents', encrypted);
      return encrypted;
    }

    await this.put('documents', document);
    return document;
  }

  /**
   * Get a document by ID
   */
  async getDocument(id) {
    const doc = await this.get('documents', id);
    if (doc && this.isEncrypted) {
      return await cryptoService.decryptFields(doc, ['content', 'extractedText']);
    }
    return doc;
  }

  /**
   * Get all documents
   */
  async getAllDocuments() {
    const docs = await this.getAll('documents');
    if (this.isEncrypted) {
      return Promise.all(
        docs.map(async (doc) => {
          try {
            return await cryptoService.decryptFields(doc, ['content', 'extractedText']);
          } catch (e) {
            return doc; // Return partially decrypted if error
          }
        })
      );
    }
    return docs;
  }

  /**
   * Get documents by case ID
   */
  async getDocumentsByCase(caseId) {
    const docs = await this.getByIndex('documents', 'caseId', caseId);
    if (this.isEncrypted) {
      return Promise.all(
        docs.map(async (doc) => {
          try {
            return await cryptoService.decryptFields(doc, ['content', 'extractedText']);
          } catch (e) {
            return doc;
          }
        })
      );
    }
    return docs;
  }

  // ==================== Recording Operations ====================

  /**
   * Save a recording
   */
  async saveRecording(recording) {
    const record = {
      ...recording,
      id: recording.id || cryptoService.generateSecureId(),
      createdAt: recording.createdAt || Date.now(),
      synced: false
    };

    if (this.isEncrypted) {
      const encrypted = await cryptoService.encryptFields(record, ['audioData']);
      await this.put('recordings', encrypted);
      return encrypted;
    }

    await this.put('recordings', record);
    return record;
  }

  /**
   * Get a recording by ID
   */
  async getRecording(id) {
    const recording = await this.get('recordings', id);
    if (recording && this.isEncrypted) {
      return await cryptoService.decryptFields(recording, ['audioData']);
    }
    return recording;
  }

  /**
   * Get all recordings
   */
  async getAllRecordings() {
    const recordings = await this.getAll('recordings');
    if (this.isEncrypted) {
      return Promise.all(
        recordings.map(async (rec) => {
          try {
            return await cryptoService.decryptFields(rec, ['audioData']);
          } catch (e) {
            return rec;
          }
        })
      );
    }
    return recordings;
  }

  // ==================== Case Operations ====================

  /**
   * Save a case
   */
  async saveCase(caseData) {
    const caseItem = {
      ...caseData,
      id: caseData.id || cryptoService.generateSecureId(),
      createdAt: caseData.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    if (this.isEncrypted) {
      const encrypted = await cryptoService.encryptFields(caseItem, ['notes', 'details']);
      await this.put('cases', encrypted);
      return encrypted;
    }

    await this.put('cases', caseItem);
    return caseItem;
  }

  /**
   * Get a case by ID
   */
  async getCase(id) {
    const caseItem = await this.get('cases', id);
    if (caseItem && this.isEncrypted) {
      return await cryptoService.decryptFields(caseItem, ['notes', 'details']);
    }
    return caseItem;
  }

  /**
   * Get all cases
   */
  async getAllCases() {
    const cases = await this.getAll('cases');
    if (this.isEncrypted) {
      return Promise.all(
        cases.map(async (c) => {
          try {
            return await cryptoService.decryptFields(c, ['notes', 'details']);
          } catch (e) {
            return c;
          }
        })
      );
    }
    return cases;
  }

  /**
   * Update case stage
   */
  async updateCaseStage(id, stage) {
    const caseItem = await this.getCase(id);
    if (caseItem) {
      caseItem.currentStage = stage;
      caseItem.updatedAt = Date.now();
      return await this.saveCase(caseItem);
    }
    return null;
  }

  // ==================== Notes Operations ====================

  /**
   * Save a note
   */
  async saveNote(note) {
    const noteItem = {
      ...note,
      id: note.id || cryptoService.generateSecureId(),
      createdAt: note.createdAt || Date.now()
    };

    if (this.isEncrypted) {
      const encrypted = await cryptoService.encryptFields(noteItem, ['content']);
      await this.put('notes', encrypted);
      return encrypted;
    }

    await this.put('notes', noteItem);
    return noteItem;
  }

  /**
   * Get notes by case ID
   */
  async getNotesByCase(caseId) {
    const notes = await this.getByIndex('notes', 'caseId', caseId);
    if (this.isEncrypted) {
      return Promise.all(
        notes.map(async (n) => {
          try {
            return await cryptoService.decryptFields(n, ['content']);
          } catch (e) {
            return n;
          }
        })
      );
    }
    return notes;
  }

  // ==================== Translation Cache Operations ====================

  /**
   * Get cached translation
   */
  async getCachedTranslation(hash) {
    return await this.getByIndex('translations', 'hash', hash);
  }

  /**
   * Save translation to cache
   */
  async cacheTranslation(original, translated, sourceLang, targetLang) {
    const hash = await cryptoService.hash(original);
    const translation = {
      id: hash,
      hash: hash,
      original: this.isEncrypted ? (await cryptoService.encrypt(original)) : original,
      translated: this.isEncrypted ? (await cryptoService.encrypt(translated)) : translated,
      sourceLang,
      targetLang,
      createdAt: Date.now()
    };
    await this.put('translations', translation);
    return translation;
  }

  // ==================== Legal Terms Operations ====================

  /**
   * Save legal term
   */
  async saveLegalTerm(term) {
    await this.put('legalTerms', {
      ...term,
      cachedAt: Date.now()
    });
  }

  /**
   * Get legal term by term name
   */
  async getLegalTerm(termName) {
    return await this.get('legalTerms', termName.toLowerCase());
  }

  /**
   * Get all legal terms by category
   */
  async getLegalTermsByCategory(category) {
    return await this.getByIndex('legalTerms', 'category', category);
  }

  /**
   * Initialize legal terms (for offline use)
   */
  async initializeLegalTerms(terms) {
    const tx = this.db.transaction('legalTerms', 'readwrite');
    const store = tx.objectStore('legalTerms');
    
    for (const term of terms) {
      await store.put({
        ...term,
        term: term.term.toLowerCase(),
        cachedAt: Date.now()
      });
    }
    
    console.log(`[DatabaseService] Initialized ${terms.length} legal terms`);
  }

  // ==================== Settings Operations ====================

  /**
   * Get a setting
   */
  async getSetting(key) {
    const setting = await this.get('settings', key);
    return setting?.value;
  }

  /**
   * Save a setting
   */
  async saveSetting(key, value) {
    await this.put('settings', { key, value, updatedAt: Date.now() });
  }

  // ==================== Sync Queue Operations ====================

  /**
   * Add item to sync queue
   */
  async queueForSync(item) {
    const queueItem = {
      ...item,
      status: 'pending',
      createdAt: Date.now(),
      retryCount: 0
    };
    await this.put('syncQueue', queueItem);
    return queueItem;
  }

  /**
   * Get pending sync items
   */
  async getPendingSyncItems() {
    return await this.getByIndex('syncQueue', 'status', 'pending');
  }

  /**
   * Mark sync item as complete
   */
  async markSyncComplete(id) {
    const item = await this.get('syncQueue', id);
    if (item) {
      item.status = 'completed';
      item.completedAt = Date.now();
      await this.put('syncQueue', item);
    }
  }

  /**
   * Update sync item retry count
   */
  async incrementSyncRetry(id) {
    const item = await this.get('syncQueue', id);
    if (item) {
      item.retryCount++;
      item.lastRetry = Date.now();
      await this.put('syncQueue', item);
    }
  }

  // ==================== Generic Operations ====================

  /**
   * Generic put operation
   */
  async put(storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onsuccess = () => resolve(data);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Generic get operation
   */
  async get(storeName, id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Generic getAll operation
   */
  async getAll(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Generic getByIndex operation
   */
  async getByIndex(storeName, indexName, value) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Generic delete operation
   */
  async delete(storeName, id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all data in a store
   */
  async clear(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get storage estimate
   */
  async getStorageEstimate() {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage,
        quota: estimate.quota,
        usagePercentage: ((estimate.usage / estimate.quota) * 100).toFixed(2)
      };
    }
    return null;
  }

  /**
   * Clear all data (for privacy reset)
   */
  async clearAll() {
    const storeNames = ['documents', 'recordings', 'transcripts', 'cases', 'notes', 'translations', 'legalTerms', 'syncQueue'];
    
    for (const storeName of storeNames) {
      await this.clear(storeName);
    }
    
    console.log('[DatabaseService] All data cleared');
  }
}

// Export as singleton
const databaseService = new DatabaseService();
export default databaseService;

// Export class for testing
export { DatabaseService };
