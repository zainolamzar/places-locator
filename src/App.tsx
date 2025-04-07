import { useState } from 'react';
import { MapPin } from 'lucide-react';
import Map from './components/Map';
import PlaceCard from './components/PlaceCard';
import { rentalPlaces } from './data';
import { RentalPlace } from './types';
import { CSSTransition } from 'react-transition-group';

function App() {
  const [selectedPlace, setSelectedPlace] = useState<RentalPlace | null>(null);

  const handlePlaceSelect = (place: RentalPlace) => {
    setSelectedPlace(place);
  };

  const handleClose = () => {
    setSelectedPlace(null);
  };

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden">
      {/* Header Badge */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-lg overflow-hidden">
          <div className="px-3 sm:px-6 py-2 sm:py-4">
            <div className="flex flex-col items-start gap-0.5 sm:gap-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Places Locator</h1>
              </div>
              <span className="text-xs sm:text-sm text-gray-600 italic">By Zain Coder</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="w-full h-full touch-none">
        <Map 
          places={rentalPlaces} 
          onPlaceSelect={handlePlaceSelect} 
        />
      </div>

      {/* Overlay Card */}
      <CSSTransition
        in={!!selectedPlace}
        timeout={300}
        classNames="overlay-card"
        unmountOnExit
      >
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 touch-none">
          {selectedPlace && (
            <div className="rounded-lg shadow-xl overflow-hidden transform transition-all duration-300">
              <PlaceCard 
                place={selectedPlace}
                onClose={handleClose}
              />
            </div>
          )}
        </div>
      </CSSTransition>
    </div>
  );
}

export default App;