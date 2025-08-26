import React from "react";
import { MapPinIcon, StarIcon, ClockIcon } from "@heroicons/react/24/solid";

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
  const getAttractionIcon = (type: string) => {
    const iconClass = "w-8 h-8";
    
    switch (type.toLowerCase()) {
      case 'musée':
        return <span className="text-2xl">🏛️</span>;
      case 'site historique':
        return <span className="text-2xl">🏰</span>;
      case 'parc':
        return <span className="text-2xl">🌳</span>;
      case 'monument religieux':
        return <span className="text-2xl">⛪</span>;
      case 'marché':
        return <span className="text-2xl">🏪</span>;
      default:
        return <MapPinIcon className={`${iconClass} text-white/60`} />;
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-400";
    if (rating >= 4.0) return "text-yellow-400";
    if (rating >= 3.5) return "text-orange-400";
    return "text-red-400";
  };

  const getDistanceColor = (distance: string) => {
    const km = parseFloat(distance);
    if (km <= 1) return "text-green-400";
    if (km <= 2) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <h3 className="text-white text-2xl font-light mb-6 flex items-center">
        <span className="mr-3 text-3xl">🏛️</span>
        Sites touristiques près de {cityName}
      </h3>
      
      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        {attractions.length > 0 ? (
          attractions.map((attraction, index) => (
            <div 
              key={index} 
              className="group hover:bg-white/15 transition-all duration-300 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 hover:scale-[1.02] transform cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                  {getAttractionIcon(attraction.type)}
                </div>
                
                <div className="flex-1 min-w-0 space-y-2">
                  <div>
                    <h4 className="text-white font-medium text-lg truncate group-hover:text-white/90 transition-colors">
                      {attraction.name}
                    </h4>
                    <p className="text-white/60 text-sm font-light">
                      {attraction.type}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <StarIcon className="w-4 h-4 text-yellow-400" />
                        <span className={`text-sm font-medium ${getRatingColor(attraction.rating)}`}>
                          {attraction.rating.toFixed(1)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="w-4 h-4 text-white/60" />
                        <span className={`text-sm font-light ${getDistanceColor(attraction.distance)}`}>
                          {attraction.distance}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-white/40">
                      <ClockIcon className="w-4 h-4" />
                      <span className="text-xs font-light">
                        ~{Math.ceil(parseFloat(attraction.distance) * 12)} min
                      </span>
                    </div>
                  </div>
                  
                  {/* Barre de progression pour la note */}
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-400 to-green-400 rounded-full transition-all duration-500"
                      style={{ width: `${(attraction.rating / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">🏛️</div>
            <p className="text-white/60 text-lg font-light mb-2">
              Aucun site touristique trouvé
            </p>
            <p className="text-white/40 text-sm font-light">
              Essayez avec une ville plus grande ou vérifiez l'orthographe
            </p>
          </div>
        )}
      </div>
      
      {attractions.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <div className="text-2xl mb-2">📍</div>
            <p className="text-white/80 text-sm font-light">
              {attractions.length} sites trouvés
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <div className="text-2xl mb-2">⭐</div>
            <p className="text-white/80 text-sm font-light">
              Note moyenne: {(attractions.reduce((acc, attr) => acc + attr.rating, 0) / attractions.length).toFixed(1)}
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <div className="text-2xl mb-2">🚶</div>
            <p className="text-white/80 text-sm font-light">
              À moins de 2km
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TouristAttractions;