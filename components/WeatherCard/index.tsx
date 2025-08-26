import React from "react";

const WeatherCard = ({ data }: any) => {
  return (
    <>
      <div className="flex justify-between items-center py-4">
        <div className="flex flex-col">
          <span className="text-lg xl:text-6xl font-bold">
            {data.main.temp} °C
          </span>
          <span className="font-semibold mt-1 text-white">{data.name}</span>
        </div>
        <img
          className="h-auto w-14 md:w-20 object-cover"
          src={`http://openweathermap.org/img/w/${data.weather[0].icon}.png`}
          alt={`${data.weather[0].description} icon`}
        />
      </div>
      <div className="p-4 xl:p-8">
        <p className="text-sm xl:text-xl bg-blue-800 text-white text-center flex justify-center items-center p-2 rounded-md px-4">
          <span>Weather: {data.weather[0].description}</span>
        </p>
      </div>
    </>
  );
};

export default WeatherCard;
