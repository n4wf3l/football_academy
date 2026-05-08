import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Props {
  lat: number;
  lng: number;
  zoom?: number;
  popupHtml?: string;
  className?: string;
}

export default function MapEmbed({ lat, lng, zoom = 14, popupHtml, className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom,
      scrollWheelZoom: false,
      zoomControl: true,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const primary =
      getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() ||
      '#1B5E20';

    const icon = L.divIcon({
      className: 'academy-map-pin',
      html: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 24 30" style="display:block;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.3))"><path fill="${primary}" stroke="#fff" stroke-width="1.2" d="M12 0.6C6.48 0.6 2 5.08 2 10.6c0 7.5 10 18.8 10 18.8s10-11.3 10-18.8c0-5.52-4.48-10-10-10z"/><circle cx="12" cy="10.6" r="3.6" fill="#fff"/></svg>`,
      iconSize: [40, 50],
      iconAnchor: [20, 50],
      popupAnchor: [0, -45],
    });

    const marker = L.marker([lat, lng], { icon }).addTo(map);
    if (popupHtml) {
      marker.bindPopup(popupHtml);
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lng, zoom, popupHtml]);

  return <div ref={containerRef} className={className} />;
}
