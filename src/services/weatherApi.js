import axios from "axios";

const API_KEY = "a4db8e476227b513341db0757933bedf";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const getWeather = async (city) => {
  const res = await axios.get(
    `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
  );
  return res.data;
};