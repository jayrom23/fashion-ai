/**
 * Enhanced storage service that uses IndexedDB for large data and localStorage as fallback
 * Helps prevent quota exceeded errors when storing large images
 */
class StorageService {
  constructor() {
    this.dbName = 'ai-fashion-editor';
    this.versionStoreName = 'versions';
    this.db = null;
    this.maxVersions = 20; // Maximum number of versions to keep
    this.isIndexedDBSupported = this._checkIndexedDBSupport();
    
    if (this.isIndexedDBSupported) {
      this._initDatabase();
    }
  }
  
  // Check if IndexedDB is supported
  _checkIndexedDBSupport() {
    return 'indexedDB' in window;
  }
  
  // Initialize IndexedDB
  _initDatabase() {
    const request = indexedDB.open(this.dbName, 1);
    
    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      this.isIndexedDBSupported = false;
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores
      if (!db.objectStoreNames.contains(this.versionStoreName)) {
        const store = db.createObjectStore(this.versionStoreName, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
    
    request.onsuccess = (event) => {
      this.db = event.target.result;
      console.log('IndexedDB initialized successfully');
    };
  }
  
  // Save versions to IndexedDB (or localStorage as fallback)
  async saveVersions(versions) {
    if (this.isIndexedDBSupported && this.db) {
      try {
        // Trim versions to keep only the maximum number
        const versionsToStore = [...versions].slice(-this.maxVersions);
        
        // Store each version in IndexedDB
        const transaction = this.db.transaction(this.versionStoreName, 'readwrite');
        const store = transaction.objectStore(this.versionStoreName);
        
        // Clear old versions first
        store.clear();
        
        // Add new versions
        for (const version of versionsToStore) {
          store.add(version);
        }
        
        // Store only the version IDs in localStorage for quick access
        const versionIds = versionsToStore.map(v => v.id);
        localStorage.setItem('workspaceVersionIds', JSON.stringify(versionIds));
        
        return new Promise((resolve, reject) => {
          transaction.oncomplete = () => resolve(true);
          transaction.onerror = (event) => reject(event.target.error);
        });
      } catch (error) {
        console.error('Error saving versions to IndexedDB:', error);
        return this._fallbackToLocalStorage(versions);
      }
    } else {
      return this._fallbackToLocalStorage(versions);
    }
  }
  
  // Fallback to localStorage with size limit handling
  _fallbackToLocalStorage(versions) {
    try {
      // Remove images from versions to save space
      const compressedVersions = versions.map(version => {
        // Create a copy without the large image data
        const { uploadedImage, generatedImage, ...rest } = version;
        
        // Store only small thumbnails
        return {
          ...rest,
          uploadedImageThumbnail: this._createThumbnail(uploadedImage),
          generatedImageThumbnail: this._createThumbnail(generatedImage),
          // Keep track that we've compressed this version
          isCompressed: true
        };
      });
      
      localStorage.setItem('workspaceStates', JSON.stringify(compressedVersions));
      localStorage.setItem('workspaceStatesCompressed', 'true');
      
      return Promise.resolve(true);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      
      // Last resort: Try to save just the most recent version
      if (versions.length > 0) {
        try {
          const latestVersion = versions[versions.length - 1];
          const { uploadedImage, generatedImage, ...rest } = latestVersion;
          
          localStorage.setItem('workspaceStates', JSON.stringify([{
            ...rest,
            isCompressed: true
          }]));
          
          return Promise.resolve(false);
        } catch (finalError) {
          console.error('Failed to save even a single version:', finalError);
          return Promise.resolve(false);
        }
      }
      
      return Promise.resolve(false);
    }
  }
  
  // Create a small thumbnail from base64 image
  _createThumbnail(base64Image) {
    if (!base64Image) return null;
    
    // Just return a very small portion of the image to identify it
    // In a real app, you'd use canvas to resize the image
    return base64Image.substring(0, 100) + '...';
  }
  
  // Load versions from IndexedDB or localStorage
  async getVersions() {
    if (this.isIndexedDBSupported && this.db) {
      try {
        const versionIds = JSON.parse(localStorage.getItem('workspaceVersionIds') || '[]');
        
        if (versionIds.length === 0) {
          return [];
        }
        
        const transaction = this.db.transaction(this.versionStoreName, 'readonly');
        const store = transaction.objectStore(this.versionStoreName);
        
        const versions = [];
        for (const id of versionIds) {
          const request = store.get(id);
          const version = await new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
          });
          
          if (version) {
            versions.push(version);
          }
        }
        
        return versions;
      } catch (error) {
        console.error('Error loading versions from IndexedDB:', error);
        return this._fallbackFromLocalStorage();
      }
    } else {
      return this._fallbackFromLocalStorage();
    }
  }
  
  // Fallback to get versions from localStorage
  _fallbackFromLocalStorage() {
    try {
      const versions = JSON.parse(localStorage.getItem('workspaceStates') || '[]');
      const isCompressed = localStorage.getItem('workspaceStatesCompressed') === 'true';
      
      if (isCompressed) {
        // If versions are compressed, warn the user
        console.warn('Loading compressed versions without full image data');
      }
      
      return Promise.resolve(versions);
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return Promise.resolve([]);
    }
  }
  
  // Clear all stored versions
  async clearVersions() {
    if (this.isIndexedDBSupported && this.db) {
      const transaction = this.db.transaction(this.versionStoreName, 'readwrite');
      const store = transaction.objectStore(this.versionStoreName);
      store.clear();
    }
    
    localStorage.removeItem('workspaceStates');
    localStorage.removeItem('workspaceVersionIds');
    localStorage.removeItem('workspaceStatesCompressed');
    
    return Promise.resolve(true);
  }
}

export default new StorageService();
