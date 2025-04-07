export interface RentalPlace {
  id: string;
  name: string;
  price: number;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  moreDetailsUrl: string;
}