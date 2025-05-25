import { NextSeo } from "next-seo";
import axios from "axios";
import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { FaGithub, FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";
import { Roboto } from "@next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Index() {
  const seo = {
    title: "Tempo - Beautiful Weather",
    description: "Simple, beautiful weather at your fingertips.",
  };

  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData]: any = useState(null);
  const [error, setError] = useState("");
  const [showMap, setShowMap] = useState(false);

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
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=5e9699131a1fa6d7a82f824d8a6e8c7f&units=metric`
      );
      setWeatherData(response.data);
    } catch {
      setError("City not found");
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
    setCity("");
    setError("");
  };

  const getWeatherGradient = () => {
    if (!weatherInfo) return "from-sky-600 via-blue-600 to-blue-700";
    const iconCode = weatherInfo.icon;
    const isDay = iconCode.includes("d");
    if (iconCode.includes("01")) {
      return isDay
        ? "from-amber-400 via-orange-400 to-red-400"
        : "from-indigo-900 via-purple-800 to-pink-700";
    }
    if (iconCode.includes("02")) {
      return isDay
        ? "from-blue-400 via-sky-500 to-cyan-400"
        : "from-slate-800 via-gray-700 to-blue-900";
    }
    if (iconCode.includes("03") || iconCode.includes("04"))
      return "from-gray-400 via-slate-500 to-gray-600";
    if (iconCode.includes("09") || iconCode.includes("10"))
      return "from-slate-600 via-blue-700 to-indigo-800";
    if (iconCode.includes("11"))
      return "from-gray-800 via-slate-700 to-purple-900";
    if (iconCode.includes("13")) return "from-blue-200 via-sky-300 to-cyan-200";
    if (iconCode.includes("50"))
      return "from-gray-500 via-slate-600 to-gray-600";
    return "from-sky-400 via-blue-500 to-blue-600";
  };

  const getWeatherEmoji = () => {
    if (!weatherInfo) return "🌤️";
    const iconCode = weatherInfo.icon;
    if (iconCode.includes("01")) return iconCode.includes("d") ? "☀️" : "🌙";
    if (iconCode.includes("02")) return iconCode.includes("d") ? "⛅" : "☁️";
    if (iconCode.includes("03") || iconCode.includes("04")) return "☁️";
    if (iconCode.includes("09") || iconCode.includes("10")) return "🌧️";
    if (iconCode.includes("11")) return "⛈️";
    if (iconCode.includes("13")) return "❄️";
    if (iconCode.includes("50")) return "🌫️";
    return "🌤️";
  };

  return (
    <>
      <NextSeo title={seo.title} description={seo.description} />
      <div
        className={`min-h-screen bg-gradient-to-br ${getWeatherGradient()} transition-all duration-1000 ${
          roboto.className
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
        <div className="relative z-10 min-h-screen flex flex-col">
          <header className="p-4 sm:p-6">
            <div className="flex flex-wrap justify-between items-center gap-4 max-w-5xl mx-auto">
              <button
                onClick={reset}
                className="text-white text-2xl sm:text-3xl font-normal tracking-wider hover:text-white transition-transform duration-300 hover:scale-110"
              >
                Tempo
              </button>
              <Link href="https://github.com/Asam237/tempo-tracker">
                <FaGithub className="text-white text-xl sm:text-2xl duration-300 hover:scale-110 transition-transform" />
              </Link>
            </div>
          </header>

          <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
            {!showMap ? (
              <div className="w-full max-w-md">
                {!weatherData ? (
                  <div className="text-center space-y-8">
                    <div className="space-y-4">
                      <div className="text-5xl sm:text-6xl mb-4">🌤️</div>
                      <h1 className="text-2xl sm:text-3xl font-light text-white/95 leading-relaxed">
                        What&apos;s the weather
                        <br />
                        <span className="font-normal text-white">
                          like today?
                        </span>
                      </h1>
                    </div>
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          onKeyPress={handleKeyPress}
                          type="text"
                          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 text-base sm:text-lg rounded-2xl px-6 py-4 focus:bg-white/20 focus:border-white/40 focus:outline-none transition-all text-center"
                          placeholder="Enter city name"
                          disabled={loading}
                        />
                        {loading && (
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      {error && (
                        <p className="text-white/80 text-sm font-light">
                          {error}
                        </p>
                      )}
                      <button
                        onClick={getWeather}
                        disabled={loading || !city.trim()}
                        className="w-full bg-white/15 hover:bg-white/25 text-white py-4 rounded-2xl transition-all disabled:opacity-40 backdrop-blur-sm font-light text-base sm:text-lg border border-white/20 hover:border-white/30"
                      >
                        {loading ? "Searching..." : "Get Weather"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-8">
                    <div className="space-y-6">
                      <div className="text-5xl sm:text-6xl mb-4">
                        {getWeatherEmoji()}
                      </div>
                      <div>
                        <h2 className="text-5xl sm:text-7xl font-extralight text-white mb-2">
                          {weatherInfo?.temp}°
                        </h2>
                        <p className="text-white/90 text-lg sm:text-xl font-light capitalize mb-1">
                          {weatherInfo?.description}
                        </p>
                        <p className="text-white/70 text-base sm:text-lg font-light">
                          {weatherInfo?.name}, {weatherInfo?.country}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        {
                          label: "Feels like",
                          value: `${weatherInfo?.feelsLike}°`,
                        },
                        {
                          label: "Humidity",
                          value: `${weatherInfo?.humidity}%`,
                        },
                        {
                          label: "Wind",
                          value: `${weatherInfo?.windSpeed} km/h`,
                        },
                        { label: "Sunrise", value: weatherInfo?.sunrise },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                        >
                          <p className="text-white/60 text-sm font-light mb-1">
                            {item.label}
                          </p>
                          <p className="text-white text-xl font-light">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3 pt-4">
                      <button
                        onClick={() => setShowMap(true)}
                        className="w-full bg-white/15 hover:bg-white/25 text-white py-4 rounded-2xl transition-all backdrop-blur-sm flex items-center justify-center space-x-2 border border-white/20 hover:border-white/30"
                      >
                        <FaMapMarkerAlt className="text-base sm:text-sm" />
                        <span className="font-light">View on Map</span>
                      </button>
                      <button
                        onClick={reset}
                        className="w-full text-white/70 hover:text-white py-3 transition-all font-light"
                      >
                        Search another city
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full px-4 sm:px-0 max-w-5xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20">
                  <div className="p-6 border-b border-white/20">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl sm:text-3xl">
                          {getWeatherEmoji()}
                        </div>
                        <div className="text-white">
                          <h3 className="text-xl sm:text-2xl font-light">
                            {weatherInfo?.name}
                          </h3>
                          <p className="text-white/70 font-light capitalize text-sm sm:text-base">
                            {weatherInfo?.temp}° • {weatherInfo?.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowMap(false)}
                        className="text-white/70 hover:text-white transition-colors font-light text-sm sm:text-lg"
                      >
                        ← Back
                      </button>
                    </div>
                  </div>
                  <div className="h-[300px] sm:h-[500px] bg-white/5">
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

          <footer className="p-4 sm:p-6 text-center">
            <p className="text-white text-xs sm:text-sm font-light leading-6 lg:leading-[24px]">
              Made with ❤️ for weather lovers
              <br />
              {new Date().getFullYear()}{" "}
              <a
                className="underline underline-offset-4 transition-transform duration-300 hover:scale-110"
                href="https://abbasali.cm"
              >
                Abba Sali{" "}
              </a>
              All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
