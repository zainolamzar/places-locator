import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { RentalPlace } from '../types';

interface MapProps {
  places: RentalPlace[];
  onPlaceSelect: (place: RentalPlace) => void;
}

const Map: React.FC<MapProps> = ({ places, onPlaceSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
    });

    loader.load().then(() => {
      if (!mapRef.current) return;

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 3.1390, lng: 101.6869 }, // Kuala Lumpur coordinates
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        gestureHandling: 'greedy', // This enables touch gestures
        mapTypeControl: true,
        mapTypeControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT,
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU, // More mobile-friendly
        },
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER,
        },
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        },
        streetViewControl: false, // Disable street view on mobile
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [{ color: '#242f3e' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }]
          }
        ]
      });

      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add markers for each place
      places.forEach(place => {
        const marker = new google.maps.Marker({
          position: place.location,
          map,
          title: place.name,
          animation: google.maps.Animation.DROP,
          optimized: true, // Optimize for mobile performance
        });

        marker.addListener('click', () => {
          onPlaceSelect(place);
        });

        markersRef.current.push(marker);
      });

      // Add touch event listeners for better mobile interaction
      map.addListener('touchend', () => {
        // You can add custom touch interactions here
      });
    });
  }, [places, onPlaceSelect]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-[100dvh] touch-none" 
      style={{ 
        touchAction: 'none',
        WebkitOverflowScrolling: 'touch',
      }} 
    />
  );
};

export default Map;