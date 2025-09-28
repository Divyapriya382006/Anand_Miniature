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

     

    
      </div>
    
  );
}

export default App;