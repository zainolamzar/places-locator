import React from 'react';
import { RentalPlace } from '../types';
import { MapPin, DollarSign, ExternalLink, X } from 'lucide-react';

interface PlaceCardProps {
  place: RentalPlace;
  onClose: () => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, onClose }) => {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-4 md:p-6 max-w-4xl mx-auto relative">
      <button
        onClick={handleClose}
        className="absolute right-2 top-2 p-2 rounded-full bg-white/90 hover:bg-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 z-10"
        aria-label="Close details"
      >
        <X className="w-5 h-5 text-gray-600" />
      </button>

      <div className="space-y-4 mt-2">
        <h2 className="text-xl md:text-2xl font-bold pr-8">{place.name}</h2>
        
        <div className="flex items-start gap-2 text-gray-600">
          <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Location:</span>
            <span className="text-sm">{place.address}</span>
            <span className="text-xs text-gray-500">{`${place.location.lat.toFixed(4)}, ${place.location.lng.toFixed(4)}`}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-green-600 font-semibold">
          <span>RM {place.price}/month</span>
        </div>

        <p className="text-gray-700 text-sm md:text-base">{place.description}</p>

        <a
          href={place.moreDetailsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          More Details
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default PlaceCard;