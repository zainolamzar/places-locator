import { LatLngLiteral } from '@googlemaps/js-api-loader';

export interface RentalPlace {
  name: string;
  address: string;
  location: LatLngLiteral;
  price: number;
  description: string;
  moreDetailsUrl: string;
}

// Extend the global google.maps namespace
declare global {
  namespace google.maps.marker {
    interface PinView {
      element: HTMLElement;
      scale: number;
      background: string;
      borderColor: string;
      glyph: string;
    }
    
    class PinView {
      constructor(options: Partial<PinView>);
    }
    
    class AdvancedMarkerElement {
      position: LatLngLiteral;
      map: google.maps.Map | null;
      title: string;
      content: HTMLElement;
      
      constructor(options: {
        position: LatLngLiteral;
        map: google.maps.Map;
        title: string;
        content: HTMLElement;
      });
      
      addListener(event: string, callback: () => void): void;
    }
  }
}