import { NextSeo } from "next-seo";
import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { FaGithub, FaMapMarkerAlt, FaChevronLeft, FaSearch } from "react-icons/fa";
import { 
  CloudIcon, 
  SunIcon, 
  CloudRainIcon, 
  EyeIcon,
  WindIcon,
  DropletIcon,
  ThermometerIcon,
  SunriseIcon,
  SunsetIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Roboto } from "@next/font/google";
import { getCurrentWeather, getWeatherForecast, getTouristAttractions } from "../utils/weatherApi";
import WeatherForecast from "../components/WeatherForecast";
import TouristAttractions from "../components/TouristAttractions";
import React from "react";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const Map = dynamic(() => import("../components/Map"), { ssr: false });

const Home: React.FC = () => {
  const seo = {
    title: "Tempo - Beautiful Weather",
    description: "Simple, beautiful weather at your fingertips.",
  };

  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData]: any = useState(null);
  const [forecastData, setForecastData]: any = useState(null);
  const [attractions, setAttractions]: any = useState([]);
  const [error, setError] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [activeTab, setActiveTab] = useState("weather");

  const weatherInfo = useMemo(() => {
    if (!weatherData) return null;
    return {
      lat: weatherData.coord.lat,
      lng: weatherData.coord.lon,
      temp: Math.round(weatherData.main.temp),
      name: weatherData.name,
      country: weatherData.sys.country,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      feelsLike: Math.round(weatherData.main.feels_like),
      humidity: weatherData.main.humidity,
      windSpeed: Math.round(weatherData.wind.speed * 3.6),
      pressure: weatherData.main.pressure,
      visibility: weatherData.visibility ? Math.round(weatherData.visibility / 1000) : 10,
      sunrise: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sunset: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  }, [weatherData]);

  const getWeather = useCallback(async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError("");
    try {
      const weather = await getCurrentWeather(city);
      setWeatherData(weather);
      
      const forecast = await getWeatherForecast(weather.coord.lat, weather.coord.lon);
      setForecastData(forecast);
      
      const touristSpots = await getTouristAttractions(weather.coord.lat, weather.coord.lon, weather.name);
      setAttractions(touristSpots);
    } catch (err: any) {
      setError(err.message || "Ville non trouvée");
    } finally {
      setLoading(false);
    }
  }, [city]);

  const handleKeyPress = useCallback(
    (e: any) => {
      if (e.key === "Enter") getWeather();
    },
    [getWeather]
  );

  const reset = () => {
    setShowMap(false);
    setWeatherData(null);
    setForecastData(null);
    setAttractions([]);
    setCity("");
    setError("");
    setActiveTab("weather");
  };

  const getWeatherGradient = () => {
    if (!weatherInfo) return "from-indigo-600 via-purple-600 to-pink-600";
    const iconCode = weatherInfo.icon;
    const isDay = iconCode.includes("d");
    
    if (iconCode.includes("01")) {
      return isDay
        ? "from-yellow-400 via-orange-500 to-red-500"
        : "from-indigo-900 via-purple-900 to-pink-900";
    }
    if (iconCode.includes("02")) {
      return isDay
        ? "from-blue-400 via-sky-500 to-cyan-500"
        : "from-slate-800 via-gray-800 to-blue-900";
    }
    if (iconCode.includes("03") || iconCode.includes("04"))
      return "from-gray-500 via-slate-600 to-gray-700";
    if (iconCode.includes("09") || iconCode.includes("10"))
      return "from-slate-700 via-blue-800 to-indigo-900";
    if (iconCode.includes("11"))
      return "from-gray-900 via-slate-800 to-purple-900";
    if (iconCode.includes("13")) 
      return "from-blue-100 via-sky-200 to-cyan-300";
    if (iconCode.includes("50"))
      return "from-gray-600 via-slate-700 to-gray-800";
    return "from-indigo-600 via-purple-600 to-pink-600";
  };

  const getWeatherIcon = (size = "text-6xl") => {
    if (!weatherInfo) return <SunIcon className={`${size} text-yellow-400`} />;
    const iconCode = weatherInfo.icon;
    const isDay = iconCode.includes("d");
    
    if (iconCode.includes("01")) 
      return <SunIcon className={`${size} ${isDay ? 'text-yellow-400' : 'text-blue-300'}`} />;
    if (iconCode.includes("02")) 
      return <CloudIcon className={`${size} text-gray-300`} />;
    if (iconCode.includes("03") || iconCode.includes("04")) 
      return <CloudIcon className={`${size} text-gray-400`} />;
    if (iconCode.includes("09") || iconCode.includes("10")) 
      return <CloudRainIcon className={`${size} text-blue-400`} />;
    if (iconCode.includes("11")) 
      return <CloudRainIcon className={`${size} text-purple-400`} />;
    if (iconCode.includes("13")) 
      return <CloudIcon className={`${size} text-blue-200`} />;
    if (iconCode.includes("50")) 
      return <CloudIcon className={`${size} text-gray-500`} />;
    return <SunIcon className={`${size} text-yellow-400`} />;
  };

  const getWeatherAdvice = () => {
    if (!weatherInfo) return [];
    const temp = weatherInfo.temp;
    const humidity = weatherInfo.humidity;
    const windSpeed = weatherInfo.windSpeed;
    
    const advice = [];
    
    if (temp > 25) {
      advice.push("🌡️ Il fait chaud, pensez à vous hydrater régulièrement");
    } else if (temp < 10) {
      advice.push("🧥 Il fait frais, n'oubliez pas votre veste");
    } else {
      advice.push("🌡️ Température idéale pour les activités extérieures");
    }
    
    if (humidity > 70) {
      advice.push("💧 Humidité élevée, l'air peut sembler lourd");
    } else if (humidity < 30) {
      advice.push("💧 Air sec, pensez à vous hydrater");
    } else {
      advice.push("💧 Humidité confortable");
    }
    
    if (windSpeed > 20) {
      advice.push("🌬️ Vent fort, attention aux objets légers");
    } else if (windSpeed > 10) {
      advice.push("🌬️ Vent modéré, parfait pour faire voler un cerf-volant");
    } else {
      advice.push("🌬️ Vent calme, idéal pour une promenade");
    }
    
    return advice;
  };

  return (
    <>
      <NextSeo title={seo.title} description={seo.description} />
      <div
        className={`min-h-screen bg-gradient-to-br ${getWeatherGradient()} transition-all duration-1000 ${
          roboto.className
        } relative overflow-hidden`}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10" />
        
        <div className="relative z-10 min-h-screen flex flex-col">
          <header className="p-4 sm:p-6">
            <div className="flex flex-wrap justify-between items-center gap-4 max-w-7xl mx-auto">
              <button
                onClick={reset}
                className="text-white text-2xl sm:text-3xl font-light tracking-wider hover:text-white/80 transition-all duration-300 hover:scale-105 flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <span className="text-lg">🌤️</span>
                </div>
                <span>Tempo</span>
              </button>
              <Link href="https://github.com/Asam237/tempo-tracker">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-110">
                  <FaGithub className="text-white text-xl" />
                </div>
              </Link>
            </div>
          </header>

          <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
            {!showMap ? (
              <div className="w-full max-w-6xl mx-auto">
                {!weatherData ? (
                  <div className="text-center space-y-8 max-w-md mx-auto">
                    <div className="space-y-6">
                      <div className="relative">
                        <div className="text-8xl sm:text-9xl mb-6 animate-bounce">
                          {getWeatherIcon("text-8xl sm:text-9xl")}
                        </div>
                        <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl"></div>
                      </div>
                      <h1 className="text-3xl sm:text-4xl font-light text-white/95 leading-relaxed">
                        Découvrez la météo
                        <br />
                        <span className="font-normal text-white bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                          de votre ville
                        </span>
                      </h1>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                        <div className="relative flex items-center">
                          <input
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            onKeyPress={handleKeyPress}
                            type="text"
                            className="w-full bg-white/15 backdrop-blur-md border border-white/30 text-white placeholder-white/60 text-lg rounded-2xl pl-6 pr-14 py-5 focus:bg-white/25 focus:border-white/50 focus:outline-none transition-all text-center font-light shadow-2xl"
                            placeholder="Entrez le nom de votre ville"
                            disabled={loading}
                          />
                          <button
                            onClick={getWeather}
                            disabled={loading || !city.trim()}
                            className="absolute right-2 p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all disabled:opacity-40 backdrop-blur-sm"
                          >
                            {loading ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                              <FaSearch className="text-white text-sm" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {error && (
                        <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-4 backdrop-blur-sm">
                          <p className="text-white/90 text-sm font-light flex items-center justify-center">
                            <span className="mr-2">⚠️</span>
                            {error}
                          </p>
                        </div>
                      )}
                      
                      <button
                        onClick={getWeather}
                        disabled={loading || !city.trim()}
                        className="w-full bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white py-5 rounded-2xl transition-all disabled:opacity-40 backdrop-blur-md font-light text-lg border border-white/30 hover:border-white/40 shadow-2xl hover:shadow-white/10 hover:scale-[1.02] transform"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center space-x-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Recherche en cours...</span>
                          </div>
                        ) : (
                          "Obtenir la météo"
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Header météo principal */}
                    <div className="text-center space-y-6">
                      <div className="relative inline-block">
                        <div className="text-7xl sm:text-8xl mb-4 animate-pulse">
                          {getWeatherIcon("text-7xl sm:text-8xl")}
                        </div>
                        <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl"></div>
                      </div>
                      
                      <div className="space-y-2">
                        <h2 className="text-6xl sm:text-8xl font-extralight text-white mb-2 tracking-tight">
                          {weatherInfo?.temp}°
                        </h2>
                        <p className="text-white/90 text-xl sm:text-2xl font-light capitalize">
                          {weatherInfo?.description}
                        </p>
                        <p className="text-white/70 text-lg sm:text-xl font-light flex items-center justify-center space-x-2">
                          <FaMapMarkerAlt className="text-sm" />
                          <span>{weatherInfo?.name}, {weatherInfo?.country}</span>
                        </p>
                      </div>
                    </div>

                    {/* Grille des informations météo */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          label: "Ressenti",
                          value: `${weatherInfo?.feelsLike}°`,
                          icon: <ThermometerIcon className="w-6 h-6" />,
                          color: "text-orange-400"
                        },
                        {
                          label: "Humidité",
                          value: `${weatherInfo?.humidity}%`,
                          icon: <DropletIcon className="w-6 h-6" />,
                          color: "text-blue-400"
                        },
                        {
                          label: "Vent",
                          value: `${weatherInfo?.windSpeed} km/h`,
                          icon: <WindIcon className="w-6 h-6" />,
                          color: "text-gray-400"
                        },
                        {
                          label: "Visibilité",
                          value: `${weatherInfo?.visibility} km`,
                          icon: <EyeIcon className="w-6 h-6" />,
                          color: "text-green-400"
                        },
                      ].map((item, index) => (
                        <div
                          key={item.label}
                          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 group"
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`${item.color} group-hover:scale-110 transition-transform`}>
                              {item.icon}
                            </div>
                            <p className="text-white/60 text-sm font-light">
                              {item.label}
                            </p>
                          </div>
                          <p className="text-white text-2xl font-light">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Lever/Coucher du soleil */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-md rounded-2xl p-6 border border-orange-400/30">
                        <div className="flex items-center space-x-3 mb-2">
                          <SunriseIcon className="w-6 h-6 text-orange-400" />
                          <p className="text-white/80 text-sm font-light">Lever du soleil</p>
                        </div>
                        <p className="text-white text-2xl font-light">{weatherInfo?.sunrise}</p>
                      </div>
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30">
                        <div className="flex items-center space-x-3 mb-2">
                          <SunsetIcon className="w-6 h-6 text-purple-400" />
                          <p className="text-white/80 text-sm font-light">Coucher du soleil</p>
                        </div>
                        <p className="text-white text-2xl font-light">{weatherInfo?.sunset}</p>
                      </div>
                    </div>

                    {/* Navigation par onglets */}
                    <div className="flex justify-center">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
                        <div className="flex space-x-2">
                          {[
                            { id: "weather", label: "Détails", icon: "🌤️" },
                            { id: "forecast", label: "Prévisions", icon: "📅" },
                            { id: "attractions", label: "Tourisme", icon: "🏛️" },
                          ].map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`px-6 py-3 rounded-xl text-sm font-light transition-all flex items-center space-x-2 ${
                                activeTab === tab.id
                                  ? "bg-white/20 text-white shadow-lg scale-105"
                                  : "text-white/70 hover:text-white hover:bg-white/10"
                              }`}
                            >
                              <span className="text-lg">{tab.icon}</span>
                              <span>{tab.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Contenu des onglets */}
                    <div className="min-h-[300px]">
                      {activeTab === "weather" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <h3 className="text-white text-xl font-light mb-6 flex items-center">
                              <span className="mr-3 text-2xl">📊</span>
                              Informations détaillées
                            </h3>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                <span className="text-white/70 flex items-center">
                                  <span className="mr-2">🌡️</span>
                                  Pression
                                </span>
                                <span className="text-white font-light">{weatherInfo?.pressure} hPa</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                <span className="text-white/70 flex items-center">
                                  <span className="mr-2">☁️</span>
                                  Couverture nuageuse
                                </span>
                                <span className="text-white font-light">Modérée</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                <span className="text-white/70 flex items-center">
                                  <span className="mr-2">🌡️</span>
                                  Index UV
                                </span>
                                <span className="text-white font-light">Modéré</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <h3 className="text-white text-xl font-light mb-6 flex items-center">
                              <span className="mr-3 text-2xl">💡</span>
                              Conseils personnalisés
                            </h3>
                            <div className="space-y-4">
                              {getWeatherAdvice().map((advice, index) => (
                                <div key={index} className="p-3 bg-white/5 rounded-xl">
                                  <p className="text-white/80 text-sm font-light">{advice}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {activeTab === "forecast" && forecastData && (
                        <WeatherForecast forecast={forecastData} />
                      )}
                      
                      {activeTab === "attractions" && (
                        <TouristAttractions attractions={attractions} cityName={weatherInfo?.name || ""} />
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => setShowMap(true)}
                        className="bg-white/15 hover:bg-white/25 text-white py-4 px-8 rounded-2xl transition-all backdrop-blur-md flex items-center justify-center space-x-3 border border-white/20 hover:border-white/30 hover:scale-105 transform shadow-lg"
                      >
                        <FaMapMarkerAlt className="text-lg" />
                        <span className="font-light text-lg">Voir sur la carte</span>
                      </button>
                      <button
                        onClick={reset}
                        className="text-white/70 hover:text-white py-4 px-8 transition-all font-light text-lg hover:bg-white/10 rounded-2xl"
                      >
                        Nouvelle recherche
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full px-4 sm:px-0 max-w-6xl mx-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                  <div className="p-6 border-b border-white/20 bg-gradient-to-r from-white/5 to-transparent">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl sm:text-4xl">
                          {getWeatherIcon("text-3xl sm:text-4xl")}
                        </div>
                        <div className="text-white">
                          <h3 className="text-2xl sm:text-3xl font-light">
                            {weatherInfo?.name}
                          </h3>
                          <p className="text-white/70 font-light capitalize text-lg">
                            {weatherInfo?.temp}° • {weatherInfo?.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowMap(false)}
                        className="flex items-center space-x-2 text-white/70 hover:text-white transition-all font-light text-lg bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm"
                      >
                        <FaChevronLeft className="text-sm" />
                        <span>Retour</span>
                      </button>
                    </div>
                  </div>
                  <div className="h-[400px] sm:h-[600px] bg-white/5 relative overflow-hidden">
                    <Map
                      lat={weatherInfo?.lat}
                      long={weatherInfo?.lng}
                      description={weatherInfo?.description}
                      city={weatherInfo?.name}
                    />
                  </div>
                </div>
              </div>
            )}
          </main>

          <footer className="p-6 text-center">
            <div className="max-w-2xl mx-auto">
              <p className="text-white/60 text-sm font-light leading-relaxed">
                Créé avec ❤️ pour les passionnés de météo
                <br />
                © {new Date().getFullYear()}{" "}
                <a
                  className="text-white/80 hover:text-white underline underline-offset-4 transition-all duration-300 hover:scale-105 inline-block"
                  href="https://abbasali.cm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abba Sali Aboubakar Mamate
                </a>
                {" "}• Tous droits réservés
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );