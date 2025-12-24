import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CountryStats, COUNTRY_CENTERS } from '../../types';

interface PMIWorldMapProps {
  countries: CountryStats[];
  onCountryClick: (countryCode: string) => void;
}

const PMIWorldMap: React.FC<PMIWorldMapProps> = ({ countries, onCountryClick }) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  useEffect(() => {
    if (!mapRef.current) {
      // Initialiser la carte
      const map = L.map('map', {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 6,
        worldCopyJump: true,
      });

      // Ajouter la couche de tuiles OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
    }

    return () => {
      // Nettoyer la carte lors du démontage
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || countries.length === 0) return;

    // Nettoyer les marqueurs existants
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Trouver le max pour la normalisation des tailles
    const maxTotal = Math.max(...countries.map((c) => c.total));

    // Ajouter les marqueurs pour chaque pays
    countries.forEach((country) => {
      const center = COUNTRY_CENTERS[country.country_code];
      if (!center) {
        console.warn(`No coordinates for country: ${country.country_code}`);
        return;
      }

      // Calculer la taille du cercle (proportionnel au nombre de certifications)
      const size = Math.max(
        10,
        Math.sqrt((country.total / maxTotal) * 50000)
      );

      // Couleur basée sur le nombre de certifications
      const getColor = (total: number) => {
        const ratio = total / maxTotal;
        if (ratio > 0.7) return '#99000d';
        if (ratio > 0.5) return '#cb181d';
        if (ratio > 0.3) return '#ef3b2c';
        if (ratio > 0.15) return '#fb6a4a';
        if (ratio > 0.05) return '#fc9272';
        return '#fcbba1';
      };

      const marker = L.circleMarker([center[0], center[1]], {
        radius: size,
        fillColor: getColor(country.total),
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7,
      });

      // Tooltip au survol
      marker.bindTooltip(
        `
        <div class="text-center">
          <div class="font-bold text-base mb-1">${country.country_name}</div>
          <div class="text-sm"><strong>${country.total.toLocaleString()}</strong> certifications</div>
          <div class="text-xs mt-1 text-gray-600">
            ${Object.entries(country.by_cert_type)
              .slice(0, 3)
              .map(([type, count]) => `${type}: ${count.toLocaleString()}`)
              .join('<br>')}
          </div>
        </div>
        `,
        {
          permanent: false,
          direction: 'top',
          className: 'custom-tooltip',
        }
      );

      // Événement au clic
      marker.on('click', () => {
        onCountryClick(country.country_code);
      });

      // Effet de survol
      marker.on('mouseover', () => {
        marker.setStyle({
          fillOpacity: 0.9,
          weight: 3,
        });
      });

      marker.on('mouseout', () => {
        marker.setStyle({
          fillOpacity: 0.7,
          weight: 2,
        });
      });

      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
    });
  }, [countries, onCountryClick]);

  return (
    <div className="relative w-full h-full">
      <div id="map" className="w-full h-full rounded-lg shadow-lg"></div>

      {/* Légende */}
      <div className="absolute bottom-6 left-6 bg-white p-4 rounded-lg shadow-lg z-[1000]">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Nombre de certifications
        </h3>
        <div className="space-y-2">
          {[
            { label: 'Très élevé', color: '#99000d' },
            { label: 'Élevé', color: '#cb181d' },
            { label: 'Moyen', color: '#ef3b2c' },
            { label: 'Faible', color: '#fb6a4a' },
            { label: 'Très faible', color: '#fcbba1' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-white"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-xs text-gray-700">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
          Cliquez sur un pays pour plus de détails
        </div>
      </div>
    </div>
  );
};

export default PMIWorldMap;
