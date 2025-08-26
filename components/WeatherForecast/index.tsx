import React from "react";
import { CloudIcon, SunIcon, CloudRainIcon } from "@heroicons/react/24/outline";

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
    if (iconCode.includes("01")) return <SunIcon className="w-8 h-8 text-yellow-400" />;
    if (iconCode.includes("02") || iconCode.includes("03") || iconCode.includes("04")) 
      return <CloudIcon className="w-8 h-8 text-gray-400" />;
    if (iconCode.includes("09") || iconCode.includes("10")) 
      return <CloudRainIcon className="w-8 h-8 text-blue-400" />;
    return <SunIcon className="w-8 h-8 text-yellow-400" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'short', 
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <h3 className="text-white text-xl font-light mb-4">Prévisions 3 jours</h3>
      <div className="space-y-4">
        {forecast.map((day, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center space-x-4">
              {getWeatherIcon(day.icon)}
              <div>
                <p className="text-white font-medium">{formatDate(day.date)}</p>
                <p className="text-white/70 text-sm capitalize">{day.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white text-lg font-light">
                {Math.round(day.temp_max)}° / {Math.round(day.temp_min)}°
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;