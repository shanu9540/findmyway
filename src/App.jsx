import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BackgroundStars from './components/BackgroundStars';
import Projects from './components/Projects';
import Skills from './components/Skills';
import About from './components/About';
import AWSJourney from './components/AWSJourney';
import Education from './components/Education';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Footer from './components/Footer';
import App_rentease from './App_rentease'; // RentEase Appliance Rental App

function App() {
  // Initialize theme from localStorage or default to 'dark' for premium coding feel
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  // Track active sub-app ('portfolio' or 'rentease') based on hash router
  const [activeApp, setActiveApp] = useState(() => {
    return window.location.hash === '#rentease' ? 'rentease' : 'portfolio';
  });

  // Listen to hash change to toggle between RentEase and Portfolio
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#rentease') {
        setActiveApp('rentease');
      } else {
        setActiveApp('portfolio');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLaunchRentEase = () => {
    window.location.hash = '#rentease';
    setActiveApp('rentease');
  };

  const handleBackToPortfolio = () => {
    window.location.hash = '';
    setActiveApp('portfolio');
  };

  // If RentEase sub-app is active, load it!
  if (activeApp === 'rentease') {
    return (
      <App_rentease onBackToPortfolio={handleBackToPortfolio} />
    );
  }

  return (
    <div className="app">
      {/* Background Twinkling Stars */}
      <BackgroundStars />

      {/* Navigation */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Main Content Layout (Flow Order: Hero -> Projects -> Skills -> About -> AWS/DevOps -> Education -> Achievements -> Contact) */}
      <main>
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Projects Section */}
        <Projects onLaunchRentEase={handleLaunchRentEase} />

        {/* 3. Skills Section */}
        <Skills />

        {/* 4. About Section */}
        <About />

        {/* 5. AWS & DevOps Journey Section */}
        <AWSJourney />

        {/* 6. Education Section */}
        <Education />

        {/* 7. Achievements & Activities */}
        <Achievements />

        {/* 8. Contact Section (contains Resume CTA & Form) */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
