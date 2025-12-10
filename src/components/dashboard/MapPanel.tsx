import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapPanelProps {
  lat: number;
  lng: number;
}

// Custom marker icon
const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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

      {/* Interactive Map */}
      <div className="relative rounded-lg overflow-hidden h-48">
        <MapContainer
          center={[lat, lng]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]} icon={customIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">Sensor Station #12</p>
                <p className="font-mono text-xs">{lat.toFixed(6)}°N, {lng.toFixed(6)}°E</p>
              </div>
            </Popup>
          </Marker>
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