import React, { createContext, useState } from 'react';

// Create the context
const ControlPanelContext = createContext();

// Create the context provider
const ControlPanelProvider = ({ children }) => {
  // State variables
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLocationServicesUsed, setIsLocationServicesUsed] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [prioritizeOpen, setPrioritizeOpen] = useState(false);
  const [alternateLocationIndex, setAlternateLocationIndex] = useState('');
  const [isPrintFriendlyMode, setIsPrintFriendlyMode] = useState(false);

  // Function to update the state
  const updateContext = (darkMode, categories, prioritize) => {
    setIsDarkMode(darkMode);
    setSelectedCategories(categories);
    setPrioritizeOpen(prioritize);
  };

  const updateLocationServicesContext = (value) => {
    console.log("Location services changes to...");
    console.log(value);
    setIsLocationServicesUsed(value);
  }

  const updateSelectedCategoriesContext = (categories) => {
    setSelectedCategories(categories);
    console.log(categories);
  }

  const updateAlternateLocationContext = (value) => {
    setAlternateLocationIndex(value);
  }

  const toggleIsPrintFriendlyModeContext = () => {
    if (isPrintFriendlyMode) {
      setIsPrintFriendlyMode(false);
      return;
    }

    setIsPrintFriendlyMode(true);
  }

  // Context value
  const contextValue = {
    isDarkMode,
    isLocationServicesUsed,
    selectedCategories,
    prioritizeOpen,
    updateContext,
    updateLocationServicesContext,
    updateSelectedCategoriesContext,
    alternateLocationIndex,
    updateAlternateLocationContext,
    isPrintFriendlyMode,
    toggleIsPrintFriendlyModeContext
  };

  return (
    <ControlPanelContext.Provider value={contextValue}>
      {children}
    </ControlPanelContext.Provider>
  );
};

export { ControlPanelContext, ControlPanelProvider };
