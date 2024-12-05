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
    description: "Tempo Tracker",
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
        <header className="bg-slate-900 h-14">
          <div className="container mx-auto h-full">
            <div className="flex justify-between items-center h-full">
              <h4
                onClick={() => (weatherData ? setTempo(true) : null)}
                className="text-white cursor-pointer hover:cursor-pointer text-2xl font-bold"
              >
                Tempo Tracker
              </h4>
              <div className="flex space-x-2 justify-center items-center">
                {weatherData && !tempo && (
                  <h4
                    className="cursor-pointer mr-4 text-white bg-slate-900 border-2 rounded-full px-4 py-1.5 text-sm hover:bg-white hover:text-slate-900 hover:font-bold"
                    onClick={() => setTempo(!tempo)}
                  >
                    Voir les details
                  </h4>
                )}
                {weatherData && tempo && (
                  <h4
                    className="cursor-pointer mr-4 text-white bg-slate-900 border-2 rounded-full px-4 py-1.5 text-sm hover:bg-white hover:text-slate-900 hover:font-bold"
                    onClick={() => setTempo(!tempo)}
                  >
                    Voir la carte
                  </h4>
                )}
                <Link href={"https://github.com/Asam237/tempo-tracker"}>
                  <FaGithub color="white" size={26} />
                </Link>
              </div>
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
          <div className="z-20">
            <div className="flex flex-col items-center justify-center w-screen min-h-screen text-gray-700 p-10">
              <div className="w-full max-w-screen-sm bg-white p-10 rounded-xl ring-8 ring-white ring-opacity-40">
                <h1 className="text-lg xl:text-3xl font-bold text-gray-800 mb-6 flex justify-between items-center">
                  Chercher une ville
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2 w-full">
                    <div className="relative w-full">
                      <input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        type="text"
                        id="simple-search"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 w-full"
                        placeholder="Enter city.."
                        required
                      />
                    </div>
                    <button
                      onClick={getWeather}
                      className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                      </svg>
                      <span className="sr-only">Search</span>
                    </button>
                  </div>
                </div>
                {loading ? (
                  <p className="flex justify-center items-center p-8">
                    Loading...
                  </p>
                ) : (
                  weatherData && <WeatherCard data={weatherData} />
                )}
              </div>
            </div>
          </div>
        )}
        {tempo == false && (
          <div className="flex flex-col w-screen h-screen text-gray-700 p-10 bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 ">
            <div>
              <h1 className="font-bold text-gray-800 mb-6 flex justify-between items-center blug-800">
                <span className="hidden xl:flex text-xl">
                  Tempo Tracker Map
                </span>
                {icon && (
                  <div className={"overflow-hidden"}>
                    <div className="flex flex-row space-x-4 items-center justify-center">
                      <span className="text-xs md:text-lg font-bold">
                        {degre} °C
                      </span>
                      <span className="text-xs md:text-lg font-semibold mt-1 text-gray-500">
                        {name}
                      </span>
                      <img
                        className="h-auto w-14 md:w-20 object-cover"
                        src={`http://openweathermap.org/img/w/${typeIco}.png`}
                        alt={`${typeIco} icon`}
                      />
                      <FaEye
                        size={20}
                        className="cursor-pointer mr-4"
                        onClick={() => setTempo(!tempo)}
                      />
                    </div>
                  </div>
                )}
              </h1>
              <Map lat={lat} long={long} description={desc} city={city} />
            </div>
          </div>
        )}
      </main>
      <footer className="bg-slate-900 h-14 absolute bottom-0 left-0 right-0 text-white flex justify-center items-center">
        <p className="text-sm text-white">
          © Abba Sali | Copyright {new Date().getFullYear()}. All rights
          reserved.
        </p>
      </footer>
    </>
  );
}
