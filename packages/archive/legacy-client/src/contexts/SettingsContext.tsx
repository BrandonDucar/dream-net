import React, { createContext, useContext, useState, useEffect } from 'react';

interface Settings {
    emergentApiKey: string;
    identitySeed: string;
    themePreference: 'cyberpunk' | 'classic';
}

interface SettingsContextType {
    settings: Settings;
    updateSettings: (newSettings: Partial<Settings>) => void;
    isConfigured: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>({
        emergentApiKey: '',
        identitySeed: 'Operator_' + Math.floor(Math.random() * 1000),
        themePreference: 'cyberpunk',
    });

    useEffect(() => {
        const savedSettings = localStorage.getItem('dreamnet_settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const updateSettings = (newSettings: Partial<Settings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        localStorage.setItem('dreamnet_settings', JSON.stringify(updated));
    };

    const isConfigured = settings.emergentApiKey.length > 0;

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, isConfigured }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
