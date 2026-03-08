import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

import { getWeather } from "./services/weatherApi";
import { getBackgroundQueryFromGemini } from "./services/gemini";
import ThemeToggle from "./components/ThemeToggle";

const defaultLightBg = "https://source.unsplash.com/1600x900/?sunny,sky";
const defaultDarkBg = "https://source.unsplash.com/1600x900/?city,night";

const lightBackgroundsByCondition = {
  Clear: "https://source.unsplash.com/1600x900/?sunny,blue,sky",
  Rain: "https://source.unsplash.com/1600x900/?rain,day,city",
  Clouds: "https://source.unsplash.com/1600x900/?cloudy,bright,sky",
  Snow: "https://source.unsplash.com/1600x900/?snow,day,city",
  Thunderstorm: "https://source.unsplash.com/1600x900/?stormy,clouds,day",
  Drizzle: "https://source.unsplash.com/1600x900/?light,drizzle,city",
  Mist: "https://source.unsplash.com/1600x900/?mist,morning,city",
};

const darkBackgroundsByCondition = {
  Clear: "https://source.unsplash.com/1600x900/?clear,night,stars",
  Rain: "https://source.unsplash.com/1600x900/?rain,night,city,lights",
  Clouds: "https://source.unsplash.com/1600x900/?cloudy,night,sky",
  Snow: "https://source.unsplash.com/1600x900/?snow,night,street",
  Thunderstorm: "https://source.unsplash.com/1600x900/?lightning,storm,night",
  Drizzle: "https://source.unsplash.com/1600x900/?drizzle,night,street",
  Mist: "https://source.unsplash.com/1600x900/?foggy,night,city",
};

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [backgroundQuery, setBackgroundQuery] = useState("");

  const placeholderOptions = [
    "Search city...",
    "Try: London",
    "Try: New York",
    "Try: Tokyo",
    "Try: Mumbai",
  ];

  useEffect(() => {
    if (inputFocused || city.trim()) return;

    const id = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderOptions.length);
    }, 2500);

    return () => clearInterval(id);
  }, [inputFocused, city, placeholderOptions.length]);

  useEffect(() => {
    let cancelled = false;

    const updateBackgroundFromGemini = async () => {
      if (!weather) {
        setBackgroundQuery("");
        return;
      }

      const condition = weather?.weather?.[0]?.main;
      const description = weather?.weather?.[0]?.description;
      const cityName = weather?.name;

      const suggestion = await getBackgroundQueryFromGemini({
        condition,
        description,
        city: cityName,
        isNight: darkMode,
      });

      if (!cancelled) {
        setBackgroundQuery(suggestion || "");
      }
    };

    updateBackgroundFromGemini();

    return () => {
      cancelled = true;
    };
  }, [weather, darkMode]);

  const updateHistory = (name) => {
    if (!name) return;
    setHistory((prev) => {
      const existing = prev.filter(
        (c) => c.toLowerCase() !== name.toLowerCase()
      );
      return [name, ...existing].slice(0, 5);
    });
  };

  const searchWeather = async (targetCity) => {
    const trimmedCity = (targetCity ?? city).trim();
    if (!trimmedCity) return;

    try {
      setLoading(true);
      setError("");
      const data = await getWeather(trimmedCity);
      setWeather(data);
      updateHistory(data?.name || trimmedCity);
    } catch (err) {
      setWeather(null);
      setError("Could not find that city. Try another name.");
    } finally {
      setLoading(false);
    }
  };

  const getBackground = () => {
    const condition = weather?.weather?.[0]?.main;
    const isNight = darkMode;

    const defaultBg = isNight ? defaultDarkBg : defaultLightBg;

    if (backgroundQuery) {
      const query = encodeURIComponent(backgroundQuery);
      return `https://source.unsplash.com/1600x900/?${query}`;
    }

    if (!condition) {
      return defaultBg;
    }

    const map = isNight ? darkBackgroundsByCondition : lightBackgroundsByCondition;
    return map[condition] || defaultBg;
  };

  const getCityPhoto = () => {
    if (!weather?.name) return null;
    const base = `${weather.name} city skyline ${
      darkMode ? "at night with lights" : "on a sunny day"
    }`;
    const query = encodeURIComponent(base);
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
      className="text-white"
    >
      <div className="min-h-screen bg-black/40">
        <header className="flex items-center justify-between px-6 pt-4">
          <h1 className="text-2xl md:text-3xl font-bold drop-shadow-lg">
            🌤 Weather App
          </h1>
          <ThemeToggle
            dark={darkMode}
            onToggle={() => setDarkMode((prev) => !prev)}
          />
        </header>

        <main className="flex flex-col items-center justify-center px-4 pb-10">
          <h2 className="text-3xl md:text-4xl font-semibold mt-4 mb-4 animate-fadeIn drop-shadow-lg text-center">
            Check the weather anywhere in the world
          </h2>

          <div
            className={`search-bar flex bg-white rounded-full shadow-xl overflow-hidden mt-2 border border-white/30 backdrop-blur-sm ${
              error ? "search-bar--error" : ""
            }`}
          >
            <input
              type="text"
              placeholder={placeholderOptions[placeholderIndex]}
              className="search-input px-5 py-3 text-black outline-none bg-transparent min-w-[220px]"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
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

          {history.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-2 px-4 animate-fadeIn">
              {history.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => searchWeather(item)}
                  className="recent-chip text-xs md:text-sm px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 transition-all"
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          {error && (
            <p className="mt-3 text-sm text-red-200 animate-fadeIn">{error}</p>
          )}
          {loading && !error && (
            <p className="mt-3 text-sm text-blue-100 animate-fadeIn">
              Fetching latest weather...
            </p>
          )}

          {weather && !error && (
            <div className="mt-10 bg-black/40 backdrop-blur-md p-8 rounded-2xl text-center animate-fadeIn max-w-4xl w-full mx-4">
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
                  <h3 className="text-3xl font-bold">{weather.name}</h3>

                  <p className="text-lg capitalize mt-1">
                    {weather.weather[0].description}
                  </p>

                  <p className="text-5xl font-bold mt-4">
                    {Math.round(weather.main.temp)}°C
                  </p>
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