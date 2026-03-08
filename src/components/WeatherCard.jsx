function WeatherCard({ data }) {
  if (!data) return null;

  return (
    <div className="bg-white shadow p-6 rounded mt-4 text-center">
      <h2 className="text-xl font-bold">{data.name}</h2>

      <p className="text-4xl">{data.main.temp}°C</p>

      <p>{data.weather[0].description}</p>

      <p>Humidity: {data.main.humidity}%</p>

      <p>Wind: {data.wind.speed} km/h</p>
    </div>
  );
}

export default WeatherCard;