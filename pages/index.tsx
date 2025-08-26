"use client";

import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  FaGithub,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaSearch,
  FaThermometerHalf,
  FaCloud,
  FaSun,
  FaEye,
  FaTint,
} from "react-icons/fa";
import Link from "next/link";
import {
  getCurrentWeather,
  getWeatherForecast,
  getTouristAttractions,
} from "../utils/weatherApi";
import WeatherForecast from "../components/WeatherForecast";
import TouristAttractions from "../components/TouristAttractions";
import React from "react";

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
      visibility: weatherData.visibility
        ? Math.round(weatherData.visibility / 1000)
        : 10,
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

      const forecast = await getWeatherForecast(
        weather.coord.lat,
        weather.coord.lon
      );
      setForecastData(forecast);

      const touristSpots = await getTouristAttractions(
        weather.coord.lat,
        weather.coord.lon,
        weather.name
      );
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
    if (!weatherInfo) return "from-blue-600 via-purple-600 to-indigo-700";
    const iconCode = weatherInfo.icon;
    const isDay = iconCode.includes("d");

    if (iconCode.includes("01")) {
      return isDay
        ? "from-orange-400 via-yellow-500 to-amber-600"
        : "from-slate-800 via-purple-900 to-indigo-900";
    }
    if (iconCode.includes("02")) {
      return isDay
        ? "from-sky-400 via-blue-500 to-cyan-600"
        : "from-slate-700 via-gray-800 to-blue-900";
    }
    if (iconCode.includes("03") || iconCode.includes("04"))
      return "from-gray-500 via-slate-600 to-gray-700";
    if (iconCode.includes("09") || iconCode.includes("10"))
      return "from-slate-600 via-blue-700 to-indigo-800";
    if (iconCode.includes("11"))
      return "from-gray-800 via-slate-800 to-purple-900";
    if (iconCode.includes("13"))
      return "from-slate-300 via-blue-200 to-cyan-300";
    if (iconCode.includes("50"))
      return "from-gray-600 via-slate-700 to-gray-800";
    return "from-blue-600 via-purple-600 to-indigo-700";
  };

  const getWeatherIcon = (size = "text-6xl") => {
    if (!weatherInfo)
      return <FaSun className={`${size} text-yellow-400 drop-shadow-lg`} />;
    const iconCode = weatherInfo.icon;
    const isDay = iconCode.includes("d");

    if (iconCode.includes("01"))
      return (
        <FaSun
          className={`${size} ${
            isDay ? "text-yellow-400" : "text-blue-300"
          } drop-shadow-lg filter`}
        />
      );
    if (iconCode.includes("02"))
      return <FaCloud className={`${size} text-gray-300 drop-shadow-lg`} />;
    if (iconCode.includes("03") || iconCode.includes("04"))
      return <FaCloud className={`${size} text-gray-400 drop-shadow-lg`} />;
    if (iconCode.includes("09") || iconCode.includes("10"))
      return <FaCloud className={`${size} text-blue-400 drop-shadow-lg`} />;
    if (iconCode.includes("11"))
      return <FaCloud className={`${size} text-purple-400 drop-shadow-lg`} />;
    if (iconCode.includes("13"))
      return <FaCloud className={`${size} text-blue-200 drop-shadow-lg`} />;
    if (iconCode.includes("50"))
      return <FaCloud className={`${size} text-gray-500 drop-shadow-lg`} />;
    return <FaSun className={`${size} text-yellow-400 drop-shadow-lg`} />;
  };

  const getWeatherAdvice = () => {
    if (!weatherInfo) return [];
    const temp = weatherInfo.temp;
    const humidity = weatherInfo.humidity;
    const windSpeed = weatherInfo.windSpeed;

    const advice = [];

    if (temp > 25) {
      advice.push({
        icon: "🌡️",
        text: "Il fait chaud, pensez à vous hydrater régulièrement",
        type: "hot",
      });
    } else if (temp < 10) {
      advice.push({
        icon: "🧥",
        text: "Il fait frais, n'oubliez pas votre veste",
        type: "cold",
      });
    } else {
      advice.push({
        icon: "🌡️",
        text: "Température idéale pour les activités extérieures",
        type: "perfect",
      });
    }

    if (humidity > 70) {
      advice.push({
        icon: "💧",
        text: "Humidité élevée, l'air peut sembler lourd",
        type: "humid",
      });
    } else if (humidity < 30) {
      advice.push({
        icon: "💧",
        text: "Air sec, pensez à vous hydrater",
        type: "dry",
      });
    } else {
      advice.push({
        icon: "💧",
        text: "Humidité confortable",
        type: "perfect",
      });
    }

    if (windSpeed > 20) {
      advice.push({
        icon: "🌬️",
        text: "Vent fort, attention aux objets légers",
        type: "windy",
      });
    } else if (windSpeed > 10) {
      advice.push({
        icon: "🌬️",
        text: "Vent modéré, parfait pour faire voler un cerf-volant",
        type: "breezy",
      });
    } else {
      advice.push({
        icon: "🌬️",
        text: "Vent calme, idéal pour une promenade",
        type: "calm",
      });
    }

    return advice;
  };

  return (
    <div className="min-h-screen">
      {/* Background avec gradient dynamique */}
      <div
        className={`fixed inset-0 bg-gradient-to-br ${getWeatherGradient()} transition-all duration-1000`}
      >
        {/* Éléments d'arrière-plan animés */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse animation-delay-500"></div>
        </div>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 md:p-6 border-b border-white/10 backdrop-blur-sm bg-white/5">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button
              onClick={reset}
              className="text-white hover:text-white hover:bg-white/10 text-xl md:text-2xl font-light tracking-wide p-2 h-auto rounded-xl transition-all duration-300 hover:scale-105 group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                  <span className="text-lg">🌤️</span>
                </div>
                <span className="hidden sm:inline">Tempo Weather</span>
              </div>
            </button>

            <Link href="https://github.com/Asam237/tempo-tracker">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-110 border border-white/20">
                <FaGithub className="text-white text-xl" />
              </div>
            </Link>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            {!showMap ? (
              <>
                {!weatherData ? (
                  /* Interface de recherche */
                  <div className="flex items-center justify-center min-h-[70vh]">
                    <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                      <div className="text-center space-y-6">
                        <div className="mx-auto w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 relative">
                          <div className="text-4xl animate-bounce">
                            {getWeatherIcon("text-4xl")}
                          </div>
                          <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl"></div>
                        </div>

                        <div>
                          <h1 className="text-2xl md:text-3xl font-light text-white mb-2 tracking-wide">
                            Découvrez la météo
                          </h1>
                          <p className="text-white/70 font-light leading-relaxed">
                            Entrez le nom de votre ville pour commencer
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                            <div className="relative">
                              <input
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Nom de la ville..."
                                disabled={loading}
                                className="w-full bg-white/20 border border-white/30 text-white placeholder:text-white/50 h-14 text-center rounded-2xl px-6 focus:bg-white/25 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-light text-lg backdrop-blur-md"
                              />
                              <button
                                onClick={getWeather}
                                disabled={loading || !city.trim()}
                                className="absolute right-2 top-2 h-10 w-10 bg-white/20 hover:bg-white/30 rounded-xl transition-all disabled:opacity-40 backdrop-blur-sm flex items-center justify-center group"
                              >
                                {loading ? (
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                  <FaSearch className="text-white text-sm group-hover:scale-110 transition-transform" />
                                )}
                              </button>
                            </div>
                          </div>

                          {error && (
                            <div className="bg-red-500/20 border border-red-400/50 rounded-2xl p-4 backdrop-blur-sm">
                              <p className="text-white/90 text-sm font-light flex items-center justify-center">
                                <span className="mr-2">⚠️</span>
                                {error}
                              </p>
                            </div>
                          )}

                          <button
                            onClick={getWeather}
                            disabled={loading || !city.trim()}
                            className="w-full bg-white/20 hover:bg-white/30 text-white h-14 rounded-2xl font-light text-lg border border-white/30 hover:border-white/40 transition-all disabled:opacity-40 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-[1.02] transform"
                          >
                            {loading ? (
                              <div className="flex items-center justify-center space-x-3">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Recherche...</span>
                              </div>
                            ) : (
                              "Obtenir la météo"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Affichage météo */
                  <div className="space-y-8">
                    {/* Affichage principal de la météo */}
                    <div className="text-center space-y-6">
                      <div className="relative inline-block">
                        <div className="text-7xl sm:text-8xl mb-4 animate-pulse">
                          {getWeatherIcon("text-7xl sm:text-8xl")}
                        </div>
                        <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl -z-10"></div>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-6xl md:text-8xl font-extralight text-white tracking-tight">
                          {weatherInfo?.temp}°
                        </h2>
                        <p className="text-xl md:text-2xl text-white/90 font-light capitalize">
                          {weatherInfo?.description}
                        </p>
                        <div className="flex items-center justify-center space-x-2 text-white/70">
                          <FaMapMarkerAlt className="text-sm" />
                          <span className="text-lg">
                            {weatherInfo?.name}, {weatherInfo?.country}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Grille des métriques météo */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          label: "Ressenti",
                          value: `${weatherInfo?.feelsLike}°`,
                          icon: <FaThermometerHalf className="w-5 h-5" />,
                          color: "text-orange-400",
                        },
                        {
                          label: "Humidité",
                          value: `${weatherInfo?.humidity}%`,
                          icon: <FaTint className="w-5 h-5" />,
                          color: "text-blue-400",
                        },
                        {
                          label: "Vent",
                          value: `${weatherInfo?.windSpeed} km/h`,
                          icon: <FaCloud className="w-5 h-5" />,
                          color: "text-gray-400",
                        },
                        {
                          label: "Visibilité",
                          value: `${weatherInfo?.visibility} km`,
                          icon: <FaEye className="w-5 h-5" />,
                          color: "text-green-400",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 group"
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <div
                              className={`${item.color} group-hover:scale-110 transition-transform`}
                            >
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

                    {/* Heures de lever/coucher du soleil */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-md rounded-2xl p-6 border border-orange-400/30">
                        <div className="flex items-center space-x-3 mb-2">
                          <FaSun className="w-5 h-5 text-orange-400" />
                          <span className="text-white/80 font-light">
                            Lever du soleil
                          </span>
                        </div>
                        <p className="text-2xl font-light text-white">
                          {weatherInfo?.sunrise}
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30">
                        <div className="flex items-center space-x-3 mb-2">
                          <FaSun className="w-5 h-5 text-purple-400" />
                          <span className="text-white/80 font-light">
                            Coucher du soleil
                          </span>
                        </div>
                        <p className="text-2xl font-light text-white">
                          {weatherInfo?.sunset}
                        </p>
                      </div>
                    </div>

                    {/* Onglets */}
                    <div className="flex justify-center">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
                        <div className="flex space-x-2">
                          {[
                            { id: "weather", label: "Détails", icon: "🌤️" },
                            { id: "forecast", label: "Prévisions", icon: "📅" },
                            {
                              id: "attractions",
                              label: "Tourisme",
                              icon: "🏛️",
                            },
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
                                <span className="text-white/70">Pression</span>
                                <span className="text-white font-light">
                                  {weatherInfo?.pressure} hPa
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                <span className="text-white/70">Index UV</span>
                                <span className="text-white font-light bg-white/20 px-2 py-1 rounded-lg text-sm">
                                  Modéré
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <h3 className="text-white text-xl font-light mb-6 flex items-center">
                              <span className="mr-3 text-2xl">💡</span>
                              Conseils personnalisés
                            </h3>
                            <div className="space-y-3">
                              {getWeatherAdvice().map((advice, index) => (
                                <div
                                  key={index}
                                  className="p-3 bg-white/5 rounded-xl flex items-start space-x-3"
                                >
                                  <span className="text-lg">{advice.icon}</span>
                                  <p className="text-white/80 text-sm font-light flex-1">
                                    {advice.text}
                                  </p>
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
                        <TouristAttractions
                          attractions={attractions}
                          cityName={weatherInfo?.name || ""}
                        />
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                      <button
                        onClick={() => setShowMap(true)}
                        className="bg-white/20 hover:bg-white/30 text-white border border-white/30 h-12 px-8 rounded-2xl transition-all hover:scale-105 transform backdrop-blur-md flex items-center justify-center space-x-3 shadow-lg"
                      >
                        <FaMapMarkerAlt className="text-lg" />
                        <span className="font-light text-lg">
                          Voir sur la carte
                        </span>
                      </button>
                      <button
                        onClick={reset}
                        className="text-white hover:text-white hover:bg-white/10 h-12 px-8 rounded-2xl transition-all font-light text-lg"
                      >
                        Nouvelle recherche
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Vue carte */
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                  <div className="p-6 border-b border-white/20 bg-gradient-to-r from-white/5 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl md:text-4xl">
                          {getWeatherIcon("text-3xl md:text-4xl")}
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-light text-white">
                            {weatherInfo?.name}
                          </h3>
                          <p className="text-white/70 font-light">
                            {weatherInfo?.temp}° • {weatherInfo?.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowMap(false)}
                        className="text-white hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-all font-light text-lg flex items-center space-x-2"
                      >
                        <FaChevronLeft className="text-sm" />
                        <span>Retour</span>
                      </button>
                    </div>
                  </div>
                  <div className="h-[400px] md:h-[600px] bg-white/5">
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
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center border-t border-white/10 backdrop-blur-sm bg-white/5">
          <div className="max-w-2xl mx-auto">
            <p className="text-white/60 text-sm font-light">
              Créé avec ❤️ pour les passionnés de météo
            </p>
            <p className="text-white/40 text-xs mt-2">
              © {new Date().getFullYear()}{" "}
              <a
                className="text-white/60 hover:text-white underline underline-offset-4 transition-colors"
                href="https://abbasali.cm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Abba Sali Aboubakar Mamate
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
