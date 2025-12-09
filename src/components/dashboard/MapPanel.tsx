import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapPanelProps {
  lat: number;
  lng: number;
}

export const MapPanel = ({ lat, lng }: MapPanelProps) => {
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  
  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gps" />
          <h3 className="text-lg font-semibold text-foreground">
            Sensor Location
          </h3>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in Maps
          </a>
        </Button>
      </div>

      {/* Static Map Placeholder */}
      <div className="relative rounded-lg overflow-hidden bg-muted h-48">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{
            backgroundImage: `url(https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-l+0ea5e9(${lng},${lat})/${lng},${lat},12,0/400x200@2x?access_token=pk.placeholder)`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background/80 to-transparent">
          <div className="text-center p-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/90 shadow-lg">
              <MapPin className="h-5 w-5 text-gps animate-float" />
              <div className="text-left">
                <p className="font-mono text-sm font-medium">{lat.toFixed(6)}°N</p>
                <p className="font-mono text-sm font-medium">{lng.toFixed(6)}°E</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-muted-foreground text-xs mb-1">River</p>
          <p className="font-medium">Godavari</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-muted-foreground text-xs mb-1">Station</p>
          <p className="font-medium">Station #12</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-muted-foreground text-xs mb-1">State</p>
          <p className="font-medium">Telangana</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-muted-foreground text-xs mb-1">District</p>
          <p className="font-medium">Hyderabad</p>
        </div>
      </div>
    </div>
  );
};
