// Remove the import and use google.maps.LatLngLiteral directly
export interface RentalPlace {
  id: string;
  name: string;
  address: string;
  location: google.maps.LatLngLiteral;
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
  }
}