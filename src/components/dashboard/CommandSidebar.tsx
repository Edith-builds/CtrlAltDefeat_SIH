import { useState } from 'react';
import {
  FileText,
  Gauge,
  Settings,
  RotateCcw,
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface CommandSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

// All available commands shown in UI
const commands = [
  { id: 'instant_report', name: 'Instant Report', icon: FileText, description: 'Request immediate sensor reading' },
  { id: 'set_flood_height', name: 'Set Flood Height', icon: Gauge, description: 'Configure flood threshold' },
  { id: 'calibration', name: 'Calibration', icon: Settings, description: 'Calibrate sensor readings' },
  { id: 'reset', name: 'Reset Device', icon: RotateCcw, description: 'Reset sensor module' },
  { id: 'set_interval', name: 'Time Interval', icon: Clock, description: 'Set report interval' },
];

//
// ⭐ NEW: Unified command sender (used by sendCommand below)
//
export async function sendCommandToDevice(
  device_id: string,
  command_name: string,
  payload: Record<string, unknown> = {}
) {
  const { data, error } = await supabase
    .from("commands")
    .insert([
      {
        device_id,
        command_name,
        payload,
        status: "pending",
      },
    ]);

  if (error) throw error;
  return data;
}

export const CommandSidebar = ({ isOpen, onToggle }: CommandSidebarProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);

  //
  // Handle clicking a command in list
  //
  const handleCommandClick = (commandId: string) => {
    // Commands that need user input
    if (commandId === 'set_flood_height' || commandId === 'set_interval') {
      setSelectedCommand(commandId);
      setInputValue('');
      setDialogOpen(true);
    } else {
      // Fire immediately
      sendCommand(commandId, {});
    }
  };

  //
  // ⭐ Replaces your old sendCommand — now uses unified sendCommandToDevice()
  //
  const sendCommand = async (command: string, payload: Record<string, unknown>) => {
    setIsSending(true);

    try {
      await sendCommandToDevice("station-1", command, payload);

      toast({
        title: 'Command Sent',
        description: `${command.replace(/_/g, ' ')} command has been sent to the device.`,
      });
    } catch (error) {
      console.error('Error sending command:', error);
      toast({
        title: 'Command Failed',
        description: 'Failed to send command. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
      setDialogOpen(false);
    }
  };

  //
  // Dialog Submit Handler
  //
  const handleDialogSubmit = () => {
    if (!selectedCommand) return;

    const payload =
      selectedCommand === 'set_flood_height'
        ? { threshold: parseInt(inputValue) }
        : { interval: parseInt(inputValue) * 1000 }; // seconds → ms

    sendCommand(selectedCommand, payload);
  };

  return (
    <>
      {/* Sidebar */}
      <div className={cn(
        'fixed left-0 top-0 h-full bg-sidebar z-40 transition-all duration-300 shadow-xl',
        isOpen ? 'w-64' : 'w-16',
        'hidden md:block'
      )}>
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 bg-sidebar-primary text-sidebar-primary-foreground p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform z-[60]"
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {/* Logo Section */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sidebar-primary/20">
              <AlertTriangle className="h-6 w-6 text-sidebar-primary" />
            </div>
            {isOpen && (
              <div className="animate-fade-in">
                <h2 className="font-semibold text-sidebar-foreground">Commands</h2>
                <p className="text-xs text-sidebar-foreground/60">Sensor Control</p>
              </div>
            )}
          </div>
        </div>

        {/* Commands List */}
        <nav className="p-2 mt-4">
          <ul className="space-y-1">
            {commands.map((cmd) => (
              <li key={cmd.id}>
                <button
                  onClick={() => handleCommandClick(cmd.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all',
                    'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-sidebar-ring'
                  )}
                  disabled={isSending}
                >
                  <cmd.icon className="h-5 w-5 flex-shrink-0" />
                  {isOpen && (
                    <div className="text-left animate-fade-in">
                      <div className="text-sm font-medium">{cmd.name}</div>
                      <div className="text-xs text-sidebar-foreground/60">{cmd.description}</div>
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="p-3 rounded-lg bg-sidebar-accent/50 text-xs text-sidebar-foreground/70">
              <p>API Status: <span className="text-status-safe font-medium">Connected</span></p>
              <p className="mt-1">Commands are sent via GSM</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border z-40 md:hidden">
        <nav className="flex justify-around py-2">
          {commands.slice(0, 5).map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => handleCommandClick(cmd.id)}
              className="flex flex-col items-center gap-1 p-2 text-sidebar-foreground hover:text-sidebar-primary transition-colors"
              disabled={isSending}
            >
              <cmd.icon className="h-5 w-5" />
              <span className="text-[10px]">{cmd.name.split(' ')[0]}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCommand === 'set_flood_height'
                ? 'Set Flood Height Threshold'
                : 'Set Update Interval'}
            </DialogTitle>
            <DialogDescription>
              {selectedCommand === 'set_flood_height'
                ? 'Enter the water level (in cm) that should trigger a flood alert.'
                : 'Enter the time interval (in seconds) between sensor readings.'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="value">
              {selectedCommand === 'set_flood_height' ? 'Threshold (cm)' : 'Interval (seconds)'}
            </Label>
            <Input
              id="value"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={selectedCommand === 'set_flood_height' ? '220' : '5'}
              className="mt-2"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDialogSubmit} disabled={!inputValue || isSending}>
              <Send className="h-4 w-4 mr-2" />
              {isSending ? 'Sending...' : 'Send Command'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
