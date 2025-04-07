import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { RentalPlace } from '../types';

interface MapProps {
  places: RentalPlace[];
  onPlaceSelect: (place: RentalPlace) => void;
}

const Map: React.FC<MapProps> = ({ places, onPlaceSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['marker', 'places'],
    });

    loader.load().then(() => {
      if (!mapRef.current) return;

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 3.1390, lng: 101.6869 },
        zoom: 12,
        mapId: 'YOUR_MAP_ID', // You need to create a Map ID in Google Cloud Console
        mapTypeId: google.maps.MapTypeId.HYBRID,
        gestureHandling: 'greedy',
        mapTypeControl: true,
        mapTypeControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT,
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        },
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER,
        },
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        },
        streetViewControl: false,
      });

      // Clear existing markers
      markersRef.current.forEach(marker => marker.map = null);
      markersRef.current = [];

      // Add markers for each place
      places.forEach(place => {
        // Create a div element for the marker
        const markerDiv = document.createElement('div');
        markerDiv.className = 'marker';
        markerDiv.style.width = '24px';
        markerDiv.style.height = '24px';
        markerDiv.style.backgroundColor = '#EA4335'; // Changed to Google Red
        markerDiv.style.border = '2px solid white';
        markerDiv.style.borderRadius = '50%';
        markerDiv.style.display = 'flex';
        markerDiv.style.alignItems = 'center';
        markerDiv.style.justifyContent = 'center';
        markerDiv.style.color = 'white';
        markerDiv.style.fontWeight = 'bold';
        markerDiv.style.fontSize = '12px';
        markerDiv.textContent = place.name.charAt(0).toUpperCase();

        // Add hover effect
        markerDiv.addEventListener('mouseenter', () => {
          markerDiv.style.transform = 'scale(1.4)';
          markerDiv.style.backgroundColor = '#D33426'; // Darker red on hover
        });

        markerDiv.addEventListener('mouseleave', () => {
          markerDiv.style.transform = 'scale(1)';
          markerDiv.style.backgroundColor = '#EA4335'; // Back to original red
        });

        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: place.location,
          map,
          title: place.name,
          content: markerDiv,
        });

        // Add click event to the marker div itself
        markerDiv.addEventListener('click', (e) => {
          e.stopPropagation();
          onPlaceSelect(place);
          map.panTo(place.location);
          map.setZoom(15);
        });

        // Also add the gmp-click event as a fallback
        marker.addEventListener('gmp-click', () => {
          onPlaceSelect(place);
          map.panTo(place.location);
          map.setZoom(15);
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