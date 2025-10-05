import { useState } from "react";

export default function Meteo() {
  const [city, setCity] = useState("Maroua");
  const [weather, setWeather]: any = useState(null);
  const [analyse, setAnalyse] = useState("");

  const API_KEY = "5e9699131a1fa6d7a82f824d8a6e8c7f";

  const getWeather = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&lang=fr`
      );

      if (!response.ok) throw new Error("Erreur API météo");

      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error(error);
      alert("Impossible de récupérer la météo");
    }
  };

  const handleAnalyse = async () => {
    if (!weather) return alert("Charge d'abord la météo !");

    try {
      const response = await fetch(
        "https://n8n.abbasali.cm/webhook-test/weather",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: weather.name,
            temperature: weather.main.temp,
            humidity: weather.main.humidity,
            forecast: weather.weather[0].description,
          }),
        }
      );

      if (!response.ok) throw new Error("Erreur côté n8n");

      const data = await response.json();

      // Vérifie que n8n renvoie bien {status, insight}
      if (data.status === "ok" && data.insight) {
        setAnalyse(data.insight);
      } else {
        console.warn("Réponse inattendue :", data);
        setAnalyse("⚠️ Impossible d'obtenir l'analyse depuis n8n");
      }
    } catch (error) {
      console.error(error);
      setAnalyse("Erreur lors de la communication avec n8n");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">🌦️ Application Météo</h1>

      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Entrer une ville"
        className="border px-2 py-1 rounded w-full mb-2"
      />

      <button
        onClick={getWeather}
        className="bg-green-500 text-white px-4 py-2 rounded w-full"
      >
        Obtenir la météo
      </button>

      {weather && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h2 className="font-semibold">{weather.name}</h2>
          <p>🌡 Température : {weather.main.temp}°C</p>
          <p>💧 Humidité : {weather.main.humidity}%</p>
          <p>📖 Prévision : {weather.weather[0].description}</p>

          <button
            onClick={handleAnalyse}
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Analyse avec n8n
          </button>
        </div>
      )}

      {analyse && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h2 className="font-semibold">🔎 Analyse n8n :</h2>
          <p>{analyse}</p>
        </div>
      )}
    </div>
  );
}
