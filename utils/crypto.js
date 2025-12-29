/**
 * CryptoService - Privacy-by-Design Encryption Service
 * Uses Web Crypto API for AES-GCM encryption
 * Zero-knowledge architecture - keys never leave the client
 */

class CryptoService {
  constructor() {
    this.keyPair = null;
    this.sessionKey = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the crypto service
   * Generates or derives encryption keys
   */
  async init(options = {}) {
    const { passphrase, createNew = false } = options;
    
    try {
      if (createNew) {
        // Generate new key pair
        this.keyPair = await this.generateKeyPair();
      } else if (passphrase) {
        // Derive key from passphrase
        this.sessionKey = await this.deriveKeyFromPassphrase(passphrase);
      } else {
        // Try to load existing keys from IndexedDB
        this.keyPair = await this.loadKeyPair();
      }
      
      this.isInitialized = true;
      console.log('[CryptoService] Initialized successfully');
      return true;
    } catch (error) {
      console.error('[CryptoService] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Generate a new RSA key pair for asymmetric encryption
   */
  async generateKeyPair() {
    console.log('[CryptoService] Generating new key pair');
    
    return await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Derive an AES-GCM key from a passphrase using PBKDF2
   */
  async deriveKeyFromPassphrase(passphrase, salt = null) {
    const encoder = new TextEncoder();
    const passphraseBuffer = encoder.encode(passphrase);
    
    // Generate salt if not provided
    if (!salt) {
      salt = crypto.getRandomValues(new Uint8Array(16));
    }
    
    // Import passphrase as key material
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passphraseBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    
    // Derive AES key using PBKDF2
    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      {
        name: 'AES-GCM',
        length: 256
      },
      false,
      ['encrypt', 'decrypt']
    );
    
    return {
      key: derivedKey,
      salt: salt
    };
  }

  /**
   * Encrypt data using AES-GCM
   */
  async encrypt(plaintext, key = null) {
    try {
      const encryptionKey = key || this.sessionKey?.key;
      
      if (!encryptionKey) {
        throw new Error('No encryption key available');
      }
      
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify(plaintext));
      
      // Generate random IV
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Encrypt
      const encryptedData = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        encryptionKey,
        data
      );
      
      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encryptedData.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(encryptedData), iv.length);
      
      // Convert to base64 for storage
      return this.arrayBufferToBase64(combined);
    } catch (error) {
      console.error('[CryptoService] Encryption failed:', error);
      throw error;
    }
  }

  /**
   * Decrypt data using AES-GCM
   */
  async decrypt(encryptedBase64, key = null) {
    try {
      const decryptionKey = key || this.sessionKey?.key;
      
      if (!decryptionKey) {
        throw new Error('No decryption key available');
      }
      
      // Convert from base64
      const combined = this.base64ToArrayBuffer(encryptedBase64);
      
      // Extract IV and encrypted data
      const iv = combined.slice(0, 12);
      const encryptedData = combined.slice(12);
      
      // Decrypt
      const decryptedData = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        decryptionKey,
        encryptedData
      );
      
      // Decode and parse
      const decoder = new TextDecoder();
      return JSON.parse(decoder.decode(decryptedData));
    } catch (error) {
      console.error('[CryptoService] Decryption failed:', error);
      throw error;
    }
  }

  /**
   * Encrypt sensitive fields in an object
   */
  async encryptFields(obj, fieldsToEncrypt) {
    const encryptedObj = { ...obj };
    
    for (const field of fieldsToEncrypt) {
      if (encryptedObj[field]) {
        encryptedObj[field] = await this.encrypt(encryptedObj[field]);
      }
    }
    
    return encryptedObj;
  }

  /**
   * Decrypt sensitive fields in an object
   */
  async decryptFields(obj, fieldsToDecrypt) {
    const decryptedObj = { ...obj };
    
    for (const field of fieldsToDecrypt) {
      if (decryptedObj[field]) {
        decryptedObj[field] = await this.decrypt(decryptedObj[field]);
      }
    }
    
    return decryptedObj;
  }

  /**
   * Generate a secure random ID
   */
  generateSecureId() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Hash sensitive data (one-way)
   */
  async hash(data) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    return this.arrayBufferToBase64(hashBuffer);
  }

  /**
   * Export public key for sharing
   */
  async exportPublicKey() {
    if (!this.keyPair) {
      throw new Error('No key pair available');
    }
    
    const exported = await crypto.subtle.exportKey(
      'spki',
      this.keyPair.publicKey
    );
    return this.arrayBufferToBase64(exported);
  }

  /**
   * Import a public key
   */
  async importPublicKey(base64Key) {
    const keyBuffer = this.base64ToArrayBuffer(base64Key);
    
    return await crypto.subtle.importKey(
      'spki',
      keyBuffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
      },
      false,
      ['encrypt']
    );
  }

  /**
   * Encrypt using RSA (for key exchange)
   */
  async encryptRSA(plaintext, publicKey) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    
    return await crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP'
      },
      publicKey,
      data
    );
  }

  /**
   * Save key pair to IndexedDB
   */
  async saveKeyPair(keyPair) {
    const exportedPrivate = await crypto.subtle.exportKey(
      'pkcs8',
      keyPair.privateKey
    );
    const exportedPublic = await crypto.subtle.exportKey(
      'spki',
      keyPair.publicKey
    );
    
    const db = await this.openKeyDB();
    const transaction = db.transaction('keys', 'readwrite');
    const store = transaction.objectStore('keys');
    
    await store.put({
      id: 'civislaw-keypair',
      privateKey: this.arrayBufferToBase64(exportedPrivate),
      publicKey: this.arrayBufferToBase64(exportedPublic),
      created: Date.now()
    });
    
    this.keyPair = keyPair;
  }

  /**
   * Load key pair from IndexedDB
   */
  async loadKeyPair() {
    try {
      const db = await this.openKeyDB();
      const transaction = db.transaction('keys', 'readonly');
      const store = transaction.objectStore('keys');
      const request = store.get('civislaw-keypair');
      
      return new Promise((resolve, reject) => {
        request.onsuccess = async () => {
          const data = request.result;
          if (!data) {
            resolve(null);
            return;
          }
          
          const privateKey = await crypto.subtle.importKey(
            'pkcs8',
            this.base64ToArrayBuffer(data.privateKey),
            {
              name: 'RSA-OAEP',
              hash: 'SHA-256'
            },
            false,
            ['decrypt']
          );
          
          const publicKey = await crypto.subtle.importKey(
            'spki',
            this.base64ToArrayBuffer(data.publicKey),
            {
              name: 'RSA-OAEP',
              hash: 'SHA-256'
            },
            false,
            ['encrypt']
          );
          
          resolve({ privateKey, publicKey });
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('[CryptoService] Failed to load key pair:', error);
      return null;
    }
  }

  /**
   * Open IndexedDB for key storage
   */
  openKeyDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('CivisLawKeys', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('keys')) {
          db.createObjectStore('keys', { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * Clear all keys and data
   */
  async clearAll() {
    this.keyPair = null;
    this.sessionKey = null;
    this.isInitialized = false;
    
    // Clear IndexedDB
    const keyDB = await this.openKeyDB();
    const keyTx = keyDB.transaction('keys', 'readwrite');
    keyTx.objectStore('keys').clear();
    
    // Clear caches
    if ('caches' in self) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    
    console.log('[CryptoService] All keys and cache cleared');
  }

  /**
   * Utility: ArrayBuffer to Base64
   */
  arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Utility: Base64 to ArrayBuffer
   */
  base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

// Export as singleton
const cryptoService = new CryptoService();
export default cryptoService;

// Export class for testing
export { CryptoService };
