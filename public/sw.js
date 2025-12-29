/**
 * CivisLaw Service Worker
 * Handles offline caching, background sync, and push notifications
 */

const CACHE_NAME = 'civislaw-v1';
const OFFLINE_PAGE = '/offline.html';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/document-explainer.html',
  '/recorder.html',
  '/translator.html',
  '/decoder.html',
  '/timeline.html',
  '/manifest.json',
  '/styles/globals.css'
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Precaching app shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[ServiceWorker] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log('[ServiceWorker] Removing old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[ServiceWorker] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    // For AI API calls, use network first with offline fallback
    if (url.pathname.startsWith('/api/')) {
      event.respondWith(networkFirstWithOfflineFallback(request));
    }
    return;
  }

  // For navigation requests, use network first
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful response
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => {
          // Return cached page or offline fallback
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              return caches.match(OFFLINE_PAGE) || new Response('Offline', { status: 503 });
            });
        })
    );
    return;
  }

  // For API requests, use network first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  // For static assets, use cache first, fall back to network
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached response and update cache in background
          fetch(request)
            .then((response) => {
              if (response && response.status === 200) {
                caches.open(CACHE_NAME)
                  .then((cache) => cache.put(request, response));
              }
            })
            .catch(() => {});
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(request, responseClone));
            }
            return response;
          })
          .catch(() => {
            // Return offline fallback for images and scripts
            if (request.destination === 'image') {
              return caches.match('/images/icon-192x192.png');
            }
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// Network first with offline fallback strategy
async function networkFirstWithOfflineFallback(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[ServiceWorker] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // For AI requests, queue for background sync
    if (request.url.includes('/api/')) {
      await queueAIRequest(request);
      return new Response(JSON.stringify({
        queued: true,
        message: 'Request queued for when connection is restored'
      }), {
        status: 202,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Queue AI requests for background sync
async function queueAIRequest(request) {
  try {
    const db = await openRequestDB();
    const requestData = await request.clone().text();
    
    const transaction = db.transaction('queued-requests', 'readwrite');
    const store = transaction.objectStore('queued-requests');
    
    await store.add({
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: requestData,
      timestamp: Date.now()
    });
    
    // Register for background sync
    if ('sync' in self.registration) {
      await self.registration.sync.register('sync-ai-requests');
    }
    
    // Notify clients
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'REQUEST_QUEUED',
        message: 'Request saved for when connection is restored'
      });
    });
    
    console.log('[ServiceWorker] AI request queued');
  } catch (error) {
    console.error('[ServiceWorker] Failed to queue request:', error);
  }
}

// IndexedDB for queued requests
function openRequestDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CivisLawRequests', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('queued-requests')) {
        db.createObjectStore('queued-requests', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Sync event:', event.tag);
  
  if (event.tag === 'sync-ai-requests') {
    event.waitUntil(syncQueuedRequests());
  }
});

// Sync queued requests when back online
async function syncQueuedRequests() {
  console.log('[ServiceWorker] Syncing queued requests');
  
  try {
    const db = await openRequestDB();
    const transaction = db.transaction('queued-requests', 'readwrite');
    const store = transaction.objectStore('queued-requests');
    const request = store.getAll();
    
    request.onsuccess = async () => {
      const queuedRequests = request.result;
      
      for (const queued of queuedRequests) {
        try {
          const response = await fetch(queued.url, {
            method: queued.method,
            headers: queued.headers,
            body: queued.body
          });
          
          if (response.ok) {
            // Remove from queue on success
            const deleteTx = db.transaction('queued-requests', 'readwrite');
            const deleteStore = deleteTx.objectStore('queued-requests');
            deleteStore.delete(queued.id);
            
            // Notify clients
            const clients = await self.clients.matchAll();
            clients.forEach(client => {
              client.postMessage({
                type: 'SYNC_COMPLETE',
                message: 'Request completed successfully'
              });
            });
          }
        } catch (error) {
          console.error('[ServiceWorker] Sync failed for request:', error);
        }
      }
    };
  } catch (error) {
    console.error('[ServiceWorker] Sync error:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push received');
  
  let data = {
    title: 'CivisLaw Update',
    body: 'You have a new notification',
    icon: '/images/icon-192x192.png',
    badge: '/images/icon-72x72.png'
  };
  
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      vibrate: [200, 100, 200],
      tag: 'civislaw-notification',
      requireInteraction: true
    })
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification clicked');
  event.notification.close();
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // Focus existing window if available
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
      })
  );
});

// Message handling from main app
self.addEventListener('message', (event) => {
  console.log('[ServiceWorker] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CACHE_CUSTOM_ASSETS') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(event.data.assets))
    );
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => caches.delete(cacheName))
          );
        })
    );
  }
});

console.log('[ServiceWorker] Service Worker loaded');
