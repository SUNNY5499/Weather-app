import { useState } from "react";
import { FaSearch } from "react-icons/fa";

import { getWeather } from "./services/weatherApi";
import ThemeToggle from "./components/ThemeToggle";

const defaultLightBg = "https://source.unsplash.com/1600x900/?city,sky";
const defaultDarkBg = "https://source.unsplash.com/1600x900/?city,night,lights";

const backgroundsByCondition = {
  Clear: "https://source.unsplash.com/1600x900/?sunny,blue,sky,city",
  Rain: "https://source.unsplash.com/1600x900/?rain,city,streets",
  Clouds: "https://source.unsplash.com/1600x900/?cloudy,sky,city",
  Snow: "https://source.unsplash.com/1600x900/?snow,city,buildings",
  Thunderstorm: "https://source.unsplash.com/1600x900/?storm,lightning,city",
  Drizzle: "https://source.unsplash.com/1600x900/?drizzle,rain,city",
  Mist: "https://source.unsplash.com/1600x900/?mist,fog,city",
};

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const searchWeather = async () => {
    const trimmedCity = city.trim();
    if (!trimmedCity) return;

    try {
      setLoading(true);
      setError("");
      const data = await getWeather(trimmedCity);
      setWeather(data);
    } catch (err) {
      setWeather(null);
      setError("City not found or API error.");
    } finally {
      setLoading(false);
    }
  };

  const getBackground = () => {
    const base = darkMode ? defaultDarkBg : defaultLightBg;
    if (!weather?.weather?.[0]?.main) return base;

    const condition = weather.weather[0].main;
    return backgroundsByCondition[condition] || base;
  };

  const getCityPhoto = () => {
    if (!weather?.name) return null;
    const query = encodeURIComponent(
      `${weather.name} city skyline ${darkMode ? "at night" : "on a sunny day"}`
    );
    return `https://source.unsplash.com/600x400/?${query}`;
  };

  return (
    <div
      style={{
        backgroundImage: `url(${getBackground()})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
      className="relative"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-16 -left-20 h-64 w-64 rounded-full bg-sky-500/40 blur-3xl" />
        <div className="absolute bottom-0 right-[-4rem] h-72 w-72 rounded-full bg-indigo-500/40 blur-3xl" />
      </div>

      <div
        className={`min-h-screen px-4 md:px-8 ${
          darkMode ? "bg-slate-950/70 text-white" : "bg-sky-50/70 text-slate-900"
        } flex flex-col`}
      >
        <header className="flex items-center justify-between py-4">
          <h1 className="text-2xl md:text-3xl font-bold drop-shadow-lg flex items-center gap-2">
            <span>🌤</span>
            <span>Weather App</span>
          </h1>
          <ThemeToggle
            dark={darkMode}
            onToggle={() => setDarkMode((prev) => !prev)}
          />
        </header>

        <main className="flex flex-1 flex-col items-center justify-center pb-10">
          <div
            className={`search-bar flex rounded-full shadow-xl overflow-hidden border backdrop-blur-md ${
              darkMode
                ? "bg-white/95 text-black border-white/40"
                : "bg-slate-900/90 text-white border-slate-700/80"
            } ${error ? "search-bar--error" : ""}`}
          >
            <input
              type="text"
              placeholder="Search city..."
              className={`search-input px-5 py-3 outline-none bg-transparent min-w-[220px] ${
                darkMode ? "text-black placeholder:text-slate-500" : "text-white placeholder:text-slate-300"
              }`}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchWeather();
                }
              }}
            />

            <button
              onClick={searchWeather}
              className="search-button bg-blue-500 px-6 flex items-center justify-center hover:bg-blue-600 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <FaSearch />
            </button>
          </div>

          {error && (
            <p
              className={`mt-3 text-sm animate-fadeIn ${
                darkMode ? "text-red-200" : "text-red-600"
              }`}
            >
              {error}
            </p>
          )}
          {loading && !error && (
            <p
              className={`mt-3 text-sm animate-fadeIn ${
                darkMode ? "text-blue-100" : "text-blue-700"
              }`}
            >
              Fetching latest weather...
            </p>
          )}

          {weather && !error && (
            <div
              className={`mt-10 backdrop-blur-md p-8 rounded-2xl text-center animate-fadeIn max-w-3xl w-full mx-4 shadow-2xl ${
                darkMode ? "bg-slate-900/70 text-white" : "bg-white/90 text-slate-900"
              }`}
            >
              <div className="grid md:grid-cols-[2fr,3fr] gap-6 items-center">
                {getCityPhoto() && (
                  <div className="overflow-hidden rounded-2xl shadow-lg">
                    <img
                      src={getCityPhoto()}
                      alt={weather.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}

                <div>
                  <h2 className="text-3xl font-bold">{weather.name}</h2>

                  <p className="text-lg capitalize mt-1">
                    {weather.weather[0].description}
                  </p>

                  <h3 className="text-5xl font-bold mt-4">
                    {Math.round(weather.main.temp)}°C
                  </h3>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;