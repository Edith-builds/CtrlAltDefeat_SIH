import { Waves, Moon, Sun, Settings, MapPin } from 'lucide-react';
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
  lastUpdated,
  onSettingsClick,
}: HeaderProps) => {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Title Section */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
              <Waves className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-foreground truncate">
                National River Water Level Monitoring
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Powered by GSM-based Floating Sensor Network
              </p>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Connection Status */}
            <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-muted/50">
              <div className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full ${
                isConnected 
                  ? 'bg-status-safe pulse-dot' 
                  : 'bg-status-danger'
              }`} />
              <span className="text-xs sm:text-sm font-medium">
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Last Updated */}
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <span className="hidden sm:inline">🔄 Last Updated:</span>
              <span className="font-mono text-[10px] sm:text-sm">
                {lastUpdated.toLocaleTimeString()}
              </span>
            </div>

            {/* Location */}
            <div className="hidden lg:flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Godavari River | Telangana</span>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 sm:h-9 sm:w-9"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onSettingsClick}
              className="h-8 w-8 sm:h-9 sm:w-9"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
