import React from 'react';
import { Link, useLocation } from 'wouter';
import { useDreamNetTheme } from '@/contexts/DreamNetThemeContext';
import { SettingsProvider, useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { SettingsDialog } from '../SettingsDialog';
import { SentientAvatar } from '../ui/SentientAvatar';
import {
  Network,
  Box,
  ShoppingBag,
  FlaskConical,
  Bot,
  Users,
  Activity,
  Settings
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SettingsProvider>
      <LayoutContent>{children}</LayoutContent>
    </SettingsProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { dreamNetMode, toggleDreamNetMode } = useDreamNetTheme();
  const { settings } = useSettings();

  const navLinks = [
    { href: '/', label: 'DreamNet', icon: Network },
    { href: '/os', label: 'OS Map', icon: Network },
    { href: '/vault', label: 'Vault', icon: Box },
    { href: '/shop', label: 'Shop', icon: ShoppingBag },
    { href: '/dreamtank', label: 'DreamTank', icon: FlaskConical },
    { href: '/agents', label: 'Agents', icon: Bot },
    { href: '/community', label: 'Community', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navigation Bar */}
      <header className={`sticky top-0 z-50 border-b ${dreamNetMode
        ? 'bg-black/90 border-electric-cyan/30 backdrop-blur-sm shadow-[0_0_20px_rgba(0,255,255,0.1)]'
        : 'bg-background/80 border-border backdrop-blur-sm'
        }`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Network className={`w-6 h-6 ${dreamNetMode ? 'text-electric-cyan' : 'text-primary'}`} />
              <span className={`text-xl font-semibold ${dreamNetMode ? 'text-electric-cyan' : ''}`}>
                DreamNet
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}>
                  <Button
                    variant={location === href ? 'default' : 'ghost'}
                    className={`${dreamNetMode && location === href
                      ? 'bg-electric-cyan/20 text-electric-cyan border-electric-cyan/50'
                      : ''
                      }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Toggles & Settings */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden lg:inline">DreamNet Mode</span>
                <button
                  onClick={toggleDreamNetMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${dreamNetMode
                    ? 'bg-electric-cyan'
                    : 'bg-muted'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${dreamNetMode ? 'translate-x-6' : 'translate-x-1'
                      } ${dreamNetMode ? 'shadow-[0_0_8px_rgba(0,255,255,0.6)]' : ''}`}
                  />
                </button>
              </div>
              <div className="h-6 w-px bg-white/10 mx-2" />
              <div className="flex items-center gap-3">
                <SentientAvatar
                  seed={settings.identitySeed}
                  type="research"
                  className="w-8 h-8 ring-1 ring-white/20 shadow-[0_0_10px_rgba(0,243,255,0.2)]"
                  pulse={false}
                />
                <SettingsDialog />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className={`border-t mt-auto ${dreamNetMode
        ? 'border-electric-cyan/20 bg-black/50'
        : 'border-border bg-background'
        }`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>DreamNet — A Living Digital Network</p>
            <div className="flex items-center gap-4">
              <Link href="/system/os-status" className="hover:text-foreground transition-colors">
                <Activity className="w-4 h-4" />
              </Link>
              <Link href="/system/runtime" className="hover:text-foreground transition-colors">
                <Settings className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

