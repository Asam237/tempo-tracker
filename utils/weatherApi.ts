const API_KEY = "5e9699131a1fa6d7a82f824d8a6e8c7f";

export interface WeatherData {
  coord: { lat: number; lon: number };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: { speed: number };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  name: string;
  visibility?: number;
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp_max: number;
      temp_min: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
  }>;
}

export const getCurrentWeather = async (city: string): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${API_KEY}&units=metric&lang=fr`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Ville non trouvée. Vérifiez l'orthographe.");
      } else if (response.status === 401) {
        throw new Error("Erreur d'authentification API.");
      } else {
        throw new Error("Erreur lors de la récupération des données météo.");
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erreur de connexion. Vérifiez votre connexion internet.");
  }
};

export const getWeatherForecast = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des prévisions");
    }

    const data: ForecastData = await response.json();

    // Grouper par jour et prendre les valeurs min/max
    const dailyForecasts = data.list.reduce((acc: any, item) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!acc[date]) {
        acc[date] = {
          date: new Date(item.dt * 1000).toISOString(),
          temp_max: item.main.temp_max,
          temp_min: item.main.temp_min,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        };
      } else {
        acc[date].temp_max = Math.max(acc[date].temp_max, item.main.temp_max);
        acc[date].temp_min = Math.min(acc[date].temp_min, item.main.temp_min);
      }
      return acc;
    }, {});

    return Object.values(dailyForecasts).slice(0, 3);
  } catch (error) {
    console.error("Erreur lors de la récupération des prévisions:", error);
    return [];
  }
};

export const getTouristAttractions = async (
  lat: number,
  lon: number,
  cityName: string
) => {
  try {
    // Simulation d'une API de sites touristiques avec des données plus réalistes
    const attractionTypes = [
      { type: "Musée", emoji: "🏛️", baseRating: 4.3 },
      { type: "Site historique", emoji: "🏰", baseRating: 4.5 },
      { type: "Parc", emoji: "🌳", baseRating: 4.1 },
      { type: "Monument religieux", emoji: "⛪", baseRating: 4.6 },
      { type: "Marché", emoji: "🏪", baseRating: 4.0 },
      { type: "Place publique", emoji: "🏛️", baseRating: 4.2 },
      { type: "Jardin botanique", emoji: "🌺", baseRating: 4.4 },
    ];

    const mockAttractions = attractionTypes
      .slice(0, 5)
      .map((attraction, index) => ({
        name: `${attraction.type} ${
          index === 0
            ? "principal"
            : index === 1
            ? "historique"
            : index === 2
            ? "central"
            : index === 3
            ? "Notre-Dame"
            : "local"
        } de ${cityName}`,
        rating:
          Math.round(
            (attraction.baseRating + (Math.random() * 0.4 - 0.2)) * 10
          ) / 10,
        distance: `${(0.3 + Math.random() * 1.7).toFixed(1)} km`,
        type: attraction.type,
      }));

    await new Promise((resolve) =>
      setTimeout(resolve, 800 + Math.random() * 400)
    );

    return mockAttractions;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des sites touristiques:",
      error
    );
    return [];
  }
};
