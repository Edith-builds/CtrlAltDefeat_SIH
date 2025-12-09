import { Waves, Moon, Sun, Settings, MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  isConnected: boolean;
  isSimulated: boolean;
  lastUpdated: Date;
  onSettingsClick: () => void;
}

export const Header = ({
  isDarkMode,
  toggleTheme,
  isConnected,
  isSimulated,
  lastUpdated,
  onSettingsClick,
}: HeaderProps) => {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title Section */}
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Waves className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-foreground">
                National River Water Level Monitoring
              </h1>
              <p className="text-sm text-muted-foreground">
                Powered by GSM-based Floating Sensor Network
              </p>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex flex-wrap items-center gap-3 lg:gap-4">
            {/* Connection Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
              <div className={`h-2.5 w-2.5 rounded-full ${
                isConnected 
                  ? 'bg-status-safe pulse-dot' 
                  : 'bg-status-danger'
              }`} />
              <span className="text-sm font-medium">
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Simulation Badge */}
            {isSimulated && (
              <Badge variant="outline" className="text-xs border-secondary text-secondary">
                <RefreshCw className="h-3 w-3 mr-1" />
                Simulated
              </Badge>
            )}

            {/* Last Updated */}
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <span>🔄 Last Updated:</span>
              <span className="font-mono">
                {lastUpdated.toLocaleTimeString()} | {lastUpdated.toLocaleDateString()}
              </span>
            </div>

            {/* Location */}
            <div className="hidden lg:flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Godavari River | Telangana</span>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onSettingsClick}
              className="h-9 w-9"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
