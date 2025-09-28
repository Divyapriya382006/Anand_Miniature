import React, { useState, useEffect } from 'react';
import { DatabaseSchema } from './types';
import { 
  createEmptyDatabase,
  saveToFileSystem,
  loadFromFileSystem,
  saveToIndexedDB,
  loadFromIndexedDB,
  downloadDatabase,
  mergeImportedDatabase,
  getLeaderboard
} from './utils/database';
import { createDemoProducts } from './utils/demoData';

// Components
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ProductCatalog from './components/ProductCatalog';
import Leaderboard from './components/Leaderboard';
import AdminDashboard from './components/AdminDashboard';
import About from './components/About';
import Contact from './components/Contact';

function App() {
  const [database, setDatabase] = useState<DatabaseSchema>(createEmptyDatabase());
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Load database on startup
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try IndexedDB first
        const dbData = await loadFromIndexedDB();
        if (dbData) {
          setDatabase(dbData);
          setTheme(dbData.settings.theme);
        } else {
          // Initialize with demo data if first time
          const emptyDb = createEmptyDatabase();
          emptyDb.settings.demo_mode = true;
          emptyDb.products = createDemoProducts();
          setDatabase(emptyDb);
          await saveToIndexedDB(emptyDb);
        }
      } catch (error) {
        console.error('Failed to load database:', error);
      }
    };

    loadData();
  }, []);

  // Apply theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Track current section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'shop', 'reviews', 'leaderboard', 'about', 'contact', 'admin'];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setCurrentSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDatabaseUpdate = async (updatedDb: DatabaseSchema) => {
    updatedDb.meta.generated_at = new Date().toISOString();
    setDatabase(updatedDb);
    
    try {
      await saveToIndexedDB(updatedDb);
    } catch (error) {
      console.error('Failed to save database:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    const updatedDb = {
      ...database,
      settings: {
        ...database.settings,
        theme: newTheme
      }
    };
    
    handleDatabaseUpdate(updatedDb);
  };

  const handleToggleDemoMode = () => {
    const updatedDb = {
      ...database,
      settings: {
        ...database.settings,
        demo_mode: !database.settings.demo_mode
      },
      products: database.settings.demo_mode ? [] : createDemoProducts()
    };
    
    handleDatabaseUpdate(updatedDb);
  };

  const handleExportDatabase = async () => {
    try {
      const success = await saveToFileSystem(database);
      if (!success) {
        downloadDatabase(database);
      }
    } catch (error) {
      console.error('Export failed:', error);
      downloadDatabase(database);
    }
  };

  const handleImportDatabase = async () => {
    try {
      const importedDb = await loadFromFileSystem();
      if (importedDb) {
        const mergedDb = mergeImportedDatabase(database, importedDb);
        await handleDatabaseUpdate(mergedDb);
        alert('Database imported successfully!');
      }
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import database. Please check the file format.');
    }
  };

  const { publicTop3, adminTop3 } = getLeaderboard(database.products);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navigation
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        theme={theme}
        toggleTheme={toggleTheme}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />

      <Hero />
      
      <ProductCatalog products={database.products} />
      
      <Leaderboard
        publicLeaderboard={publicTop3}
        adminLeaderboard={adminTop3}
        isAdmin={isAdminAuthenticated}
      />

      <About />
      
      <Contact />

      <AdminDashboard
        database={database}
        onDatabaseUpdate={handleDatabaseUpdate}
        isAuthenticated={isAdminAuthenticated}
        onLogin={() => setIsAdminAuthenticated(true)}
        onLogout={() => setIsAdminAuthenticated(false)}
      />

      {/* {/* Demo Mode Controls */}
      {database.settings.demo_mode && (
        <div className="fixed bottom-4 left-4 z-40">
          <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3 shadow-lg">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200 text-sm">
              <span>🎯 Demo Mode Active</span>
              <button
                onClick={handleToggleDemoMode}
                className="ml-2 px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs"
              >
                Disable
              </button>
            </div>
          </div> 
        </div>
      )}

      {/* Database Controls */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
        <button
          onClick={handleExportDatabase}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Export Database"
        >
          💾
        </button>
        <button
          onClick={handleImportDatabase}
          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Import Database"
        >
          
        </button>
        {!database.settings.demo_mode && (
          <button
            onClick={handleToggleDemoMode}
            className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full shadow-lg transition-colors"
            title="Enable Demo Mode"
          >
            🎯
          </button>
        )}
      </div>
    </div>
  ); */}
}

export default App; 