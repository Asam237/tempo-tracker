import React from "react";
import { MapPinIcon, StarIcon } from "@heroicons/react/24/solid";

interface Attraction {
  name: string;
  rating: number;
  distance: string;
  type: string;
  photo_url?: string;
}

interface TouristAttractionsProps {
  attractions: Attraction[];
  cityName: string;
}

const TouristAttractions: React.FC<TouristAttractionsProps> = ({ attractions, cityName }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <h3 className="text-white text-xl font-light mb-4 flex items-center">
        <MapPinIcon className="w-5 h-5 mr-2" />
        Sites touristiques près de {cityName}
      </h3>
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {attractions.length > 0 ? (
          attractions.map((attraction, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
              <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPinIcon className="w-8 h-8 text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm truncate">{attraction.name}</h4>
                <p className="text-white/60 text-xs mb-1">{attraction.type}</p>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <StarIcon className="w-4 h-4 text-yellow-400" />
                    <span className="text-white/80 text-xs ml-1">{attraction.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-white/60 text-xs">• {attraction.distance}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <MapPinIcon className="w-12 h-12 text-white/30 mx-auto mb-2" />
            <p className="text-white/60 text-sm">Aucun site touristique trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TouristAttractions;