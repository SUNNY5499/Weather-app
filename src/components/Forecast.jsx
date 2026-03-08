function Forecast({ forecast }) {
  if (!forecast) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
      {forecast.list.slice(0, 5).map((item, index) => (
        <div key={index} className="bg-white p-4 shadow rounded text-center">
          <p>{new Date(item.dt_txt).toLocaleDateString()}</p>
          <p>{item.main.temp}°C</p>
          <p>{item.weather[0].main}</p>
        </div>
      ))}
    </div>
  );
}

export default Forecast;
