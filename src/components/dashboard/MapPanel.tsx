import { useEffect, useRef } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapPanelProps {
  lat: number;
  lng: number;
}

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export const MapPanel = ({ lat, lng }: MapPanelProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([lat, lng], 13);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Add marker
    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(`
      <div style="text-align: center;">
        <strong>Sensor Station #12</strong><br/>
        <span style="font-family: monospace; font-size: 12px;">${lat.toFixed(6)}°N, ${lng.toFixed(6)}°E</span>
      </div>
    `);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [lat, lng]);

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
      <div ref={mapRef} className="rounded-lg overflow-hidden h-48 z-0" />

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
