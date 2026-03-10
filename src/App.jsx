import { useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { getWeather } from "./services/weatherApi";
import ThemeToggle from "./components/ThemeToggle";

const PEXELS_API_KEY = "ZKyvTPwOIFCYQxqP3HOLpDQwCfjPUtKoeWS1aWUNsVmYZ8rWTpx2wm7G";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // SEARCH WEATHER FUNCTION
  const searchWeather = async () => {
    if (!city.trim()) return;

    try {
      setLoading(true);
      setError("");

      // Weather API
      const weatherData = await getWeather(city);
      setWeather(weatherData);

      // City Image API
      try {
        const imageRes = await axios.get(
          `https://api.pexels.com/v1/search?query=${city} city landmark&per_page=6`,
          {
            headers: {
              Authorization: PEXELS_API_KEY,
            },
          }
        );

        setImages(imageRes.data.photos);
      } catch (imgErr) {
        console.log("Image API error:", imgErr);
        setImages([]);
      }
    } catch (err) {
      setWeather(null);
      setError("City not found or API error.");
    } finally {
      setLoading(false);
    }
  };

  // Background Image
  const getBackgroundImage = () => {
    if (images.length > 0) {
      return images[0].src.landscape;
    }

    return darkMode
      ? "https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
      : "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
  };

  return (
    <div
      style={{
        backgroundImage: `url(${getBackgroundImage()})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
      className="relative"
    >
      <div
        className={`min-h-screen px-4 md:px-8 ${
          darkMode ? "bg-black/60 text-white" : "bg-white/60 text-black"
        } flex flex-col`}
      >
        {/* HEADER */}
        <header className="flex items-center justify-between py-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            🌤 Weather App
          </h1>

          <ThemeToggle
            dark={darkMode}
            onToggle={() => setDarkMode(!darkMode)}
          />
        </header>

        {/* MAIN */}
        <main className="flex flex-1 flex-col items-center justify-center">

          {/* SEARCH BAR */}
          <div className="flex rounded-full overflow-hidden shadow-xl border backdrop-blur-md bg-white/90 text-black">

            <input
              type="text"
              placeholder="Search city..."
              className="px-5 py-3 outline-none bg-transparent min-w-[220px]"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") searchWeather();
              }}
            />

            <button
              onClick={searchWeather}
              className="bg-blue-500 px-6 flex items-center justify-center text-white hover:bg-blue-600"
            >
              <FaSearch />
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <p className="mt-3 text-red-500 font-semibold">{error}</p>
          )}

          {/* LOADING */}
          {loading && (
            <p className="mt-3 text-blue-500">Fetching weather...</p>
          )}

          {/* WEATHER CARD */}
          {weather && !error && (
            <div className="mt-10 backdrop-blur-md p-8 rounded-2xl text-center max-w-xl w-full shadow-2xl bg-white/80">

              <h2 className="text-3xl font-bold">{weather.name}</h2>

              <p className="text-lg capitalize mt-2">
                {weather.weather[0].description}
              </p>

              <h3 className="text-5xl font-bold mt-4">
                {Math.round(weather.main.temp)}°C
              </h3>

              <div className="grid grid-cols-2 gap-4 mt-6 text-lg">
                <p>💧 Humidity: {weather.main.humidity}%</p>
                <p>🌬 Wind: {weather.wind.speed} m/s</p>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default App;