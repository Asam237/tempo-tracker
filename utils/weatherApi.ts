const API_KEY = "5e9699131a1fa6d7a82f824d8a6e8c7f";

export interface WeatherData {
  coord: { lat: number; lon: number };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
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
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`
  );
  if (!response.ok) throw new Error("Ville non trouvée");
  return response.json();
};

export const getWeatherForecast = async (lat: number, lon: number) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`
  );
  if (!response.ok) throw new Error("Erreur lors de la récupération des prévisions");
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
};

export const getTouristAttractions = async (lat: number, lon: number, cityName: string) => {
  // Simulation d'une API de sites touristiques
  // En production, vous pourriez utiliser Google Places API, Foursquare, etc.
  const mockAttractions = [
    {
      name: `Musée principal de ${cityName}`,
      rating: 4.5,
      distance: "0.8 km",
      type: "Musée",
    },
    {
      name: `Centre historique de ${cityName}`,
      rating: 4.2,
      distance: "1.2 km",
      type: "Site historique",
    },
    {
      name: `Parc central de ${cityName}`,
      rating: 4.0,
      distance: "1.5 km",
      type: "Parc",
    },
    {
      name: `Cathédrale de ${cityName}`,
      rating: 4.7,
      distance: "0.5 km",
      type: "Monument religieux",
    },
    {
      name: `Marché local de ${cityName}`,
      rating: 4.1,
      distance: "2.0 km",
      type: "Marché",
    },
  ];

  // Simuler un délai d'API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockAttractions;
};