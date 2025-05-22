import { NextSeo } from "next-seo";
import axios from "axios";
import { useState } from "react";
import WeatherCard from "../components/WeatherCard";
import dynamic from "next/dynamic";
import { FaEye, FaGithub } from "react-icons/fa";
import Link from "next/link";
import { Roboto } from "@next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Index() {
  const seo = {
    title: "Tempo Tracker",
    description: "Track weather and view maps with ease.",
  };

  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [tempo, setTempo] = useState(true);
  const [icon, setIcon] = useState(false);
  const [name, setName] = useState("");
  const [degre, setDegre] = useState("");
  const [desc, setDesc] = useState("");
  const [typeIco, setTypeIco] = useState(null);

  const getWeather = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=5e9699131a1fa6d7a82f824d8a6e8c7f&units=metric`
      );
      setLoading(false);
      setLat(response.data.coord.lat);
      setLong(response.data.coord.lon);
      setWeatherData(response.data);
      setDegre(response.data.main.temp);
      setName(response.data.name);
      setDesc(response.data.weather[0].description);
      setTypeIco(response.data.weather[0].icon);
      setIcon(true);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching weather data:", error);
    }
  };

  return (
    <>
      <NextSeo title={seo.title} description={seo.description} />
      <div className={`${roboto.className} absolute top-0 left-0 z-50 w-full`}>
        <header className="bg-slate-900 h-16 shadow-md">
          <div className="container mx-auto h-full px-4 flex justify-between items-center">
            <h4
              onClick={() => (weatherData ? setTempo(true) : null)}
              className="text-white cursor-pointer text-2xl font-bold hover:text-gray-300 transition"
            >
              Tempo Tracker
            </h4>
            <div className="flex space-x-4 items-center">
              {weatherData && (
                <button
                  className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                  onClick={() => setTempo(!tempo)}
                >
                  {tempo ? "Voir la carte" : "Voir les détails"}
                </button>
              )}
              <Link href="https://github.com/Asam237/tempo-tracker">
                <FaGithub
                  className="text-white hover:text-gray-300 transition"
                  size={26}
                />
              </Link>
            </div>
          </div>
        </header>
      </div>
      <div
        className={`bg-[url("../assets/imgs/weather.webp")] bg-no-repeat bg-cover h-screen w-screen z-0 left-0 top-0 absolute`}
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
      <main className="relative z-20 h-screen w-screen">
        {tempo && (
          <div className="flex flex-col items-center justify-center w-screen min-h-screen text-gray-700 p-6">
            <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
              <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Chercher une ville
              </h1>
              <div className="flex items-center space-x-4 mb-6">
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  type="text"
                  className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  placeholder="Entrez une ville..."
                  required
                />
                <button
                  onClick={getWeather}
                  className="p-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
                >
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 19l-4-4m0-7a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
              {loading ? (
                <p className="text-center text-gray-500">Chargement...</p>
              ) : (
                weatherData && <WeatherCard data={weatherData} />
              )}
            </div>
          </div>
        )}
        {!tempo && (
          <div className="flex flex-col w-screen h-screen text-gray-700 p-6 bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200">
            <div>
              <h1 className="font-bold text-gray-800 mb-6 text-2xl text-center">
                Carte de Tempo Tracker
              </h1>
              {icon && (
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold">{degre} °C</span>
                    <span className="text-lg font-medium text-gray-500">
                      {name}
                    </span>
                    <img
                      className="h-16 w-16 object-cover rounded-full border-2 border-gray-300"
                      src={`http://openweathermap.org/img/w/${typeIco}.png`}
                      alt={`${typeIco} icon`}
                    />
                  </div>
                </div>
              )}
              <Map lat={lat} long={long} description={desc} city={city} />
            </div>
          </div>
        )}
      </main>
      <footer className="bg-slate-900 h-16 flex justify-center items-center text-white">
        <p className="text-sm">
          © {new Date().getFullYear()} Abba Sali. Tous droits réservés.
        </p>
      </footer>
    </>
  );
}
