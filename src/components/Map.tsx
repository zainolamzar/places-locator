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
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const isMapInitializedRef = useRef(false);

  // Initialize map only once
  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['marker', 'places'],
    });

    loader.load().then(() => {
      if (!mapRef.current || isMapInitializedRef.current) return;

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

      mapInstanceRef.current = map;
      isMapInitializedRef.current = true;

      // Add markers after map is initialized
      updateMarkers(map, places);
    });
  }, []);

  // Update markers when places change
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapInitializedRef.current) return;
    updateMarkers(mapInstanceRef.current, places);
  }, [places]);

  const updateMarkers = (map: google.maps.Map, places: RentalPlace[]) => {
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
      markerDiv.style.position = 'relative';
      markerDiv.style.display = 'flex';
      markerDiv.style.alignItems = 'center';
      markerDiv.style.justifyContent = 'center';

      // Create the pin body
      const pinBody = document.createElement('div');
      pinBody.style.width = '16px';
      pinBody.style.height = '16px';
      pinBody.style.backgroundColor = '#EA4335';
      pinBody.style.borderRadius = '50% 50% 50% 0';
      pinBody.style.transform = 'rotate(-45deg)';
      pinBody.style.position = 'absolute';
      pinBody.style.top = '4px';
      pinBody.style.left = '4px';

      // Create the pin shadow
      const pinShadow = document.createElement('div');
      pinShadow.style.width = '20px';
      pinShadow.style.height = '20px';
      pinShadow.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
      pinShadow.style.borderRadius = '50%';
      pinShadow.style.position = 'absolute';
      pinShadow.style.top = '2px';
      pinShadow.style.left = '2px';
      pinShadow.style.zIndex = '-1';

      markerDiv.appendChild(pinShadow);
      markerDiv.appendChild(pinBody);

      markerDiv.addEventListener('mouseenter', (e) => {
        e.preventDefault();
        markerDiv.style.transform = 'scale(1.4)';
        pinBody.style.backgroundColor = '#D33426';
      });

      markerDiv.addEventListener('mouseleave', (e) => {
        e.preventDefault();
        markerDiv.style.transform = 'scale(1)';
        pinBody.style.backgroundColor = '#EA4335';
      });

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: place.location,
        map,
        title: place.name,
        content: markerDiv,
      });

      // Add click event to the marker div itself
      markerDiv.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        onPlaceSelect(place);
        map.panTo(place.location);
        map.setZoom(15);
      });

      // Also add the gmp-click event as a fallback
      marker.addEventListener('gmp-click', (e) => {
        e.preventDefault();
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
  };

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