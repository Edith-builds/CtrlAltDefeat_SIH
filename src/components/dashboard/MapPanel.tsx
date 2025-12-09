import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issue with Vite/Webpack bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom sensor marker icon
const sensorIcon = new L.DivIcon({
  className: 'custom-sensor-marker',
  html: `<div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-background">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary-foreground">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

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

      {/* Interactive Leaflet Map */}
      <div className="relative rounded-lg overflow-hidden h-48">
        <MapContainer
          center={[lat, lng]}
          zoom={14}
          scrollWheelZoom={true}
          className="h-full w-full z-0"
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]} icon={sensorIcon}>
            <Popup>
              <div className="text-center p-1">
                <p className="font-semibold text-sm">Sensor Station #12</p>
                <p className="text-xs text-muted-foreground">
                  {lat.toFixed(6)}°N, {lng.toFixed(6)}°E
                </p>
              </div>
            </Popup>
          </Marker>
          <Circle
            center={[lat, lng]}
            radius={500}
            pathOptions={{
              color: 'hsl(var(--primary))',
              fillColor: 'hsl(var(--primary))',
              fillOpacity: 0.1,
              weight: 2,
            }}
          />
        </MapContainer>
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
