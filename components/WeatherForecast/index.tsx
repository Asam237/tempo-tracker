import React from "react";
import { CloudIcon, SunIcon, CloudRainIcon, EyeIcon } from "@heroicons/react/24/outline";

interface ForecastDay {
  date: string;
  temp_max: number;
  temp_min: number;
  description: string;
  icon: string;
}

interface WeatherForecastProps {
  forecast: ForecastDay[];
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecast }) => {
  const getWeatherIcon = (iconCode: string) => {
    const iconClass = "w-10 h-10";
    
    if (iconCode.includes("01")) {
      const isDay = iconCode.includes("d");
      return <SunIcon className={`${iconClass} ${isDay ? 'text-yellow-400' : 'text-blue-300'}`} />;
    }
    if (iconCode.includes("02") || iconCode.includes("03") || iconCode.includes("04")) 
      return <CloudIcon className={`${iconClass} text-gray-300`} />;
    if (iconCode.includes("09") || iconCode.includes("10")) 
      return <CloudRainIcon className={`${iconClass} text-blue-400`} />;
    if (iconCode.includes("11")) 
      return <CloudRainIcon className={`${iconClass} text-purple-400`} />;
    if (iconCode.includes("13")) 
      return <CloudIcon className={`${iconClass} text-blue-200`} />;
    if (iconCode.includes("50")) 
      return <EyeIcon className={`${iconClass} text-gray-400`} />;
    return <SunIcon className={`${iconClass} text-yellow-400`} />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Demain";
    } else {
      return date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp > 25) return "text-red-400";
    if (temp > 15) return "text-yellow-400";
    if (temp > 5) return "text-green-400";
    return "text-blue-400";
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <h3 className="text-white text-2xl font-light mb-6 flex items-center">
        <span className="mr-3 text-3xl">📅</span>
        Prévisions sur 3 jours
      </h3>
      
      <div className="space-y-4">
        {forecast.length > 0 ? (
          forecast.map((day, index) => (
            <div 
              key={index} 
              className="group hover:bg-white/15 transition-all duration-300 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 hover:scale-[1.02] transform"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {getWeatherIcon(day.icon)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-white font-medium text-lg capitalize">
                      {formatDate(day.date)}
                    </p>
                    <p className="text-white/70 text-sm capitalize font-light">
                      {day.description}
                    </p>
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`text-2xl font-light ${getTemperatureColor(day.temp_max)}`}>
                      {Math.round(day.temp_max)}°
                    </span>
                    <span className="text-white/50 text-lg font-light">
                      / {Math.round(day.temp_min)}°
                    </span>
                  </div>
                  <div className="flex items-center justify-end space-x-1">
                    <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-red-400 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, Math.max(0, ((day.temp_max + 10) / 50) * 100))}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">📅</div>
            <p className="text-white/60 text-lg font-light">
              Aucune prévision disponible
            </p>
          </div>
        )}
      </div>
      
      {forecast.length > 0 && (
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-white/60 text-sm font-light text-center">
            💡 Les prévisions sont mises à jour toutes les 3 heures
          </p>
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;